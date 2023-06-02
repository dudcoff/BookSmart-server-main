import { UnauthorizedError } from "./apiError"
import jwt from "jsonwebtoken"

const verifyAuth = (bearerToken: string | undefined | null) => {
  if (!bearerToken) {
    throw new UnauthorizedError("Token não informado")
  }

  const [, token] = bearerToken.split(" ")

  let userId: string | null = ""

  jwt.verify(token, process.env.JWT_SECRET!, async (err, decoded) => {
    if (err || !decoded || typeof decoded !== "object" || !decoded.id) {
      userId = null
      return
    } else {
      userId = decoded.id
    }
  })

  if (!userId) {
    throw new UnauthorizedError("Token inválido")
  }

  return userId
}

export default verifyAuth
