import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="id">
            <Head>
                <meta charSet="UTF-8" />
                <meta
                    name="description"
                    content="ZikAnime - Nonton anime terlengkap dan terupdate. Streaming anime sub Indo gratis!"
                />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
