/**
 * The phase ink system.
 *
 * A capture tool colours rows by protocol so you learn the palette once and
 * read every later capture faster. The same idea here: each SMTP phase owns a
 * fixed ink, and that ink is the same in the waterfall, the telemetry
 * breakdown, the attempt tree and the legend. Nothing is coloured decoratively.
 *
 * Ten phases is too many for ten unrelated hues, so they are grouped into five
 * stages — the way a transit map groups stations onto lines — and the two
 * phases inside a stage share its hue at two depths. Adjacent phases in the
 * sequence therefore always differ, while the stage stays recognisable.
 */

export const STAGES = {
  resolve: { label: 'Resolve', light: '#6E56CF', dark: '#A78BFA' },
  connect: { label: 'Connect', light: '#1D63D1', dark: '#6BA2F5' },
  negotiate: { label: 'Negotiate', light: '#0E7F72', dark: '#44C7B5' },
  envelope: { label: 'Envelope', light: '#A26212', dark: '#E0A75C' },
  transfer: { label: 'Transfer', light: '#C0392F', dark: '#F08A80' },
};

/** phase -> [stage, depth]. Depth 0 is the stage's primary phase. */
const PHASE_STAGE = {
  dns: ['resolve', 0],
  tcp: ['connect', 0],
  tls: ['connect', 1],
  greeting: ['negotiate', 0],
  ehlo: ['negotiate', 1],
  auth: ['negotiate', 1],
  mailFrom: ['envelope', 0],
  rcptTo: ['envelope', 1],
  data: ['transfer', 0],
  quit: ['transfer', 1],
};

export const PHASE_LABEL = {
  dns: 'DNS',
  tcp: 'TCP',
  tls: 'TLS',
  greeting: 'Banner',
  ehlo: 'EHLO',
  auth: 'AUTH',
  mailFrom: 'MAIL FROM',
  rcptTo: 'RCPT TO',
  data: 'DATA',
  quit: 'QUIT',
};

export const PHASE_HINT = {
  dns: 'Resolving the recipient domain’s MX records',
  tcp: 'Opening the connection to the mail server',
  tls: 'STARTTLS upgrade and certificate handshake',
  greeting: 'Waiting for the server’s 220 greeting',
  ehlo: 'Capability negotiation',
  auth: 'Authenticating to the relay',
  mailFrom: 'Declaring the envelope sender',
  rcptTo: 'Declaring each envelope recipient',
  data: 'Transferring the message body',
  quit: 'Closing the session',
};

/** The order phases occur on the wire — also the order everything renders in. */
export const PHASE_ORDER = [
  'dns', 'tcp', 'tls', 'greeting', 'ehlo', 'auth', 'mailFrom', 'rcptTo', 'data', 'quit',
];

/**
 * Resolve a phase to its ink for the active mode. The second phase in a stage
 * is rendered at reduced opacity rather than as a separate hue, so the stage
 * reads as one line with a branch.
 */
export function phaseInk(phase, mode = 'light') {
  const entry = PHASE_STAGE[phase];
  if (!entry) return mode === 'dark' ? '#8C97A3' : '#5B6572';
  const [stage, depth] = entry;
  const base = STAGES[stage][mode === 'dark' ? 'dark' : 'light'];
  return depth === 0 ? base : withAlpha(base, 0.62);
}

export function stageOf(phase) {
  return PHASE_STAGE[phase]?.[0] ?? null;
}

function withAlpha(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Delivery outcome inks. Separate from phase ink — different axis of meaning. */
export const OUTCOME = {
  sent: { label: 'Delivered', light: '#0B7A4B', dark: '#4ECB8D' },
  deferred: { label: 'Deferred', light: '#A26212', dark: '#E0A75C' },
  failed: { label: 'Failed', light: '#C0392F', dark: '#F08A80' },
  sending: { label: 'Sending', light: '#1D63D1', dark: '#6BA2F5' },
  queued: { label: 'Queued', light: '#5B6572', dark: '#8C97A3' },
};

export function outcomeInk(status, mode = 'light') {
  const o = OUTCOME[status];
  if (!o) return mode === 'dark' ? '#8C97A3' : '#5B6572';
  return mode === 'dark' ? o.dark : o.light;
}

/** A reply code's class decides how a captured row is tinted. */
export function replyClass(code) {
  if (!code) return 'queued';
  if (code >= 500) return 'failed';
  if (code >= 400) return 'deferred';
  if (code >= 200 && code < 300) return 'sent';
  return 'sending';
}
