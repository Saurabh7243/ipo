import { Request,Response,NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import * as ExcelJS from 'exceljs';
import { Ipo } from "../models/Ipo";
import { ExchangedEnum, IpoTypeEnum, TypeEnum } from "../utils/enumData";

function checkExchangedType(data:any) {
    let checkType = ""
    if(data.Type == TypeEnum.Mainbord) {
        checkType = "Mainline"
    } else if(data.Type == TypeEnum.SME){
        if(data.Exchanged == ExchangedEnum.NSE) {
            checkType = "SME, NSE"
        } else if(data.Exchanged == ExchangedEnum.BSE) {
            checkType = "SME, BSE"
        }
    }
    return checkType
}

function checkLotsize(data:any) {
    let lotSizeStatus = null
    for(let i in data) {
        if(data[i].LotSizeId) {
            lotSizeStatus = true
        }
        return  lotSizeStatus= lotSizeStatus ? 'yes' : 'no'
    }
return 'no'
}

function checkTimeLine(data:any) {
    let timeLineStatus = null
    if(data.TimelineId) {
        timeLineStatus = true
    }
    return  timeLineStatus= timeLineStatus ? 'yes' : 'no'
}

function checkReservation(data:any) {
    let reservationStatus = null
    if(data?.ReservationId) {
        reservationStatus = true
    }
    return  reservationStatus= reservationStatus ? 'yes' : 'no'
}

function checkAboutFromDetails(data:any) {
    let aboutStatus = null
    if(data?.IpoDetailId && data?.About) {
        aboutStatus = true
    }
    return  aboutStatus= aboutStatus ? 'yes' : 'no'
}

function checkFinanceFromDetails(data:any) {
    let aboutStatus = null
    if(data?.IpoDetailId && data?.FinancialInformation) {
        aboutStatus = true
    }
    return  aboutStatus= aboutStatus ? 'yes' : 'no'
}

function checkObjectivesFromDetails(data:any) {
    let objectivesStatus = null
    if(data?.IpoDetailId && data?.Objectives) {
        objectivesStatus = true
    }
    return  objectivesStatus= objectivesStatus ? 'yes' : 'no'
}

function checkCompanyAddressFromDetails(data:any) {
    let companyAddressStatus = null
    if(data?.IpoDetailId && data?.CompanyAddress) {
        companyAddressStatus = true
        return  companyAddressStatus= companyAddressStatus ? 'yes' : 'no'
    }
return 'no'
}

function checkIpoDetailsData(data:any) {
    let rhpStatus = null;
    let drhpStatus = null;
    let anchorStatus = null;
    let minimumPrice = null;
    let faceValue = null;
    let ipoType = "";

    if(data?.IpoType) {
        if(data?.IpoType == IpoTypeEnum.BOOK_BUILT_ISSUE) {
            ipoType = "BOOK BUILT"
        } else {
            ipoType = "FIXED"
        }
    }

    rhpStatus = data?.RHPLink ? 'yes' : 'no';

    drhpStatus = data?.DRHPLink ? 'yes' : 'no';

    anchorStatus = data?.AnchorListLink ? 'yes' : 'no';

    minimumPrice = data?.MinimumPrice ? data?.MinimumPrice : '';

    faceValue = data?.FaceValue ? data?.FaceValue : '';

    return { rhpStatus, drhpStatus,anchorStatus,minimumPrice,faceValue, ipoType };
}

function checkGMP(data:any) {
    let gmpStatus = null
    for(let i in data) {
        if(data[i].GmpId) {
            gmpStatus = true
        }
        return gmpStatus= gmpStatus ? 'yes' : 'no'
    }
return 'no'
}

function checkKPI(data:any) {
    let kpiStatus = null
    for(let i in data) {
        if(data[i].ValuationId) {
            kpiStatus = true
        }
        return kpiStatus= kpiStatus ? 'yes' : 'no'
    }
return 'no'
}

function checkPromoterHoldings(data:any) {
    if(data) {
        return  'yes'
    }
return 'no'
}

function checkPromoterName(data:any) {
    if(data?.PromoterNames) {
        if(data?.PromoterNames != "" || typeof data?.PromoterNames !='undefined' ) {
            return  'yes'
        } else {
            return 'no'
        }
        
    }
return 'no'
}

function checkLeadManagers(data:any) {
    let leadManagersStatus = null
    if(data) {
        leadManagersStatus = true
        return  leadManagersStatus= leadManagersStatus ? 'yes' : 'no'
    }
return 'no'
}

function checkNoReservation(data:any) {
    let noReservationStatus = null
    if(data.NoReservationId) {
        noReservationStatus = true
        return  noReservationStatus= noReservationStatus ? 'yes' : 'no'
    }
return 'no'
}

function checkRegistar(data:any) {
    let registarStatus = null
    if(data.RegistrarId) {
        registarStatus = true
        return  registarStatus= registarStatus ? 'yes' : 'no'
    }
return 'no'
}

function checkMarketMakers(data:any) {
    let marketMakerStatus = null
    if(data) {
        marketMakerStatus = true
        return  marketMakerStatus= marketMakerStatus ? 'yes' : 'no'
    }
return 'no'
}

function checkStatus(data:any){
    let checkType = checkExchangedType(data)
    let lotSize = checkLotsize(data.LotSizeId)
    let timeLine = checkTimeLine(data.TimeLine)
    let reservation= checkReservation(data?.Reservation)
    let about = checkAboutFromDetails(data.IpoDetail)
    let finance = checkFinanceFromDetails(data.IpoDetail)
    let gmp = checkGMP(data.IPOGMPId)
    let objectives = checkObjectivesFromDetails(data.IpoDetail)
    let companyAddress = checkCompanyAddressFromDetails(data.IpoDetail)
    let ipoDetails = checkIpoDetailsData(data.IpoDetail)
    let promoterHoldings = checkPromoterHoldings(data.PromoterHoldings)
    let leadManager = checkLeadManagers(data.RelationIpoLeadManagers)
    let marketMaker = checkMarketMakers(data.RelationIpoMarketMakers)
    let kpi =  checkKPI(data.ValuationId)
    let noReservation = checkNoReservation(data.NoReservations)
    let registar = checkRegistar(data.IpoDetail.RegistrarId)
    let promoterName =checkPromoterName(data.PromoterHoldings)
    
    // console.log("===>",kpi)
    // console.log(data.PromoterHoldings)
    return {
        // CompanyName: data.CompanyName ? 'yes' : 'no',
        Type: checkType ,
        // Symbol
        // BseId,
        IpoType:ipoDetails.ipoType,
        MinimumPrice:ipoDetails.minimumPrice,
        FaceValue:ipoDetails.faceValue,
        CompanyLogo:data.CompanyLogo ? 'yes' : 'no',
        LotSize:lotSize,
        Dates:timeLine,
        Reservation:reservation,
        About:about,
        Finance:finance,
        GMP:gmp,
        KPI:kpi,
        NoReservation:noReservation,
        Objectives:objectives,
        CompanyAddress:companyAddress,
        DRHP:ipoDetails.drhpStatus,
        RHP:ipoDetails.rhpStatus,
        Promoter:promoterHoldings,
        AnchorLink:ipoDetails.anchorStatus,
        Registrar:registar,
        LeadManager:leadManager,
        MarketMaker:marketMaker,
        PromoterName:promoterName
    };
}
class ExcelFileController {

    async exportExcelFile(req: Request, res: Response, next: NextFunction) {
        const connection = await dbUtils.getDefaultConnection();
        const ipoRepo = connection.getRepository(Ipo)
        try {
            const now = new Date();
            const getYear = now.getFullYear();
            const getMonth = now.getMonth() + 1;
            const getDay = now.getDate()
            const getFullDay = `${getYear}-${getMonth}-${getDay}`;

            const getIpoData =await ipoRepo.createQueryBuilder('ipo')
                  .leftJoinAndSelect('ipo.TimeLine', 'TimeLine')
                  .leftJoinAndSelect('ipo.LotSizeId', 'LotSizeId')
                  .leftJoinAndSelect('ipo.IpoDetail', 'IpoDetail')
                  .leftJoinAndSelect('ipo.Reservation','Reservation')
                  .leftJoinAndSelect('ipo.NoReservations','NoReservations')
                  .leftJoinAndSelect('ipo.PromoterHoldings','PromoterHoldings')
                  .leftJoinAndSelect('ipo.IPOGMPId','IPOGMPId')
                  .leftJoinAndSelect('ipo.RelationIpoLeadManagers','RelationIpoLeadManagers')
                  .leftJoinAndSelect('ipo.RelationIpoMarketMakers','RelationIpoMarketMakers')
                  .leftJoinAndSelect('ipo.ValuationId','ValuationId')
                  .leftJoinAndSelect('IpoDetail.RegistrarId', 'Registrars')
                  .where('ipo.IsDelete = :IsDelete', {IsDelete:0})
                  .andWhere('ipo.IsActive = :IsActive', {IsActive:1})
                  .andWhere('TimeLine.EndDate >= :EndDate', {EndDate:getFullDay})
                  .orderBy("TimeLine.StartDate", "ASC")
                  .addOrderBy("TimeLine.EndDate", "ASC")
                  .getMany();
            const workbook = new ExcelJS.Workbook();
            const workSheet = workbook.addWorksheet('Sheet 1')

            workSheet.columns = [
                { header: 'IPO Name', key: 'ipoName', width: 45 },
                { header: 'Ipo Id', key: 'id', width: 10 },
                { header: 'Type', key: 'type', width: 15 },
                { header: 'Symbol', key: 'symbol', width: 15 },
                { header: 'Bse Id', key: 'bseId', width: 10 },
                { header: 'Investor Id', key: 'investorId', width: 10 },
                { header: 'Premium Id', key: 'premiumId', width: 10 },
                { header: 'Ipo Type', key: 'ipoType', width: 15 },
                { header: 'Retail Quota', key: 'retailQuota', width: 15 },
                { header: 'Minimum Price', key: 'minimumPrice', width: 15 }, 
                { header: 'Face Value', key: 'faceValue', width: 15 },
                { header: 'Logo', key: 'logo', width: 10 },
                { header: 'Lot Size', key: 'lotSize', width: 10 },
                { header: 'Start Date', key: 'dates', width: 10 },
                { header: 'Reservation', key: 'reservation', width: 15 },
                { header: 'About', key: 'about', width: 10 },
                { header: 'Finance', key: 'finance', width: 10 },
                { header: 'GMP', key: 'gmp', width: 10 },
                { header: 'KPI', key: 'kpi', width: 10 },
                { header: 'No Reservation', key: 'noReservation', width: 15 },
                { header: 'Objectives'  , key: 'objectives', width: 12 },
                { header: 'Company Address', key: 'companyAddress', width: 20 },
                { header: 'DRHP', key: 'drhp', width: 10 },
                { header: 'RHP', key: 'rhp', width: 10 },
                { header: 'Promoter Holding', key: 'promoter', width: 10 },
                { header: 'Promoter Name', key: 'promoterName', width: 10 },
                { header: 'Anchor Link', key: 'anchorLink', width: 15 },
                { header: 'Registrar', key: 'registrar', width: 10 },
                { header: 'Lead Manager', key: 'leadManager', width: 15 },
                { header: 'Market Maker', key: 'marketMaker', width: 15 },
            ];
            
            for(let i in getIpoData) {
                const ipoData = getIpoData[i]
                const statusData  = checkStatus(ipoData)

                let retailQuota = ""

                if(ipoData?.RetailQuota) {
                    if(ipoData?.RetailQuota == 1) {
                        retailQuota = "35%"
                    } else if(ipoData?.RetailQuota == 2){
                        retailQuota = "10%"
                    }
                }
                workSheet.addRows([
                    { 
                      ipoName: ipoData.CompanyName ? ipoData.CompanyName : '',
                      id: ipoData.IpoId,
                      type: statusData.Type, 
                      symbol: ipoData.Symbol ? ipoData.Symbol : '',
                      bseId:ipoData.BseId ? ipoData.BseId : '',
                      investorId:ipoData.InvestorId ? ipoData.InvestorId :'',
                      premiumId:ipoData.PremiumId ? ipoData.PremiumId :'',
                      ipoType:statusData.IpoType,
                      retailQuota:retailQuota,
                      minimumPrice:statusData.MinimumPrice,
                      faceValue:statusData.FaceValue,
                      logo:statusData.CompanyLogo,
                      lotSize:ipoData.LotSizeId.length > 0 ? ipoData.LotSizeId[0].RetailMinShare : '',
                      dates:ipoData.TimeLine?.StartDate ? ipoData.TimeLine?.StartDate : '',
                      reservation:statusData.Reservation,
                      about:statusData.About,
                      finance:statusData.Finance,
                      gmp:statusData.GMP,
                      kpi:statusData.KPI,
                      noReservation:statusData.NoReservation,
                      objectives:statusData.Objectives,
                      companyAddress:statusData.CompanyAddress,
                      drhp:statusData.DRHP,
                      rhp:statusData.RHP,
                      promoter:statusData.Promoter,
                      promoterName:statusData.PromoterName,
                      anchorLink:statusData.AnchorLink,
                      registrar:statusData.Registrar,
                      leadManager:statusData.LeadManager,
                      marketMaker:statusData.MarketMaker
                    },                
                ])
            }
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=' + 'data.xlsx'
            );

            await workbook.xlsx.write(res);
            return res.end();
        } catch (error) {
            console.error('Error updating timeline:', error.message);
            return res.status(500).send('Internal server error');
        }
    }
}

export default new ExcelFileController()