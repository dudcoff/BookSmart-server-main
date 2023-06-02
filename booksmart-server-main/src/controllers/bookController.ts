import Book from "@/entities/Book"
import { Conflict, NotFoundError } from "@/helper/apiError"
import verifyAuth from "@/helper/verifyAuth"
import bookRepository from "@/repositories/bookRepository"
import userRepository from "@/repositories/userRepository"
import { Request, Response } from "express"

class bookController {
  async index(req: Request, res: Response) {
    const books = await bookRepository.find({
      select: {
        userOwner: {
          username: true,
          avatarUrl: true,
          fullName: true,
          userClass: true,
          id: true
        }
      },
      relations: { userOwner: true },
      order: { createdAt: "DESC" }
    })

    return res.json(books)
  }

  async show(req: Request, res: Response) {
    const { id } = req.params

    const book = await bookRepository.findOne({
      where: { isbn: id },
      relations: ["userOwner"]
    })

    if (!book) {
      throw new NotFoundError("Livro não encontrado")
    }

    return res.json(book)
  }

  async store(req: Request<{}, {}, Book & { userId: string }>, res: Response) {
    const {
      title,
      authorsName,
      publisher,
      year,
      pages,
      language,
      forAdults,
      category,
      isbn,
      coverUrl,
      userId
    } = req.body

    const userExists = await userRepository.findOneBy({ id: userId })

    if (!userExists || !userId) {
      throw new NotFoundError("Usuário não encontrado")
    }

    const bookExists = await bookRepository.findOne({
      where: [{ isbn, userOwner: { id: userExists.id } }]
    })

    if (bookExists) {
      throw new Conflict("Você já cadastrou este ISBN")
    }

    const book = bookRepository.create({
      forAdults,
      category,
      isbn,
      title,
      authorsName,
      publisher,
      year,
      pages,
      language,
      coverUrl,
      userOwner: userExists
    })

    await bookRepository.save(book)

    return res.status(201).json(book)
  }

  async update(req: Request<{ id: string }, {}, Book>, res: Response) {
    const { id } = req.params
    const { authorization } = req.headers
    const { isbn, createdAt, userOwner, ...newData } = req.body

    const userId = verifyAuth(authorization)

    const book = await bookRepository.findOne({
      where: { isbn: id, userOwner: { id: userId } }
    })

    if (!book) {
      throw new NotFoundError("Livro não encontrado")
    }

    const updatedBook = await bookRepository.preload({
      ...book,
      ...newData,
      isbn: id
    })

    if (!updatedBook) {
      throw new NotFoundError("Livro não encontrado")
    }

    await bookRepository.save(updatedBook)

    return res.json(updatedBook)
  }
}

export default new bookController()
