import Helper from "../infra/helper";
import { validarTokenSync, GET } from "../models/mdlComandosSql";

export async function validarInformacoes(res, req, arrExcessao) {
    let obj = req.body;
    let tratarCampos = Helper.tratarCamposObrigatorios(obj, arrExcessao);
    if (typeof (req.headers.client_id) != "undefined") {
        var client_id = req.headers.client_id.replace("client_id ", "");

        let strSql = ` select * from tb_dados_parceiro where client_id = '${client_id}' `;
        return GET(strSql)
            .then(ret => {
                if (ret.rowsAffected[0] > 0) {
                    if (tratarCampos) { return { retorno: `O campo "${tratarCampos}" e obrigatorio!`, token: '', client_id: client_id } };

                    if (typeof (req.headers.authorization) != "undefined") {
                        let token = req.headers.authorization.replace("Bearer ", "");
                        return validarTokenSync(token)
                            .then(ret => {
                                if (ret.rowsAffected[0] <= 0) {
                                    return { retorno: `O TOKEN informado é inválido ou já foi utilizado!`, token: token, client_id: client_id };
                                } else { return { retorno: 'OK', token: token, client_id: client_id }; }
                            })
                    } else { return { retorno: `o TOKEN é obrigatório!`, token: '', client_id: '' }; }

                } else { return { retorno: `O client_id informado é inválido : ${client_id}.`, token: '', client_id: '' }; }
            })
    } else { return { retorno: `O ClientID é obrigatório!`, token: '', client_id: '' }; }
}

export async function retornarSaldo(numConta, client_id) {
    let strSql = ` select saldo_conta as saldo from tb_contas_bancarias where num_conta = '${numConta}'`;
    return GET(strSql)
        .then(ret => {
            if (ret.rowsAffected[0] > 0) {
                return ret.recordset[0].saldo;
            } else {
                return -99999999;
            }
        });
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function retornaDataVencimentoBoleto(){
    let strSql = ` select convert(DATE, getdate()+2, 23) data_atual `;
    return GET(strSql)
        .then(ret => {
            if (ret.rowsAffected[0] > 0) {
                return ret.recordset[0].data_atual;
            } else {
                return -1;
            }
        });
}

export function obterTokenAarin() {
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