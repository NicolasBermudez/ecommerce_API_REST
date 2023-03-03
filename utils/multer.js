const multer = require('multer');

// multer.diskStorage()

storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = { upload };
