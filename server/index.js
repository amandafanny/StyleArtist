import express from "express";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import multer from "multer";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const app = express();
const storage = multer.diskStorage({
  destination: path.resolve(__dirname, "uploads"), // 上传文件保存的目录
  filename: (req, file, callback) => {
    const name = file.originalname.replace(/\s+/g, "-").toLowerCase();
    const timestamp = Date.now();
    callback(null, `${timestamp}-${name}`);
  },
});
const upload = multer({ storage });
const port = 3001;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/openai", upload.single("image"), async (req, res) => {
  const file = req.file;
  try {
    const response = await openai.createImageVariation(
      fs.createReadStream(file.path),
      4,
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
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});

// 定时清理上传的文件
setInterval(async () => {
  const now = Date.now();
  const files = await fs.readdir(path.resolve(__dirname, "uploads"));
  files.forEach(async (file) => {
    const stat = await fs.stat(path.resolve(__dirname, "uploads", file));
    const modifiedTime = new Date(stat.mtime).getTime();
    if (now - modifiedTime > 24 * 60 * 60 * 1000) {
      console.log(`Deleting ${file}`);
      await fs.unlink(path.resolve(__dirname, "uploads", file));
    }
  });
}, 60 * 60 * 1000); // 每小时清理一次
