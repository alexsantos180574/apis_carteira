"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const funcoes_1 = require("../../models/funcoes");
const mdlClubeWhisky_1 = require("../../models/mdlClubeWhisky");
/* classe de ClubeWhisky */
class ClubeWhisky {
    pagamentoCartaoClubeWhisky(req, res) {
        let obj = req.body;
        let arrExcessao = ["valor"];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                mdlClubeWhisky_1.pagamentoCartao(req, res, obj, msg.client_id);
            }
            else {
                res.status(400).send({ erro: msg.retorno, status: false });
            }
        })
            .catch(erro => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
    obterDadosBancariosConta(req, res) {
        let arrExcessao = ["valor"];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                mdlClubeWhisky_1.obterDadosBancarios(res, req, msg.client_id);
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
exports.default = new ClubeWhisky();
