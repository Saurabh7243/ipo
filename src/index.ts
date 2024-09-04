// src/index.ts
import express, { Express, Request, Response } from 'express';
import bodyParser, { json } from "body-parser";
import path from 'path';
import cookieParser from "cookie-parser";
import cors from 'cors';
import passport from './utils/passport';
import dbUtils from './utils/db.utils';
import * as routes from "./routes";
import session from 'express-session';
import http from 'http'

import { initSocket } from './utils/socket';
import { CronJobs } from './models/cronJobs';
import { startGMpCronJob } from './jobs/ipoGMPJob';
import { startCronJob } from './jobs/subscriptionJob';

startGMpCronJob()
startCronJob()

const port = 3000


const app: Express = express();
const server = http.createServer(app);
export const io = initSocket(server);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Serve static files
app.use("/public", express.static(path.join(__dirname, '../public')));

app.use(session({ secret: process.env.AUTH_SECRET_KEY || 'ILove_Node', resave: false, saveUninitialized: true }));

import { exec, spawn } from 'child_process';

// Register routes
routes.registerRoutes(app);

const conn: any = dbUtils.init();
if (conn) {
  console.log("Database Connected...........");
} else {
  console.log("Not Connected.....");
}


io.on('connection', (socket)=> {
  debugger
  console.log('socket io server connected')

  socket.on("message", async (msg)=> {
    console.log(`Message received: ${msg}`);
    io.emit('message', msg);
  });

  setInterval(async() => {
    const connection = await dbUtils.getDefaultConnection();
    const cronJobRepo = connection.getRepository(CronJobs);

    const findDate = await cronJobRepo.find({where: {CronJobId:1}})
    let storeDate = null
    findDate.map((i:any)=> {
      storeDate = i.LastUpdate.toLocaleString()
    })
    socket.emit('updateData', {
      timestamp: storeDate,
    });
  }, 5000);

  socket.on("disconnect", ()=> {
    console.log('User disconnected');
  })

});

//generate key and secret
// import * as crypto from 'crypto';

// const secretKey = crypto.randomBytes(24).toString('hex');
// console.log('crypto ------------------------> secretKey',secretKey);

// function generateApiKey(length = 16) {
//   return crypto.randomBytes(length).toString('hex');
// }
// const apiKey = generateApiKey();
// console.log('crypto ------------------------> apiKey',apiKey);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
