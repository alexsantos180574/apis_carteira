import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";
import { Service } from "aws-sdk";

async function comprarGiftCard(res, obj) {
    var nome = '';
    var email;
    var celular;

    const sql = require('mssql'); 

    sql.connect(Helper.configSql, function (err) {
        if (err) console.log(err);

        let strSql = `SELECT NOME AS nome
                            ,NUM_CPF_CNPJ AS documento
                            ,CONCAT(NUM_DDD_TELEFONE, NUM_TELEFONE) AS celular
                            ,EMAIL AS email
                      FROM TB_CLIENTES_TITULAR
                      WHERE NUM_CPF_CNPJ = '${obj.documento}'`;

        sql.query(strSql, function (err, results) {
            nome = Helper.retirarAcentos(results.recordset[0].nome);
            email = results.recordset[0].email;
            celular = results.recordset[0].celular;

            var tid = Helper.getHash();

            var axios = require('axios');
            var data = JSON.stringify({
                            "Tid": tid,
                            "Pid": 20914,
                            "ProdId": 7374,
                            "Product": obj.id_produto,
                            "RechargeOptionName": obj.nome_produto,
                            "CustomerIdentifier": celular,
                            "Amount": obj.valor,
                            "Name": nome,
                            "Email": email,
                            "Document": obj.documento,
                            "MobilePhone": celular,
                            "Description": obj.descricao
                        });
                        
            var config = {
                method: 'post',
                url: 'https://dev.meu.cash/apiv10Sandbox/transaction/out/recharge/create',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            return axios(config)
                   .then(function (response) {
                        const objeto = JSON.parse(JSON.stringify(response.data));
                        //console.log(objeto);
                        if(objeto.StatusCode == 200){
                            obtemCodigoGiftCard(tid)
                            .then(cod =>{
                                let codigoGift = (obj.nome_produto != "GOOGLE PLAY RECARGA") ? ( (cod == "Payout") ? '00000000000' : cod) : '';
                                let msg = (codigoGift == '') ? 'Você receberá um email ou SMS da operadora em breve!' : '';
                                inserirDadosCompra(res, obj).then(() => Helper.sendResponse(res, 201, {mensagem:'Compra do GiftCard efetuada com sucesso! '+msg, codigo:codigoGift}));
                            });
                        }else{
                            Helper.sendErro(res, 401, objeto.Message);
                        }
                    })
                    .catch(error => console.error.bind(console, `Erro: ${error}`));
            });
        });
}

async function obtemCodigoGiftCard(Tid){
    var axios = require('axios');

    var config = {
      method: 'get',
      url: 'https://dev.meu.cash/apiv10Sandbox/transaction/getByTid/'+Tid+'/pid/20914',
      headers: { }
    };
    //console.log(Tid);
    return axios(config)
    .then(function (response) {
      //console.log(JSON.stringify(response.data));
      let rest = JSON.parse(JSON.stringify(response.data));
      //console.log(rest);
      return rest.Result.Transaction.Custom;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });    
}

async function inserirDadosCompra(res, obj){
    var valor = obj.valor;
    var conta = obj.conta;
    var descricao = 'Compra do GiftCard';
    var giftcard = obj.nome_produto;

    const sql = require('mssql');

    sql.connect(Helper.configSql, function(err){
        
        if (err) console.log(err);

        var request = new sql.Request();

        let strSql = (`INSERT INTO TB_MOV_CONTA_BANCARIA
                        (NUM_CONTA
                        ,VALOR
                        ,TIPO_TRANSACAO
                        ,ID_ORIGEM_TRANSACAO
                        ,ID_STATUS_TRANSACAO
                        ,DESCRICAO)
                       VALUES
                        (${conta}
                        ,${valor}
                        ,'S'
                        ,6
                        ,12
                        ,'${descricao} ${giftcard}')`);
        
        return request.query(strSql, function(err, data){
            if (err) {return err}
        });
    });
}

class CtrComprarGiftCard {
    emitirCompra(req, res){
        let obj = req.body;
        comprarGiftCard(res, obj);
    }
}

export default new CtrComprarGiftCard();