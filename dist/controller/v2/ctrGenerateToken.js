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
        let strSql1 = ` select client_id, senha, nome_parceiro `;
        strSql1 += ` from tb_dados_parceiro `;
        if (tratarCampos == '') {
            let codehash = helper_1.default.getHash();
            const sql = require('mssql');
            sql.connect(helper_1.default.configSql(), function (err) {
                if (err) {
                    console.log(err);
                    helper_1.default.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
                }
                else {
                    var request = new sql.Request();
                    let strSql = ` select client_id, senha, nome_parceiro from tb_dados_parceiro where client_id = '${client_id}' and senha = '${senha}' `;
                    //console.log(strSql);
                    ///Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!'+strSql);
                    request.query(strSql, function (err, data) {
                        if (err) {
                            console.log(err);
                            helper_1.default.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
                        }
                        else {
                            if (data.rowsAffected[0] > 0) {
                                let sqlStrT = ` insert into tb_tokens(access_token, client_id, valido) values( '${codehash}', '${client_id}', 'S') `;
                                request.query(sqlStrT, function (err, dataG) {
                                    if (err) {
                                        console.log(err);
                                        helper_1.default.sendFalha(res, 500, 'Falha ao obter o token!');
                                    }
                                    else {
                                        helper_1.default.sendResponse(res, 201, { token_acesso: codehash, cliente: data.recordset[0].nome_parceiro });
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
            res.status(400).send({ erro: `o campo "${tratarCampos}" e obrigatorio!`, status: false });
        }
    });
}
class ctrGenerateToken {
    geraToken(req, res) {
        var obj = req.body;
        gerarToken(res, obj);
    }
}
exports.default = new ctrGenerateToken();
