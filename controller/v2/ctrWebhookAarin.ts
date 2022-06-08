import { efetuaDeposito, atualizaPixDestino } from "../../models/mdlTransacoes";
import { validarInformacoes, retornarSaldo } from "../../models/funcoes";
import { receberPixCobranca } from "../../models/mdlTransacoes";

class ctrWebhookAarin{
  
cashout(req, res){
    let obj = req.body;
    //console.log(obj);
    //console.log('cashout');
    atualizaPixDestino(res, obj);
    res.status(200).send({retorno: obj, status: true});
}

pix(req, res){
    let obj = req.body;
    //console.log(obj);
    receberPixCobranca(res, obj);
    //console.log('pix');
    //res.status(200).send({retorno: obj, status: true});
}

devolucao(req, res){
    let obj = req.body;
    //console.log(obj);
    console.log('PIX devolucao => não implementado');
    res.status(200).send({retorno: obj, status: true});
}

boleto(req, res){
    let obj = req.body;
    //console.log(obj);
    console.log('boleto => não implementado');
    res.status(200).send({retorno: obj, status: true});
}

pixLote(req, res){
    let obj = req.body;
    //console.log(obj);
    console.log('pixLote => não implementado');
    res.status(200).send({retorno: obj, status: true});
}

btrra(req, res){
        let obj = req.body;
        let arrExcessao  = [];
        validarInformacoes(res, req, arrExcessao)
        .then(msg=>{
            if(msg.retorno=='OK'){
                retornarSaldo(obj.conta, msg.client_id)
                .then(saldo=>{
                    if(saldo >= 0){
                            if( obj.valor > saldo ){
                                res.status(400).send({erro: 'Saldo insuficiente!', status: false});
                            }else{
                                efetuaDeposito(res, obj, msg.client_id)
                            }
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

    pagboletoIugu(req, res){
        let obj = req.body;
        //console.log(obj);
        res.status(200).send({retorno: obj, status: true});
    }
}

export default new ctrWebhookAarin();