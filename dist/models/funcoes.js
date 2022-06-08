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
exports.obterTokenAarin = exports.retornaDataVencimentoBoleto = exports.sleep = exports.retornarSaldo = exports.validarInformacoes = void 0;
const helper_1 = require("../infra/helper");
const mdlComandosSql_1 = require("../models/mdlComandosSql");
function validarInformacoes(res, req, arrExcessao) {
    return __awaiter(this, void 0, void 0, function* () {
        let obj = req.body;
        let tratarCampos = helper_1.default.tratarCamposObrigatorios(obj, arrExcessao);
        if (typeof (req.headers.client_id) != "undefined") {
            var client_id = req.headers.client_id.replace("client_id ", "");
            let strSql = ` select * from tb_dados_parceiro where client_id = '${client_id}' `;
            return mdlComandosSql_1.GET(strSql)
                .then(ret => {
                if (ret.rowsAffected[0] > 0) {
                    if (tratarCampos) {
                        return { retorno: `O campo "${tratarCampos}" e obrigatorio!`, token: '', client_id: client_id };
                    }
                    ;
                    if (typeof (req.headers.authorization) != "undefined") {
                        let token = req.headers.authorization.replace("Bearer ", "");
                        return mdlComandosSql_1.validarTokenSync(token)
                            .then(ret => {
                            if (ret.rowsAffected[0] <= 0) {
                                return { retorno: `O TOKEN informado é inválido ou já foi utilizado!`, token: token, client_id: client_id };
                            }
                            else {
                                return { retorno: 'OK', token: token, client_id: client_id };
                            }
                        });
                    }
                    else {
                        return { retorno: `o TOKEN é obrigatório!`, token: '', client_id: '' };
                    }
                }
                else {
                    return { retorno: `O client_id informado é inválido : ${client_id}.`, token: '', client_id: '' };
                }
            });
        }
        else {
            return { retorno: `O ClientID é obrigatório!`, token: '', client_id: '' };
        }
    });
}
exports.validarInformacoes = validarInformacoes;
function retornarSaldo(numConta, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let strSql = ` select saldo_conta as saldo from tb_contas_bancarias where num_conta = '${numConta}'`;
        return mdlComandosSql_1.GET(strSql)
            .then(ret => {
            if (ret.rowsAffected[0] > 0) {
                return ret.recordset[0].saldo;
            }
            else {
                return -99999999;
            }
        });
    });
}
exports.retornarSaldo = retornarSaldo;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
function retornaDataVencimentoBoleto() {
    return __awaiter(this, void 0, void 0, function* () {
        let strSql = ` select convert(DATE, getdate()+2, 23) data_atual `;
        return mdlComandosSql_1.GET(strSql)
            .then(ret => {
            if (ret.rowsAffected[0] > 0) {
                return ret.recordset[0].data_atual;
            }
            else {
                return -1;
            }
        });
    });
}
exports.retornaDataVencimentoBoleto = retornaDataVencimentoBoleto;
function obterTokenAarin() {
    var axios = require('axios');
    var data = '{"empresaId": "f4ebee60-ddbf-4290-8a42-0cd4ad80fc1a","senha": "sr1C4KKyowFR0Ur6LWR6K724TqhPRlv9","escopo": ["cob.write","cob.read","pix.write","pix.read","webhook.write","webhook.read","account.read","destiny.account.read","destiny.account.write"]}';
    var config = {
        method: 'post',
        url: 'https://pix.aarin.com.br/api/v1/oauth/token',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    return axios(config)
        .then(function (response) {
        //console.log(JSON.stringify(response.data));
        return response.data;
    })
        .catch(function (error) {
        console.log(error);
        return error;
    });
}
exports.obterTokenAarin = obterTokenAarin;
