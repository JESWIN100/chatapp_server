import express from 'express'
import { dbConnect } from './config/db.js';
import apiRouter from './routes/index.js';
import logger from 'morgan'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {app,server} from './socket/socket.js'
// const app = express();
const port = 3000;
dbConnect()


app.use(cors({
  origin: "https://chatapp-tau-five.vercel.app", 
  credentials: true, 
 
}));


app.use(express.json())
app.use(logger('dev'));
app.use(cookieParser())
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
