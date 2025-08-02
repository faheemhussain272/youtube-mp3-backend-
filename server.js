const express = require("express");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

app.get("/convert", async (req, res) => {
  const videoURL = req.query.url;
  if (!ytdl.validateURL(videoURL)) return res.status(400).send("Invalid URL");

  const videoID = ytdl.getURLVideoID(videoURL);
  const filePath = path.resolve(__dirname, `${videoID}.mp3`);
  const stream = ytdl(videoURL, { quality: "highestaudio" });

  ffmpeg(stream)
    .audioBitrate(128)
    .save(filePath)
    .on("end", () => {
      res.download(filePath, `${videoID}.mp3`, () => {
        fs.unlinkSync(filePath);
      });
    });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
