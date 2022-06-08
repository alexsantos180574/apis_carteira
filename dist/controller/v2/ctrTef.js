"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const funcoes_1 = require("../../models/funcoes");
const mdlTransacoes_1 = require("../../models/mdlTransacoes");
class ctrTEF {
    post(req, res) {
        let obj = req.body;
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                funcoes_1.retornarSaldo(obj.conta_origem, msg.client_id)
                    .then(saldo => {
                    if (saldo >= 0) {
                        funcoes_1.retornarSaldo(obj.conta_destino, msg.client_id)
                            .then(ret => {
                            if (ret == -1) {
                                res.status(400).send({ erro: 'Conta DESTINO inexistente!', status: false });
                            }
                            else {
                                if (obj.valor > saldo) {
                                    res.status(400).send({ erro: 'Saldo insuficiente!', status: false });
                                }
                                else {
                                    mdlTransacoes_1.emitirTEF(res, obj, msg.client_id, msg.token);
                                }
                            }
                        });
                    }
                    else {
                        res.status(400).send({ erro: 'Conta ORIGEM inexistente!', status: false });
                    }
                });
            }
            else {
                res.status(400).send({ erro: msg.retorno, status: false });
            }
        })
            .catch(error => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
    getDadosCliente(req, res) {
        let arrExcessao = [];
        let obj = req.body;
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                mdlTransacoes_1.obterInfoClientePara(res, obj, msg.client_id);
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
exports.default = new ctrTEF();
