const express = require('express');
require('dotenv').config();
const authRouter = require('./routes/authRoutes');
const blogRouter = require('./routes/blogRoutes');
const userRouter = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const app = express();
const cors = require('cors');

app.listen(5000);

app.use(cors({
  origin: 'https://www.aycrown.tech',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use('/api/public', express.static(path.join(__dirname, 'public')));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });
app.post('/api/upload', upload.single('file'), async (req, res) => {
  res.json(req.file.filename);
});
app.use('/api', authRouter);
app.use('/api', blogRouter);
app.use('/api', userRouter);
