import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import todo from "./routes/todo.js";
import user from "./routes/user.js";
import ErrorHandler from "./middleware/errorHandler.js";
import NotFound from "./middleware/notFound.js";

//Get dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const port = process.env.PORT || 8080;

const app = express();

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Static
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use("/api/todo", todo);
app.use("/api/user", user);

//Error Handler
app.use(NotFound);
app.use(ErrorHandler);

app.listen(port);
