import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm"
import Book from "./Book"

@Entity("users")
class User {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string

  @Column({ type: "varchar", length: 255 })
  fullName: string

  @Column({ type: "varchar", length: 30, unique: true })
  username: string

  @Column({ type: "varchar", length: 255, unique: true })
  email: string

  @Column({ type: "varchar", select: false })
  password: string

  @Column({ type: "boolean" })
  isStudent: boolean

  @Column({ type: "char", length: 4, default: null })
  userClass: string

  @Column({ default: null })
  avatarUrl: string

  @ManyToMany(() => Book, (book) => book.usersFavorites, { cascade: true })
  @JoinTable()
  favoriteBooks: Book[]

  @OneToMany(() => Book, (book) => book.userOwner)
  @JoinTable({
    name: "user_books",
    joinColumn: { name: "userId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "bookIsbn", referencedColumnName: "isbn" }
  })
  books: Book[]

  @CreateDateColumn({ type: "timestamptz" })
  readonly createdAt: Date
}

export default User
