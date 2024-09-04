import { Request, Response } from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import * as express from "express";
import cronJobController from "../controllers/cronJobController";

@ImportedRoute.register
class cronJob implements IRouting {
    prefix= "/job";

    register(app: express.Application) {
      
      app.post(`${this.prefix}/start-cron`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return cronJobController.startJob(req,res,next);
      });

      app.post(`${this.prefix}/stop-cron`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return cronJobController.stopJob(req,res,next);
      });

      app.post(`${this.prefix}/status-cron`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return cronJobController.statusJob(req,res,next);
      });

      app.post(`${this.prefix}/startGMP`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return cronJobController.startGMP(req,res,next);
      });

      app.post(`${this.prefix}/stopGMP`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return cronJobController.stopGMP(req,res,next);
      });

      app.post(`${this.prefix}/statusGMP`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return cronJobController.statusGMP(req,res,next);
      });

      app.post(`${this.prefix}/getGMPs`,(req:Request ,res:Response,next: express.NextFunction)=> {
        return cronJobController.getIpoGMPs(req,res,next);
      });
      
    }
}

export default new cronJob()