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
function novoGiftCard(res, obj, token) {
    return __awaiter(this, void 0, void 0, function* () {
        var tratarCampos = '';
        let client_id = (obj.client_id != '' ? obj.client_id : tratarCampos = 'client_id');
        let valor = (obj.valor != '' ? obj.valor : tratarCampos = 'valor');
        let conta = (obj.conta != '' ? obj.conta : tratarCampos = 'conta');
        let documento = (obj.documento != '' ? obj.documento : tratarCampos = 'documento');
        if (tratarCampos == '') {
            let codehash = helper_1.default.getCodGiftCard(); //Helper.getCodGiftCard;//Helper.gerarCodVerificacao(100000000000, 999999999999);
            const sql = require('mssql');
            sql.connect(helper_1.default.configSql, function (err) {
                if (err) {
                    console.log(err);
                    helper_1.default.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
                }
                else {
                    var request = new sql.Request();
                    let strSql = ` SELECT TOP 1 ACCESS_TOKEN `;
                    strSql += `FROM TB_TOKENS `;
                    ///strSql     += ` WHERE ACCESS_TOKEN = '${token}' AND VALIDO = 'S' `; não necessita de token para os Apps
                    //console.log(strSql);
                    request.query(strSql, function (err, data) {
                        if (err) {
                            console.log(err);
                            helper_1.default.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
                        }
                        else {
                            if (data.rowsAffected[0] > 0) {
                                let sqlStrT = ` INSERT INTO TB_GIFT_CARDS(CODIGO_GIFT_CARD, CLIENT_ID, TOKEN_VALIDACAO, VALOR_GIFT, NUM_CONTA, DOCUMENTO) VALUES ( '${codehash}', '${client_id}','${token}', ${valor}, '${conta}', '${documento}' ) `;
                                //console.log(sqlStr); 
                                request.query(sqlStrT, function (err, data) {
                                    if (err) {
                                        console.log(err);
                                        helper_1.default.sendErro(res, 500, 'Falha ao gerar GiftCard!');
                                    }
                                    else {
                                        helper_1.default.sendResponse(res, 201, { codigo_giftcard: codehash, mensagem: "" });
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
class ctrCadGiftCardKickPay {
    incGiftCard(req, res) {
        var obj = req.body;
        let token = '1'; //req.headers.authorization.replace("Bearer ", "");
        if (token) {
            novoGiftCard(res, obj, token);
        }
        else {
            res.status(400).send({ erro: `o TOKEN é obrigatório!`, status: false });
        }
    }
}
exports.default = new ctrCadGiftCardKickPay();
