import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Successful connection"))
  .catch((err) => console.error(err));



app.listen(PORT, () => console.log(`Server started on port ${PORT}`)
)