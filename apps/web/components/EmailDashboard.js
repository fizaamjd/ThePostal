import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  AddRounded,
  DeleteOutlineRounded,
  FilterListRounded,
  ReplayRounded,
  SearchRounded,
  StarRounded,
  StarBorderRounded,
} from '@mui/icons-material';
import { messages as messagesApi, subscribeToEvents } from '../lib/api';
import { useRequireAuth } from '../lib/auth-context';
import { outcomeInk, replyClass } from '../lib/phase-ink';
import TopBar from './TopBar';
import StatusChip from './StatusChip';

const FOLDERS = [
  { key: 'inbox', label: 'Inbox' },
  { key: 'sent', label: 'Sent' },
  { key: 'archive', label: 'Archive' },
];

const STATUSES = ['all', 'sent', 'deferred', 'failed', 'queued'];

/**
 * The mailbox, read as a capture.
 *
 * A filter bar sits above a dense table: one row per message, tinted by
 * outcome, with monospaced columns for the things that are measurements —
 * reply code, size, time. It is the shape a capture tool uses because it is the
 * right shape for scanning a long list of transactions quickly.
 */
export default function EmailDashboard() {
  const router = useRouter();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const cap = theme.palette.capture;
  const narrow = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isReady } = useRequireAuth();

  const [folder, setFolder] = useState('inbox');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [state, setState] = useState({ items: [], total: 0, nextCursor: null });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(
    async ({ cursor = null, silent = false } = {}) => {
      if (!isReady) return;
      if (cursor) setLoadingMore(true);
      else if (!silent) setLoading(true);

      try {
        const page = await messagesApi.list({
          folder,
          limit: 30,
          q: search.trim() || undefined,
          status: status === 'all' ? undefined : status,
          cursor: cursor || undefined,
        });
        setState((current) => ({
          items: cursor ? [...current.items, ...page.items] : page.items,
          total: page.total,
          nextCursor: page.nextCursor,
        }));
        setError(null);
      } catch (caught) {
        setError(caught.message ?? 'Could not load messages');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [folder, search, status, isReady],
  );

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!isReady) return undefined;
    return subscribeToEvents((event) => {
      if (event.type === 'metrics.tick') return;
      void load({ silent: true });
    });
  }, [isReady, load]);

  const mutate = async (id, fn, optimistic) => {
    setState((c) => ({ ...c, items: optimistic(c.items) }));
    try {
      await fn();
    } catch (caught) {
      setError(caught.message ?? 'That did not work');
      void load({ silent: true });
    }
  };

  const counts = useMemo(() => {
    const by = { sent: 0, deferred: 0, failed: 0, queued: 0 };
    for (const m of state.items) if (by[m.status] !== undefined) by[m.status] += 1;
    return by;
  }, [state.items]);

  if (!isReady) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress size={22} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <TopBar />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* --- heading ------------------------------------------------- */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
          spacing={2}
          sx={{ mb: 2.5 }}
        >
          <Box>
            <Typography variant="h3" sx={{ mb: 0.5 }}>
              {FOLDERS.find((f) => f.key === folder)?.label}
            </Typography>
            <Typography
              className="mono"
              sx={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'text.disabled' }}
            >
              {user?.email}
              {state.total > 0 && ` · ${state.total} message${state.total === 1 ? '' : 's'}`}
            </Typography>
          </Box>

          <Button variant="contained" startIcon={<AddRounded sx={{ fontSize: 17 }} />} onClick={() => router.push('/compose')}>
            Compose
          </Button>
        </Stack>

        {/* --- filter bar ---------------------------------------------- */}
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            bgcolor: 'background.paper',
            overflow: 'hidden',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.25}
            alignItems={{ xs: 'stretch', md: 'center' }}
            sx={{ p: 1.25, borderBottom: '1px solid', borderColor: 'divider', bgcolor: cap.raised }}
          >
            <Stack direction="row" spacing={0.5}>
              {FOLDERS.map((f) => (
                <Button
                  key={f.key}
                  size="small"
                  onClick={() => {
                    setFolder(f.key);
                    setState({ items: [], total: 0, nextCursor: null });
                  }}
                  sx={{
                    px: 1.25,
                    color: folder === f.key ? 'text.primary' : 'text.secondary',
                    bgcolor: folder === f.key ? cap.sunken : 'transparent',
                    fontWeight: folder === f.key ? 600 : 500,
                  }}
                >
                  {f.label}
                </Button>
              ))}
            </Stack>

            <TextField
              fullWidth
              placeholder="Filter by subject, address or body…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { fontFamily: 'var(--mono)', fontSize: '0.8125rem' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded sx={{ fontSize: 16, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />

            {folder !== 'inbox' && (
              <Stack direction="row" spacing={0.4} alignItems="center">
                <FilterListRounded sx={{ fontSize: 15, color: 'text.disabled', mr: 0.3 }} />
                {STATUSES.map((s) => {
                  const on = status === s;
                  const ink = s === 'all' ? theme.palette.text.primary : outcomeInk(s, mode);
                  return (
                    <Button
                      key={s}
                      size="small"
                      onClick={() => setStatus(s)}
                      sx={{
                        minWidth: 0,
                        px: 0.9,
                        fontFamily: 'var(--mono)',
                        fontSize: '0.6875rem',
                        color: on ? ink : 'text.disabled',
                        bgcolor: on ? cap.sunken : 'transparent',
                        fontWeight: on ? 600 : 400,
                      }}
                    >
                      {s}
                      {s !== 'all' && counts[s] > 0 ? ` ${counts[s]}` : ''}
                    </Button>
                  );
                })}
              </Stack>
            )}
          </Stack>

          {/* --- column headers ---------------------------------------- */}
          {!narrow && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '28px 180px 1fr 96px 64px 76px 68px',
                gap: 1.5,
                px: 1.5,
                py: 0.85,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: cap.sunken,
              }}
            >
              {['', folder === 'inbox' ? 'from' : 'to', 'subject', 'status', 'reply', 'size', 'time'].map((h, i) => (
                <Typography key={i} variant="overline" sx={{ color: 'text.disabled' }}>
                  {h}
                </Typography>
              ))}
            </Box>
          )}

          {/* --- rows --------------------------------------------------- */}
          {loading ? (
            <Box sx={{ p: 1.5 }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} height={34} sx={{ mb: 0.5 }} />
              ))}
            </Box>
          ) : state.items.length === 0 ? (
            <EmptyState folder={folder} filtered={Boolean(search.trim()) || status !== 'all'} />
          ) : (
            state.items.map((m) => (
              <CaptureRow
                key={m.id}
                message={m}
                folder={folder}
                narrow={narrow}
                mode={mode}
                cap={cap}
                onOpen={() => router.push(`/messages/${m.id}`)}
                onStar={(e) => {
                  e.stopPropagation();
                  void mutate(
                    m.id,
                    () => messagesApi.patch(m.id, { starred: !m.starred }),
                    (items) => items.map((x) => (x.id === m.id ? { ...x, starred: !x.starred } : x)),
                  );
                }}
                onDelete={(e) => {
                  e.stopPropagation();
                  void mutate(
                    m.id,
                    () => messagesApi.remove(m.id),
                    (items) => items.filter((x) => x.id !== m.id),
                  );
                }}
                onRetry={(e) => {
                  e.stopPropagation();
                  void mutate(m.id, () => messagesApi.retry(m.id), (items) => items);
                }}
              />
            ))
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {state.nextCursor && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="outlined" size="small" disabled={loadingMore} onClick={() => load({ cursor: state.nextCursor })}>
              {loadingMore ? 'Loading…' : 'Load more'}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

/* ------------------------------------------------------------------ */

function CaptureRow({ message, folder, narrow, mode, cap, onOpen, onStar, onDelete, onRetry }) {
  const lastAttempt = message.attempts?.[message.attempts.length - 1];
  const code = lastAttempt?.responseCode ?? null;
  const tintKey = folder === 'inbox' ? 'queued' : replyClass(code) || message.status;
  const rowTint = cap.tint[`${tintKey}Row`] ?? 'transparent';
  const ink = outcomeInk(message.status, mode);
  const counterparty = folder === 'inbox' ? message.from : message.to.join(', ');
  const canRetry = message.status === 'failed' || message.status === 'deferred';
  const trace = lastAttempt?.trace;

  const cell = {
    fontFamily: 'var(--mono)',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  if (narrow) {
    return (
      <Box
        onClick={onOpen}
        sx={{
          px: 1.5,
          py: 1.25,
          cursor: 'pointer',
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: rowTint,
          borderLeft: '2px solid',
          borderLeftColor: message.read ? 'transparent' : ink,
          '&:hover': { bgcolor: cap.sunken },
        }}
      >
        <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ mb: 0.4 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: message.read ? 500 : 650, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {message.subject}
          </Typography>
          {folder !== 'inbox' && <StatusChip status={message.status} />}
        </Stack>
        <Typography className="mono" sx={{ ...cell, color: 'text.secondary' }}>
          {counterparty}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      onClick={onOpen}
      sx={{
        display: 'grid',
        gridTemplateColumns: '28px 180px 1fr 96px 64px 76px 68px',
        gap: 1.5,
        alignItems: 'center',
        px: 1.5,
        py: 0.9,
        cursor: 'pointer',
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: rowTint,
        position: 'relative',
        '&:hover': { bgcolor: cap.sunken },
        '&:hover .row-actions': { opacity: 1 },
        // Unread is marked structurally, not only by weight.
        '&::before': message.read
          ? undefined
          : { content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, backgroundColor: ink },
      }}
    >
      <IconButton size="small" onClick={onStar} aria-label={message.starred ? 'Unstar' : 'Star'} sx={{ p: 0.25 }}>
        {message.starred ? (
          <StarRounded sx={{ fontSize: 16, color: 'warning.main' }} />
        ) : (
          <StarBorderRounded sx={{ fontSize: 16, color: 'text.disabled' }} />
        )}
      </IconButton>

      <Typography className="mono" sx={{ ...cell, color: 'text.secondary' }}>
        {counterparty}
      </Typography>

      <Typography
        sx={{
          fontSize: '0.8125rem',
          fontWeight: message.read ? 500 : 650,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: 'text.primary',
        }}
      >
        {message.subject}
        {message.bodyPreview && (
          <Box component="span" sx={{ color: 'text.disabled', fontWeight: 400, ml: 1 }}>
            {message.bodyPreview}
          </Box>
        )}
      </Typography>

      <Box>{folder === 'inbox' ? null : <StatusChip status={message.status} />}</Box>

      <Typography className="mono tnum" sx={{ ...cell, color: code ? 'text.primary' : 'text.disabled', fontWeight: 500 }}>
        {code ?? '—'}
      </Typography>

      <Typography className="mono tnum" sx={{ ...cell, color: 'text.disabled', textAlign: 'right' }}>
        {formatBytes(message.sizeBytes)}
      </Typography>

      <Box sx={{ position: 'relative', textAlign: 'right' }}>
        <Typography className="mono tnum" sx={{ ...cell, color: 'text.disabled' }}>
          {trace ? `${trace.totalMs.toFixed(0)}ms` : formatTime(message.createdAt)}
        </Typography>

        <Stack
          className="row-actions"
          direction="row"
          spacing={0.25}
          sx={{
            position: 'absolute',
            right: -4,
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: 0,
            transition: 'opacity 110ms ease',
            bgcolor: cap.surface,
            borderRadius: 0.5,
            boxShadow: 1,
          }}
        >
          {canRetry && (
            <Tooltip title="Re-queue for delivery">
              <IconButton size="small" onClick={onRetry} aria-label="Retry delivery" sx={{ p: 0.4 }}>
                <ReplayRounded sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <IconButton size="small" onClick={onDelete} aria-label="Delete message" sx={{ p: 0.4 }}>
              <DeleteOutlineRounded sx={{ fontSize: 15 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );
}

function EmptyState({ folder, filtered }) {
  return (
    <Stack spacing={1} alignItems="center" sx={{ py: 7, px: 3, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ color: 'text.secondary' }}>
        {filtered ? 'Nothing matches that filter' : `Nothing in ${folder}`}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.disabled', maxWidth: '46ch' }}>
        {filtered
          ? 'Search covers the subject, sender, recipients and body. Try a shorter query, or clear the status filter.'
          : folder === 'inbox'
            ? 'Mail delivered to this address over SMTP appears here. Send some with: swaks --server <host>:2525 --to you@postal.local'
            : 'Messages you send appear here with their full delivery trace.'}
      </Typography>
    </Stack>
  );
}

function formatBytes(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`;
  return `${(bytes / 1024 / 1024).toFixed(1)}M`;
}

function formatTime(iso) {
  const d = new Date(iso);
  const age = Date.now() - d.getTime();
  if (age < 86400000) return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  if (age < 604800000) return d.toLocaleDateString(undefined, { weekday: 'short' });
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
