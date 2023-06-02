import { Router } from "express"
import "express-async-errors"
import userController from "@controllers/userController"
import bookController from "@controllers/bookController"
import authController from "@controllers/authController"

const router = Router()

// USER
router.get("/user", userController.index)
router.get("/user/:id", userController.show)
router.post("/user", userController.store)
router.put("/user/:id", userController.update)

// BOOK
router.get("/book", bookController.index)
router.get("/book/:id", bookController.show)
router.post("/book", bookController.store)
router.put("/book/:id", bookController.update)

// AUTH
router.post("/auth/login", authController.login)
router.get("/auth/me", authController.me)

export default router
