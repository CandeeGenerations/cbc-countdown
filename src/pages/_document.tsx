import {Head, Html, Main, NextScript} from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Countdown</title>
      </Head>

      <body className="text-base" style="background-color: #621A34">
        <main className="p-6 pb-4">
          <Main />
          <NextScript />
        </main>
      </body>
    </Html>
  )
}
