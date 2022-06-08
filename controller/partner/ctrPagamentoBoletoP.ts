import Helper from "../../infra/helper";

async function obterSaldoP(_id) {
    var axios = require('axios');
    var data = JSON.stringify({ "token": 0 });
    var resultado;

    var config = {
        method: 'get',
        url: 'http://apis.atlanticbank.com.br/contas/v1/saldocliente/' + _id,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    return axios(config)
        .then(function (response) {
            const objeto = JSON.parse(JSON.stringify(response.data));
            resultado = objeto.saldo[0].saldo;
            return resultado;
        })
        .catch(function (error) {
            return error;
        });
}

async function inserirDadosPagamentoP(res, obj, nossoNumero) {
    const conta = obj.conta;
    const valor = obj.valor;
    const nome_favorecido = obj.nome;
    const documento_favorecido = obj.documento;
    const descricao = obj.descricao;
    const codigo_de_barras = obj.codigo_de_barras;

    const sql = require('mssql');

    sql.connect(Helper.configSql, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
        let codehash = Helper.getHash();
        // query to the database and get the records
        let strSql = (`INSERT INTO TB_MOV_CONTA_BANCARIA
                        (NUM_CONTA
                        ,VALOR
                        ,TIPO_TRANSACAO
                        ,ID_ORIGEM_TRANSACAO
                        ,NOME_DESTINO
                        ,DOCUMENTO_DESTINO
                        ,ID_STATUS_TRANSACAO
                        ,CODIGO_DE_BARRAS
                        ,DESCRICAO
                        ,NOSSO_NUMERO
                        ,CODIGO_VALIDADOR)
                    VALUES
                        ('${conta}'
                        ,${valor}
                        ,'S'
                        ,1
                        ,'${nome_favorecido}'
                        ,'${documento_favorecido}'
                        ,1
                        ,'${codigo_de_barras}'
                        ,'${descricao}'
                        ,'${nossoNumero}','${codehash}' )`);

        request.query(strSql, function (err, data) {
            if (err) { 
                console.log(err);
                Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
             }else{
                ///Service.create(obj);
                Helper.sendSaldo(res, 201, 'Pagamento efetuado com sucesso!');
             }
        });
    });
}

async function emitirPagamentoP(res, obj) {
    var nome;
    var email;
    var celular;
    var data_atual;

    const sql = require('mssql');

    sql.connect(Helper.configSql, function (err) {
        if (err) console.log(err);
        // query to the database and get the records 
        let strSql = `SELECT NOME AS nome
                            ,NUM_CPF_CNPJ AS documento
                            ,CONCAT(NUM_DDD_TELEFONE, NUM_TELEFONE) AS celular
                            ,EMAIL AS email
                            ,convert(varchar(10), getdate(), 23) AS data_atual
                      FROM TB_CLIENTES_TITULAR
                      WHERE NUM_CPF_CNPJ = '${obj.documento}'`;

        sql.query(strSql, function (err, results) {
            nome = results.recordset[0].nome;
            email = results.recordset[0].email;
            celular = results.recordset[0].celular;
            data_atual = results.recordset[0].data_atual;
            
            let tid = Helper.getHash();
            var axios = require('axios');
            var data = JSON.stringify({
                            "Tid": tid,
                            "Pid": 20914,
                            "ProdId": 7374,
                            "Amount": obj.valor,
                            "DueDate": data_atual,
                            "Name": nome,
                            "Email": email,
                            "Document": obj.documento,
                            "MobilePhone": celular,
                            "Description": obj.descricao,
                            "Barcode": obj.codigo_de_barras
                        });

            var config = {
                    method: 'post',
                    url: 'https://dev.meu.cash/apiv10Sandbox/transaction/out/billPayment',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    data : data
            };
            ///console.log(data);
            return axios(config)
                .then(function (response) {
                    const objeto = JSON.parse(JSON.stringify(response.data));
                    const resultado = objeto;//.Success;
                    inserirDadosPagamentoP(res, obj, tid);
            })
            .catch(function (error) {
                console.log(error);
                Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
            });
        });
    });
}

class ctrPagamentoBoletoP {
    createP(req, res) {
        let obj = req.body;
        if(typeof(obj.valor) != "undefined"){
            obterSaldoP(obj.conta)
                .then(saldo => {
                    ///console.log(obj.valor);
                    ///console.log(saldo);
                    if (saldo >= obj.valor) {
                        emitirPagamentoP(res, obj);
                    } else {
                        ///console.log('Saldo insuficiente!');
                        Helper.sendSaldo(res, 401, 'Saldo insuficiente!');
                    }
                });
        }else{
            //console.log(`o VALOR é obrigatório!`);
            res.status(401).send({erro: `o VALOR é obrigatório!`, status: false})
        }
    }
}

export default new ctrPagamentoBoletoP();