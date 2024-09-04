import { Request, Response } from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import * as express from "express";
import middleware from "../utils/middleware";
import excelFileController from "../controllers/excelFileController";

@ImportedRoute.register
class excelFileRoute implements IRouting {
    prefix= "/export";

    register(app: express.Application) {
      
      app.get(`${this.prefix}/excel`,middleware.isCookieAuthenticated,(req:Request ,res:Response,next: express.NextFunction)=> {
        return excelFileController.exportExcelFile(req,res,next);
      });
      
    }
}

export default new excelFileRoute()