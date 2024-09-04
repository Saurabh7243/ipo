import axios from 'axios';
import * as cheerio from 'cheerio';
import { constants } from '../constants';
import moment from 'moment';
import { subscriptionAppWiseInsertUpdate, subscriptionFields } from '../dbSp';
import { TypeEnum } from '../../utils/enumData';

export async function scrapeSubscriptionAppWiseData(IpoId: number, premiumid: number){
    var url = constants.CON_PREMIUM_URL + premiumid + "/";
    var hni10L:any = 0
    var hni2L:any = 0
    var retail:any = 0
    try {
        const { data } = await axios.get(url);
        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);
        const divsWithClass = $('.table-condensed');

        divsWithClass.each((i, div) => {
            var thead = $(div).children('thead').children('tr').children('th');
            var theadtext = thead.text();
            if (theadtext.toLocaleUpperCase().includes("APPLICATION WISE BREAKUP")) { 
                var trChildren = $(div).children('tbody').children('tr');
                trChildren.each((i, tr) => {
                    var tdChildren = $(tr).children('td');
                    tdChildren.each((j, td) => {
                        if (j == 2){
                            if (i == 0){
                                hni10L = $(td).text()
                            } else if (i == 1){
                                hni2L = $(td).text()
                            } else if (i == 2){
                                retail = $(td).text()
                            }  
                        }
                    })
                   
                })
            }
        });
        
        console.log("hni10L-->"+ hni10L);
        console.log("hni2L-->"+ hni2L);
        console.log("retail-->"+ retail);

        const field:subscriptionFields = {
            Type:TypeEnum.Mainbord,
            IpoId: IpoId,
            SniiSubscription: 0,
            SniiApplication: hni2L,
            ShareHolderSubscription: 0,
            ShareHolderApplication: 0,
            RetailSubscription: 0,
            RetailApplication: retail,
            QibSubscription: 0,
            QibApplication: 0,
            NiiSubscription: 0,
            NiiApplication: 0,
            LastUpdate: 0,
            EmployeeSubscription: 0,
            EmployeeApplication: 0,
            BniiSubscription: 0,
            BniiApplication: hni10L,
        }
        subscriptionAppWiseInsertUpdate(field)

    } catch (err) {
        console.error(err);
    }
}