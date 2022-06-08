import Helper from "../../infra/helper";

async function exibirListaBancos(req, res) {

    var axios = require('axios');

    var config = {
        method: 'get',
        url: 'https://dev.meu.cash/apiv10Sandbox/transaction/subPaymentMethods/2',
        headers: {}
    };

    axios(config)
        .then(function (response) {
            //console.log(JSON.stringify(response.data));
            const objeto = JSON.parse(JSON.stringify(response.data));
            const resultado = objeto;
           
            let arrResultado = [];
            for(var i in resultado.Result){
                arrResultado.push({
                    id: resultado.Result[i].Id,
                    nome_banco: resultado.Result[i].Name,
                    numero_banco: resultado.Result[i].BankNumber,
                    icone: resultado.Result[i].Icone
                });
            }
            Helper.sendResponse(res, 200, arrResultado);
        })
        .catch(function (error) {
            console.log(error);
            Helper.sendErro(res, 401, 'Falha ao carregar as informações!');
        });
}

class CtrListarInformacoesBancos {
    obterLista(req, res) {
        exibirListaBancos(req, res);
    }
}

export default new CtrListarInformacoesBancos();