import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;

//@desc Register
//POST /api/user/register
const register = async (req, res, next) => {
  const { email, password } = req.body;
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    const error = new Error("Email already exists");
    error.status = 400;
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  res.status(201).json({ message: "success", user: newUser });
};

//@desc Login
//POST /api/user/login
const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const error = new Error("No email in data !");
    error.status = 400;
    return next(error);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    const error = new Error("Password wrong !");
    error.status = 400;
    return next(error);
  }
  console.log('LOGIN log',SECRET_KEY);
  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });

  res.status(200).json({ message: "success", token });
};

export { register, login }
