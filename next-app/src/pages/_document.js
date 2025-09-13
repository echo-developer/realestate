import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    const locale = "en";

    return (
      <Html lang={locale}>
        <Head>
          <link
            href="/assets/images/favicon.png"
            type="image/png"
            rel="shortcut icon"
          />
          <link rel="preload" href="/assets/images/logo.png" as="image" />
          <link rel="preload" href="/assets/images/logo-mobile.png" as="image" />
          <link href="/assets/css/icons.css" type="text/css" rel="stylesheet" />
          <link
            href="/assets/css/google-material-icons.css"
            type="text/css"
            rel="stylesheet"
          />
          <link href="/assets/css/mmenu.css" type="text/css" rel="stylesheet" />
          <link href="/assets/css/style.css" type="text/css" rel="stylesheet" />
          <link href="/assets/css/ltr.css" type="text/css" rel="stylesheet" />
          <link
            href="/assets/css/responsive.css"
            type="text/css"
            rel="stylesheet"
          />
          <link
            href="/assets/css/magic-check.css"
            type="text/css"
            rel="stylesheet"
          />

          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css"
            integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7"
            crossorigin="anonymous"
          />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css" />
        </Head>
        <body >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
