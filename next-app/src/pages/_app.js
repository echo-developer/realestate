'use client'
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import Head from "next/head";
import "../app/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import MyLoader from "@/components/LoadingSpinner/MyLoader";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/context/AuthProvider";
// import 'mmenu-js/dist/mmenu.css'; // Optional default styles

function MyApp({ Component, pageProps }) {
  const { locale, events } = useRouter();
  const [loading, setLoading] = useState(true);

  // Handle route change events for loading spinner
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    events.on("routeChangeStart", handleStart);
    events.on("routeChangeComplete", handleComplete);
    events.on("routeChangeError", handleComplete);

    return () => {
      events.off("routeChangeStart", handleStart);
      events.off("routeChangeComplete", handleComplete);
      events.off("routeChangeError", handleComplete);
    };
  }, [events]);


  // useEffect(() => {
  //   // Ensure that mmenu is initialized only on the client side
  //   if (typeof window !== 'undefined') {
  //     import('jquery').then(($) => {
  //       import('mmenu-js').then((Mmenu) => {
  //         // Make sure we access the default export correctly
  //         const menu = new Mmenu.default('#menu', {
  //           extensions: ['effect-slide-menu', 'pageshadow'],
  //           navbar: { title: 'Menu' },
  //           navbars: [
  //             { position: 'top', content: ['search', 'close'] },
  //           ],
  //         });

  //         menu.init();
  //       });
  //     });
  //   }
  // }, []);


  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Suspense fallback={<MyLoader />}>
          <Head key={locale}>
            {/* You can add meta tags, title, etc. */}
          </Head>
          <div>
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Suspense>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
