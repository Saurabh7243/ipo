import { Request,Response,NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import lotSizeScrapData from "../scrap/ipoLotsize";
import { ipoDetailScrap } from "../scrap/ipoDetail";
import { scrapeTimeLineData } from "../scrap/ipoTimeline";
import { scrapValuation } from "../scrap/ipoValuation";
import { scrapeFinancialInfo } from "../scrap/ipoFinance";
import { scrapeObjectiveData } from "../scrap/ipoObjective";
import { scrapeReservationData } from "../scrap/ipoReservation";
import { scrapePromoHoldingData } from "../scrap/ipoPromotor";
import { ExchangedEnum, FetchDataEnum, TypeEnum } from "../utils/enumData";
import { scrapeCompanyAddress } from "../scrap/ipoOtherDetail";
import { scrapegmpInsertUpdateData } from "../scrap/gmpInvestor";
import { scrapeBSEMainSubscriptionData } from "../scrap/liveSubscriptions/mainBSE";
import { scrapeBSESMESubscriptionData } from "../scrap/liveSubscriptions/smeBSE";
import { scrapeNSESMESubscriptionData } from "../scrap/liveSubscriptions/smeNSE";
import { scrapeNSEMainSubscriptionData } from "../scrap/liveSubscriptions/mainNSE";
import { noReservationsInsertUpdate } from "../scrap/dbSp";
import { scrapeDetailAboutData } from "../scrap/ipoAbout";
import { scrapeNSESMEPythonSubscriptionData } from "../scrap/liveSubscriptions/smeNSEPython";
import { scrapeNSEMainPythonSubscriptionData } from "../scrap/liveSubscriptions/mainNSEPython";

class scrapingController {

    async syncLotSize(req: any, res: any, next: NextFunction) {
        const {IpoId,ChitorId,ChitorName} = req.body;

        try {
           await lotSizeScrapData(IpoId,ChitorId,ChitorName,req,res)            
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating lot size data:', error.message);
            
            return res.status(500).json({ error: 'Internal server error', details: error.message });
        }
    }

    async syncIpoDetails(req: Request, res: Response, next: NextFunction) {
        const {IpoId,ChitorId,ChitorName,RetailQuota,Type,IpoType} = req.body;
        try {
            noReservationsInsertUpdate(IpoId,RetailQuota,Type,IpoType)
            const data:any = await ipoDetailScrap(IpoId,ChitorId,ChitorName)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating ipo details:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncTimeLine(req: Request, res: Response, next: NextFunction) {
        const {IpoId,ChitorId,ChitorName} = req.body;
        try {

           await scrapeTimeLineData(IpoId,ChitorId,ChitorName)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating timeline:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncValuation(req: Request, res: Response, next: NextFunction) {
        const {IpoId,ChitorId,ChitorName} = req.body;
        try {
           await scrapValuation(IpoId,ChitorId,ChitorName)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating timeline:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncFinancialInfo(req: Request, res: Response, next: NextFunction) {
        const {IpoId,ChitorId,ChitorName} = req.body;
        try {

           await scrapeFinancialInfo(IpoId,ChitorId,ChitorName)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating financialinfo:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncObjectives(req: Request, res: Response, next: NextFunction) {
        
        const {IpoId,ChitorId,ChitorName} = req.body;
        try {
           await scrapeObjectiveData(IpoId,ChitorId,ChitorName)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating financialinfo:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncReservation(req: Request, res: Response, next: NextFunction) {
        
        const {IpoId,ChitorId,ChitorName,IsSme} = req.body;
        let checkIsSme = false
        if(IsSme == TypeEnum.SME) {
            checkIsSme = true
        } 
        console.log(req.body)
        try {
           await scrapeReservationData(IpoId,ChitorId,ChitorName, checkIsSme)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating financialinfo:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncPromoHolding(req: Request, res: Response, next: NextFunction) {
        const {IpoId,ChitorId,ChitorName} = req.body;
        try {
           await scrapePromoHoldingData(IpoId,ChitorId,ChitorName)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating financialinfo:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncCompanyAddress(req: Request, res: Response, next: NextFunction) {
        const {IpoId,ChitorId,ChitorName} = req.body;
        try {
           await scrapeCompanyAddress(IpoId,ChitorId,ChitorName)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating financialinfo:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncIPOGMPs(req: Request, res: Response, next: NextFunction) {
        const {IpoId,InvestorId} = req.body;
        try {
           await scrapegmpInsertUpdateData(IpoId,InvestorId)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating GMP:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncSubscription(req: Request, res: Response, next: NextFunction) {
        const {IpoId,BseId,Symbol,Type,Exchanged,FetchData} = req.body;
        var isError = false
        if(Type == TypeEnum.Mainbord ) {
            if(FetchData == FetchDataEnum.BSE) {
                if(BseId == null || BseId == 0) {
                    isError = true
                } 

            } else if(FetchData == FetchDataEnum.NSE) {
                if(Symbol == null || Symbol == "") {
                    isError = true
                }
            }
            
        } else if(Type == TypeEnum.SME) {
                
            if(Exchanged == ExchangedEnum.BSE) {
                if(BseId == null || BseId == 0) {
                    isError = true
                } 
            } else if(Exchanged == ExchangedEnum.NSE) {
                if(Symbol == null || Symbol == "") {
                    isError = true
                }
            } 
        }

        if(isError) {
            return res.status(300).json("")
        }
        try {
            if(Type == TypeEnum.Mainbord) {
                if(FetchData == FetchDataEnum.BSE) {
                    await scrapeBSEMainSubscriptionData(IpoId,BseId)
                } else if(FetchData == FetchDataEnum.NSE) {
                    await scrapeNSEMainPythonSubscriptionData(IpoId,Symbol)
                    // await scrapeNSEMainSubscriptionData(IpoId,Symbol)
                }  
                return res.status(200).json("Data updated successfully")
            } else if(Type == TypeEnum.SME) {
                
                if(Exchanged == ExchangedEnum.BSE) {
                   await scrapeBSESMESubscriptionData(IpoId,BseId)
                    return res.status(200).json("Data updated successfully")
                } else if(Exchanged == ExchangedEnum.NSE) {
                //    await scrapeNSESMESubscriptionData(IpoId,Symbol)
                    await scrapeNSESMEPythonSubscriptionData(IpoId,Symbol)
                    return res.status(200).json("Data updated successfully") 
                } 
            }
            return res.status(400).json("Data not updated")
        } catch (error) {
            console.error('Error updating GMP:', error.message);
            return res.status(500).send('Internal server error');
        }
    }

    async syncAbout(req: Request, res: Response, next: NextFunction) {
        
        const {IpoId,ChitorId,ChitorName} = req.body;
        try {
           await scrapeDetailAboutData(IpoId,ChitorId,ChitorName)
            return res.status(200).json("Data updated successfully")
        } catch (error) {
            console.error('Error updating financialinfo:', error.message);
            return res.status(500).send('Internal server error');
        }
    }
}

export default new scrapingController()