import express from "express";
import AuthToken from "../middleware/jwt.js";
import {
  getTodoList,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoControllers.js";
const router = express.Router();
router.use(AuthToken);

//Get all todos
router.get("/", getTodoList);

//Get sigle todo
router.get("/:id", getTodo);

//Create new todo
router.post("/", createTodo);

//Update todo
router.put("/:id", updateTodo);

//Delete todo
router.delete("/:id", deleteTodo);

export default router;
