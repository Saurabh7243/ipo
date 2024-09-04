import { Ipo } from "../models/Ipo";
import dbUtils from "../utils/db.utils";
import cron from "node-cron";
import { isCurrentTimeInRange, isWeekday } from "./subscriptionJob";
import { scrapegmpInsertUpdateData } from "../scrap/gmpInvestor";
import { CronJobs } from "../models/cronJobs";

let ipoGMPJob: cron.ScheduledTask | null = null;

export async function getIpoGMPs() {
    // debugger
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];
    console.log("Formatted Date:", currentDate);

    const connection = await dbUtils.getDefaultConnection();
    
    try {
        const ipos = await connection.getRepository(Ipo)
            .createQueryBuilder('ipos')
            .leftJoinAndSelect('ipos.TimeLine', 'TimeLine')
            .where('ipos.IsDelete = :isDelete', { isDelete: 0 })
            .andWhere('ipos.IsActive = :isActive', { isActive: 1 })
            .andWhere('TimeLine.ListingDate >= :date', { date: currentDate })
            .andWhere('ipos.InvestorId != :investorId', { investorId: 0 })
            .getMany();

        for(let ipo of ipos) {
            getLiveGMPDate(ipo.IpoId,ipo.InvestorId)
        }
    } catch (error) {
        console.error("Error fetching IPOS:", error);
    }
}

async function getLiveGMPDate(IpoId:number,InvestorId:number) {
    scrapegmpInsertUpdateData(IpoId,InvestorId)
}

export async function startGMpCronJob() {
    console.log("GMP Cron job is not started.");
    const connection = await dbUtils.getDefaultConnection();
    const cronJobRepo = connection.getRepository(CronJobs);            
    const now = new Date()
    if (!ipoGMPJob) {
        ipoGMPJob = cron.schedule('0 10 * * *', async function() {
            const isInTimeRange = await isCurrentTimeInRange();
            const isWeekdayToday = await isWeekday();
            if(isWeekdayToday) {
                if(isInTimeRange) {
                    await getIpoGMPs();
                    console.log("Date and time matched, job executed.");
                } else {
                    console.log("time is not within the range, job skipped.");    
                }
            } else {
                console.log("Either date is a weekend");
            }
        
        });

        cronJobRepo.update(1,{
            GMPLastUpdate:now.toLocaleString()
        })
        
    } else {
        console.log("GMP Cron job is already running.")
    }
}

export function stopGMPCronJob() {
    if(ipoGMPJob){
        ipoGMPJob.stop();
        ipoGMPJob = null;
        console.log('Cron job stopped.');
    } else {
        console.log('Cron job is not running.');
    }
}

export function isGMPJobRunning() {
    return ipoGMPJob !== null;
}

export { ipoGMPJob }