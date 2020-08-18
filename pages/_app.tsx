

// import App from "next/app";
import { AppProps } from 'next/app'
import { Provider } from 'next-auth/client'
import "../styles/globals.scss"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
