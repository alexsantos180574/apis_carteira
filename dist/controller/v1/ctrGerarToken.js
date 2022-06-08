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
function gerarToken(res, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        var tratarCampos = '';
        let client_id = (obj.client_id != '' ? obj.client_id : tratarCampos = 'client_id');
        let senha = (obj.senha != '' ? obj.senha : tratarCampos = 'senha');
        if (tratarCampos == '') {
            let codehash = helper_1.default.getHash();
            const sql = require('mssql');
            sql.connect(helper_1.default.configSql, function (err) {
                if (err) {
                    console.log(err);
                    helper_1.default.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
                }
                else {
                    // create Request object
                    var request = new sql.Request();
                    // query to the database and get the records
                    let strSql = ` SELECT CLIENT_ID, SENHA, NOME_PARCEIRO `;
                    strSql += `FROM TB_DADOS_PARCEIRO `;
                    strSql += ` WHERE CLIENT_ID = '${client_id}' AND SENHA = '${senha}' `;
                    //console.log(strSql);
                    request.query(strSql, function (err, data) {
                        if (err) {
                            console.log(err);
                            helper_1.default.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
                        }
                        else {
                            if (data.rowsAffected[0] > 0) {
                                //console.log(data);
                                let sqlStrT = ` INSERT INTO TB_TOKENS(ACCESS_TOKEN, CLIENT_ID) VALUES( '${codehash}', '${client_id}') `;
                                //console.log(sqlStr); 
                                request.query(sqlStrT, function (err, dataG) {
                                    if (err) {
                                        console.log(err);
                                        helper_1.default.sendFalha(res, 500, 'Falha ao obter o token!');
                                    }
                                    else {
                                        helper_1.default.sendResponse(res, 201, { token_acesso: codehash, cliente: data.recordset[0].NOME_PARCEIRO });
                                    }
                                });
                            }
                            else {
                                helper_1.default.sendNaoEncontradoMsgPersonalizada(res, 401, { erro: 'usuario nao encontrado' });
                            }
                        }
                    });
                }
            });
        }
        else {
            //console.log('teste 05'+tratarCampos);
            res.status(400).send({ erro: `o campo "${tratarCampos}" e obrigatorio!`, status: false });
        }
    });
}
class ctrGerarToken {
    geraToken(req, res) {
        var obj = req.body;
        gerarToken(res, obj);
    }
}
exports.default = new ctrGerarToken();
