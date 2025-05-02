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
        </Head>
        <body id="wrapper">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
