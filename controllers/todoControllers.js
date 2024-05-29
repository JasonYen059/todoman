import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//@desc Get all todos
//GET /api/todo
const getTodoList = async (req, res, next) => {
  const limit = parseInt(req.query.limit);
  const userId = req.user.userId;
  const todos = await prisma.todo.findMany({
    where:{ userId }
  });

  if (!isNaN(limit) && limit > 0) {
    return res.status(200).json(todos.slice(0, limit));
  }
  res.status(200).json(todos);
};

//@desc Get single todos
//GET /api/todo/:id
const getTodo = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const parseId = parseInt(id);
  const todo = await prisma.todo.findUnique({
    where: { id: parseId, userId },
  });

  if (!todo) {
    const error = new Error(`Get -- Can't find the fucking ${id}, Bitch`);
    error.status = 404;
    return next(error);
  }

  res.status(200).json(todo);
};

//@desc Create todo
//POST /api/todo
const createTodo = async (req, res, next) => {
  const { item } = req.body;
  const userId = req.user.userId;

  if (!item) {
    const error = new Error("Just send the fucking todo");
    error.status = 400;
    return next(error);
  }
  await prisma.todo.create({
    data: {
      userId,
      item
    },
  });
  const todos = await prisma.todo.findMany({ where:{ userId }});
  res.status(201).json(todos);
};

//@desc Update todo
//PUT /api/todo/:id
const updateTodo = async (req, res, next) => {
  const {
    body: { item, check },
    params: { id },
  } = req;
  const parseId = parseInt(id);
  const userId = req.user.userId;

  try {
    await prisma.todo.update({
      where: { id: parseId, userId },
      data: { item, check },
    });
    const todos = await prisma.todo.findMany({ where:{ userId }});
    res.status(200).json(todos);
  } catch (err) {
    const error = new Error(`Update -- Can't find the fucking ${id}, Bitch`);
    error.status = 404;
    next(error);
  }
};

//@desc Delete todo
//DELETE /api/todo/:id
const deleteTodo = async (req, res, next) => {
  const { id } = req.params;
  const parseId = parseInt(id);
  const userId = req.user.userId;

  try {
    await prisma.todo.delete({
      where: { id: parseId, userId },
    });
    const todos = await prisma.todo.findMany({ where:{ userId }});
    res.status(200).json(todos);
  } catch (err) {
    const error = new Error(`Delete -- Can't find the fucking ${id}, Bitch`);
    error.status = 404;
    next(error);
  }
};

export { getTodoList, getTodo, createTodo, updateTodo, deleteTodo };
