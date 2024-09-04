const connection = require("./db");
const moment = require('moment');
var global = require('./global');

function ipoDatesUpdate(iid, open_date, close_date, basic_allotment_date, refund_date, credit_share_date, listing_date)
{
    var records = [open_date, close_date, basic_allotment_date, refund_date, credit_share_date, listing_date, iid];
    var sql = 'UPDATE tbl_ipo SET start_date = ?, end_date = ?, allotment_date = ?, refund_date = ?, credit_share_date =?, listing_date = ? WHERE iid = ?';  
    connection.query(sql,records, function (err, result) {  
        if (err) throw err;  
            console.log("1 record updated");  
        });  
}

function subscriptionInsertUpdate(iid, retail, qib, nii, bnii, snii, employee, share_holder, retailApplication, niiApplication, qibApplication, employeesApplication, shareHolderApplication, last_update = null){

    retail = global.commaZeroCheck(retail);
    nii = global.commaZeroCheck(nii);
    qib = global.commaZeroCheck(qib);
    bnii = global.commaZeroCheck(bnii);
    snii = global.commaZeroCheck(snii);
    employee = global.commaZeroCheck(employee);
    share_holder = global.commaZeroCheck(share_holder);

    retailApplication = global.commaZeroCheck(retailApplication);
    niiApplication = global.commaZeroCheck(niiApplication);
    qibApplication = global.commaZeroCheck(qibApplication);
    employeesApplication = global.commaZeroCheck(employeesApplication);
    shareHolderApplication = global.commaZeroCheck(shareHolderApplication);

    var sql = "SELECT * FROM tbl_subscription WHERE iid="+iid;  
    connection.query(sql, function(err, row) {
      if(err) {
          console.warn('Error in DB');
          console.debug(err);
          return;
      } else {
          if (row && row.length ) {
              console.log('Row was found!');
              subscriptionUpdateData(iid, retail, qib, nii, bnii, snii, employee, share_holder, retailApplication, niiApplication, qibApplication, employeesApplication, shareHolderApplication, last_update);
          } else {
              console.log('Row was not found :( !');
              subscriptionInsertData(iid, retail, qib, nii, bnii, snii, employee, share_holder, retailApplication, niiApplication, qibApplication, employeesApplication, shareHolderApplication, last_update);
          }
      }
    });
}
  
function subscriptionInsertData(iid, retail, qib, nii, bnii, snii, employee, share_holder, retailApplication, niiApplication, qibApplication, employeesApplication, shareHolderApplication, last_update = null)
{
    if (retail == 0) return;
    if (retail == null) return;

    var updateTime = last_update;
    if (updateTime == null){
        updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    }
    
    var sql = 'INSERT INTO tbl_subscription (iid, rii, qib, nii, bnii, snii, employee, share_holder, retail_application, nii_application, qib_application, employee_application, share_holder_application, last_update) VALUES ('+iid+', '+retail+', '+qib+', '+nii+', '+bnii+', '+snii+', '+employee+', '+share_holder+', '+retailApplication+', '+niiApplication+', '+qibApplication+', '+employeesApplication+', '+shareHolderApplication+', "'+updateTime+'")';  
    connection.query(sql, function (err, result) {  
        if (err) throw err;  
        console.log("1 record inserted");  
        console.log("Row inserted with id = "
            + result.insertId);
        });  
}

function subscriptionUpdateData(iid, retail, qib, nii, bnii, snii, employee, share_holder, retailApplication, niiApplication, qibApplication, employeesApplication, shareHolderApplication, last_update = null)
{
    if (retail == 0) return;
    if (retail == null) return;

    var updateTime = last_update;
    if (updateTime == null){
        updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    }

    var records = [retail, qib, nii, bnii, snii, employee, share_holder, retailApplication, niiApplication, qibApplication, employeesApplication, shareHolderApplication, updateTime, iid];
    var sql = 'UPDATE tbl_subscription SET rii = ?, qib = ?, nii = ?, bnii = ?, snii =?, employee = ?, share_holder = ?, retail_application = ?, nii_application = ?, qib_application = ?, employee_application = ?, share_holder_application = ?, last_update = ? WHERE iid = ?';  
    connection.query(sql,records, function (err, result) {  
        if (err) throw err;  
        console.log("1 record updated");  
        });  
}

function lotSizeInsertUpdate(iid, retail_min_lot, retail_min_share, retail_max_lot, retail_max_share, shni_min_lot, shni_min_share, shni_max_lot, shni_max_share, bhni_min_lot, bhni_min_share, last_update = null){

    retail_min_lot = global.commaZeroCheck(retail_min_lot);
    retail_min_share = global.commaZeroCheck(retail_min_share);
    retail_max_lot = global.commaZeroCheck(retail_max_lot);
    retail_max_share = global.commaZeroCheck(retail_max_share);
    shni_min_lot = global.commaZeroCheck(shni_min_lot);
    shni_min_share = global.commaZeroCheck(shni_min_share);
    shni_max_lot = global.commaZeroCheck(shni_max_lot);
    shni_max_share = global.commaZeroCheck(shni_max_share);
    bhni_min_lot = global.commaZeroCheck(bhni_min_lot);
    bhni_min_share = global.commaZeroCheck(bhni_min_share);
   
    var sql = "SELECT * FROM tbl_lotsize WHERE iid="+iid;  
    connection.query(sql, function(err, row) {
      if(err) {
          console.warn('Error in DB');
          console.debug(err);
          return;
      } else {
          if (row && row.length ) {
              console.log('Row was found!');
              lotSizeUpdateData(iid, retail_min_lot, retail_min_share, retail_max_lot, retail_max_share, shni_min_lot, shni_min_share, shni_max_lot, shni_max_share, bhni_min_lot, bhni_min_share, last_update);
          } else {
              console.log('Row was not found :( !');
              lotSizeInsertData(iid, retail_min_lot, retail_min_share, retail_max_lot, retail_max_share, shni_min_lot, shni_min_share, shni_max_lot, shni_max_share, bhni_min_lot, bhni_min_share, last_update);
          }
      }
    });
}

function lotSizeInsertData(iid, retail_min_lot, retail_min_share, retail_max_lot, retail_max_share, shni_min_lot, shni_min_share, shni_max_lot, shni_max_share, bhni_min_lot, bhni_min_share, last_update = null)
{
    if (retail_min_lot == 0) return;
    if (retail_min_lot == null) return;

    var updateTime = last_update;
    if (updateTime == null){
        updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    }
    
    var sql = 'INSERT INTO tbl_lotsize (iid, retail_min_lot, retail_min_share, retail_max_lot, retail_max_share, shni_min_lot, shni_min_share, shni_max_lot, shni_max_share, bhni_min_lot, bhni_min_share, updated_date) VALUES ('+iid+', '+retail_min_lot+', '+retail_min_share+', '+retail_max_lot+', '+retail_max_share+', '+shni_min_lot+', '+shni_min_share+', '+shni_max_lot+', '+shni_max_share+', '+bhni_min_lot+', '+bhni_min_share+', "'+updateTime+'")';  
    connection.query(sql, function (err, result) {  
        if (err) throw err;  
        console.log("1 record inserted");  
        console.log("Row inserted with id = "
            + result.insertId);
        });  
}

function lotSizeUpdateData(iid, retail_min_lot, retail_min_share, retail_max_lot, retail_max_share, shni_min_lot, shni_min_share, shni_max_lot, shni_max_share, bhni_min_lot, bhni_min_share, last_update = null)
{
    if (retail_min_lot == 0) return;
    if (retail_min_lot == null) return;

    var updateTime = last_update;
    if (updateTime == null){
        updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    }

    var records = [retail_min_lot, retail_min_share, retail_max_lot, retail_max_share, shni_min_lot, shni_min_share, shni_max_lot, shni_max_share, bhni_min_lot, bhni_min_share, updateTime, iid];
    var sql = 'UPDATE tbl_lotsize SET retail_min_lot = ?, retail_min_share = ?, retail_max_lot = ?, retail_max_share = ?, shni_min_lot =?, shni_min_share = ?, shni_max_lot = ?, shni_max_share = ?, bhni_min_lot = ?, bhni_min_share = ?, updated_date = ? WHERE iid = ?';  
    connection.query(sql,records, function (err, result) {  
        if (err) throw err;  
        console.log("1 record updated");  
        });  
}

function valuationInsertUpdate(iid, values){
    var sql = "SELECT * FROM tbl_valuation WHERE iid="+iid;  
    connection.query(sql, function(err, row) {
      if(err) {
          console.warn('Error in DB');
          console.debug(err);
          return;
      } else {
          if (row && row.length ) {
              console.log('Row was found!');
          } else {
              console.log('Row was not found :( !');
              insertValuations(values);
          }
      }
    });
}

function insertValuations(values){
    var sql = "INSERT INTO tbl_valuation (iid, strKey, strValue) VALUES ?";
    // var values = [
    //   [1,'John', 'Highway 71'],
    //   [1, 'Peter', 'Lowstreet 4'],
    //   [1, 'Viola', 'Sideway 1633']
    // ];
    connection.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
}

function shareOfferedInsertUpdate(iid, anchor_investor_shares, market_makers_shares, retail_shares, nii_shares, bnii_shares, snii_shares, qib_shares, employee_shares, share_holder_shares, total_shares, bnii_maximum_allotment, snii_maximum_allotment, retail_maximum_allotment){

    anchor_investor_shares = global.commaZeroCheck(anchor_investor_shares);
    market_makers_shares = global.commaZeroCheck(market_makers_shares);
    retail_shares = global.commaZeroCheck(retail_shares);
    nii_shares = global.commaZeroCheck(nii_shares);
    bnii_shares = global.commaZeroCheck(bnii_shares);
    snii_shares = global.commaZeroCheck(snii_shares);
    qib_shares = global.commaZeroCheck(qib_shares);
    employee_shares = global.commaZeroCheck(employee_shares);
    share_holder_shares = global.commaZeroCheck(share_holder_shares);
    total_shares = global.commaZeroCheck(total_shares);
    bnii_maximum_allotment = global.commaZeroCheck(bnii_maximum_allotment);
    snii_maximum_allotment = global.commaZeroCheck(snii_maximum_allotment);
    retail_maximum_allotment = global.commaZeroCheck(retail_maximum_allotment);
    
    var sql = "SELECT * FROM tbl_shares_offered WHERE iid="+iid;  
    connection.query(sql, function(err, row) {
      if(err) {
          console.warn('Error in DB');
          console.debug(err);
          return;
      } else {
          if (row && row.length ) {
              console.log('Row was found!');
              shareOfferedUpdateData(iid, anchor_investor_shares, market_makers_shares, retail_shares, nii_shares, bnii_shares, snii_shares, qib_shares, employee_shares, share_holder_shares, total_shares, bnii_maximum_allotment, snii_maximum_allotment, retail_maximum_allotment);
          } else {
              console.log('Row was not found :( !');
              shareOfferedInsertData(iid, anchor_investor_shares, market_makers_shares, retail_shares, nii_shares, bnii_shares, snii_shares, qib_shares, employee_shares, share_holder_shares, total_shares, bnii_maximum_allotment, snii_maximum_allotment, retail_maximum_allotment);
          }
      }
    });
}

function shareOfferedInsertData(iid, anchor_investor_shares, market_makers_shares, retail_shares, nii_shares, bnii_shares, snii_shares, qib_shares, employee_shares, share_holder_shares, total_shares, bnii_maximum_allotment, snii_maximum_allotment, retail_maximum_allotment)
{
    if (retail_shares == 0) return;
    if (retail_shares == null) return;
 
    var sql = 'INSERT INTO tbl_shares_offered (iid, anchor_investor_shares, market_makers_shares, retail_shares, nii_shares, bnii_shares, snii_shares, qib_shares, employee_shares, share_holder_shares, total_shares, bnii_maximum_allotment, snii_maximum_allotment, retail_maximum_allotment) VALUES ('+iid+', '+anchor_investor_shares+', '+market_makers_shares+', '+retail_shares+', '+nii_shares+', '+bnii_shares+', '+snii_shares+', '+qib_shares+', '+employee_shares+', '+share_holder_shares+', '+total_shares+', '+bnii_maximum_allotment+', '+snii_maximum_allotment+', '+retail_maximum_allotment+')';  
    connection.query(sql, function (err, result) {  
        if (err) throw err;  
        console.log("1 record inserted");  
        console.log("Row inserted with id = "
            + result.insertId);
        });  
}

function shareOfferedUpdateData(iid, anchor_investor_shares, market_makers_shares, retail_shares, nii_shares, bnii_shares, snii_shares, qib_shares, employee_shares, share_holder_shares, total_shares, bnii_maximum_allotment, snii_maximum_allotment, retail_maximum_allotment)
{
    if (retail_shares == 0) return;
    if (retail_shares == null) return;

    var records = [];
    var sql = '';

    if (anchor_investor_shares == 0 && market_makers_shares == 0) {
      records = [
        retail_shares,
        nii_shares,
        bnii_shares,
        snii_shares,
        qib_shares,
        employee_shares,
        share_holder_shares,
        total_shares,
        bnii_maximum_allotment,
        snii_maximum_allotment,
        retail_maximum_allotment,
        iid,
      ];
      sql =
        "UPDATE tbl_shares_offered SET retail_shares = ?, nii_shares = ?, bnii_shares =?, snii_shares = ?, qib_shares = ?, employee_shares = ?, share_holder_shares = ?, total_shares = ?, bnii_maximum_allotment = ?, snii_maximum_allotment = ?, retail_maximum_allotment = ? WHERE iid = ?";
    } else if (anchor_investor_shares == 0) {
      records = [
        market_makers_shares,
        retail_shares,
        nii_shares,
        bnii_shares,
        snii_shares,
        qib_shares,
        employee_shares,
        share_holder_shares,
        total_shares,
        bnii_maximum_allotment,
        snii_maximum_allotment,
        retail_maximum_allotment,
        iid,
      ];
      sql =
        "UPDATE tbl_shares_offered SET market_makers_shares = ?, retail_shares = ?, nii_shares = ?, bnii_shares =?, snii_shares = ?, qib_shares = ?, employee_shares = ?, share_holder_shares = ?, total_shares = ?, bnii_maximum_allotment = ?, snii_maximum_allotment = ?, retail_maximum_allotment = ? WHERE iid = ?";
    } else {
      records = [
        anchor_investor_shares,
        market_makers_shares,
        retail_shares,
        nii_shares,
        bnii_shares,
        snii_shares,
        qib_shares,
        employee_shares,
        share_holder_shares,
        total_shares,
        bnii_maximum_allotment,
        snii_maximum_allotment,
        retail_maximum_allotment,
        iid,
      ];
      sql =
        "UPDATE tbl_shares_offered SET anchor_investor_shares = ?, market_makers_shares = ?, retail_shares = ?, nii_shares = ?, bnii_shares =?, snii_shares = ?, qib_shares = ?, employee_shares = ?, share_holder_shares = ?, total_shares = ?, bnii_maximum_allotment = ?, snii_maximum_allotment = ?, retail_maximum_allotment = ? WHERE iid = ?";
    }
    
    connection.query(sql,records, function (err, result) {  
        if (err) throw err;  
        console.log("1 record updated");  
        });  
}

function detailReservationInsertUpdate(iid, reservation_data){

    if (reservation_data.toString().trim() == "") return;

    var sql = "SELECT * FROM tbl_ipodetail WHERE iid="+iid;  
    connection.query(sql, function(err, row) {
      if(err) {
          console.warn('Error in DB');
          console.debug(err);
          return;
      } else {
          if (row && row.length ) {
              console.log('Row was found!');
              detailReservationUpdateData(iid, reservation_data.toString().trim());
          } else {
              console.log('Row was not found :( !');
              detailReservationInsertData(iid, reservation_data.toString().trim());
          }
      }
    });
}

function detailReservationInsertData(iid, reservation_data)
{
    var sql = 'INSERT INTO tbl_ipodetail (iid, reservation) VALUES ('+iid+', "'+reservation_data+'")';  
    connection.query(sql, function (err, result) {  
        if (err) throw err;  
        console.log("1 record inserted");  
        console.log("Row inserted with id = "
            + result.insertId);
        });  
}

function detailReservationUpdateData(iid, reservation_data)
{
    var records = [reservation_data, iid];
    var sql = 'UPDATE tbl_ipodetail SET reservation = ? WHERE iid = ?';  
    connection.query(sql,records, function (err, result) {  
        if (err) throw err;  
        console.log("1 record updated");  
        });  
}

function detailFinancialInfoInsertUpdate(iid, finacial_data){

    if (finacial_data.toString().trim() == "") return;

    var sql = "SELECT * FROM tbl_ipodetail WHERE iid="+iid;  
    connection.query(sql, function(err, row) {
      if(err) {
          console.warn('Error in DB');
          console.debug(err);
          return;
      } else {
          if (row && row.length ) {
              console.log('Row was found!');
              detailFinancialInfoUpdateData(iid, finacial_data.toString().trim());
          } else {
              console.log('Row was not found :( !');
              detailFinancialInfoInsertData(iid, finacial_data.toString().trim());
          }
      }
    });
}

function detailFinancialInfoInsertData(iid, finacial_data)
{
    var sql = 'INSERT INTO tbl_ipodetail (iid, finacial_infomation) VALUES ('+iid+', "'+finacial_data+'")';  
    connection.query(sql, function (err, result) {  
        if (err) throw err;  
        console.log("1 record inserted");  
        console.log("Row inserted with id = "
            + result.insertId);
        });  
}

function detailFinancialInfoUpdateData(iid, finacial_data)
{
    var records = [finacial_data, iid];
    var sql = 'UPDATE tbl_ipodetail SET finacial_infomation = ? WHERE iid = ?';  
    connection.query(sql,records, function (err, result) {  
        if (err) throw err;  
        console.log("1 record updated");  
        });  
}

function detailObjectivesInsertUpdate(iid, objective_data){

    if (objective_data.toString().trim() == "") return;

    var sql = "SELECT * FROM tbl_ipodetail WHERE iid="+iid;  
    connection.query(sql, function(err, row) {
      if(err) {
          console.warn('Error in DB');
          console.debug(err);
          return;
      } else {
          if (row && row.length ) {
              console.log('Row was found!');
              detailObjectivesUpdateData(iid, objective_data);
          } else {
              console.log('Row was not found :( !');
              detailObjectivesInsertData(iid, objective_data);
          }
      }
    });
}

function detailObjectivesInsertData(iid, objective_data)
{
    var sql = 'INSERT INTO tbl_ipodetail (iid, objectives) VALUES ('+iid+', "'+objective_data+'")';  
    connection.query(sql, function (err, result) {  
        if (err) throw err;  
        console.log("1 record inserted");  
        console.log("Row inserted with id = "
            + result.insertId);
        });  
}

function detailObjectivesUpdateData(iid, objective_data)
{
    var records = [iid];
    var sql = 'UPDATE tbl_ipodetail SET objectives = "'+objective_data+'" WHERE iid = ?';  
    connection.query(sql,records, function (err, result) {  
        if (err) throw err;  
        console.log("1 record updated");  
        });  
}

function detailsInsertUpdate(iid, detail_data, ipoType, faceValue, minPrice, maxPrice, lotSize, shareHoldingPreIssue, shareHoldingPostIssue, totalIssueShare, totalIssuePrice, freshIssueShare, freshIssuePrice, ofsIssueShare, ofsIssuePrice){

    if (detail_data.toString().trim() == "") return;

    var sql = "SELECT * FROM tbl_ipodetail WHERE iid="+iid;  
    connection.query(sql, function(err, row) {
      if(err) {
          console.warn('Error in DB');
          console.debug(err);
          return;
      } else {
          if (row && row.length ) {
              console.log('Row was found!');
              detailsUpdateData(iid, detail_data, ipoType, faceValue, minPrice, maxPrice, lotSize, shareHoldingPreIssue, shareHoldingPostIssue, totalIssueShare, totalIssuePrice, freshIssueShare, freshIssuePrice, ofsIssueShare, ofsIssuePrice);
          } else {
              console.log('Row was not found :( !');
              detailsInsertData(iid, detail_data, ipoType, faceValue, minPrice, maxPrice, lotSize, shareHoldingPreIssue, shareHoldingPostIssue, totalIssueShare, totalIssuePrice, freshIssueShare, freshIssuePrice, ofsIssueShare, ofsIssuePrice);
          }
      }
    });
}

function detailsInsertData(iid, detail_data, ipoType, faceValue, minPrice, maxPrice, lotSize, shareHoldingPreIssue, shareHoldingPostIssue, totalIssueShare, totalIssuePrice, freshIssueShare, freshIssuePrice, ofsIssueShare, ofsIssuePrice)
{
    var sql = 'INSERT INTO tbl_ipodetail (iid, ipo_type, face_value, min_price, max_price, lot_size, shareholding_preissue, shareholding_postissue, totalissue_shares, totalissue_price, freshissue_shares, freshissue_price, ofsissue_shares, ofsissue_price, details) VALUES ('+iid+', '+ipoType+',  '+faceValue+', '+minPrice+', '+maxPrice+', '+lotSize+',  '+shareHoldingPreIssue+',  '+shareHoldingPostIssue+',  '+totalIssueShare+',  "'+totalIssuePrice+'",  '+freshIssueShare+',  "'+freshIssuePrice+'",  '+ofsIssueShare+',  "'+ofsIssuePrice+'", "'+detail_data+'")';  
    connection.query(sql, function (err, result) {  
        if (err) throw err;  
        console.log("1 record inserted");  
        console.log("Row inserted with id = "
            + result.insertId);
        });  
}

function detailsUpdateData(iid, detail_data, ipoType, faceValue, minPrice, maxPrice, lotSize, shareHoldingPreIssue, shareHoldingPostIssue, totalIssueShare, totalIssuePrice, freshIssueShare, freshIssuePrice, ofsIssueShare, ofsIssuePrice)
{
    var records = [ipoType, faceValue, minPrice, maxPrice, lotSize, shareHoldingPreIssue, shareHoldingPostIssue, totalIssueShare, totalIssuePrice, freshIssueShare, freshIssuePrice, ofsIssueShare, ofsIssuePrice, detail_data, iid];
    var sql = 'UPDATE tbl_ipodetail SET ipo_type = ?, face_value = ?, min_price = ?, max_price = ?, lot_size = ?, shareholding_preissue = ?, shareholding_postissue = ?, totalissue_shares = ?, totalissue_price = ?, freshissue_shares = ?, freshissue_price = ?, ofsissue_shares = ?, ofsissue_price = ?, details = ? WHERE iid = ?';  
    connection.query(sql,records, function (err, result) {  
        if (err) throw err;  
        console.log("1 record updated");  
        });  
}

function promotorHoldingInsertUpdate(iid, pre_issue, post_issue){

    if (pre_issue.toString().trim() == "") return;

    var sql = "SELECT * FROM tbl_promotor_holding WHERE iid="+iid;  
    connection.query(sql, function(err, row) {
      if(err) {
          console.warn('Error in DB');
          console.debug(err);
          return;
      } else {
          if (row && row.length ) {
              console.log('Row was found!');
              promotorHoldingUpdateData(iid, pre_issue, post_issue);
          } else {
              console.log('Row was not found :( !');
              promotorHoldingInsertData(iid, pre_issue, post_issue);
          }
      }
    });
}

function promotorHoldingInsertData(iid, pre_issue, post_issue)
{
    var sql = 'INSERT INTO tbl_promotor_holding (iid, pre_issue, post_issue) VALUES ('+iid+', "'+pre_issue+'", "'+post_issue+'")';  
    connection.query(sql, function (err, result) {  
        if (err) throw err;  
        console.log("1 record inserted");  
        console.log("Row inserted with id = "
            + result.insertId);
        });  
}

function promotorHoldingUpdateData(iid, pre_issue, post_issue)
{
    var records = [pre_issue, post_issue, iid];
    var sql = 'UPDATE tbl_promotor_holding SET pre_issue = ?, post_issue = ? WHERE iid = ?';  
    connection.query(sql,records, function (err, result) {  
        if (err) throw err;  
        console.log("1 record updated");  
        });  
}

function gmpInsertUpdate(iid, gmp_date, gmp_price, sub2_rate, last_update){

    if (last_update.trim() == "") return;

    var sql = "SELECT * FROM tbl_gmp WHERE iid = "+iid+ ' AND last_update = "'+last_update+'"';  
    connection.query(sql, function(err, row) {
      if(err) {
            console.warn('Error in DB');
            console.debug(err);
        //   console.warn('Error in DB');
        //   console.debug(err);
          return;
      } else {
          if (row && row.length ) {
              console.log('Row was found!');
              //gmpUpdateData(iid, gmp_date, gmp_price, sub2_rate, last_update);
          } else {
              console.log('Row was not found :( !');
              gmpInsertData(iid, gmp_date, gmp_price, sub2_rate, last_update);
          }
      }
    });
}

function gmpInsertData(iid, gmp_date, gmp_price, sub2_rate, last_update)
{
    var sql = 'INSERT INTO tbl_gmp (iid, gmp_date, gmp_price, sub2_sauda_rate, last_update) VALUES ('+iid+', "'+gmp_date+'", '+gmp_price+', "'+sub2_rate+'", "'+last_update+'")';  
    connection.query(sql, function (err, result) {  
        if (err) throw err;  
        console.log("1 record inserted");  
        console.log("Row inserted with id = "
            + result.insertId);
        });  
}

function gmpUpdateData(iid, gmp_date, gmp_price, sub2_rate, last_update)
{
    var records = [gmp_date, gmp_price, sub2_rate, last_update, iid];
    var sql = 'UPDATE tbl_gmp SET gmp_date = ?, gmp_price = ?, sub2_sauda_rate = ?, last_update = ? WHERE iid = ?';  
    connection.query(sql,records, function (err, result) {  
        if (err) throw err;  
        console.log("1 record updated");  
        });  
}

function checkMarketMakerData(iid, marketMakerName)
{
    var sql = "SELECT * FROM tbl_marketmaker WHERE marketmaker_name LIKE '%"+marketMakerName+"%'";
    connection.query(sql, function(err, row) {
      if(err) {
          console.warn('Error in DB');
          console.debug(err);
          return;
      } else {
          if (row && row.length ) {
              console.log('Row was found!');
              updateMarketMakerData(iid, row[0].mmid);
          } else {
              console.log('Row was not found :( !');
              insertMarketMakerData(iid, marketMakerName);
          }
      }
    });
}

function updateMarketMakerData(iid, mmid)
{
    var records = [mmid, iid];
    var sql = 'UPDATE tbl_ipodetail SET mmid = ? WHERE iid = ?';  
    connection.query(sql,records, function (err, result) {  
        if (err) throw err;  
        console.log("1 record updated");  
        }); 
}

function insertMarketMakerData(iid, marketMakerName)
{
    var sql = 'INSERT INTO tbl_marketmaker (marketmaker_name) VALUES ("'+marketMakerName+'")';  
    connection.query(sql, function (err, result) {  
        if (err) throw err;  
        console.log("1 record inserted");  
        console.log("Row inserted with id = "
            + result.insertId);
            updateMarketMakerData(iid, result.insertId);
        });  
}

function detailCompanyAddressInsertUpdate(iid, address_data){

    if (address_data.toString().trim() == "") return;

    var sql = "SELECT * FROM tbl_ipodetail WHERE iid="+iid;  
    connection.query(sql, function(err, row) {
      if(err) {
          console.warn('Error in DB');
          console.debug(err);
          return;
      } else {
          if (row && row.length ) {
              console.log('Row was found!');
              detailCompanyAddressUpdateData(iid, address_data);
          } else {
              console.log('Row was not found :( !');
              detailCompanyAddressInsertData(iid, address_data);
          }
      }
    });
}

function detailCompanyAddressInsertData(iid, address_data)
{
    var sql = 'INSERT INTO tbl_ipodetail (iid, company_address) VALUES ('+iid+', "'+address_data+'")';  
    connection.query(sql, function (err, result) {  
        if (err) throw err;  
        console.log("1 record inserted");  
        console.log("Row inserted with id = "
            + result.insertId);
        });  
}

function detailCompanyAddressUpdateData(iid, address_data)
{
    var records = [address_data, iid];
    var sql = 'UPDATE tbl_ipodetail SET company_address = ? WHERE iid = ?';  
    connection.query(sql,records, function (err, result) {  
        if (err) throw err;  
        console.log("1 record updated");  
        });  
}

function checkRegistrarData(iid, registerName)
{
    var sql = "SELECT * FROM tbl_register WHERE register_name LIKE '%"+registerName+"%'";
    connection.query(sql, function(err, row) {
      if(err) {
          console.warn('Error in DB');
          console.debug(err);
          return;
      } else {
          if (row && row.length > 0 ) {
              console.log('Row was found!');
              updateRegistrarData(iid, row[0].rid);
          } else {
              console.log('Row was not found :( !');
          }
      }
    });
}

function updateRegistrarData(iid, rid)
{
    var records = [rid, iid];
    var sql = 'UPDATE tbl_ipodetail SET rid = ? WHERE iid = ?';  
    connection.query(sql,records, function (err, result) {  
        if (err) throw err;  
        console.log("1 record updated");  
        }); 
}

function checkLeadManagerData(iid, leadManagerName)
{
    var sql = "SELECT * FROM tbl_leadmanager WHERE manager_name LIKE '%"+leadManagerName+"%'";
    connection.query(sql, function(err, row) {
      if(err) {
          console.warn('Error in DB');
          console.debug(err);
          return;
      } else {
          if (row && row.length ) {
              console.log('Row was found!');
              checkRelationIPOLeadManagerData(iid, row[0].lmid);
          } else {
              console.log('Row was not found :( !');
              insertLeadManagerData(iid, leadManagerName);
          }
      }
    });
}

function insertLeadManagerData(iid, leadManagerName)
{
    var sql = 'INSERT INTO tbl_leadmanager (manager_name) VALUES ("'+leadManagerName+'")';  
    connection.query(sql, function (err, result) {  
        if (err) throw err;  
        console.log("1 record inserted");  
        console.log("Row inserted with id = "
            + result.insertId);
            insertRelationIPOLeadManagerData(iid, result.insertId);
        });  
}

function checkRelationIPOLeadManagerData(iid, lmid)
{
    var sql = "SELECT * FROM tbl_relation_ipo_leadmanager WHERE iid = "+iid+" AND lmid ="+lmid;
    connection.query(sql, function(err, row) {
      if(err) {
          console.warn('Error in DB');
          console.debug(err);
          return;
      } else {
          if (row && row.length ) {
              console.log('Row was found!');
          } else {
              console.log('Row was not found :( !');
              insertRelationIPOLeadManagerData(iid, lmid);
          }
      }
    });
}

function insertRelationIPOLeadManagerData(iid, lmid)
{
    var sql = 'INSERT INTO tbl_relation_ipo_leadmanager (iid, lmid) VALUES ('+iid+', '+lmid+')';   
    connection.query(sql, function (err, result) {  
        if (err) throw err;  
        console.log("1 record inserted");  
        console.log("Row inserted with id = "
            + result.insertId);
        });  
}

function getIpoData(iid, callback)
{
    var sql = "SELECT * FROM tbl_ipo WHERE iid="+iid;  
    connection.query(sql, function(err, row) {
      if(err) {
          console.warn('Error in DB');
          console.debug(err);
          return;
      } else {
          if (row && row.length ) {
              console.log('Row was found!');
              return callback(row[0]);
          } else {
              console.log('Row was not found :( !');
              return callback(null);
          }
      }
    });
}

function getRunningOpenIpoData(today_date, callback)
{
    console.log('getRunningOpenIpoData');
    var sql = "SELECT * FROM tbl_ipo where start_date <= '"+today_date+"' and end_date >= '"+today_date+"' and isactive = 0 and isdelete = 0";  
    connection.query(sql, function(err, row) {
      if(err) {
          console.warn('Error in DB');
          console.debug(err);
          return;
      } else {
          if (row && row.length ) {
              console.log('Row was found!');
              return callback(row);
          } else {
              console.log('Row was not found :( !');
              return callback(null);
          }
      }
    });
}

module.exports = {
    subscriptionInsertUpdate,
    ipoDatesUpdate,
    lotSizeInsertUpdate,
    valuationInsertUpdate,
    shareOfferedInsertUpdate,
    detailReservationInsertUpdate,
    detailFinancialInfoInsertUpdate,
    detailObjectivesInsertUpdate,
    detailsInsertUpdate,
    promotorHoldingInsertUpdate,
    gmpInsertUpdate,
    checkMarketMakerData,
    detailCompanyAddressInsertUpdate,
    checkRegistrarData,
    checkLeadManagerData,
    getIpoData,
    getRunningOpenIpoData
}