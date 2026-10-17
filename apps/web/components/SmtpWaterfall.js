import React from 'react';
import { Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { PHASE_HINT, PHASE_LABEL, PHASE_ORDER, STAGES, phaseInk, stageOf } from '../lib/phase-ink';

/**
 * One SMTP transaction, laid out to scale and coloured by the phase ink system.
 *
 * Bars start where the previous phase ended, so the row reads as a sequence on
 * the wire rather than as an unordered bar chart — the gap between a bar's
 * start and the left edge is time already spent. Each phase keeps the ink it
 * carries everywhere else in the product, so the palette is learned once.
 */
export default function SmtpWaterfall({ phases = [], totalMs = 0, dense = false, showLegend = true }) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const cap = theme.palette.capture;

  const measured = phases
    .filter((p) => p.durationMs > 0)
    .sort((a, b) => PHASE_ORDER.indexOf(a.phase) - PHASE_ORDER.indexOf(b.phase));

  if (measured.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        No transaction recorded for this message yet.
      </Typography>
    );
  }

  const sum = measured.reduce((acc, p) => acc + p.durationMs, 0) || 1;

  // Cumulative offsets turn the chart into a timeline.
  let elapsed = 0;
  const rows = measured.map((p) => {
    const row = { ...p, offset: elapsed, share: (p.durationMs / sum) * 100 };
    elapsed += p.durationMs;
    return row;
  });

  const stagesPresent = [...new Set(measured.map((p) => stageOf(p.phase)).filter(Boolean))];

  return (
    <Box>
      <Stack spacing={0}>
        {rows.map((p) => {
          const ink = phaseInk(p.phase, mode);
          const label = PHASE_LABEL[p.phase] ?? p.phase;

          return (
            <Tooltip
              key={p.phase}
              arrow
              placement="top"
              title={`${p.share.toFixed(1)}% of the transaction${PHASE_HINT[p.phase] ? ` · ${PHASE_HINT[p.phase]}` : ''}`}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: dense ? '74px 1fr 56px' : '94px 1fr 66px',
                  alignItems: 'center',
                  gap: 1.25,
                  py: dense ? 0.3 : 0.45,
                  cursor: 'default',
                  '&:hover .track': { backgroundColor: cap.sunken },
                }}
              >
                <Typography
                  className="mono"
                  sx={{
                    fontFamily: 'var(--mono)',
                    fontSize: dense ? '0.625rem' : '0.6875rem',
                    color: 'text.secondary',
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {label}
                </Typography>

                <Box
                  className="track"
                  sx={{
                    position: 'relative',
                    height: dense ? 9 : 12,
                    borderRadius: 0.5,
                    backgroundColor: cap.lineSoft,
                    transition: 'background-color 110ms ease',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: `${(p.offset / sum) * 100}%`,
                      width: `${Math.max(p.share, 0.9)}%`,
                      backgroundColor: ink,
                      borderRadius: 0.5,
                    }}
                  />
                </Box>

                <Typography
                  className="mono tnum"
                  sx={{
                    fontFamily: 'var(--mono)',
                    fontSize: dense ? '0.625rem' : '0.6875rem',
                    textAlign: 'right',
                    color: 'text.primary',
                    fontWeight: 500,
                  }}
                >
                  {p.durationMs.toFixed(1)}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 1.25, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}
      >
        <Typography variant="overline" sx={{ color: 'text.disabled' }}>
          total
        </Typography>
        <Typography
          className="mono tnum"
          sx={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', fontWeight: 600 }}
        >
          {totalMs.toFixed(1)} ms
        </Typography>
      </Stack>

      {showLegend && stagesPresent.length > 0 && (
        <Stack direction="row" flexWrap="wrap" sx={{ gap: 1.25, mt: 1.25 }}>
          {stagesPresent.map((key) => (
            <Stack key={key} direction="row" alignItems="center" spacing={0.6}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: 0.25,
                  backgroundColor: STAGES[key][mode === 'dark' ? 'dark' : 'light'],
                }}
              />
              <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.6875rem' }}>
                {STAGES[key].label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}
