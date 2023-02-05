require("colors");
require("dotenv/config");

const fileUpload = require("express-fileupload");
const randomstring = require("randomstring");
const fetch = require("node-fetch");
const express = require("express");
const path = require("path");
const url = require("url");

const app = express();
app.listen(process.env.PORT, () => {
    console.log("#".cyan.bold, "App is Online".green);
});

app.use("/CDN", express.static(path.join(__dirname, "./CDN")));
app.use(express.static(path.join(__dirname, "./public")));
app.set("views", path.join(__dirname, "./views"));
app.use(express.json());
app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: (1024 * 1024) * 20 // 20 MB
    }
}));


app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.post("/message", async (req, res) => {
    let { message } = req.body;
    let images = [];
    if (req.files) {
        images = Object.values(req.files).map((img) => {
            let filename = `${randomstring.generate(5)}${path.extname(img.name)}`;
            img.mv(path.join(__dirname, `./CDN/${filename}`));
            return filename;
        });
        message += `\n\n*Images:*\n${images.map((img) => `${req.headers.referer}CDN/${img}`).join("\n")}`;
    }
    message += `\n\n*Time:* ${new Date().toLocaleTimeString()}\n*Date:* ${new Date().toLocaleDateString()}`
    let messageURL = `https://api.callmebot.com/whatsapp.php?phone=${process.env.PHONE_NUMBER}&apikey=${process.env.WHATSAPP_API_KEY}&text=${message}`;
    fetch(url.parse(messageURL, true).href);
    res.status(200).json({ text: "تم إرسال الرسالة بنجاح!", icon: "success" });
});

app.use((req, res) => {
    res.sendStatus(404);
});