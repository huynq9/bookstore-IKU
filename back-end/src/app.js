import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// app.use("/api", routerProduct);
// app.use("/api", routerAuth);
app.use("/api", router);

export const viteNodeApp = app;
mongoose.connect(`${process.env.URI_DB}`);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
  console.log("hehehee");
});
