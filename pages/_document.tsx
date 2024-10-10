import { DocumentProps, Head, Html, Main, NextScript } from 'next/document';
import Script from "next/script";

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

        <Script
        id='matomo-tracking-script'
          dangerouslySetInnerHTML={{
            __html: `   var _paq = window._paq = window._paq || [];
        //  _paq.push(['trackPageView']);
            _paq.push(["requireCookieConsent"]);     // <--- Add this line to the script
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
        <Script
          id="cookiebot-script"
          src="https://consent.cookiebot.com/uc.js"

          data-cbid={process.env.COOKIEBOT_ID}
          data-blockingmode="auto"
          type="text/javascript"
        ></Script>

        <Script
          id="cookiebot-matomo-connector"
          dangerouslySetInnerHTML={{
            __html: `
// Cookiebot consent and Matomo connector
  var waitForTrackerCount = 0;
  function matomoWaitForTracker() {
    if (typeof _paq === "undefined" || typeof Cookiebot === "undefined") {
      if (waitForTrackerCount < 40) {
        setTimeout(matomoWaitForTracker, 250);
        waitForTrackerCount++;
        return;
      }
    } else {
      window.addEventListener("CookiebotOnAccept", function (e) {
        consentSet();
      });
      window.addEventListener("CookiebotOnDecline", function (e) {
        consentSet();
      });
    }
  }
  function consentSet() {
    if (Cookiebot.consent.statistics) {
      _paq.push(["setCookieConsentGiven"]);
    } else {
      _paq.push(["forgetCookieConsentGiven"]);
    }
  }
  document.addEventListener("DOMContentLoaded", matomoWaitForTracker());`,
          }}
        ></Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
