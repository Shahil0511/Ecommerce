import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/user";
import { productRouter } from "./routes/products";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/product", productRouter);

mongoose.connect(
  "mongodb+srv://kingoo:0511@database.osyap.mongodb.net/?retryWrites=true&w=majority&appName=DATABASE"
);

app.listen(3001, () => {
  console.log("server is ready on 3001");
});
