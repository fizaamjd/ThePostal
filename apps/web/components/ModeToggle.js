import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { LightModeOutlined, DarkModeOutlined } from '@mui/icons-material';
import { useThemeMode } from '../lib/theme-mode';

export default function ModeToggle() {
  const { mode, toggle } = useThemeMode();
  const next = mode === 'dark' ? 'light' : 'dark';

  return (
    <Tooltip title={`Switch to ${next} theme`}>
      <IconButton onClick={toggle} aria-label={`Switch to ${next} theme`} size="small">
        {mode === 'dark' ? (
          <LightModeOutlined sx={{ fontSize: 17 }} />
        ) : (
          <DarkModeOutlined sx={{ fontSize: 17 }} />
        )}
      </IconButton>
    </Tooltip>
  );
}
