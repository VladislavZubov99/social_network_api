const express = require('express')
const userRouter = require('./routes/user.routes');
const postRouter = require('./routes/post.routes');
const commentRouter = require('./routes/comment.routes');
const PORT = process.env.PORT || 8080;
const cors = require('cors')

const app = express();
app.use(cors({
  origin: '*'
}))
app.use(express.json());
app.use('/api', userRouter);
app.use('/api', postRouter);
app.use('/api', commentRouter);
app.get('/', (req, res) => res.send("Welcome to API for social_network blog"));

app.listen(PORT, () => console.log('server started on', PORT, 'port'))