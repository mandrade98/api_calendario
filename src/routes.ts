import { Router } from "express";
import { EventController } from "./controllers/EventController";
import { EventParticipantController } from "./controllers/EventParticipantController";
import { UserController } from "./controllers/UserController";

const router = Router();
const userController = new UserController();
const eventController = new EventController();
const eventParticipantController = new EventParticipantController();

router.get("/", (request, response) => {
    return response
        .status(200)
        .send("API REST para gerenciar eventos e pessoas.");
});

router.post("/user", userController.save);
router.delete("/user", userController.delete);
router.put("/user", userController.update);
router.get("/users", userController.list);
router.get("/user/list", userController.listByEmail);

router.post("/event", eventController.save);
router.delete("/event", eventController.delete);
router.put("/event", eventController.update);
router.get("/events", eventController.list);
router.get("/event/list", eventController.listById);

router.post("/eventParticipant", eventParticipantController.save);
router.get("/eventParticipant/list", eventParticipantController.listByUserId);

export { router };
