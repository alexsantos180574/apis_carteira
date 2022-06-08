import { validarInformacoes } from "../../models/funcoes";
import { obterListaConvites, comprarConvite, obterListaConvitesComprados,
         pagarMensalidade, gravarusoticket, obterExtratoTicketsUsados, validarTicket
       } from "../../models/mdlParceiros";

/* classe de Parceiros */
class Parceiros{
    getListaConvites(req, res){
        let arrExcessao  = [];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                obterListaConvites(res, req, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }

    getListaConvitesComprados(req, res){
        let arrExcessao  = [];
        let obj = req.body;
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                obterListaConvitesComprados(res, req, obj, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }

    criarCompraConvite(req, res){
        let obj = req.body;
        let arrExcessao  = ["valor"];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                comprarConvite(req, res, obj, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }

    pagaMensalidade(req, res){
        let obj = req.body;
        let arrExcessao  = [];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                pagarMensalidade(req, res, obj, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }

    gravaUsoTicket(req, res){
        let obj = req.body;
        let arrExcessao  = [];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                gravarusoticket(req, res, obj, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }
    
    getExtratoTicketsUsados(req, res){
        let arrExcessao  = [];
        let obj = req.body;
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                obterExtratoTicketsUsados(res, req, obj, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }

    getValidarTicket(req, res){
        let arrExcessao  = [];
        let obj = req.body;
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                validarTicket(res, req, obj, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }
}

export default new Parceiros();
