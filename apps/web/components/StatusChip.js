import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { OUTCOME, outcomeInk } from '../lib/phase-ink';

/**
 * Delivery outcome. Colour is doing real work, so it is always paired with the
 * word and with a filled-or-hollow marker — the states stay separable with no
 * colour at all.
 */
export default function StatusChip({ status, size = 'small' }) {
  const theme = useTheme();
  const ink = outcomeInk(status, theme.palette.mode);
  const label = OUTCOME[status]?.label ?? status;
  const settled = status === 'sent' || status === 'failed' || status === 'deferred';
  const box = size === 'medium' ? 8 : 7;

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.7, flexShrink: 0 }}>
      <Box
        sx={{
          width: box,
          height: box,
          borderRadius: 0.25,
          flexShrink: 0,
          border: '1.5px solid',
          borderColor: ink,
          backgroundColor: settled ? ink : 'transparent',
        }}
      />
      <Typography
        sx={{
          fontSize: size === 'medium' ? '0.8125rem' : '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.01em',
          color: ink,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
