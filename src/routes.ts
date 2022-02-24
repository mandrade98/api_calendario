import { Router } from "express";
import { UserController } from "./controllers/UserController";


const router = Router()
const userController = new UserController();

router.get("/", (request, response) => {
    return response.status(200).send("API REST para gerenciar eventos e pessoas.")
})


router.post("/user", userController.save)
router.delete("/user", userController.delete)
router.put("/user", userController.update)
router.get("/users", userController.list)
router.get("/user/list", userController.listByEmail)



export { router }
