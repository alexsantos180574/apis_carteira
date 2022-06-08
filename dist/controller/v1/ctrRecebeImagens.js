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
////import mdlExtrato from "../models/mdlExtrato";
const helper_1 = require("../../infra/helper");
const HttpStatus = require("http-status");
function atualizafotoperfil(res, documento, client_id, nomefoto) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = require('mssql');
        const clientid = ((typeof (client_id) == "undefined" ? '' : (client_id == '' ? '' : client_id)));
        sql.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            // create Request object
            var request = new sql.Request();
            // query to the database and get the records
            let strSql = `UPDATE TB_CLIENTES_TITULAR SET IMG_FOTO_FACE_BASE64 = '${nomefoto}', CLIENT_ID = '${clientid}' WHERE NUM_CPF_CNPJ = '${documento}' `;
            ///console.log(strSql);
            request.query(strSql, function (err, data) {
                if (err) {
                    console.log(err);
                    res.status(500).send({ erro: 'Erro ao enviar foto!' });
                }
                else {
                    helper_1.default.sendResponse(res, HttpStatus.OK, 'Foto enviada com sucesso!');
                }
            });
        });
    });
}
class ctrRecebeImagens {
    validarImagens(req, res) {
        atualizafotoperfil(res, req.params.documento, req.params.client_id, req.file.originalname);
    }
}
exports.default = new ctrRecebeImagens();
