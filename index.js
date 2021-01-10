const express = require('express');
const app = express();
const path = require("path");
const multer = require('multer');
const url = require("url");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, './static/uploads'))
    },
    filename: function (req, file, cb) {
        const ext = path.extname( file.originalname)
        cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    }
})

const upload = multer({ storage: storage })

app.use(express.static(path.join(__dirname, './static')));

app.post('/upload', upload.single('imgName'), async function (req, res, next) {
    res.json({message: "ok", url: `./uploads/${req.file.filename}`});
});

app.get('/download', function (req, res) {
    const urlParams = url.parse(req.url).query;
    console.log(urlParams)
    const filename = urlParams.replace("filename=", "");
    let file = path.join(__dirname, "./static/uploads/" + filename);
    res.download(file);
});
app.listen(9527)

// const server = http.createServer(async (req, res) => {
//     const url = req.url;
//     if (url == "/upload" && req.method === "POST") {
//         let file = ""
//         req.on("data", (chunk => file += chunk))
//         req.on("end", () => {
//             let fileP = path.join(__dirname, "./uploads/"+"123.jpg");
//             fs.promises.writeFile(fileP, file).then(value => {
//                 console.log("OK")
//                 res.end("0k")
//             })
//         });
//
//
//     }
// });
// server.on('clientError', (err, socket) => {
//     socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
// });
// server.listen(9527);