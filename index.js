import express from 'express'
import { dbConnect } from './config/db.js';
import apiRouter from './routes/index.js';
import logger from 'morgan'
import cors from 'cors';
import {app,server} from './socket/socket.js'
import cookieParser from 'cookie-parser';

// const app = express();
const port = 3000;
dbConnect()


app.use(cors({
  origin: process.env.PORT, 
  credentials: true, 
 
}));


app.use(express.json())
app.use(cookieParser());
app.use(logger('dev'));


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use('/api', apiRouter);
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint does not exist' });
});

server.listen(port, () => {
  console.log(`The port at http://localhost:${port}`);
})
