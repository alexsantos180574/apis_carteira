import Helper from "../../infra/helper";

async function gerarToken(res, obj) {
    var axios = require('axios');
    var qs = require('qs');
    var data = qs.stringify({
        'grant_type': 'client_credentials'
    });

    var config = {
        method: 'post',
        url: 'https://hml.auth.blupay-apps.com.br/auth/realms/payment-bus/protocol/openid-connect/token',
        headers: {
            'Authorization': 'Basic YXRsYW50aWMuYmFuazo3NGQwZmE4NC03NzZjLTQ5YTYtYjMzNy0wMDFjYWJkNDAzMjI=',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'AWSALB=ZHnqLUpYeMnh1dbLudqASEaQYoV5xrKKIaEV9hFC/NgUTO+ZrSqTmLSV+gEXNz0JjkotnycFTDbe6GM/XEecoB7qHXUCPBH2t2DhcGcdP2MPNkxQGO7msRnFQ9bq; AWSALBCORS=ZHnqLUpYeMnh1dbLudqASEaQYoV5xrKKIaEV9hFC/NgUTO+ZrSqTmLSV+gEXNz0JjkotnycFTDbe6GM/XEecoB7qHXUCPBH2t2DhcGcdP2MPNkxQGO7msRnFQ9bq'
        },
        data: data
    };

    return axios(config)
        .then(function (response) {
            //console.log(JSON.stringify(response.data));
            const objeto = JSON.parse(JSON.stringify(response.data));
            const resultado = objeto;
            //console.log(`RESULTADO AQUI >>>> ${resultado.access_token}`);
            return resultado;
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function emitirBoleto(res, obj, token) {
    var nome;
    var celular;
    var email;
    var cep;
    var endereco;
    var numero;
    var complemento;
    var bairro;
    var cidade;
    var uf;
    var data_boleto;
    var nosso_numero;

    const sql = require('mssql');

    sql.connect(Helper.configSql, function (err) {

        if (err){
            console.log(err);
            Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
        }else{
            let strSql = `SELECT c.NOME AS nome
                    ,c.NUM_CPF_CNPJ AS documento
                    ,CONCAT(c.NUM_DDD_TELEFONE, c.NUM_TELEFONE) AS celular
                    ,c.EMAIL AS email
                    ,e.CEP AS cep
                    ,e.ENDERECO AS endereco
                    ,e.NUMERO AS numero
                    ,e.COMPLEMENTO AS complemento
                    ,e.BAIRRO AS bairro
                    ,e.CIDADE AS cidade
                    ,e.UF AS uf
                    ,(SELECT ISNULL(MAX(NOSSO_NUMERO), 1)+1 FROM TB_LISTA_BOLETO_GERADO) AS nosso_numero
                    ,(SELECT CONVERT(VARCHAR(10), GETDATE(), 23)) as data_vencimento
            FROM TB_CLIENTES_TITULAR c, TB_ENDERECOS e
            WHERE c.ID_CLIENTE_TITULAR = e.ID_CLIENTE
                AND c.NUM_CPF_CNPJ = '${obj.cpf}' `;

            //console.log(strSql);
            sql.query(strSql, function (err, results) {
                nome = results.recordset[0].nome;
                celular = results.recordset[0].celular;
                email = results.recordset[0].email;
                cep = results.recordset[0].cep;
                endereco = results.recordset[0].endereco;
                numero = results.recordset[0].numero;
                complemento = results.recordset[0].complemento;
                bairro = results.recordset[0].bairro;
                cidade = results.recordset[0].cidade;
                uf = results.recordset[0].uf;
                data_boleto = results.recordset[0].data_vencimento;
                nosso_numero = results.recordset[0].nosso_numero;

                //            let tid = Helper.getHash();
                var axios = require('axios');
                var data = JSON.stringify({
                "externalId": nosso_numero,
                "value": obj.valor,
                "dueDate": data_boleto,
                "debtor": {
                    "taxId": '41250888883',//obj.cpf,
                    "name": nome,
                    "email": email,
                    "phone": celular,
                    "address": {
                        "zipCode": cep,
                        "state": uf,
                        "city": cidade,
                        "neighborhood": bairro,
                        "street": endereco,
                        "number": numero,
                        "complement": complemento
                    }
                },
                "penalty": {
                    "value": 0,
                    "date": "",
                    "interestRate": 0
                },
                "discount": {
                    "percentage": 0,
                    "dailyValue": 0,
                    "limitDate": ""
                },
                "type": "BILL_SLIP"
                });

                var config = {
                method: 'post',
                url: 'https://api.hml.pb.blupay-apps.com.br/api/invoices',
                headers: {
                    'Authorization': 'Bearer '+token.access_token,
                    'Content-Type': 'application/json'
                },
                data: data
                };

                axios(config)
                .then(function (response) {
                    const objeto = JSON.parse(JSON.stringify(response.data));
                    const resultado = objeto;
                    inserirDadosBoleto(res, obj, results.recordset[0], resultado);
                })
                .catch(function (error) {
                    //console.log(error.response.data.message);
                    Helper.sendErro(res, 401, 'Falha ao emitir o Boleto. Erro: '+error.response.data.message);
                });
            });
        } 
    });
}

function inserirDadosBoleto(res, obj, rs, retorno) {
    //console.log(retorno);
    var valor = obj.valor;
    var documento = obj.cpf;
    var nome  = rs.nome;
    var email = rs.email;
    var telefone = rs.celular;
    var codigo_de_barras = retorno.digitable;
    var token_id_boleto = retorno.txId;
    var nosso_numero = rs.nosso_numero;
    var qrcode = retorno.qrCode;
    var datavenc = retorno.dueDate;

    const sql = require('mssql');

    sql.connect(Helper.configSql, function (err) {

        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        let strSql = (`INSERT INTO TB_LISTA_BOLETO_GERADO
                                (VALOR
                                ,DOCUMENTO
                                ,NOME
                                ,EMAIL
                                ,TELEFONE
                                ,CODIGO_DE_BARRAS
                                ,TOKEN_ID_BOLETO
                                ,NOSSO_NUMERO
                                ,QRCODE)
                        VALUES
                                ('${valor}'
                                ,'${documento}'
                                ,'${nome}'
                                ,'${email}'
                                ,'${telefone}'
                                ,'${codigo_de_barras}'
                                ,'${token_id_boleto}'
                                ,'${nosso_numero}'
                                ,'${qrcode}')`);
        //console.log(strSql);

        request.query(strSql, function (err, data) {
            if (err) {
                Helper.sendErro(res, 401, 'Falha ao emitir o Boleto.');
                console.log(err);
            } else {
                Helper.sendResponse(res, 201, {resultado:'Boleto gerado com sucesso!',qrCode:qrcode,codigobarra:codigo_de_barras, codigo:token_id_boleto, datavencimento:datavenc});
            }
        });
    });
}

class CtrGerarBoleto{

    create(req, res) {
        let obj = req.body;

        var validarDados = '';

        validarDados = (obj.valor == '' ? validarDados = 'valor' : validarDados = '');
        validarDados = (obj.cpf != '' ? validarDados = 'cpf' : validarDados = '');

        if (validarDados) {

            gerarToken(res, obj)
                .then(token => {
                    emitirBoleto(res, obj, token)
                        .then(msg => {
                            let vm = req.body;
                            /*inserirDadosBoleto(res, obj)
                                .then(msg => {
                                    console.log(obj);
                                });
                                */
                        })
                        .catch(Error => Helper.sendErro(res, 401, 'Falha ao emitir o Boleto.'));
            })
            .catch(Error => Helper.sendErro(res, 401, 'Falha ao gerar o token.'));
            
        } else {
            Helper.sendErro(res, 401, 'O campo ' + validarDados + ' é necessário!');
        }
    }
}

export default new CtrGerarBoleto();