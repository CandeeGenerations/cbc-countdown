import {Head, Html, Main, NextScript} from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <body className="text-base text-white" style={{backgroundColor: '#621A34'}}>
        <main className="p-10 pb-4">
          <Main />
          <NextScript />
        </main>
      </body>
    </Html>
  )
}
