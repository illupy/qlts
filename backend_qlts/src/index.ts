import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { AppDataSource } from "./data-source";
import cookieParser from 'cookie-parser';
import route from "./routes";
AppDataSource.initialize()
  .then(async () => {
    const app = express();

    // Middlewares
    app.use(express.json()); 
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan("combined"));
    app.use(cors(
      {
        origin: "http://localhost:5173",
        credentials: true,
      }
    ));
    app.use(cookieParser());

    // Routes
    route(app)

    // Start server
    app.listen(3001, () => {
      console.log("Express server has started on port 3001. Open http://localhost:3001/");
    });
  })
  .catch((error) => console.log("DB init error:", error));
