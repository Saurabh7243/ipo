import { Request, Response, NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import { Ipo } from "../models/Ipo";
import {
  ExchangedEnum,
  FetchDataEnum,
  IpoTypeEnum,
  IssueTypeEnum,
  TypeEnum,
} from "../utils/enumData";
import { IpoDetail } from "../models/IPODetail";
import { noReservationsInsertUpdate } from "../scrap/dbSp";
import { Brackets } from "typeorm";

class IpoController {
  async addIpo(req: Request, res: Response, next: NextFunction) {

    try {
      const connection = await dbUtils.getDefaultConnection();
      const ipoRepo = connection.getRepository(Ipo);
      const ipoDetailRepo: any = connection.getRepository(IpoDetail);

      const {
        bseid,
        chittorId,
        chittorName,
        companyName,
        displayName,
        exchanged,
        inversterId,
        premiumId,
        symbols,
        type,
        urlName,
        RetailQuota,
        IssueType,
        IpoType,
      } = req.body;
      // console.log(req.body);

      let typeData: any;
      if (type === "1") {
        typeData = TypeEnum.Mainbord;
      } else {
        typeData = TypeEnum.SME;
      }

      let exchangeData: any;
      if (exchanged === "1") {
        exchangeData = ExchangedEnum.NSE;
      } else if (exchanged === "2") {
        exchangeData = ExchangedEnum.BSE;
      } else {
        exchangeData = ExchangedEnum.BOTH;
      }

      let issue_Type = null;
      if (IssueType == 1) {
        issue_Type = IssueTypeEnum.IPO;
      } else {
        issue_Type = IssueTypeEnum.FPO;
      }

      let ipoType_Type = null;
      if (IpoType == 1) {
        ipoType_Type = IpoTypeEnum.BOOK_BUILT_ISSUE;
      } else {
        ipoType_Type = IpoTypeEnum.FIXED_PRICE_ISSUE;
      }

      const saveIpo = ipoRepo.create({
        CompanyName: companyName,
        DisplayName: displayName,
        UrlName: urlName,
        Symbol: symbols,
        Type: typeData,
        Exchanged: exchangeData,
        BseId: bseid || null,
        ChitorId: chittorId || null,
        ChitorName: chittorName || null,
        PremiumId: premiumId || null,
        InvestorId: inversterId || null,
        RetailQuota: RetailQuota || 1,
        FetchData: FetchDataEnum.BSE,
        IssueType: issue_Type,
      });
      await ipoRepo.save(saveIpo);

      if (saveIpo.IpoId > 0) {
        const saveDetail = ipoDetailRepo.create({
          IpoId: saveIpo.IpoId,
          IpoType: ipoType_Type,
        });

        await ipoDetailRepo.save(saveDetail);

        noReservationsInsertUpdate(
          saveIpo.IpoId,
          saveIpo.RetailQuota,
          saveIpo.Type,
          saveDetail.IpoType
        );
      }
      return res.redirect("/ipo/getDashboard");
      //   return res.status(200).json({ message: "Data successfully saved" });
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async getAllIpoData(req: Request, res: Response, next: NextFunction) {

    try {
      const connection = await dbUtils.getDefaultConnection();
      const ipoRepo = connection.getRepository(Ipo);

      const getAll = await ipoRepo
        .createQueryBuilder("ipo")
        .leftJoinAndSelect("ipo.TimeLine", "TimeLine")
        .where("ipo.IsDelete = :isDelete", { isDelete: false })
        .orderBy("TimeLine.StartDate", "DESC")
        .orderBy("TimeLine.EndDate", "DESC")
        // .orderBy('ipo.IpoId', 'DESC')
        .limit(20)
        .getMany();

      return res.status(200).json({ getAll });
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async softIpoDelete(req: Request, res: Response, next: NextFunction) {

    try {
      const connection = await dbUtils.getDefaultConnection();
      const ipoRepo = connection.getRepository(Ipo);
      const mainBoardid = req.params.id;

      const updateStatus = await ipoRepo.update(mainBoardid, {
        IsDelete: true,
      });
      return res.status(200).json({ updateStatus });
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async ipoDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const connection = await dbUtils.getDefaultConnection();
      const ipoRepo = connection.getRepository(Ipo);
      const id = req.body.deleteId;
      const activeTab = req.body.tab || 'mainboard';

      const updateStatus = await ipoRepo.update(id, { IsDelete: true });
      // return res.redirect("/ipo/getDashboard");
      return res.redirect(`/ipo/getDashboard?tab=${activeTab}`);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async activeInactiveController(req: Request,res: Response,next: NextFunction) {
    
    try {
      const connection = await dbUtils.getDefaultConnection();
      const ipoRepo = connection.getRepository(Ipo);
      const { IpoId, IsActive } = req.body;
      const activeTab = req.body.tab || 'mainboard';

      let checkStatus = false;
      if (IsActive == "true") {
        checkStatus = true;
      }
      const updateStatus = await ipoRepo.update(IpoId, {
        IsActive: checkStatus,
      });
      return res.redirect(`/ipo/getDashboard?tab=${activeTab}`);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async updateIpo(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        IpoId,
        companyName,
        displayName,
        UrlName,
        symbols,
        exchanged,
        Type,
        IssueType,
        IpoType,
        chittorName,
        chittorId,
        premiumId,
        inversterId,
        bseid,
        IpoDetailId,
        RetailQuota,
        FetchData,
      } = req.body;

      // Convert IDs to integers
      const intIpoId = parseInt(IpoId, 10);
      const intChittorId = parseInt(chittorId, 10);
      const intPremiumId = parseInt(premiumId, 10);
      const intInvestorId = parseInt(inversterId, 10);
      const intBseId = parseInt(bseid, 10);

      const connection = await dbUtils.getDefaultConnection();
      const ipoRepo = connection.getRepository(Ipo);
      const ipoDetailRepo = connection.getRepository(IpoDetail);

      let exchanged_Type = null;
      if (exchanged == 1) {
        exchanged_Type = ExchangedEnum.NSE;
      } else if (exchanged == 2) {
        exchanged_Type = ExchangedEnum.BSE;
      } else {
        exchanged_Type = ExchangedEnum.BOTH;
      }

      let type_Enum = null;
      if (Type == 1) {
        type_Enum = TypeEnum.Mainbord;
      } else {
        type_Enum = TypeEnum.SME;
      }

      let issue_Type = null;
      if (IssueType == 1) {
        issue_Type = IssueTypeEnum.IPO;
      } else {
        issue_Type = IssueTypeEnum.FPO;
      }

      let Ipo_Type = null;
      if (IpoType == 1) {
        Ipo_Type = IpoTypeEnum.BOOK_BUILT_ISSUE;
      } else {
        Ipo_Type = IpoTypeEnum.FIXED_PRICE_ISSUE;
      }

      const updateIpo = await ipoRepo.update(intIpoId, {
        BseId: intBseId || undefined,
        ChitorId: intChittorId || undefined,
        ChitorName: chittorName,
        CompanyName: companyName,
        DisplayName: displayName,
        UrlName: UrlName,
        Symbol: symbols,
        PremiumId: intPremiumId || undefined,
        InvestorId: intInvestorId || undefined,
        Type: type_Enum,
        Exchanged: exchanged_Type,
        IssueType: issue_Type,
        RetailQuota: RetailQuota,
        FetchData: FetchData,
      });
      console.log(updateIpo);

      if (IpoId && IpoDetailId) {
        const updateIpoDetail = await ipoDetailRepo.update(IpoDetailId, {
          IpoType: Ipo_Type,
        });
      }
      return res.redirect(`/ipoDetail/get/${intIpoId}`);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const connection = await dbUtils.getDefaultConnection();
      const ipoRepo = connection.getRepository(Ipo);

      const itemsPerPage = 20;
      const currentPage = parseInt(req.query.page as string) || 1;
      const skip = (currentPage - 1) * itemsPerPage;

      const activeTab = req.query.tab || "mainboard";
      const searchQuery = req.query.search as string;

      let totalSMEItems, totalMainBoardItems, getAllSME, getAllMainBoard, getAllNodateData, totalNodeDateItems:any;

      if (searchQuery) {
        // If search query is present, filter by CompanyName
        totalSMEItems = await ipoRepo
          .createQueryBuilder("ipo")
          .where("ipo.IsDelete = :isDelete", { isDelete: false })
          .andWhere("ipo.Type = :Type", { Type: 2 })
          .andWhere("ipo.CompanyName LIKE :search", {
            search: `%${searchQuery}%`,
          })
          .getCount();        
        
        totalMainBoardItems = await ipoRepo
          .createQueryBuilder("ipo")
          .where("ipo.IsDelete = :isDelete", { isDelete: false })
          .andWhere("ipo.Type = :Type", { Type: 1 })
          .andWhere("ipo.CompanyName LIKE :search", {
            search: `%${searchQuery}%`,
          })
          .getCount();

        totalNodeDateItems = await ipoRepo
        .createQueryBuilder("ipo")
        .where("ipo.IsDelete = :isDelete", { isDelete: false })
        .andWhere("ipo.CompanyName LIKE :search", {
          search: `%${searchQuery}%`,
        })
        .getCount();

        getAllSME = await ipoRepo
          .createQueryBuilder("ipo")
          .leftJoinAndSelect("ipo.TimeLine", "TimeLine")
          .where("ipo.IsDelete = :isDelete", { isDelete: false })
          .andWhere("ipo.Type = :Type", { Type: 2 })
          .andWhere("ipo.CompanyName LIKE :search", {
            search: `%${searchQuery}%`,
          })
          .orderBy("TimeLine.StartDate", "DESC")
          .orderBy("TimeLine.EndDate", "DESC")
          .skip(skip)
          .take(itemsPerPage)
          .getMany();

        getAllMainBoard = await ipoRepo
          .createQueryBuilder("ipo")
          .leftJoinAndSelect("ipo.TimeLine", "TimeLine")
          .where("ipo.IsDelete = :isDelete", { isDelete: false })
          .andWhere("ipo.Type = :Type", { Type: 1 })
          .andWhere("ipo.CompanyName LIKE :search", {
            search: `%${searchQuery}%`,
          })
          .orderBy("TimeLine.StartDate", "DESC")
          .orderBy("TimeLine.EndDate", "DESC")
          .skip(skip)
          .take(itemsPerPage)
          .getMany();

        getAllNodateData = await ipoRepo
          .createQueryBuilder("ipo")
          .leftJoinAndSelect("ipo.TimeLine", "TimeLine")
          .where("ipo.IsDelete = :isDelete", { isDelete: false })
          .andWhere(new Brackets(qb => {
            qb.where("TimeLine.StartDate IS NULL")
              .orWhere("TimeLine.StartDate = ''");
          }))
          .andWhere("ipo.CompanyName LIKE :search", {
            search: `%${searchQuery}%`,
          })
          .skip(skip)
          .take(itemsPerPage)
          .getMany();
        
      } else {
        // Default behavior if no search query is present
        totalSMEItems = await ipoRepo
          .createQueryBuilder("ipo")
          .where("ipo.IsDelete = :isDelete", { isDelete: false })
          .andWhere("ipo.Type = :Type", { Type: 2 })
          .getCount();

        totalMainBoardItems = await ipoRepo
          .createQueryBuilder("ipo")
          .where("ipo.IsDelete = :isDelete", { isDelete: false })
          .andWhere("ipo.Type = :Type", { Type: 1 })
          .getCount();

        getAllSME = await ipoRepo
          .createQueryBuilder("ipo")
          .leftJoinAndSelect("ipo.TimeLine", "TimeLine")
          .where("ipo.IsDelete = :isDelete", { isDelete: false })
          .andWhere("ipo.Type = :Type", { Type: 2 })
          .andWhere("TimeLine.StartDate IS NOT NULL")
          .orderBy("TimeLine.StartDate", "DESC")
          .addOrderBy("TimeLine.EndDate", "DESC")
          .skip(skip)
          .take(itemsPerPage)
          .getMany();

        getAllMainBoard = await ipoRepo
          .createQueryBuilder("ipo")
          .leftJoinAndSelect("ipo.TimeLine", "TimeLine")
          .where("ipo.IsDelete = :isDelete", { isDelete: false })
          .andWhere("ipo.Type = :Type", { Type: 1 })
          .andWhere("TimeLine.StartDate IS NOT NULL")
          .orderBy("TimeLine.StartDate", "DESC")
          .addOrderBy("TimeLine.EndDate", "DESC")
          .skip(skip)
          .take(itemsPerPage)
          .getMany();

        getAllNodateData = await ipoRepo
          .createQueryBuilder("ipo")
          .leftJoinAndSelect("ipo.TimeLine", "TimeLine")
          .where("ipo.IsDelete = :isDelete", { isDelete: false })
          .andWhere("TimeLine.StartDate IS NULL")
          .skip(skip)
          .take(itemsPerPage)
          .getMany();
      }

      getAllMainBoard.forEach((item: any) => {
        const startDate: any = item?.TimeLine?.StartDate || "";
        const endDate: any = item?.TimeLine?.EndDate || "";
        const listingDate: any = item?.TimeLine?.ListingDate || "";
        item.rowStyle = getRowStyle(startDate, endDate, listingDate);
      });

      getAllSME.forEach((item: any) => {
        const startDate: any = item?.TimeLine?.StartDate || "";
        const endDate: any = item?.TimeLine?.EndDate || "";
        const listingDate: any = item?.TimeLine?.ListingDate || "";
        item.rowStyle = getRowStyle(startDate, endDate, listingDate);
      });

      const totalSmePages = Math.ceil(totalSMEItems / itemsPerPage);
      const totalMainBoardPages = Math.ceil(totalMainBoardItems / itemsPerPage);
      const totalNoDatePages = Math.ceil(totalNodeDateItems / itemsPerPage);


      res.render("dashboard/index", {
        getAllSME,
        currentPage,
        totalSmePages,
        getAllMainBoard,
        totalMainBoardItems,
        totalMainBoardPages,
        searchQuery,
        activeTab,
        getAllNodateData,
        totalNoDatePages
      });
    } catch (error) {
      console.error(error);
      return;
    }
  }

}
export default new IpoController();

function getRowStyle(startDate: string, endDate: string, listingDate: string) {
  const today = new Date().setHours(0, 0, 0, 0);

  const start = new Date(startDate).setHours(0, 0, 0, 0);
  const end = new Date(endDate).setHours(0, 0, 0, 0);
  const listing = new Date(listingDate).setHours(0, 0, 0, 0);

  const colorStyles = {
    issueOpen: "background-color: #e6f9e7;",
    issueCloseButNotListing: "background-color: #f3f3cb;",
    issueListing: "background-color: #daf3f6;",
    issueNoClass: "background-color: white;",
    issueCloseToday: "background-color: #ffd2cc;",  
  };

  if (today >= start && today < end) {
    return colorStyles.issueOpen;
  } else if (today === end) {
    return colorStyles.issueCloseToday;
  } else if (today === listing) {
    return colorStyles.issueListing;
  } else if (today > end && today < listing) {
    return colorStyles.issueCloseButNotListing;
  }
  return colorStyles.issueNoClass;
}
