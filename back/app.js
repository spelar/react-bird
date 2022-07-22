const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
const dotenv = require('dotenv');
const db = require('./models');
const passport = require('passport');
const passportConfig = require('./passport');
const morgan = require('morgan');
const path = require('path');

dotenv.config();

const app = express();

db.sequelize.sync()
	.then(() => {
		console.log("db 연결 성공")
	})
	.catch(console.error);

passportConfig();

app.use(morgan('dev'));

app.use(cors({
 	origin: 'http://localhost:3060',
  credentials: true,
})); 
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
	res.send('Hello Express')
});

app.get('/api', (req, res) => {
	res.send('Hello Api')
});

app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

app.listen(3065, () => {
	console.log('서버 실행 중!');
});