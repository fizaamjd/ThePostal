import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          {/* Archivo carries the interface; JetBrains Mono carries every
              measurement, address and protocol reply. */}
          <link
            href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
            rel="stylesheet"
          />
          <meta name="theme-color" content="#FFFFFF" />
        </Head>
        <body>
          <div
            dangerouslySetInnerHTML={{
              __html: `<!--
THESIS: this product measures where time goes inside an SMTP transaction, so the
interface is a packet capture, not a marketing page with a chart bolted on. It
refuses the dashboard-of-rounded-stat-cards arrangement its category defaults to.
OWN-WORLD: analyser grammar in two first-class modes — tinted capture rows over a
faint measurement grid, hairline panels, JetBrains Mono columns with tabular
figures, Archivo for the interface, and a fixed ink per SMTP phase (five stage
hues at two depths) that follows that phase into every view.
STORY: a reviewer sees a real protocol exchange and its phase waterfall, learns
the palette once, then reads any later capture faster.
FIRST VIEWPORT: headline left over a live transcript panel right; the phase
waterfall directly beneath as the thesis, bars offset cumulatively so the row
reads as a timeline; primary action top-left of the fold.
FORM: protocol analyser, candidate 3 of 7, raised by the midnight transit
diagram's systematic ink-per-line discipline. Seed key 10ab4239.
FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance.
-->`,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
