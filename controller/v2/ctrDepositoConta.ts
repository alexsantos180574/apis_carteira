import { efetuaDeposito } from "../../models/mdlTransacoes";
import { validarInformacoes, retornarSaldo } from "../../models/funcoes";
class ctrDepositoConta{ 
    post(req, res){
        let obj = req.body;
        let arrExcessao  = [];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                retornarSaldo(obj.conta, msg.client_id)
                .then(saldo=>{
                    if(saldo > -99999999){
                            /*if( obj.valor > saldo ){
                                res.status(400).send({erro: 'Saldo insuficiente!', status: false});
                            }else{*/
                                efetuaDeposito(res, obj, msg.client_id)
                            //}
                    }else{
                        res.status(400).send({erro: 'Conta inexistente!', status: false});
                    }
                });
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(error=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }
}

export default new ctrDepositoConta();