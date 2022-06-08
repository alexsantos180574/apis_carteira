"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const funcoes_1 = require("../../models/funcoes");
const mdlContas_1 = require("../../models/mdlContas");
class contasBancarias {
    getSaldo(req, res) {
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                mdlContas_1.saldo(res, req.params.conta, msg.client_id);
            }
            else {
                res.status(400).send({ erro: msg.retorno, status: false });
            }
        })
            .catch(erro => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
    getExtrato(req, res) {
        let arrExcessao = [];
        //console.log(req.body)
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                mdlContas_1.obterExtratoConta(req, res, msg.client_id);
            }
            else {
                res.status(400).send({ erro: msg.retorno, status: false });
            }
        })
            .catch(erro => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
    getExtratoApp(req, res) {
        let arrExcessao = [];
        //console.log(req.body)
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                mdlContas_1.obterExtratoContaApp(req, res, msg.client_id);
            }
            else {
                res.status(400).send({ erro: msg.retorno, status: false });
            }
        })
            .catch(erro => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
    getlistarBancosAtivos(req, res) {
        let arrExcessao = [];
        //console.log(req.body)
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                mdlContas_1.listarBancosAtivos(req, res, msg.client_id);
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
exports.default = new contasBancarias();
