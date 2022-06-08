"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { validarInformacoes } from "../../models/funcoes";
const mdlNOUS_1 = require("../../models/mdlNOUS");
/* classe de clientes */
class NOUS {
    getByNoPai(req, res) {
        let arrExcessao = [];
        /*validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){*/
        mdlNOUS_1.listarNosPai(res);
        /*}else{
            res.status(400).send({erro: msg.retorno, status: false});
        }
    })
    .catch(erro=>{
        res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
    })*/
    }
    getDadosNo(req, res) {
        let arrExcessao = [];
        /*validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){*/
        mdlNOUS_1.obterDadosNO(res, req);
        /*}else{
            res.status(400).send({erro: msg.retorno, status: false});
        }
    })
    .catch(erro=>{
        res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
    })*/
    }
}
exports.default = new NOUS();
