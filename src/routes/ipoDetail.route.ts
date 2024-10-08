import { Request, Response } from "express";
import { IRouting, ImportedRoute } from "./routing.interface";
import * as express from "express";
import ipoDetailController from "../controllers/ipoDetailController";
import middleware from "../utils/middleware";
import { anchorPathLocal, boaPathLocal, logoPathLocal } from "../utils/constant";
import { removeExtraSpecialCharHyphens } from "../utils/global";


const multer = require('multer');
const fs = require('fs');

const createDirectory = (dir: string) => {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const dir = logoPathLocal//'public/images/ipoData/images';
    createDirectory(dir);
    cb(null, dir);
  },
  filename: (req: any, file: any, cb: any) => {
debugger
    const { DisplayName } = req.body;
    const fileExtension = file.mimetype.split('/')[1];
    cb(null, `${removeExtraSpecialCharHyphens(DisplayName)}-Logo.${fileExtension}`);
  }
});


const boaStorage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const dir = boaPathLocal
    createDirectory(dir);
    cb(null, dir);
  },
  filename: (req: any, file: any, cb: any) => {
    const { DisplayName } = req.body;
    const fileExtension = file.mimetype.split('/')[1];
    cb(null, `${removeExtraSpecialCharHyphens(DisplayName)}-Basis-of-Allotment.${fileExtension}`);

  }
});

const anchorInvestorStorage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const dir = anchorPathLocal
    createDirectory(dir);
    cb(null, dir);
  },
  filename: (req: any, file: any, cb: any) => {
    const { DisplayName } = req.body;
    const fileExtension = file.mimetype.split('/')[1];
    cb(null, `${removeExtraSpecialCharHyphens(DisplayName)}-Anchor-Investors.${fileExtension}`);
  }
});

const upload = multer({ storage });
const uploadBoa = multer({ storage: boaStorage });
const uploadanchorInvestorStorage = multer({ storage: anchorInvestorStorage });


@ImportedRoute.register
class IpoDetailRoute implements IRouting {
  prefix = "/ipoDetail";

  register(app: express.Application) {

    app.get(`${this.prefix}/get/:id`,middleware.isCookieAuthenticated , (req: Request, res: Response, next: express.NextFunction) => {
      return ipoDetailController.getIpoDetail(req, res, next);
    });

    app.post(`${this.prefix}/updateTimeLineDate`, middleware.isCookieAuthenticated ,upload.single('logo'), (req: Request, res: Response, next: express.NextFunction) => {
      return ipoDetailController.updateTimeLineDate(req, res, next);
    });

    // app.post(`${this.prefix}/add`,middleware.isCookieAuthenticated , (req: Request, res: Response, next: express.NextFunction) => {
    //   return ipoDetailController.addIpoDetails(req, res, next);
    // });

    app.post(`${this.prefix}/prospectus`,middleware.isCookieAuthenticated ,(req: Request, res: Response, next: express.NextFunction) => {
      return ipoDetailController.prospectuscontroller(req, res, next);
    });

    app.post(`${this.prefix}/uploadLogo`,middleware.isCookieAuthenticated , upload.single('logo'), (req: Request, res: Response, next: express.NextFunction) => {
      return ipoDetailController.uploadLogo(req, res, next);
    });

    app.post(`${this.prefix}/uploadBoa`,middleware.isCookieAuthenticated , uploadBoa.single('boa'), (req: Request, res: Response, next: express.NextFunction) => {
      return ipoDetailController.uploadBoa(req, res, next);
    });

    app.post(`${this.prefix}/uploadAnchorLink`,middleware.isCookieAuthenticated , uploadanchorInvestorStorage.single('AnchorLink'), (req: Request, res: Response, next: express.NextFunction) => {
      return ipoDetailController.uploadAnchorInvestor(req, res, next);
    });

    app.post(`${this.prefix}/detailsController`,middleware.isCookieAuthenticated , (req: Request, res: Response, next: express.NextFunction) => {
      return ipoDetailController.detailsController(req, res, next);
    });

    app.post(`${this.prefix}/updateLotSize`,middleware.isCookieAuthenticated , (req: Request, res: Response, next: express.NextFunction) => {
      return ipoDetailController.updateLotSize(req, res, next);
    });

    app.post(`${this.prefix}/updatePromoterHoldings`,middleware.isCookieAuthenticated , (req: Request, res: Response, next: express.NextFunction) => {
      return ipoDetailController.updatePromoterHoldings(req, res, next);
    });

    app.post(`${this.prefix}/updateRegistar`,middleware.isCookieAuthenticated , (req: Request, res: Response, next: express.NextFunction) => {
      return ipoDetailController.updateRegistar(req, res, next);
    });

    app.post(`${this.prefix}/updateLeadManager`,middleware.isCookieAuthenticated , (req: Request, res: Response, next: express.NextFunction) => {
      return ipoDetailController.updateLeadManager(req, res, next);
    });

    app.post(`${this.prefix}/hardDeleteLeadManager`,middleware.isCookieAuthenticated , (req: Request, res: Response, next: express.NextFunction) => {
      return ipoDetailController.hardRelationIpoLeadManagersDelete(req, res, next);
    });

    app.post(`${this.prefix}/updateIpoSubscription`,middleware.isCookieAuthenticated ,(req: Request, res: Response, next: express.NextFunction) => {
      return ipoDetailController.updateIpoSubscription(req, res, next);
    });

    app.post(`${this.prefix}/hardIpoGmpDelete`,middleware.isCookieAuthenticated ,(req: Request, res: Response, next: express.NextFunction) => {
      return ipoDetailController.hardIpoGmpDelete(req, res, next);
    });

    app.post(`${this.prefix}/deleteMarketMaker`,middleware.isCookieAuthenticated ,(req: Request, res: Response, next: express.NextFunction) => {
      return ipoDetailController.deleteMarketMaker(req, res, next);
    });

    app.post(`${this.prefix}/updateNoReservetion`,middleware.isCookieAuthenticated ,(req: Request, res: Response, next: express.NextFunction) => {
      return ipoDetailController.updateNoReservetion(req, res, next);
    });
    
  }
}

export default new IpoDetailRoute();
