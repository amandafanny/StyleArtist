import express from "express";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import multer from "multer";
import * as dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });

console.log(process.cwd());

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = 3001;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/openai", upload.single("image"), async (req, res) => {
  const buffer = req.file.buffer;
  // Set a `name` that ends with .png so that the API knows it's a PNG image
  buffer.name = "image.png";
  try {
    const response = await openai.createImageVariation(
      buffer,
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
