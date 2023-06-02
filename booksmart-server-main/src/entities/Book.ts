import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne
} from "typeorm"
import User from "./User"

@Entity({ name: "books", orderBy: { createdAt: "ASC" } })
class Book {
  @Column({ type: "varchar", length: 13, primary: true })
  isbn: string

  @Column({ type: "varchar", length: 100 })
  title: string

  @Column({ type: "varchar", array: true })
  authorsName: string[]

  @Column({ type: "varchar", array: true, nullable: true })
  category: string[]

  @Column({ type: "varchar", length: 100, nullable: true })
  publisher: string

  @Column({ type: "int" })
  pages: number

  @Column({ type: "varchar", length: 4, nullable: true })
  year: string

  @Column({ type: "varchar", length: 50 })
  language: string

  @Column({ type: "varchar", nullable: true })
  coverUrl: string

  @Column({ type: "boolean" })
  forAdults: boolean

  @ManyToOne(() => User, (user) => user.books)
  @JoinColumn({ name: "userId" })
  userOwner: User

  @ManyToMany(() => User, (user) => user.favoriteBooks)
  usersFavorites: User[]

  @CreateDateColumn({ type: "timestamptz" })
  readonly createdAt: Date
}

export default Book
