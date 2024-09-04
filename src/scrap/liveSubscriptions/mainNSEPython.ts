import { exec, spawn } from 'child_process';
import path from 'path';
import { constants } from '../constants';
import moment from 'moment';
import { subscriptionFields, subscriptionInsertUpdate } from '../dbSp';
import { TypeEnum } from '../../utils/enumData';

var iid:any = 0;

function parseData(data:any){
    var retail:any = 0
    var qib:any = 0
    var nii:any = 0
    var employees:any = 0
    var bnii:any = 0
    var snii:any = 0
    var share_holder:any = 0
    var update_on:any = "";
    var latestTime = data.updateTime;
    if (latestTime.toLocaleUpperCase().includes(constants.CON_UPDATED_AS_ON)) { 
        update_on = latestTime.substring(latestTime.toLocaleUpperCase().indexOf(constants.CON_UPDATED_ON)+14);
    }
    const listItems = data.dataList;
    var tmpIndex = -1;
    for(var i = 0; i < listItems.length; i++){
        var category = listItems[i].category;
        if (category.toLocaleUpperCase().includes(constants.CON_QUALIFIED_INSTITUTIONAL_BUYERS)) { 
            if (listItems[i].noOfsharesBid){
                qib = listItems[i].noOfsharesBid;
            }else{
                qib = listItems[i].noOfSharesBid;
            }
        } else if (category.toLocaleUpperCase().includes(constants.CON_NON_INSTITUTIONAL_INVESTORS)) { 
            tmpIndex = tmpIndex +1;
            if (tmpIndex == 0){
                if (listItems[i].noOfsharesBid){
                    nii = listItems[i].noOfsharesBid;
                }else{
                    nii = listItems[i].noOfSharesBid;
                }
            } else if (tmpIndex == 1){
                if (listItems[i].noOfsharesBid){
                    bnii = listItems[i].noOfsharesBid;
                }else{
                    bnii = listItems[i].noOfSharesBid;
                }
            } else if (tmpIndex == 2){
                if (listItems[i].noOfsharesBid){
                    snii = listItems[i].noOfsharesBid;
                }else{
                    snii = listItems[i].noOfSharesBid;
                }
            }
        } else if (category.toLocaleUpperCase().includes(constants.CON_RETAIL_INDIVIDUAL_INVESTORS)) { 
            if (listItems[i].noOfsharesBid){
                retail = listItems[i].noOfsharesBid;
            }else{
                retail = listItems[i].noOfSharesBid;
            }
        } else if (category.toLocaleUpperCase().includes(constants.CON_EMPLOYEES)) {
            if (listItems[i].noOfsharesBid){
                employees = listItems[i].noOfsharesBid;
            }else{
                employees = listItems[i].noOfSharesBid;
            } 
        } else if (category.toLocaleUpperCase().includes(constants.CON_SHAREHOLDER)) {
            if (listItems[i].noOfsharesBid){
                share_holder = listItems[i].noOfsharesBid;
            }else{
                share_holder = listItems[i].noOfSharesBid;
            }  
        } 
    }
    if (retail == '-'){
        retail = 0;
    }
    if (qib == '-'){
        qib = 0;
    }
    if (nii == '-'){
        nii = 0;
    }
    if (bnii == '-'){
        bnii = 0;
    }
    if (snii == '-'){
        snii = 0;
    }
    if (employees == '-'){
        employees = 0;
    }
    if (share_holder == '-'){
        share_holder = 0;
    }

    const tmpTime = update_on.trim().split(' ');
    var last_update = null;
    if (tmpTime.length == 2){
        // var date = moment(tmpTime[0].trim()).format('YYYY-MM-DD');
        // var time24 = moment(tmpTime[1].trim(), 'hh:mm:ss A').format('HH:mm:ss');
        // last_update = date + ' ' + time24;
        var datetime = new Date(tmpTime[0].trim() + " " + tmpTime[1].trim());
        var last_update:any = moment(datetime).format(constants.CON_DATE_YYMMDDHHMMSS);
    }

    console.log('iid -->'+iid);
    console.log('nse mainline-->');
    console.log('last_update -->'+last_update);
    console.log('RETAIL -->'+retail);
    console.log('NII -->'+nii);
    console.log('QIB -->'+qib);
    console.log('bnii -->'+bnii);
    console.log('snii -->'+snii);
    console.log('employees -->'+employees);
    console.log('share_holder -->'+share_holder);

    const field:subscriptionFields = {
        Type:TypeEnum.Mainbord,
        IpoId: iid,
        SniiSubscription: snii,
        SniiApplication: 0,
        ShareHolderSubscription: share_holder,
        ShareHolderApplication: 0,
        RetailSubscription: retail,
        RetailApplication: 0,
        QibSubscription: qib,
        QibApplication: 0,
        NiiSubscription: nii,
        NiiApplication: 0,
        LastUpdate: last_update,
        EmployeeSubscription: employees,
        EmployeeApplication: 0,
        BniiSubscription: bnii,
        BniiApplication: 0,
    }
    subscriptionInsertUpdate(field)    
}

export async function scrapeNSEMainPythonSubscriptionData(IpoId:any, Symbol:any) {
    iid = IpoId;
    const pythonScriptPath = path.join(__dirname, 'python/mainNSEPythonScript.py');
    const pythonProcess = spawn('python3', [pythonScriptPath, Symbol]);
    pythonProcess.stdout.on('data', (data) => {
  
      try {
        var modifiedData = data.toString().replace(/'/g, '"');
        modifiedData = modifiedData.toString().replace(/\bNone\b/g, null);
        const jsonData = JSON.parse(modifiedData);
        parseData(jsonData)
        // console.log(`Output from Python: ${modifiedData}`);
      } catch (error) {
        console.log(error)
      }
    });
  
    // Capture any errors
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python: ${data}`);
    });
  
    // Capture the close event
    pythonProcess.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);
    });
}