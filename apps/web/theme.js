import { createTheme } from '@mui/material/styles';

/**
 * Postal design system — protocol analyser.
 *
 * The interface borrows the grammar of a packet capture tool, because that is
 * the working interface language for exactly this shape of product: a long list
 * of transactions, each one expandable into a tree of what happened and the
 * bytes underneath. Rows are dense and tinted by outcome, columns are
 * monospaced and aligned, and a filter bar sits above the capture.
 *
 * Colour is a system rather than an accent. Every SMTP phase owns a fixed ink
 * (see lib/phase-ink.js) that follows it into every view, the way a transit
 * line keeps its colour across a whole network. Outcome tint is a separate
 * axis, used only on rows and status.
 *
 * Both modes are first-class. Light is the daylight-laptop default; dark is the
 * analyser's own, and neither is a tinted copy of the other.
 */

const SANS = '"Archivo", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const LIGHT = {
  canvas: '#F2F4F7',
  surface: '#FFFFFF',
  raised: '#FAFBFC',
  sunken: '#EDF0F4',
  line: '#D8DEE6',
  lineSoft: '#E7EBF0',
  text: '#0C1118',
  textDim: '#5A6675',
  textFaint: '#8A95A3',
  accent: '#1D63D1',
  accentWash: '#E7EFFC',
  gridline: 'rgba(12, 17, 24, 0.05)',
};

const DARK = {
  canvas: '#0B0F14',
  surface: '#11171E',
  raised: '#161E27',
  sunken: '#0D131A',
  line: '#232E3A',
  lineSoft: '#1A232D',
  text: '#E4EBF2',
  textDim: '#94A3B3',
  textFaint: '#67737F',
  accent: '#6BA2F5',
  accentWash: '#132334',
  gridline: 'rgba(228, 235, 242, 0.05)',
};

const OUTCOME_TINT = {
  light: {
    sent: '#0B7A4B',
    sentRow: 'rgba(11, 122, 75, 0.055)',
    deferred: '#A26212',
    deferredRow: 'rgba(162, 98, 18, 0.07)',
    failed: '#C0392F',
    failedRow: 'rgba(192, 57, 47, 0.06)',
    queued: '#5B6572',
    queuedRow: 'transparent',
  },
  dark: {
    sent: '#4ECB8D',
    sentRow: 'rgba(78, 203, 141, 0.06)',
    deferred: '#E0A75C',
    deferredRow: 'rgba(224, 167, 92, 0.07)',
    failed: '#F08A80',
    failedRow: 'rgba(240, 138, 128, 0.07)',
    queued: '#8C97A3',
    queuedRow: 'transparent',
  },
};

export function buildTheme(mode = 'light') {
  const c = mode === 'dark' ? DARK : LIGHT;
  const tint = OUTCOME_TINT[mode === 'dark' ? 'dark' : 'light'];

  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? c.text : c.text,
        contrastText: mode === 'dark' ? c.canvas : '#FFFFFF',
      },
      secondary: { main: c.accent, light: c.accentWash, contrastText: '#FFFFFF' },
      success: { main: tint.sent, light: tint.sentRow },
      warning: { main: tint.deferred, light: tint.deferredRow },
      error: { main: tint.failed, light: tint.failedRow },
      info: { main: c.accent, light: c.accentWash },
      divider: c.line,
      background: { default: c.canvas, paper: c.surface },
      text: { primary: c.text, secondary: c.textDim, disabled: c.textFaint },
      // Consumed directly by capture rows, waterfalls and readouts.
      capture: { ...c, tint, mono: MONO },
    },

    typography: {
      fontFamily: SANS,
      h1: { fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.035em' },
      h2: { fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 700, lineHeight: 1.14, letterSpacing: '-0.027em' },
      h3: { fontSize: '1.375rem', fontWeight: 650, lineHeight: 1.22, letterSpacing: '-0.02em' },
      h4: { fontSize: '1.125rem', fontWeight: 650, lineHeight: 1.28, letterSpacing: '-0.015em' },
      h5: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.32 },
      h6: { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.35 },
      subtitle1: { fontSize: '0.9375rem', fontWeight: 550 },
      subtitle2: { fontSize: '0.8125rem', fontWeight: 600 },
      body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
      body2: { fontSize: '0.875rem', lineHeight: 1.55 },
      caption: { fontSize: '0.75rem', lineHeight: 1.4 },
      // Column headers and field labels throughout the capture surfaces.
      overline: {
        fontFamily: MONO,
        fontSize: '0.625rem',
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        lineHeight: 1.4,
      },
      button: { fontSize: '0.8125rem', fontWeight: 550, textTransform: 'none', letterSpacing: '-0.003em' },
    },

    shape: { borderRadius: 5 },

    shadows: [
      'none',
      `0 1px 2px ${mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(12,17,24,0.07)'}`,
      `0 2px 5px ${mode === 'dark' ? 'rgba(0,0,0,0.55)' : 'rgba(12,17,24,0.08)'}`,
      `0 6px 14px -3px ${mode === 'dark' ? 'rgba(0,0,0,0.65)' : 'rgba(12,17,24,0.12)'}, 0 2px 5px -2px ${mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(12,17,24,0.07)'}`,
      `0 12px 26px -8px ${mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(12,17,24,0.16)'}, 0 4px 9px -4px ${mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(12,17,24,0.09)'}`,
      ...Array(20).fill(
        `0 18px 40px -12px ${mode === 'dark' ? 'rgba(0,0,0,0.75)' : 'rgba(12,17,24,0.2)'}, 0 6px 14px -6px ${mode === 'dark' ? 'rgba(0,0,0,0.55)' : 'rgba(12,17,24,0.1)'}`,
      ),
    ],

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '::selection': { background: c.accent, color: mode === 'dark' ? c.canvas : '#FFFFFF' },
          html: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', colorScheme: mode },
          body: {
            backgroundColor: c.canvas,
            color: c.text,
            caretColor: c.accent,
            // A faint measurement grid under every surface — the ground a
            // capture is read against, not decoration on top of it.
            backgroundImage: `linear-gradient(${c.gridline} 1px, transparent 1px), linear-gradient(90deg, ${c.gridline} 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          },
          '*::-webkit-scrollbar': { width: 11, height: 11 },
          '*::-webkit-scrollbar-track': { background: 'transparent' },
          '*::-webkit-scrollbar-thumb': {
            background: c.line,
            borderRadius: 99,
            border: `3px solid ${c.canvas}`,
          },
          '*::-webkit-scrollbar-thumb:hover': { background: c.textFaint },
          '*': { scrollbarColor: `${c.line} transparent`, scrollbarWidth: 'thin' },
          '.tnum': { fontVariantNumeric: 'tabular-nums' },
          'code, pre, .mono': { fontFamily: MONO, fontVariantNumeric: 'tabular-nums' },
          ':focus-visible': { outline: `2px solid ${c.accent}`, outlineOffset: 2 },
          '@media (prefers-reduced-motion: reduce)': {
            '*': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' },
          },
        },
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 5, padding: '7px 13px', minHeight: 34, transition: 'background-color 110ms ease, border-color 110ms ease' },
          sizeLarge: { padding: '10px 19px', minHeight: 42, fontSize: '0.875rem' },
          sizeSmall: { padding: '4px 9px', minHeight: 28, fontSize: '0.75rem' },
          contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
          containedPrimary: {
            backgroundColor: c.text,
            color: mode === 'dark' ? c.canvas : '#FFFFFF',
            '&:hover': { backgroundColor: mode === 'dark' ? '#FFFFFF' : '#000000' },
            '&.Mui-disabled': { backgroundColor: c.sunken, color: c.textFaint },
          },
          containedSecondary: { backgroundColor: c.accent, '&:hover': { filter: 'brightness(1.1)' } },
          outlined: {
            borderColor: c.line,
            color: c.text,
            '&:hover': { borderColor: c.textFaint, backgroundColor: c.sunken },
          },
          text: { color: c.textDim, '&:hover': { backgroundColor: c.sunken, color: c.text } },
        },
      },

      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: 7,
            border: `1px solid ${c.line}`,
            backgroundColor: c.surface,
            backgroundImage: 'none',
          },
        },
      },
      MuiCardContent: { styleOverrides: { root: { '&:last-child': { paddingBottom: 18 } } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none', backgroundColor: c.surface } } },

      MuiTextField: { defaultProps: { size: 'small' } },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? c.sunken : c.surface,
            borderRadius: 5,
            fontSize: '0.875rem',
            '& fieldset': { borderColor: c.line },
            '&:hover fieldset': { borderColor: c.textFaint },
            '&.Mui-focused fieldset': { borderColor: c.accent, borderWidth: 1.5 },
          },
          input: { padding: '9px 11px' },
        },
      },
      MuiInputLabel: { styleOverrides: { root: { fontSize: '0.875rem', color: c.textDim } } },

      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 4, fontWeight: 550, fontSize: '0.6875rem', height: 22 },
          outlined: { borderColor: c.line },
          label: { paddingLeft: 7, paddingRight: 7 },
        },
      },

      MuiAppBar: {
        defaultProps: { elevation: 0, color: 'inherit' },
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? 'rgba(17,23,30,0.88)' : 'rgba(255,255,255,0.88)',
            backdropFilter: 'saturate(180%) blur(12px)',
            borderBottom: `1px solid ${c.line}`,
            color: c.text,
          },
        },
      },
      MuiToolbar: { styleOverrides: { root: { minHeight: '52px !important' } } },

      MuiDivider: { styleOverrides: { root: { borderColor: c.line } } },

      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 5, border: '1px solid', fontSize: '0.8125rem', alignItems: 'center' },
          standardSuccess: { backgroundColor: tint.sentRow, borderColor: tint.sent, color: tint.sent },
          standardWarning: { backgroundColor: tint.deferredRow, borderColor: tint.deferred, color: tint.deferred },
          standardError: { backgroundColor: tint.failedRow, borderColor: tint.failed, color: tint.failed },
          standardInfo: { backgroundColor: c.accentWash, borderColor: c.accent, color: c.accent },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: mode === 'dark' ? c.raised : '#0C1118',
            border: `1px solid ${mode === 'dark' ? c.line : 'transparent'}`,
            color: mode === 'dark' ? c.text : '#FFFFFF',
            fontSize: '0.6875rem',
            fontWeight: 500,
            padding: '5px 8px',
            borderRadius: 4,
          },
          arrow: { color: mode === 'dark' ? c.raised : '#0C1118' },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: { borderRadius: 5, color: c.textDim, '&:hover': { backgroundColor: c.sunken, color: c.text } },
        },
      },

      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 99, height: 5, backgroundColor: c.sunken },
          bar: { borderRadius: 99 },
        },
      },

      MuiMenu: { styleOverrides: { paper: { border: `1px solid ${c.line}`, borderRadius: 7, marginTop: 4 } } },
      MuiMenuItem: { styleOverrides: { root: { fontSize: '0.8125rem', minHeight: 34 } } },
      MuiSkeleton: { styleOverrides: { root: { backgroundColor: c.sunken } } },
      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: c.lineSoft, fontSize: '0.8125rem', padding: '8px 12px' },
          head: { fontFamily: MONO, fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: c.textFaint, fontWeight: 500 },
        },
      },
    },
  });
}

export default buildTheme('light');
