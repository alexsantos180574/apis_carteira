"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../infra/helper");
const HttpStatus = require("http-status");
class ctrRetornaDataHora {
    retornadata(req, res) {
        const sql = require('mssql');
        // connect to your database
        sql.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            // create Request object
            var request = new sql.Request();
            // query to the database and get the records
            let strSql = ` SELECT DAY(GETDATE()) AS dia, MONTH(GETDATE()) AS mes, YEAR(GETDATE()) AS ano, GETDATE() as datahoraus, convert( varchar(10), GETDATE(), 103)+' '+convert(varchar(8), getdate(), 108) as datahorabr, convert(varchar(10), GETDATE(), 110) as dataus, convert(varchar(10), getdate(), 103) as databr
            `;
            ///console.log(strSql);
            request.query(strSql, function (err, data) {
                if (err)
                    console.log(err);
                helper_1.default.sendResponse(res, HttpStatus.OK, data.recordset);
            });
        });
    }
}
exports.default = new ctrRetornaDataHora();
