import type { AppProps } from "next/app";
import "../style/globals.css"
export default function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
