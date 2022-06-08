"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../infra/helper");
const HttpStatus = require("http-status");
class ctrUsuarioExiste {
    vefiricarUsuario(req, res) {
        const sql = require('mssql');
        // connect to your database
        sql.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            // create Request object
            var request = new sql.Request();
            // query to the database and get the records
            let strSql = ` SELECT TOP 1 DOC_IDENTIFICACAO as cpf, NOME as nome, EMAIL as email `;
            strSql += `FROM TB_ACESSO_APLICATIVOS `;
            strSql += ` WHERE DOC_IDENTIFICACAO = '${req.params.cpf}'`;
            ///console.log(strSql);
            request.query(strSql, function (err, data) {
                if (err)
                    console.log(err);
                if (data.rowsAffected[0] > 0) {
                    helper_1.default.sendResponse(res, HttpStatus.OK, data.recordset);
                }
                else {
                    helper_1.default.sendNaoEncontrado(res, HttpStatus.OK, 'usuario nao encontrado');
                }
            });
        });
    }
}
exports.default = new ctrUsuarioExiste();
