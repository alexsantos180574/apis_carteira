import { validarInformacoes, retornarSaldo } from "../../models/funcoes";
import { emitirTEF, obterInfoClientePara} from "../../models/mdlTransacoes";

class ctrTEF{ 
    post(req, res){
        let obj = req.body;
        let arrExcessao  = [];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                retornarSaldo(obj.conta_origem, msg.client_id)
                .then(saldo=>{
                    if(saldo >= 0){
                        retornarSaldo(obj.conta_destino, msg.client_id)
                        .then(ret=>{
                            if(ret == -1){
                                res.status(400).send({erro: 'Conta DESTINO inexistente!', status: false});
                            }else{
                                if( obj.valor > saldo ){
                                    res.status(400).send({erro: 'Saldo insuficiente!', status: false});
                                }else{
                                    emitirTEF(res, obj, msg.client_id, msg.token);
                                }
                            }
                        })
                    }else{
                        res.status(400).send({erro: 'Conta ORIGEM inexistente!', status: false});
                    }
                })
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(error=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }

    getDadosCliente(req, res){ 
        let arrExcessao  = [];
        let obj = req.body;
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                obterInfoClientePara(res, obj, msg.client_id);
            }else{
                res.status(400).send({erro: msg.retorno, status: false});
            }
        })
        .catch(erro=>{
            res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
        })
    }

}

export default new ctrTEF();