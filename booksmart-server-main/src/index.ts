import Express from "express"
import AppDataSource from "./dataSource"
import router from "./routes"
import errorMiddleware from "@middlewares/error"
import cors from "cors"

const port = 3000

AppDataSource.initialize().then(() => {
  const app = Express()

  app.use(Express.json())
  app.use(
    cors({
      origin: true,
      credentials: true
    })
  )
  app.use(router)

  app.use(errorMiddleware)

  app.listen(port, () => {
    console.log(`🔥 Server is listening on http://localhost:${port}`)
  })
})
