// server/index.js
import express from "express";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
import path from "path";
import multer from "multer";
import * as dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });

console.log(process.cwd());

const app = express();
const PORT = process.env.PORT || 3001;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const SAVEPATH = "uploads/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, SAVEPATH);
  },
  filename: (req, file, cb) => {
    // const uniqueName = `image_${Date.now()}${path.extname(file.originalname)}`;
    const uniqueName = `image_org${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.post("/openai", upload.single("image"), async (req, res) => {
  try {
    const response = await openai.createImageVariation(
      fs.createReadStream(req.file.path),
      1,
      "512x512",
      "url"
    );
    console.log("openai.createImageVariation=======success start");
    console.log(response);
    console.log("openai.createImageVariation=======success end");
    res.json(response.data);
  } catch (error) {
    console.log("openai.createImageVariation=======error start");
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    console.log("openai.createImageVariation=======error end");
    res
      .status(500)
      .json({ message: "Error processing image", error: error.message });
  }
  // fs.rmdir(SAVEPATH, { recursive: true }, (err) => {
  //   if (err) {
  //     console.error("Error deleting directory:", err);
  //   } else {
  //     console.log("Directory deleted successfully");
  //   }
  // });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
