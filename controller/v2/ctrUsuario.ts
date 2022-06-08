import { validarInformacoes } from "../../models/funcoes";
import { obterUsuario, vefiricarUsuario, loginUsuario, recuperarSenha,
         validaCodigoVerificacao, atualizaSenha, atualizaSenhaSemCodigo } from "../../models/mdlUsuario";

/* classe de clientes */
class Usuario{

    getById(req, res){
        let arrExcessao  = [];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                obterUsuario(res, req, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }
    
    usuarioExiste(req, res){ 
        let arrExcessao  = [];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                vefiricarUsuario(req, res, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }    

    loginusuario(req, res){
        let arrExcessao  = [];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                loginUsuario(req, res, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }

    recuperaSenha(req, res){
        let arrExcessao  = [];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                recuperarSenha(req, res, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }

    validarCodigo(req, res){
        let arrExcessao  = [];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                validaCodigoVerificacao(req, res, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }

    atualizarSenha(req, res){
        let arrExcessao  = [];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                atualizaSenha(req, res, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }

    atualizarSenhaSemCod(req, res){
        let arrExcessao  = [];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                atualizaSenhaSemCodigo(req, res, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }    
}



export default new Usuario();

