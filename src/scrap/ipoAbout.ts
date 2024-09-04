import axios from 'axios';
import * as cheerio from 'cheerio';
import { constants } from './constants';
import { DetailAboutInsertUpdate } from './dbSp';

export async function scrapeDetailAboutData(IpoId: number, chittorid: number, chittorname: string){
    var html_data_about:any = ""

    var url = constants.CON_CHITTOR_URL + chittorname +"/" + chittorid + "/";
    try {
        const { data } = await axios.get(url);
        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);
        const listItems = $("#ipoSummary")        
        listItems.each((idx, el) => {
            html_data_about = $(el).html()
        });
        
        console.log("html_data_about-->"+html_data_about);

        DetailAboutInsertUpdate(IpoId,html_data_about)
    } catch (err) {
        console.error(err);
    }
}
