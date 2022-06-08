//import { validarInformacoes } from "../../models/funcoes";
import { listarNosPai, obterDadosNO } from "../../models/mdlNOUS";

/* classe de clientes */
class NOUS{
    
    getByNoPai(req, res){
        let arrExcessao  = [];
        /*validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){*/
                listarNosPai(res);
            /*}else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })*/
    } 

    getDadosNo(req, res){
        let arrExcessao  = [];
        /*validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){*/
                obterDadosNO(res, req);
            /*}else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })*/
    } 

}

export default new NOUS();
