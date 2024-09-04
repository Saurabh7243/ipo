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

    var retailApplication:any = 0
    var qibApplication:any = 0
    var niiApplication:any = 0
    var employeesApplication:any = 0
    var shareHolderApplication:any = 0

    var latestTime = data.updateTime;
    if (latestTime.toLocaleUpperCase().includes(constants.CON_UPDATED_AS_ON)) { 
        //update_on = latestTime.substring(latestTime.toLocaleUpperCase().indexOf(constants.CON_UPDATED_ON)+14);
        update_on = latestTime.toLocaleUpperCase().replace(constants.CON_UPDATED_AS_ON,'')
        update_on = update_on.replace('HRS','').trim()
    }
    console.log("update_on =========>"+update_on);
    const listItems = data.data;
    var tmpIndex = -1;
    for(var i = 0; i < listItems.length; i++){
        var category = listItems[i].category;
        if (category.toLocaleUpperCase().includes(constants.CON_QUALIFIED_INSTITUTIONAL_BUYERS)) { 
            qib = listItems[i].noOfshareBid;
            qibApplication = listItems[i].noofapplication;
        } else if (category.toLocaleUpperCase().includes(constants.CON_NON_INSTITUTIONAL_INVESTORS)) { 
            tmpIndex = tmpIndex +1;
            if (tmpIndex == 0){
                nii = listItems[i].noOfshareBid;
                niiApplication = listItems[i].noofapplication;
            } else if (tmpIndex == 1){
                bnii = listItems[i].noOfshareBid;
            } else if (tmpIndex == 2){
                snii = listItems[i].noOfshareBid;
            }
        } else if (category.toLocaleUpperCase().includes(constants.CON_RETAIL_INDIVIDUAL_INVESTORS)) { 
            retail = listItems[i].noOfshareBid;
            retailApplication = listItems[i].noofapplication;
        } else if (category.toLocaleUpperCase().includes(constants.CON_EMPLOYEES)) { 
            employees = listItems[i].noOfshareBid;
            employeesApplication = listItems[i].noofapplication;
        } else if (category.toLocaleUpperCase().includes(constants.CON_SHAREHOLDER)) { 
            share_holder = listItems[i].noOfshareBid;
            shareHolderApplication = listItems[i].noofapplication;
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
    console.log('last_update -->'+last_update);
    console.log('RETAIL -->'+retail);
    console.log('NII -->'+nii);
    console.log('QIB -->'+qib);
    console.log('bnii -->'+bnii);
    console.log('snii -->'+snii);
    console.log('employees -->'+employees);
    console.log('share_holder -->'+share_holder);

    console.log('RETAIL APPLICATION -->'+retailApplication);
    console.log('NII APPLICATION-->'+niiApplication);
    console.log('QIB APPLICATION-->'+qibApplication);
    console.log('employees APPLICATION-->'+employeesApplication);
    console.log('share_holder APPLICATION-->'+shareHolderApplication);

    const field:subscriptionFields = {
        Type:TypeEnum.SME,
        IpoId: iid,
        SniiSubscription: snii,
        SniiApplication: 0,
        ShareHolderSubscription: share_holder,
        ShareHolderApplication: shareHolderApplication,
        RetailSubscription: retail,
        RetailApplication: retailApplication,
        QibSubscription: qib,
        QibApplication: qibApplication,
        NiiSubscription: nii,
        NiiApplication: niiApplication,
        LastUpdate: last_update,
        EmployeeSubscription: employees,
        EmployeeApplication: employeesApplication,
        BniiSubscription: bnii,
        BniiApplication: 0,
    }
    subscriptionInsertUpdate(field)
}

export async function scrapeNSESMEPythonSubscriptionData(IpoId:any, Symbol:any) {
    iid = IpoId;
    const pythonScriptPath = path.join(__dirname, 'python/smeNSEPythonScript.py');
    const pythonProcess = spawn('python', [pythonScriptPath, Symbol]);
    pythonProcess.stdout.on('data', (data) => {
  
      try {
        var modifiedData = data.toString().replace(/'/g, '"');
        modifiedData = modifiedData.toString().replace('None', null);
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