import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

/**
 * A labelled measurement. Used wherever the product states a number: the label
 * is a small mono column header, the value is large and tabular, and the two
 * are locked to the same baseline grid across every panel that uses it.
 */
export default function Readout({ label, value, unit, caption, ink, size = 'md' }) {
  const fontSize = size === 'lg' ? '2rem' : size === 'sm' ? '1.0625rem' : '1.5rem';

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="overline" sx={{ color: 'text.disabled', display: 'block', mb: 0.75 }}>
        {label}
      </Typography>
      <Stack direction="row" alignItems="baseline" spacing={0.5}>
        <Typography
          className="mono tnum"
          sx={{
            fontFamily: 'var(--mono)',
            fontSize,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: ink || 'text.primary',
          }}
        >
          {value}
        </Typography>
        {unit && (
          <Typography
            className="mono"
            sx={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'text.disabled' }}
          >
            {unit}
          </Typography>
        )}
      </Stack>
      {caption && (
        <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 0.75 }}>
          {caption}
        </Typography>
      )}
    </Box>
  );
}
