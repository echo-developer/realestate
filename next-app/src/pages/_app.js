'use client'
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import Head from "next/head";
import "../app/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import LoadingSkeleton from "@/components/LoadingSpinner/LoadingSkeleton";

function MyApp({ Component, pageProps }) {
  const { locale, events } = useRouter();
  const [loading, setLoading] = useState(true)

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

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSkeleton/>}>

        <Head key={locale}>
        </Head>
        {loading && <LoadingSkeleton />}
        
        <div>
          <Component {...pageProps} />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={''}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>

      </Suspense>
    </ErrorBoundary>
  );
}

export default MyApp;
