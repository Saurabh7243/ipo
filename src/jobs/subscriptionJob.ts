import dbUtils from "../utils/db.utils";
import { Ipo } from "../models/Ipo";
import cron from "node-cron";
import { ExchangedEnum, FetchDataEnum, TypeEnum } from "../utils/enumData";
import { scrapeBSEMainSubscriptionData } from "../scrap/liveSubscriptions/mainBSE";
import { scrapeNSEMainSubscriptionData } from "../scrap/liveSubscriptions/mainNSE";
import { scrapeBSESMESubscriptionData } from "../scrap/liveSubscriptions/smeBSE";
import { scrapeSubscriptionAppWiseData } from "../scrap/liveSubscriptions/mainPremiumAppwise";
import { CronJobs } from "../models/cronJobs";
import { scrapeNSESMEPythonSubscriptionData } from "../scrap/liveSubscriptions/smeNSEPython";
import { scrapeNSEMainPythonSubscriptionData } from "../scrap/liveSubscriptions/mainNSEPython";

let jobs: cron.ScheduledTask | null = null;

async function getIpos() {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    console.log("formattedToday :",formattedToday)

    const connection = await dbUtils.getDefaultConnection();
    
    try {
        const ipos = await connection.getRepository(Ipo)
            .createQueryBuilder('ipos')
            .leftJoinAndSelect('ipos.TimeLine', 'TimeLine')
            .where('ipos.IsDelete = :isDelete', { isDelete: 0 })
            .andWhere('ipos.IsActive = :isActive', { isActive: 1 })
            .andWhere(':date BETWEEN TimeLine.StartDate AND TimeLine.EndDate', { date: formattedToday })
            .getMany();

        for(let ipo of ipos) {
            await getLiveSubscriptionData(ipo.IpoId, ipo.Symbol, ipo.BseId, ipo.Type, ipo.Exchanged, ipo.FetchData, ipo.PremiumId)
        }
    } catch (error) {
        console.error("Error fetching IPOS:", error);
    }
}

async function getLiveSubscriptionData(IpoId:number, Symbol:string, BseId:number, Type:number, Exchanged:number, FetchData:number,PremiumId:number) {
    await dbUtils.init();
    
    if(Type == TypeEnum.Mainbord) {
        if(PremiumId == null || PremiumId == 0) {
            // api not call
        } else {
            scrapeSubscriptionAppWiseData(IpoId,PremiumId)
        }
        if(FetchData == FetchDataEnum.BSE) {
            if(BseId == null || BseId == 0) {
                // api not call
            } else {
                scrapeBSEMainSubscriptionData(IpoId,BseId)
            } 
        } else if(FetchData == FetchDataEnum.NSE) {
            if(Symbol == null || Symbol == "") {
                // api not call
            } else {
                scrapeNSEMainPythonSubscriptionData(IpoId,Symbol)
                // scrapeNSEMainSubscriptionData(IpoId,Symbol)
            }
        } 
    } else if(Type == TypeEnum.SME) {
                
        if(Exchanged == ExchangedEnum.BSE) {
            if(BseId == null || BseId == 0) {
                // no api not call
            } else {
                scrapeBSESMESubscriptionData(IpoId,BseId)
            }
        } else if(Exchanged == ExchangedEnum.NSE) {
            if(Symbol == null || Symbol == "") {
                // no api not call
            } else {
                scrapeNSESMEPythonSubscriptionData(IpoId,Symbol)
                // scrapeNSESMESubscriptionData(IpoId,Symbol)
            }
        } 
    }
}

export async function isCurrentTimeInRange() {
    const now = new Date();

    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    // Define 10:00 AM and 6:00 PM as Date objects with only hours and minutes
    const startTime = new Date();
    startTime.setHours(10, 0, 0, 0); // 10:00 AM

    const endTime = new Date();
    endTime.setHours(18, 0, 0, 0); // 6:00 PM

    // Check if current time is within the range
    const currentTime = new Date();
    currentTime.setHours(currentHours, currentMinutes, 0, 0);

    return currentTime >= startTime && currentTime <= endTime;
}

export async function isWeekday() {
    const today = new Date();
    const day = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    return day !== 0 && day !== 6; // Return true if not Saturday (6) or Sunday (0)
}

export function startCronJob() {
    if(!jobs) {
        console.log("Cron job is not running.")
        jobs = cron.schedule('*/5 * * * *', async function() {
            const isInTimeRange = await isCurrentTimeInRange();
            const isWeekdayToday = await isWeekday();
            await dbUtils.init();
            const connection = await dbUtils.getDefaultConnection();
            const cronJobRepo = connection.getRepository(CronJobs);            
            const now = new Date()
        
            if(isWeekdayToday) {
                if(isInTimeRange) {
                    await getIpos();
                    console.log("Date and time matched, job executed.");
                } else {
                    console.log("time is not within the range, job skipped.");    
                }
            } else {
                console.log("Either date is a weekend");
            }
        
            const lastUpdatedJob = cronJobRepo.update(1,{
                LastUpdate:now.toLocaleString()
            })
        
            console.log('Cron job executed.');
        });
    } else {
        console.log("Cron job is already running.")
    }
} 
export function stopCronJob() {
    debugger
    if(jobs){
        jobs.stop();
        jobs = null;
        console.log('Cron job stopped.');
    } else {
        console.log('Cron job is not running.');
    }
}

export function isCronRunning() {
    return jobs !== null;
}

export { jobs }