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
function novoVaucher(res, obj, token) {
    return __awaiter(this, void 0, void 0, function* () {
        var tratarCampos = '';
        let client_id = (obj.client_id != '' ? obj.client_id : tratarCampos = 'client_id');
        let valor = (obj.valor != '' ? obj.valor : tratarCampos = 'valor');
        let documento = (obj.documento != '' ? obj.documento : tratarCampos = 'documento');
        let numvaucher = (obj.numvaucher != '' ? obj.numvaucher : tratarCampos = 'numvaucher');
        if (tratarCampos == '') {
            let codehash = helper_1.default.getHash(); //Helper.getCodGiftCard;//Helper.gerarCodVerificacao(100000000000, 999999999999);
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
                                let strSQLU = ` SELECT * FROM TB_CLIENTES_TITULAR WHERE NUM_CPF_CNPJ LIKE '${documento}' `;
                                request.query(strSQLU, function (err, dataU) {
                                    if (err) {
                                        console.log(err);
                                        helper_1.default.sendErro(res, 500, 'Falha ao gravar os dados do vaucher!');
                                    }
                                    else {
                                        if (dataU.rowsAffected[0] > 0) {
                                            let sqlStrT = ` INSERT INTO TB_VOUCHERS_KICKSTART(NUM_CPF, CODIGO_VAUCHER, VALOR_VAUCHER, CODIGO_RASH) VALUES ( '${documento}', '${numvaucher}','${valor}', '${codehash}' ) `;
                                            //console.log(sqlStr); 
                                            request.query(sqlStrT, function (err, data) {
                                                if (err) {
                                                    console.log(err);
                                                    helper_1.default.sendErro(res, 500, 'Falha ao gravar os dados do vaucher!');
                                                }
                                                else {
                                                    helper_1.default.sendResponse(res, 201, { codigoconfirmacao: codehash });
                                                }
                                            });
                                        }
                                        else {
                                            helper_1.default.sendNaoEncontradoMsgPersonalizada(res, 401, { erro: 'O Cliente não possui conta no KickPay! Operação não realizada!' });
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
class ctrResgatarVaucherGiftCard {
    resgatarVaucherGiftCard(req, res) {
        var obj = req.body;
        if (typeof (req.headers.authorization) != "undefined") {
            let token = req.headers.authorization.replace("Bearer ", "");
            let obj = req.body;
            if (token) {
                novoVaucher(res, obj, token);
            }
            else {
                res.status(400).send({ erro: `o TOKEN é obrigatório!`, status: false });
            }
        }
        else {
            //console.log(`o TOKEN é obrigatório!`);
            res.status(400).send({ erro: `o TOKEN é obrigatório!`, status: false });
        }
    }
}
exports.default = new ctrResgatarVaucherGiftCard();
