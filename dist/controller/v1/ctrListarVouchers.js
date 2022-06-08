"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../infra/helper");
function obterListaVouchers(res, obj, documento, tiporetorno) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = require('mssql');
        sql.connect(helper_1.default.configSql, function (err) {
            if (err) {
                console.log(err);
                helper_1.default.sendErro(res, 500, 'Ocorreu um problema interno, por favor, tente mais tarde!');
            }
            else {
                var request = new sql.Request();
                let strSql = " SELECT ID_VAUCHER as idvoucher,NUM_CPF as numcpf,CODIGO_VAUCHER as codvoucher,VALOR_VAUCHER as valorvoucher, DATA_VAUCHER as datavoucher, CODIGO_RASH as codigorash,RESGATADO as resgatado, DATA_RESGATE as dataresgate ";
                strSql += ` FROM TB_VOUCHERS_KICKSTART `;
                strSql += `   WHERE NUM_CPF = '${documento}' `;
                if (tiporetorno == 'validos') {
                    strSql += `     AND DATA_RESGATE IS NULL `;
                }
                else {
                    strSql += `     AND DATA_RESGATE IS NOT NULL `;
                }
                request.query(strSql, function (err, data) {
                    if (err) {
                        console.log(err);
                        helper_1.default.sendErro(res, 500, 'Ocorreu um problema interno, por favor, tente mais tarde!');
                    }
                    else {
                        helper_1.default.sendResponse(res, 200, data.recordset);
                    }
                });
            }
        });
    });
}
class ctrListarVouchers {
    listarVouchers(req, res) {
        let obj = req.body;
        obterListaVouchers(res, obj, req.params.documento, req.params.tiporetorno);
    }
}
exports.default = new ctrListarVouchers();
