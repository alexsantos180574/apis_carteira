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
function getListaFavoritosTED(res, _agencia, _conta) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = require('mssql');
        // connect to your database
        sql.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            // create Request object
            var request = new sql.Request();
            // query to the database and get the records
            let strSql = `SELECT ID_FAVORITOS_CONTAS_TRANSFERENCIAS AS id_favorito
                             ,NUM_BANCO AS num_banco
                             ,NUM_AGENCIA AS num_agencia
                             ,NUM_CONTA AS num_conta
                             ,NOME AS nome
                             ,CPF AS cpf
                             ,convert(varchar(10), DATA_CADASTRO, 103)+' '+convert(varchar(8), DATA_CADASTRO, 108) as data_cadastro
                       FROM TB_FAVORITOS_CONTAS_TRANSFERENCIAS
                       WHERE CONTA_ORIGEM = '${_conta}'
                         AND NUM_AGENCIA_ORIGEM = '${_agencia}'
                         AND NUM_BANCO <> 213
                       ORDER BY DATA_CADASTRO DESC`;
            request.query(strSql, function (err, data) {
                if (err)
                    console.log(err);
                helper_1.default.sendResponse(res, HttpStatus.OK, data.recordset);
            });
        });
    });
}
class ctrListarFavoritosContasTED {
    listarFavoritosTED(req, res) {
        getListaFavoritosTED(res, req.params.agencia.toString(), req.params.conta.toString());
    }
}
exports.default = new ctrListarFavoritosContasTED();
