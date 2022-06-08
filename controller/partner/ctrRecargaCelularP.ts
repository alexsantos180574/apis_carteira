import Helper from "../../infra/helper";

async function efetuarRecargaP(res, obj) {
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
                            "Product": "PhoneRecharge",
                            "RechargeOptionName": obj.nome_produto,
                            "CustomerIdentifier": obj.numero_telefone,
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
                        const resultado = objeto;
                        inserirDadosRecargaP(res, obj).then(() => Helper.sendResponse(res, 201, 'Sua recarga foi efetuada com sucesso! Em breve você receberá uma mensagem de confirmação da operadora.'));
                    })
                    .catch(error => console.error.bind(console, `Erro: ${error}`));
            });
        });
}

async function inserirDadosRecargaP(res, obj){
    var valor = obj.valor;
    var conta = obj.conta;
    var descricao = "Recarga de celular";
    var giftcard = obj.nome_produto;
    var numero_telefone = obj.numero_telefone;

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
                        ,'${descricao} ${giftcard} para o número ${numero_telefone}')`);

        return request.query(strSql, function(err, data){
            if (err) {return err}
        });
    });
}

class CtrComprarGiftCardP {
    emitirCompraP(req, res){
        let obj = req.body;
        efetuarRecargaP(res, obj);
    }
}

export default new CtrComprarGiftCardP();