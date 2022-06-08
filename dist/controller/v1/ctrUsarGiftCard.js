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
function usaGiftCard(res, obj, token, codgiftcard) {
    return __awaiter(this, void 0, void 0, function* () {
        var tratarCampos = '';
        var codigoGiftCard = (codgiftcard != '' ? codgiftcard : tratarCampos = 'codigogiftcard');
        var clientid = (obj.client_id != '' ? obj.client_id : tratarCampos = 'client_id');
        if (tratarCampos == '') {
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
                    let strSql = ` SELECT ACCESS_TOKEN `;
                    strSql += `FROM TB_TOKENS `;
                    strSql += ` WHERE ACCESS_TOKEN = '${token}' AND VALIDO = 'S' `;
                    //console.log(strSql);
                    request.query(strSql, function (err, data) {
                        if (err) {
                            console.log(err);
                            helper_1.default.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
                        }
                        else {
                            if (data.rowsAffected[0] > 0) {
                                let strSqlU = ` UPDATE TB_GIFT_CARDS SET GIFT_USADO = 'S', DATA_USO_GIFT = GETDATE(), CLIENT_ID_USO = '${clientid}' WHERE CODIGO_GIFT_CARD = '${codigoGiftCard}' `;
                                //console.log(strSqlU);
                                request.query(strSqlU, function (err, dataG) {
                                    if (err) {
                                        console.log(err);
                                        helper_1.default.sendErro(res, 500, 'Falha ao utilizar GiftCard!');
                                    }
                                    else {
                                        if (dataG.rowsAffected[0] > 0) {
                                            helper_1.default.sendResponse(res, 201, 'Gift Card Utilizado com sucesso!');
                                        }
                                        else {
                                            helper_1.default.sendNaoEncontradoMsgPersonalizada(res, 401, 'Gift Card não encontrado');
                                        }
                                    }
                                });
                            }
                            else {
                                helper_1.default.sendNaoEncontradoMsgPersonalizada(res, 401, { erro: 'Token inválido ou já foi utilizado!' });
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
class ctrUsarGiftCard {
    utilizarGiftCard(req, res) {
        let token = req.headers.authorization.replace("Bearer ", "");
        let obj = req.body;
        if (token) {
            const sql = require('mssql');
            sql.connect(helper_1.default.configSql, function (err) {
                if (err) {
                    console.log(err);
                    helper_1.default.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
                }
                else {
                    var request = new sql.Request();
                    // query to the database and get the records
                    let strSql = ` SELECT TOP 1 CODIGO_GIFT_CARD `;
                    strSql += `FROM TB_GIFT_CARDS `;
                    strSql += ` WHERE CODIGO_GIFT_CARD = '${req.params.codgiftcard}' AND (DATA_CANCELAMENTO_GIFT IS NOT NULL OR GIFT_USADO = 'S') `;
                    ///console.log(strSql);
                    request.query(strSql, function (err, data) {
                        if (err) {
                            console.log(err);
                            helper_1.default.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
                            return false;
                        }
                        else {
                            if (data.rowsAffected[0] > 0) {
                                helper_1.default.sendNaoEncontradoMsgPersonalizada(res, 401, 'Gift Card inválido');
                            }
                            else {
                                usaGiftCard(res, obj, token, req.params.codgiftcard);
                            }
                        }
                    });
                }
            });
        }
        else {
            res.status(400).send({ erro: `o TOKEN é obrigatório!`, status: false });
        }
    }
}
exports.default = new ctrUsarGiftCard();
