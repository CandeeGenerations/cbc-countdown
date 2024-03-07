import {Head, Html, Main, NextScript} from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Countdown</title>
      </Head>

      <body className="bg-gray-100 text-base">
        <main className="p-8 pb-4">
          <Main />
          <NextScript />
        </main>
      </body>
    </Html>
  )
}
