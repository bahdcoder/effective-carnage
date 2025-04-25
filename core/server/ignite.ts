import fs from "node:fs/promises"
import express from "express"
import { Transform } from "node:stream"
import type { ViteDevServer } from "vite"
import type {
  PipeableStream,
  RenderToPipeableStreamOptions,
} from "react-dom/server"

// Constants
const isProduction = process.env.NODE_ENV === "production"
const port = process.env.PORT || 5173
const base = process.env.BASE || "/"
const ABORT_DELAY = 10000

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile("./build/entry/client/index.html", "utf-8")
  : ""

// Create http server
const app = express()

let vite: ViteDevServer | undefined

function getDistPath(path: string) {
  return `./build/${path}`
}

if (!isProduction) {
  const { createServer } = await import("vite")
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import("compression")).default
  const sirv = (await import("sirv")).default
  app.use(compression())
  app.use(base, sirv("./build/entry/client", { extensions: [] }))
}

// Serve HTML
app.use("*all", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "")

    let template: string | undefined

    let render: (
      url: string,
      options?: RenderToPipeableStreamOptions
    ) => PipeableStream
    if (!isProduction) {
      template = await fs.readFile("public/index.html", "utf-8")
      template = await vite?.transformIndexHtml(url, template)
      render = (await vite?.ssrLoadModule("core/entry/server.tsx"))?.render
    } else {
      template = templateHtml
      render = (await import(getDistPath("build/entry/server/server.js")))
        .render
    }

    let didError = false

    const { pipe, abort } = render(url, {
      onShellError() {
        res.status(500)
        res.set({ "Content-Type": "text/html" })
        res.send("<h1>Something went wrong</h1>")
      },
      onShellReady() {
        res.status(didError ? 500 : 200)
        res.set({ "Content-Type": "text/html" })

        const transformStream = new Transform({
          transform(chunk, encoding, callback) {
            res.write(chunk, encoding)
            callback()
          },
        })

        const [htmlStart, htmlEnd] = (template as string).split(
          "<!--app-html-->"
        )

        res.write(htmlStart)

        transformStream.on("finish", () => {
          res.end(htmlEnd)
        })

        pipe(transformStream)
      },
      onError(error) {
        didError = true
        console.error(error)
      },
    })

    setTimeout(() => {
      abort()
    }, ABORT_DELAY)
  } catch (e: unknown) {
    const viteError = e as Error
    vite?.ssrFixStacktrace(viteError)
    console.log(viteError.stack)
    res.status(500).end(viteError.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
