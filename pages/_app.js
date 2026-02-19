// pages/_app.js
import "../styles/globals.css";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        console.log("[_app] app mounted");
    }, []);
    return <Component {...pageProps} />;
}

export default MyApp;
