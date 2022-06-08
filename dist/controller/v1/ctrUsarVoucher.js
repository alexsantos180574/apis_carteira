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
function creditarEmConta(res, num_conta, codigovoucher, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = require('mssql');
        sql.connect(helper_1.default.configSql, function (err) {
            if (err) {
                console.log(err);
                helper_1.default.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
            }
            // create Request object
            var request = new sql.Request();
            let codehash = helper_1.default.getHash();
            // query to the database and get the records
            let strSql = `DECLARE @VALOR NUMERIC(18,2), @NOSSO_NUMERO VARCHAR(70), @AGENCIA_DESTINO varchar(10)
        SELECT @VALOR = VALOR_VAUCHER FROM TB_VOUCHERS_KICKSTART WHERE CODIGO_VAUCHER = '${codigovoucher}'
        
          INSERT INTO dbo.TB_MOV_CONTA_BANCARIA
                (VALOR
                ,TIPO_TRANSACAO
                ,ID_ORIGEM_TRANSACAO
                ,ID_STATUS_TRANSACAO
                ,NUM_CONTA
                ,CODIGO_VALIDADOR
                ,NOSSO_NUMERO
                ,CLIENT_ID
                ,DESCRICAO)
          VALUES(@VALOR, 'E', 9, 13, '${num_conta}', '${codehash}', '${codigovoucher}', '${client_id}', 'Resgate de Voucher')`;
            //console.log(strSql);
            request.query(strSql, function (err, data) {
                if (err) {
                    console.log(err);
                    helper_1.default.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
                }
                else {
                    helper_1.default.sendResponse(res, 201, 'Voucher Resgatado com sucesso!');
                }
            });
        });
    });
}
function usaVoucher(res, obj, token) {
    return __awaiter(this, void 0, void 0, function* () {
        var tratarCampos = '';
        var codigovoucher = (obj.codigovoucher != '' ? obj.codigovoucher : tratarCampos = 'codigovoucher');
        var clientid = (obj.client_id != '' ? obj.client_id : tratarCampos = 'client_id');
        var num_conta = (obj.num_conta != '' ? obj.num_conta : tratarCampos = 'num_conta');
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
                    /*
                    let strSql  = ` SELECT ACCESS_TOKEN `;
                    strSql     += `FROM TB_TOKENS `;
                    strSql     += ` WHERE ACCESS_TOKEN = '${token}' AND VALIDO = 'S' `;
                    request.query(strSql, function (err, data) {
                        
                        if (err){
                            console.log(err);
                            Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
                        }else{
                            if(data.rowsAffected[0] > 0){
                                */
                    let strSqlU = ` UPDATE TB_VOUCHERS_KICKSTART SET RESGATADO = 'S', DATA_RESGATE = GETDATE(), CLIENT_ID = '${clientid}' WHERE CODIGO_VAUCHER = '${codigovoucher}' `;
                    //console.log(strSqlU);
                    request.query(strSqlU, function (err, dataG) {
                        if (err) {
                            console.log(err);
                            helper_1.default.sendErro(res, 500, 'Falha ao utilizar Voucher!');
                        }
                        else {
                            creditarEmConta(res, num_conta, codigovoucher, clientid);
                        }
                    });
                    /*        }else{
                                Helper.sendNaoEncontradoMsgPersonalizada(res, 401, {erro:'Token inválido ou já foi utilizado!'});
                            }
                        }
                    }); */
                }
            });
        }
        else {
            //console.log('teste 05'+tratarCampos);
            res.status(400).send({ erro: `o campo "${tratarCampos}" e obrigatorio!`, status: false });
        }
    });
}
class ctrUsarVoucher {
    utilizarVoucher(req, res) {
        let token = ""; //req.headers.authorization.replace("Bearer ", "");
        let obj = req.body;
        //if(token){
        const sql = require('mssql');
        sql.connect(helper_1.default.configSql, function (err) {
            if (err) {
                console.log(err);
                helper_1.default.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
            }
            else {
                var request = new sql.Request();
                // query to the database and get the records
                let strSql = ` SELECT TOP 1 ID_VAUCHER `;
                strSql += `FROM TB_VOUCHERS_KICKSTART `;
                strSql += ` WHERE CODIGO_VAUCHER = '${obj.codigovoucher}' AND RESGATADO = 'N' `;
                //console.log(strSql);
                request.query(strSql, function (err, data) {
                    if (err) {
                        console.log(err);
                        helper_1.default.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
                    }
                    else {
                        if (data.rowsAffected[0] > 0) {
                            usaVoucher(res, obj, token);
                        }
                        else {
                            helper_1.default.sendNaoEncontradoMsgPersonalizada(res, 401, 'Voucher inválido, não encontrado ou já utilizado!');
                        }
                    }
                });
            }
        });
        // }else{
        //     res.status(400).send({erro: `o TOKEN é obrigatório!`, status: false})
        // }
    }
}
exports.default = new ctrUsarVoucher();
