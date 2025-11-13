import express from "express";
import {connectDB} from "./config/db.js"
import dotenv from "dotenv"
import routes from "./src/routes/index.route.js"

dotenv.config()

const port  = process.env.PORT;

const app = express();
app.use(express.json());


app.use("/api", routes)

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
    connectDB()
})

