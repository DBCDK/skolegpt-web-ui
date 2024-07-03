import { DocumentProps, Head, Html, Main, NextScript } from 'next/document';

import i18nextConfig from '../next-i18next.config';

type Props = DocumentProps & {
  // add custom document props
};

export default function Document(props: Props) {
  const currentLocale = i18nextConfig.i18n.defaultLocale;
    // props.__NEXT_DATA__.locale ?? i18nextConfig.i18n.defaultLocale;
  // console.log(currentLocale);
  return (
    <Html lang={currentLocale}>
      <Head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Chatbot UI"></meta>
        <script
        dangerouslySetInnerHTML={{
          __html: `   var _paq = window._paq = window._paq || [];
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          (function() {
            var u="https://stats.dbc.dk/";
            _paq.push(['setTrackerUrl', u+'matomo.php']);
            _paq.push(['setSiteId', '43']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
            })();`,
        }}
      />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
