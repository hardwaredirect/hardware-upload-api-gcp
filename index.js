import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import { Storage } from '@google-cloud/storage';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(fileUpload());

const storage = new Storage();
const bucket = storage.bucket(process.env.BUCKET_NAME);

app.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.plan) {
      return res.status(400).json({ error: 'No plan uploaded' });
    }
    const file = req.files.plan;
    const blob = bucket.file(file.name);
    await blob.save(file.data, { contentType: file.mimetype });
    const [buffer] = await blob.download();
    const base64PDF = buffer.toString('base64');
    // TODO: Replace with OpenAI/Aitopia call
    const materialList = `Mock list for ${file.name}`;
    res.json({ materialList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (_req, res) => {
  res.send('📦 Hardware Upload API is running');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
