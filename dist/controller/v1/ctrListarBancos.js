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
const HttpStatus = require("http-status");
function getListaBancos(res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = require('mssql');
        sql.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            var request = new sql.Request();
            let strSql = " SELECT NUM_BANCO AS num_banco, NOME_BANCO AS nome_banco FROM TB_LISTA_BANCOS WHERE ATIVO = 'S' ORDER BY NUM_BANCO ";
            request.query(strSql, function (err, data) {
                if (err)
                    console.log(err);
                helper_1.default.sendResponse(res, HttpStatus.OK, data.recordset);
            });
        });
    });
}
class ctrListarBancos {
    listarBancos(req, res) {
        getListaBancos(res);
    }
}
exports.default = new ctrListarBancos();
