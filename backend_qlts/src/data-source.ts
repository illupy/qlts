import "reflect-metadata"
import { DataSource } from "typeorm"
//using dotenv to load environment variables
import * as dotenv from "dotenv"
dotenv.config()
export const AppDataSource = new DataSource({
    type: "mysql", 
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306", 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false, //because we have database already
    logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
})
