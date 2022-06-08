import { validarInformacoes } from "../../models/funcoes";
import { saldo, obterExtratoConta, obterExtratoContaApp, listarBancosAtivos } from "../../models/mdlContas";

class contasBancarias{
    getSaldo(req, res){
        let arrExcessao  = [];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                saldo(res, req.params.conta, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }

    getExtrato(req, res){ 
        let arrExcessao  = [];
        //console.log(req.body)
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                obterExtratoConta(req, res, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false}) 
        })
    }

    getExtratoApp(req, res){ 
        let arrExcessao  = [];
        //console.log(req.body)
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                obterExtratoContaApp(req, res, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }

    getlistarBancosAtivos(req, res){
        let arrExcessao  = [];
        //console.log(req.body)
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                listarBancosAtivos(req, res, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })        
    }

}

export default new contasBancarias();