import fs from "node:fs/promises"
import type { Request, Response } from "express"
import type {
  PipeableStream,
  RenderToPipeableStreamOptions,
} from "react-dom/server"
import { Ignitor } from "./ignitor"

/**
 * Production environment implementation of the Ignitor
 */
export class IgnitorProd extends Ignitor {
  constructor() {
    super({ debug: false })
  }

  async setup() {}

  /**
   * Get the path to a file in the build directory
   */
  private getDistPath(path: string): string {
    return `./build/${path}`
  }

  /**
   * Handle requests in production mode
   * Uses pre-built assets for optimal performance
   */
  protected async handleRequest(req: Request, res: Response): Promise<void> {
    try {
      const url = req.originalUrl
      const template = await fs.readFile(
        "./build/entry/client/index.html",
        "utf-8"
      )

      const render: (
        url: string,
        options?: RenderToPipeableStreamOptions
      ) => PipeableStream = (
        await import(this.getDistPath("entry/server/server.js"))
      ).render

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
      this.handleError(error as Error, res)
    }
  }
}
