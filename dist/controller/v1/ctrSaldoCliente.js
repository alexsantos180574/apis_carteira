"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../infra/helper");
const HttpStatus = require("http-status");
class ctrSaldoCliente {
    exibirSaldoCliente(req, res) {
        const sql = require('mssql');
        sql.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            // create Request object
            var request = new sql.Request();
            // query to the database and get the records
            let strSql = `SELECT SALDO_CONTA AS saldo FROM TB_CONTAS_BANCARIAS WHERE NUM_CONTA = '${req.params.conta}'`;
            //console.log(strSql);
            request.query(strSql, function (err, data) {
                if (err)
                    console.log(err);
                helper_1.default.sendSaldo(res, HttpStatus.OK, data.recordset);
            });
        });
    }
}
exports.default = new ctrSaldoCliente();
