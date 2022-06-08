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
function validaGiftCard(res, obj, token) {
    return __awaiter(this, void 0, void 0, function* () {
        var tratarCampos = '';
        var codigoGiftCard = (obj.codigogiftcard != '' ? obj.codigogiftcard : tratarCampos = 'codigogiftcard');
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
                                let strSql = ` SELECT CODIGO_GIFT_CARD as giftcardcodigo, CONVERT(VARCHAR(10), DATA_CRIACAO_GIFT, 103) as datacriacao, VALOR_GIFT as valor,  `;
                                strSql += `       CASE WHEN GIFT_USADO = 'S' THEN 'Este Gift Card já foi utilizado.' WHEN DATA_CANCELAMENTO_GIFT IS NOT NULL THEN 'Gift Card Cancelado' ELSE 'Gift Card válido' END AS statusgiftcard `;
                                strSql += `      ,DATA_USO_GIFT as datauso, CONVERT(VARCHAR(10), DATA_CANCELAMENTO_GIFT, 103) as datacancelamento, MOTIVO_CANCELAMENTO_GIFT as motivocancelamento `;
                                strSql += `FROM TB_GIFT_CARDS `;
                                strSql += ` WHERE CODIGO_GIFT_CARD = '${codigoGiftCard}' `;
                                ///console.log(strSql);
                                request.query(strSql, function (err, dataG) {
                                    if (err) {
                                        console.log(err);
                                        helper_1.default.sendErro(res, 500, 'Falha ao validar GiftCard!');
                                    }
                                    else {
                                        if (dataG.rowsAffected[0] > 0) {
                                            helper_1.default.sendResponse(res, 201, dataG.recordset);
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
class ctrValidarGiftCard {
    validarGiftCard(req, res) {
        //console.log(req.headers.authorization);
        if (typeof (req.headers.authorization) != "undefined") {
            let token = req.headers.authorization.replace("Bearer ", "");
            let obj = req.body;
            if (token) {
                validaGiftCard(res, obj, token);
            }
            else {
                res.status(400).send({ erro: `o TOKEN é obrigatório!`, status: false });
            }
        }
        else {
            ///console.log(`o TOKEN é obrigatório!`);
            res.status(400).send({ erro: `o TOKEN é obrigatório!`, status: false });
        }
    }
}
exports.default = new ctrValidarGiftCard();
