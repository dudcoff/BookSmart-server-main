import AppDataSource from "@/dataSource"
import User from "@/entities/User"

const userRepository = AppDataSource.getRepository(User)

export default userRepository
