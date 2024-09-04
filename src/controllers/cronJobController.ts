import { Request, Response, NextFunction } from "express";
import { isCronRunning, startCronJob, stopCronJob } from '../jobs/subscriptionJob';
import { getIpoGMPs, isGMPJobRunning, startGMpCronJob, stopGMPCronJob } from "../jobs/ipoGMPJob";

class CronJobController {

    async startJob(req: Request, res: Response, next: NextFunction) {
        try {
            const run = await startCronJob(); // Await the result if it's a promise
            console.log(run);
            res.json({ cronRunning: true });
        } catch (error) {
            console.error(error);
            next(error); // Propagate the error
        }
    }

    async stopJob(req: Request, res: Response, next: NextFunction) {
        try {
            await stopCronJob(); // Await the result if it's a promise
            res.json({ cronRunning: false });
        } catch (error) {
            console.error(error);
            next(error); // Propagate the error
        }
    }

    async statusJob(req: Request, res: Response, next: NextFunction) {
        try {
            const cronRunning = await isCronRunning(); // Await the result if it's a promise
            res.json({ cronRunning });
        } catch (error) {
            console.error(error);
            next(error); // Propagate the error
        }
    }

    async startGMP(req: Request, res: Response, next: NextFunction) {
        try {
            const run = await startGMpCronJob(); // Await the result if it's a promise
            console.log(run);
            res.json({ cronGMPRunning: true });
        } catch (error) {
            console.error(error);
            next(error); // Propagate the error
        }
    }

    async stopGMP(req: Request, res: Response, next: NextFunction) {
        try {
            await stopGMPCronJob(); // Await the result if it's a promise
            res.json({ cronGMPRunning: false });
        } catch (error) {
            console.error(error);
            next(error); // Propagate the error
        }
    }

    async statusGMP(req: Request, res: Response, next: NextFunction) {
        try {
            const cronGMPRunning = await isGMPJobRunning(); // Await the result if it's a promise
            res.json({ cronGMPRunning });
        } catch (error) {
            console.error(error);
            next(error); // Propagate the error
        }
    }

    async getIpoGMPs(req: Request, res: Response, next: NextFunction) {
        try {
            
          await getIpoGMPs()
          return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error(error);
            next(error); 
            return res.status(500).send('Internal server error');
        }
    }
}

export default new CronJobController();
