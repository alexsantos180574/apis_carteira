import { validarInformacoes } from "../../models/funcoes";
import { pagamentoCartao, obterDadosBancarios } from "../../models/mdlClubeWhisky";

/* classe de ClubeWhisky */
class ClubeWhisky{

    pagamentoCartaoClubeWhisky(req, res){
        let obj = req.body;
        let arrExcessao  = ["valor"];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                pagamentoCartao(req, res, obj, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
      }

      obterDadosBancariosConta(req, res){
        let arrExcessao  = ["valor"];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                obterDadosBancarios(res, req, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
      }

}

export default new ClubeWhisky();
