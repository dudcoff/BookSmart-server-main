import ApiError from "@/helper/apiError"
import { NextFunction, Request, Response } from "express"

const errorMiddleware = (
  err: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = err.statusCode ? err.message : "Algo deu errado"
  const statusCode = err.statusCode || 500

  console.error({
    message: err.message,
    code: statusCode,
    method: req.method,
    path: req.path
  })

  return res.status(statusCode).json({ error: message })
}

export default errorMiddleware
