import { efetuaDeposito } from "../../models/mdlTransacoes";
import { validarInformacoes, retornarSaldo } from "../../models/funcoes";
import { receberPixCobranca } from "../../models/mdlTransacoes";

class ctrWebhookIugu{
    pagboleto(req, res){
        let obj = req.body;
        //console.log(obj);
        res.status(200).send({retorno: obj, status: true});
    }
}

export default new ctrWebhookIugu();