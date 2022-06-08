import { validarInformacoes } from "../../models/funcoes";
import { novoCliente, atualizaCliente, listarClientes, obterCliente, validarSocio } from "../../models/mdlClientes";

/* classe de clientes */
class Clientes{
    
    post(req, res){
        let obj = req.body;
        let arrExcessao  = ['img_foto_documento_frente_base64', 'img_foto_documento_verso_base64', 'img_foto_face_base64', 'matricula'];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                novoCliente(res, obj, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }

    put(req, res){
        let obj = req.body;
        let arrExcessao  = ['img_foto_documento_frente_base64', 'img_foto_documento_verso_base64', 'img_foto_face_base64'];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                atualizaCliente(res, req, obj, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }

    getById(req, res){
        let arrExcessao  = [];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                obterCliente(res, req, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    } 

    get(req, res){
        let arrExcessao  = [];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                listarClientes(res, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    } 

    validaSocio(req, res){
        let obj = req.body;
        let arrExcessao  = [];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                validarSocio(res, obj.matricula, obj.cpf, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }

}

export default new Clientes();
