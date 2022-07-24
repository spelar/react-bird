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
const hpp = require('hpp');
const helmet = require('helmet');

dotenv.config();

const app = express();

db.sequelize.sync()
	.then(() => {
		console.log("db 연결 성공")
	})
	.catch(console.error);
app.use(cookieParser(process.env.COOKIE_SECRET));
passportConfig();

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(hpp());
  app.use(helmet({ contentSecurityPolicy: false }));
} else {
  app.use(morgan('dev'));
}

app.use(cors({
 	origin: ['http://localhost:3060', 'nodebird.com', 'http://3.36.66.165'],
  credentials: true,
})); 
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen(80, () => {
	console.log('서버 실행 중!');
});