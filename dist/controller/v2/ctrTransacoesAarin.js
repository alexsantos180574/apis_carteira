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
const funcoes_1 = require("../../models/funcoes");
const helper_1 = require("../../infra/helper");
const mdlTransacoes_1 = require("../../models/mdlTransacoes");
const ISPB_Bs2 = '28650236';
const Conta_BS2 = '00000000550';
const Agencia_BS2 = '0001';
const TipoConta = 'ContaCorrente';
const nomeBS2 = 'InfSmart Tecnologias';
const numeroDocumentoBs2 = '03613195763';
const tipoDocumentoBS2 = 'CPF';
const infoPagadorBs2 = 'PIX Via MyClube';
function executarEndPoint(token, obj, res, pUrl, pData, Method) {
    return __awaiter(this, void 0, void 0, function* () {
        var axios = require('axios');
        var config = {
            method: Method,
            url: pUrl,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: pData
        };
        return axios(config)
            .then(function (response) {
            return response.data;
        })
            .catch(function (error) {
            console.log('Erro: ' + error);
            helper_1.default.sendErro(res, 401, 'Falha ao executar o procedimento. Erro: ' + error);
        });
    });
}
function efetuarPixCobranca(token, obj, res, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        var url = 'https://pix.aarin.com.br/api/v1/cob';
        var data = JSON.stringify({
            "calendario": {
                "expiracao": 7200
            },
            "regrasSplit": [],
            "devedor": {
                "nome": obj.nome,
                "cpf": obj.cpf
            },
            "valor": {
                "original": obj.valor
            },
            "chave": numeroDocumentoBs2,
            "solicitacaoPagador": "Credito conta Piraque Digital",
            "infoAdicionais": [
                {
                    "nome": obj.cliente,
                    "valor": obj.conta
                }
            ]
        });
        executarEndPoint(token, obj, res, url, data, 'post')
            .then(ret => {
            const objeto = JSON.parse(JSON.stringify(ret));
            const retorno = { status: objeto.status, txid: objeto.txId, linkqrcode: objeto.links.linkQrCode, copicola: objeto.links.emv };
            //console.log(retorno);
            //console.log(objeto); 
            //console.log(obj);
            mdlTransacoes_1.gravaCobrancaPixGerada(res, objeto, client_id);
        });
    });
}
function efetuarPixDestino(token, obj, res, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        var url = 'https://pix.aarin.com.br/api/v1/pix/destino';
        var data = JSON.stringify({
            "recebedor": {
                "nome": nomeBS2,
                "agencia": Agencia_BS2,
                "numeroConta": Conta_BS2,
                "ispb": ISPB_Bs2,
                "numeroDocumento": numeroDocumentoBs2,
                "tipoDocumento": tipoDocumentoBS2,
                "tipoConta": TipoConta
            },
            "chave": {
                "valor": obj.valorchave,
                "tipoChave": obj.tipoChave
            },
            "valor": obj.valor,
            "infoPagador": infoPagadorBs2
        });
        executarEndPoint(token, obj, res, url, data, 'post')
            .then(ret => {
            const objeto = JSON.parse(JSON.stringify(ret));
            //console.log(objeto);
            mdlTransacoes_1.gravarPixDestino(res, objeto, client_id, obj);
        });
    });
}
function efetuarPixDestinoConta(token, obj, res, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        var url = 'https://pix.aarin.com.br/api/v1/pix/destino';
        var data = JSON.stringify({
            "recebedor": {
                "nome": obj.nome,
                "agencia": obj.agencia,
                "numeroConta": obj.num_conta,
                "ispb": obj.ispb,
                "numeroDocumento": obj.cpf,
                "tipoDocumento": "CPF",
                "tipoConta": obj.tipo_conta
            },
            "valor": obj.valor,
            "infoPagador": "MyClubePay " + obj.info
        });
        //console.log(data);
        executarEndPoint(token, obj, res, url, data, 'post')
            .then(ret => {
            const objeto = JSON.parse(JSON.stringify(ret));
            //console.log(objeto);
            mdlTransacoes_1.gravarPixDestino(res, objeto, client_id, obj);
        });
    });
}
function confirmaPixDestino(token, req, res, client_id) {
    return __awaiter(this, void 0, void 0, function* () {
        var url = `https://pix.aarin.com.br/api/v1/pix/${req.params.pixid}`;
        var data = JSON.stringify({});
        executarEndPoint(token, req, res, url, data, 'put')
            .then(ret => {
            const objeto = JSON.parse(JSON.stringify(ret));
            mdlTransacoes_1.pixDestinoEnviado(res, objeto);
        });
    });
}
class ctrTransacoes {
    criarPixCobranca(req, res) {
        let obj = req.body;
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                funcoes_1.obterTokenAarin()
                    .then(token => {
                    efetuarPixCobranca(token.accessToken, obj, res, msg.client_id);
                });
            }
            else {
                res.status(400).send({ erro: msg.retorno, status: false });
            }
        })
            .catch(erro => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
    listarPixCobranca(req, res) {
        let obj = req.body;
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                mdlTransacoes_1.listarCobrancasPix(res, obj, msg.client_id);
            }
            else {
                res.status(400).send({ erro: msg.retorno, status: false });
            }
        })
            .catch(erro => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
    listarPixDestino(req, res) {
        let obj = req.body;
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                mdlTransacoes_1.listaPIXDestino(res, obj, msg.client_id);
            }
            else {
                res.status(400).send({ erro: msg.retorno, status: false });
            }
        })
            .catch(erro => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
    criarPixDestino(req, res) {
        let obj = req.body;
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                funcoes_1.obterTokenAarin()
                    .then(token => {
                    efetuarPixDestino(token.accessToken, obj, res, msg.client_id);
                });
            }
            else {
                res.status(400).send({ erro: msg.retorno, status: false });
            }
        })
            .catch(erro => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
    criarPixDestinoConta(req, res) {
        let obj = req.body;
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                funcoes_1.obterTokenAarin()
                    .then(token => {
                    efetuarPixDestinoConta(token.accessToken, obj, res, msg.client_id);
                });
            }
            else {
                res.status(400).send({ erro: msg.retorno, status: false });
            }
        })
            .catch(erro => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
    confirmarPixDestino(req, res) {
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                funcoes_1.obterTokenAarin()
                    .then(token => {
                    confirmaPixDestino(token.accessToken, req, res, msg.client_id);
                });
            }
            else {
                res.status(400).send({ erro: msg.retorno, status: false });
            }
        })
            .catch(erro => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
}
exports.default = new ctrTransacoes();
