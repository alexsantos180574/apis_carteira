import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";

class ctrContaExiste{ 
    vefiricarConta(req, res){
        const sql = require('mssql');
        // connect to your database
        sql.connect(Helper.configSql, function (err) {
            if (err) console.log(err);
            // create Request object
            var request = new sql.Request();
            // query to the database and get the records
            let strSql  = `SELECT CASE WHEN count(NUM_CONTA) > 0 THEN 1 ELSE 0 END AS CONTA_EXISTE from TB_CONTAS_BANCARIAS WHERE NUM_CONTA = '${req.params.conta}'`;
            //console.log(strSql);
            request.query(strSql, function (err, data) {
                if (err) console.log(err)
                Helper.sendResponse(res, HttpStatus.OK, data.recordset);
            });
        });
    }
}

export default new ctrContaExiste();