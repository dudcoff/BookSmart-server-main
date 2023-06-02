import User from "@/entities/User"
import { BadRequestError, Conflict, NotFoundError } from "@/helper/apiError"
import bookRepository from "@/repositories/bookRepository"
import userRepository from "@/repositories/userRepository"
import { Request, Response } from "express"
import { Equal, In, Not } from "typeorm"
import jwt from "jsonwebtoken"
import isUUID from "@/helper/isUUID"

class UserController {
  async index(req: Request, res: Response) {
    const users = await userRepository.find()

    return res.json(users)
  }

  async show(req: Request, res: Response) {
    const { id } = req.params

    let user

    if (isUUID(id)) {
      user = await userRepository.findOne({
        where: [{ id }],
        relations: ["books", "favoriteBooks"],
        order: { books: { createdAt: "DESC" } }
      })
    } else {
      user = await userRepository.findOne({
        where: [{ username: id }],
        relations: ["books", "favoriteBooks"],
        order: { books: { createdAt: "DESC" } }
      })
    }

    if (!user) {
      throw new NotFoundError("Usuário não encontrado")
    }

    return res.json(user)
  }

  async store(req: Request<{}, {}, User>, res: Response) {
    const { email, password, username, isStudent, userClass } = req.body

    const emailExists = await userRepository.findOneBy({ email })

    if (emailExists) {
      throw new Conflict("Este e-mail já existe")
    }

    const usernameExists = await userRepository.findOneBy({ username })

    if (usernameExists) {
      throw new Conflict("Este username já existe")
    }

    const user = userRepository.create({
      email,
      password,
      username,
      isStudent,
      userClass,
      fullName: username
    })

    await userRepository.save(user)

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "60d"
    })

    return res.status(201).json(token)
  }

  async update(
    req: Request<{ id: string }, {}, User & { favoriteBooksId: string[] }>,
    res: Response
  ) {
    const { id } = req.params
    const { password, favoriteBooksId = [], ...newData } = req.body

    const user = await userRepository.findOne({
      where: { id },
      relations: ["favoriteBooks"]
    })

    if (!user) {
      throw new NotFoundError("Usuário não encontrado")
    }

    const emailExists = await userRepository.exist({
      where: { id: Not(id), email: Equal(newData.email) }
    })

    if (emailExists) {
      throw new BadRequestError("Esse e-mail já existe")
    }

    const usernameExists = await userRepository.exist({
      where: { id: Not(id), username: Equal(newData.username) }
    })

    if (usernameExists) {
      throw new BadRequestError("Esse username já existe")
    }
    console.log(newData.fullName)

    const favoriteBooksExists = await bookRepository.find({
      where: { isbn: In(favoriteBooksId) }
    })

    console.log(user.favoriteBooks)

    const userFavoriteBooks = [
      ...favoriteBooksExists,
      ...(user.favoriteBooks || [])
    ]

    const updatedUser = await userRepository.preload({
      ...user,
      ...newData,
      favoriteBooks: userFavoriteBooks,
      id: user.id
    })

    if (!updatedUser) return

    await userRepository.save(updatedUser)

    return res.json(updatedUser)
  }
}

export default new UserController()
