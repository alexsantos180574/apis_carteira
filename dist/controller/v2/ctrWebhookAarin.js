"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mdlTransacoes_1 = require("../../models/mdlTransacoes");
const funcoes_1 = require("../../models/funcoes");
const mdlTransacoes_2 = require("../../models/mdlTransacoes");
class ctrWebhookAarin {
    cashout(req, res) {
        let obj = req.body;
        //console.log(obj);
        //console.log('cashout');
        mdlTransacoes_1.atualizaPixDestino(res, obj);
        res.status(200).send({ retorno: obj, status: true });
    }
    pix(req, res) {
        let obj = req.body;
        //console.log(obj);
        mdlTransacoes_2.receberPixCobranca(res, obj);
        //console.log('pix');
        //res.status(200).send({retorno: obj, status: true});
    }
    devolucao(req, res) {
        let obj = req.body;
        //console.log(obj);
        console.log('PIX devolucao => não implementado');
        res.status(200).send({ retorno: obj, status: true });
    }
    boleto(req, res) {
        let obj = req.body;
        //console.log(obj);
        console.log('boleto => não implementado');
        res.status(200).send({ retorno: obj, status: true });
    }
    pixLote(req, res) {
        let obj = req.body;
        //console.log(obj);
        console.log('pixLote => não implementado');
        res.status(200).send({ retorno: obj, status: true });
    }
    btrra(req, res) {
        let obj = req.body;
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                funcoes_1.retornarSaldo(obj.conta, msg.client_id)
                    .then(saldo => {
                    if (saldo >= 0) {
                        if (obj.valor > saldo) {
                            res.status(400).send({ erro: 'Saldo insuficiente!', status: false });
                        }
                        else {
                            mdlTransacoes_1.efetuaDeposito(res, obj, msg.client_id);
                        }
                    }
                    else {
                        res.status(400).send({ erro: 'Conta inexistente!', status: false });
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
    pagboletoIugu(req, res) {
        let obj = req.body;
        //console.log(obj);
        res.status(200).send({ retorno: obj, status: true });
    }
}
exports.default = new ctrWebhookAarin();
