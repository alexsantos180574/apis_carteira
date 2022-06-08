"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mdlTransacoes_1 = require("../../models/mdlTransacoes");
const funcoes_1 = require("../../models/funcoes");
class ctrDepositoConta {
    post(req, res) {
        let obj = req.body;
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                funcoes_1.retornarSaldo(obj.conta, msg.client_id)
                    .then(saldo => {
                    if (saldo > -99999999) {
                        /*if( obj.valor > saldo ){
                            res.status(400).send({erro: 'Saldo insuficiente!', status: false});
                        }else{*/
                        mdlTransacoes_1.efetuaDeposito(res, obj, msg.client_id);
                        //}
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
}
exports.default = new ctrDepositoConta();
