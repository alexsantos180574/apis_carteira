import Helper from "../../infra/helper";

async function inserirDadosTED(res, obj, arr) {
    const client_id = obj.client_id;
    const token_hash = obj.token;
    const valor = obj.valor;
    const descricao = obj.descricao;
    const nome = obj.nome;
    const email = obj.email;
    const celular = obj.celular;
    const documento = obj.documento;
    const num_banco_origem = obj.num_banco_origem;
    const agencia_origem = obj.num_agencia_origem;
    const num_conta_origem = obj.num_conta_origem;
    const documento_origem = obj.documento_origem;

    let arrDadosBancarios = [];

    let agencia_banco_fastcash = '';
    let num_conta_fastcash = '';
    let nome_fastcash = '';
    let url_img_fastcash = '';
    let documento_fastcash = '';
    let nome_banco_fastcash = '';
    let num_banco_fastcash = '';

    for (var i in arr){
        nome_banco_fastcash = (arr[i].Id == 'bank') ? arr[i].Value : nome_banco_fastcash;
        agencia_banco_fastcash = (arr[i].Id == 'agency') ? arr[i].Value : agencia_banco_fastcash;
        num_conta_fastcash = (arr[i].Id == 'account') ? arr[i].Value : num_conta_fastcash;
        nome_fastcash = (arr[i].Id == 'accountholder') ? arr[i].Value : nome_fastcash;
        documento_fastcash = (arr[i].Id == 'accountholderdocument') ? arr[i].Value : documento_fastcash;
        num_banco_fastcash = (arr[i].Id == 'banknumber') ? arr[i].Value : num_banco_fastcash;
        url_img_fastcash = (arr[i].Id == 'bankimgurl') ? arr[i].Value : url_img_fastcash;
    }

    arrDadosBancarios.push({
        banco_fastcash: nome_banco_fastcash,
        agencia_fastcash: agencia_banco_fastcash,
        conta_fastcash: num_conta_fastcash,
        nome_fastcash: nome_fastcash,
        documento_fastcash: documento_fastcash,
        num_banco_fastcash: num_banco_fastcash,
        url_img_fastcash: url_img_fastcash
    });

    const sql = require('mssql');

    sql.connect(Helper.configSql, function(err) {

        if (err) console.log(err);

        var request = new sql.Request();
        let strSql = (`INSERT INTO dbo.TB_AGUARDA_COMPROVANTE
                        (CLIENT_ID
                        ,TOKEN_HASH
                        ,VALOR
                        ,DESCRICAO
                        ,NOME
                        ,EMAIL
                        ,TELEFONE
                        ,DOCUMENTO
                        ,BANCO_ORIGEM
                        ,AGENCIA_ORIGEM
                        ,CONTA_ORIGEM
                        ,DOCUMENTO_ORIGEM
                        ,NUM_BANCO_FASTCASH
                        ,AGENCIA_FASTCASH
                        ,CONTA_FASTCASH
                        ,NOME_FASTCASH
                        ,URL_IMG_FASTCASH
                        ,DOCUMENTO_FASTCASH
                        ,NOME_BANCO_FASTCASH
                        ,TIPO_ENVIO)
                       VALUES
                        ('${client_id}',
                        '${token_hash}',
                        '${valor}',
                        '${descricao}',
                        '${nome}',
                        '${email}',
                        '${celular}',
                        '${documento}',
                        '${num_banco_origem}',
                        '${agencia_origem}',
                        '${num_conta_origem}',
                        '${documento_origem}',
                        '${num_banco_fastcash}',
                        '${agencia_banco_fastcash}',
                        '${num_conta_fastcash}',
                        '${nome_fastcash}',
                        '${url_img_fastcash}',
                        '${documento_fastcash}',
                        '${nome_banco_fastcash}',
                        2)`);

        request.query(strSql, function (err, data) {
            if (err) {
                console.log(err);
                Helper.sendErro(res, 401, 'Falha ao receber o TED!');
            }else{
                Helper.sendResponse(res, 201, arrDadosBancarios);
            }
        });
    });
}

async function retornarDadosTED(res, obj) {
    var codigo_fastcash;

    switch (obj.num_banco_origem) {
        case '001': // Banco do Brasil
            codigo_fastcash = 1;
            break;

        case '237': // Bradesco
            codigo_fastcash = 2;
            break;

        case '104': // Caixa Econômica Federal
            codigo_fastcash = 3;
            break;

        case '341': // Itaú
            codigo_fastcash = 4;
            break;

        case '033': // Santander
            codigo_fastcash = 5;
            break;

        case '041': // Banrisul
            codigo_fastcash = 8;
            /*break;

        case '': // Corrreios
            codigo_fastcash = 10;
            break;

        default: // Lotéricas
            codigo_fastcash = 11;*/
    };

    var axios = require('axios');
    var data = JSON.stringify({
        "Tid": obj.token,
        "Pid": 110,
        "ProdId": 3993,
        "Custom": "",
        "Amount": obj.valor,
        "Description": obj.descricao,
        "PaymentMethod": 2,
        "SubPaymentMethod": codigo_fastcash,
        "Name": obj.nome,
        "Email": obj.email,
        "MobilePhone": obj.celular,
        "Document": obj.documento,
        "BankAgency": obj.num_agencia_origem,
        "BankAccountNumber": obj.num_conta_origem,
        "BankAccountHolder": obj.num_banco_origem,
        "BankAccountDocument": obj.documento_origem
    });

    var config = {
        method: 'post',
        url: 'https://www.fastcash.com.br/apiv10Sandbox/transaction/in/transfer',
        headers: {
            'Authorization': 'APIKEY 97f96887-7961-48fe-9dae-8d70debc8832',
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            //console.log(JSON.stringify(response.data));
            const objeto = JSON.parse(JSON.stringify(response.data));
            const resultado = objeto;

            inserirDadosTED(res, obj, resultado.Result.Parameters);
        })
        .catch(function (error) {
            console.log(error);
            Helper.sendErro(res, 401, 'Falha ao carregar as informações!');
        });

}

class CtrReceberTED {
    emitirDadosTED(req, res){
        let obj = req.body;
        retornarDadosTED(res, obj);
    }
}

export default new CtrReceberTED();