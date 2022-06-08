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
function getExtrato(res, _id, _pagenumber, _pagerows) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = require('mssql');
        // connect to your database
        sql.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            // create Request object
            var request = new sql.Request();
            // query to the database and get the records
            let strSql = " DECLARE @PageNumber AS INT, @RowspPage AS INT ";
            strSql += " SET @PageNumber = " + _pagenumber;
            strSql += " SET @RowspPage = " + _pagerows;
            strSql += " SELECT * FROM ( ";
            strSql += " SELECT ROW_NUMBER() OVER(ORDER BY MOV.ID_MOV_CONTA_BANCARIA DESC) AS NUMBER, MOV.ID_ORIGEM_TRANSACAO, ORI.DESC_ORIGEM_TRANSACAO, MOV.DATA_TRANSACAO, MOV.ID_MOV_CONTA_BANCARIA, MOV.VALOR, TIT.NOME,TIT.NUM_CPF_CNPJ, MOV.TIPO_TRANSACAO, ";
            strSql += " STT.DESC_STATUS_TRANSACAO, NOME_DESTINO, DOCUMENTO_DESTINO, INSTITUICAO_DESTINO, AGENCIA_DESTINO, CONTA_DESTINO, TIPO_CONTA_DESTINO, ";
            strSql += " MOV.HASH_TOKEN_VOUCHER, MOV.CODIGO_DE_BARRAS, MOV.DESCRICAO, SUBSTRING(MOV.CODIGO_VALIDADOR, 1, 50) AS CODIGO_VALIDADOR ";
            strSql += " FROM TB_CLIENTES_TITULAR TIT ";
            strSql += " INNER JOIN TB_CONTAS_BANCARIAS CON ON TIT.ID_CLIENTE_TITULAR = CON.ID_CLIENTE_TITULAR AND CON.NUM_CONTA = '" + _id + "'";
            strSql += " INNER JOIN TB_MOV_CONTA_BANCARIA MOV ON MOV.NUM_CONTA = CON.NUM_CONTA ";
            strSql += " INNER JOIN TB_ORIGEM_TRANSACOES ORI ON MOV.ID_ORIGEM_TRANSACAO = ORI.ID_ORIGEM_TRANSACAO ";
            strSql += " LEFT JOIN	TB_STATUS_TRANSACAO STT   ON MOV.ID_STATUS_TRANSACAO = STT.ID_STATUS_TRANSACAO ";
            strSql += " ) AS TBL ";
            strSql += " WHERE NUMBER BETWEEN ((@PageNumber - 1) * @RowspPage + 1) AND (@PageNumber * @RowspPage) ";
            strSql += " ORDER BY ID_MOV_CONTA_BANCARIA DESC ";
            ///strSql += " WHERE TIT.NUM_CONTA = '"+_id+"'";
            ///console.log(strSql);
            request.query(strSql, function (err, data) {
                if (err)
                    console.log(err);
                helper_1.default.sendExtrato(res, HttpStatus.OK, data.recordset);
            });
        });
    });
}
class ctrExtrato {
    getExtratoId(req, res) {
        getExtrato(res, req.params.conta, req.params.pagenumber, req.params.pagerows);
    }
}
exports.default = new ctrExtrato();
