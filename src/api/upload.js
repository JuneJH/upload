const express = require('express');
const path = require("path");
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../static/uploads'))
    },
    filename: function (req, file, cb) {
        const ext = path.extname( file.originalname)
        cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    }
})
const upload = multer({ storage: storage })
router.post('/', upload.single('imgName'), async function (req, res, next) {
    res.json({message: "ok", url: `/uploads/${req.file.filename}`});
});

module.exports = router