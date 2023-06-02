import userRepository from "@/repositories/userRepository"
import User from "@entities/User"
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError
} from "@helper/apiError"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"

class authController {
  async login(req: Request<{}, {}, User>, res: Response) {
    const { email, password } = req.body

    if (email.length === 0 || password.length === 0)
      throw new BadRequestError("E-mail e senha são obrigatórios")

    const userExists = await userRepository.findOne({
      where: [{ email }, { username: email }],
      select: ["id", "email", "password"]
    })

    if (!userExists) {
      throw new NotFoundError("Usuário não encontrado")
    }

    if (userExists.password !== password) {
      throw new BadRequestError("E-mail ou senha incorretos")
    }

    const token = jwt.sign({ id: userExists.id }, process.env.JWT_SECRET!, {
      expiresIn: "60d"
    })

    return res.json({ token })
  }

  async me(req: Request, res: Response) {
    const { authorization } = req.headers

    if (!authorization) {
      throw new UnauthorizedError("Token não informado")
    }

    const [, token] = authorization.split(" ")

    let userId: string | null = null

    jwt.verify(token, process.env.JWT_SECRET!, async (err, decoded) => {
      if (err || !decoded || typeof decoded !== "object" || !decoded.id) {
        userId = null
        return
      }

      userId = decoded.id
    })

    if (!userId) {
      throw new UnauthorizedError("Token inválido")
    }

    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ["books", "favoriteBooks"]
    })

    if (!user) {
      throw new NotFoundError("Usuário não encontrado")
    }

    return res.status(200).json(user)
  }
}

export default new authController()
