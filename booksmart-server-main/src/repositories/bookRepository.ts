import AppDataSource from "@/dataSource"
import Book from "@/entities/Book"

const bookRepository = AppDataSource.getRepository(Book)

export default bookRepository
