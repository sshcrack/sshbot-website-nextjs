

// import App from "next/app";
import type { AppProps } from 'next/app'
import "../styles/globals.css"

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
