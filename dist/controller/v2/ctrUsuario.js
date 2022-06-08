"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const funcoes_1 = require("../../models/funcoes");
const mdlUsuario_1 = require("../../models/mdlUsuario");
/* classe de clientes */
class Usuario {
    getById(req, res) {
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                mdlUsuario_1.obterUsuario(res, req, msg.client_id);
            }
            else {
                res.status(400).send({ erro: msg.retorno, status: false });
            }
        })
            .catch(erro => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
    usuarioExiste(req, res) {
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                mdlUsuario_1.vefiricarUsuario(req, res, msg.client_id);
            }
            else {
                res.status(400).send({ erro: msg.retorno, status: false });
            }
        })
            .catch(erro => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
    loginusuario(req, res) {
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                mdlUsuario_1.loginUsuario(req, res, msg.client_id);
            }
            else {
                res.status(400).send({ erro: msg.retorno, status: false });
            }
        })
            .catch(erro => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
    recuperaSenha(req, res) {
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                mdlUsuario_1.recuperarSenha(req, res, msg.client_id);
            }
            else {
                res.status(400).send({ erro: msg.retorno, status: false });
            }
        })
            .catch(erro => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
    validarCodigo(req, res) {
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                mdlUsuario_1.validaCodigoVerificacao(req, res, msg.client_id);
            }
            else {
                res.status(400).send({ erro: msg.retorno, status: false });
            }
        })
            .catch(erro => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
    atualizarSenha(req, res) {
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                mdlUsuario_1.atualizaSenha(req, res, msg.client_id);
            }
            else {
                res.status(400).send({ erro: msg.retorno, status: false });
            }
        })
            .catch(erro => {
            res.status(500).send({ erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false });
        });
    }
    atualizarSenhaSemCod(req, res) {
        let arrExcessao = [];
        funcoes_1.validarInformacoes(res, req, arrExcessao)
            .then(msg => {
            if (msg.retorno == 'OK') {
                mdlUsuario_1.atualizaSenhaSemCodigo(req, res, msg.client_id);
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
exports.default = new Usuario();
