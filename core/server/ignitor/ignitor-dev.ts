import fs from "node:fs/promises"
import type { Request, Response } from "express"
import type {
  PipeableStream,
  RenderToPipeableStreamOptions,
} from "react-dom/server"
import type { ViteDevServer } from "vite"
import { Ignitor } from "./ignitor"

/**
 * Development environment implementation of the Ignitor
 */
export class IgnitorDev extends Ignitor {
  private vite: ViteDevServer | undefined

  constructor() {
    super({
      debug: true,
    })
  }

  /**
   * Setup development middleware including Vite
   */
  protected async setup(): Promise<void> {
    const { createServer } = await import("vite")

    this.vite = await createServer({
      server: { middlewareMode: true },
      appType: "custom",
    })

    this.app.use(this.vite.middlewares)
  }

  /**
   * Handle requests in development mode
   * Uses Vite's HMR and module transformation capabilities
   */
  protected async handleRequest(req: Request, res: Response): Promise<void> {
    try {
      const url = req.originalUrl

      let template = await fs.readFile("public/index.html", "utf-8")
      template =
        (await this.vite?.transformIndexHtml(url, template)) || template

      const render: (
        url: string,
        options?: RenderToPipeableStreamOptions
      ) => PipeableStream = (
        await this.vite?.ssrLoadModule("core/entry/server.tsx")
      )?.render

      let didError = false

      const { pipe, abort } = render(url, {
        onShellError: () => {
          res.status(500)
          res.set({ "Content-Type": "text/html" })
          res.send("<h1>Something went wrong</h1>")
        },
        onShellReady: () => {
          res.status(didError ? 500 : 200)
          res.set({ "Content-Type": "text/html" })

          const transformStream = this.createTransformStream(res)
          const [htmlStart, htmlEnd] = template.split("<!--app-html-->")

          res.write(htmlStart)

          transformStream.on("finish", () => {
            res.end(htmlEnd)
          })

          pipe(transformStream)
        },
        onError: (error) => {
          didError = true
          console.error(error)
        },
      })

      setTimeout(() => {
        abort()
      }, 25000)
    } catch (error: unknown) {
      const viteError = error as Error
      this.vite?.ssrFixStacktrace(viteError)
      this.handleError(viteError, res)
    }
  }
}
