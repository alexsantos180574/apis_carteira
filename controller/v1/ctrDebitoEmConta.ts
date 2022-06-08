import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";

async function obterSaldo(_id) {
    var axios = require('axios');
    var resultado;

    var config = {
        method: 'get',
        url: 'http://apis.atlanticbank.com.br/contas/v1/saldocliente/' + _id,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return axios(config)
        .then(function (response) {
            const objeto = JSON.parse(JSON.stringify(response.data));
            resultado = objeto.saldo[0].saldo;
            //console.log(resultado);
            return resultado;
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function inserirDadosDebitoEmConta(res, obj) {
    const conta = obj.conta;
    const documento = obj.documento;
    const nome = obj.nome;
    const valor = obj.valor;
    const descricao = obj.descricao;

    const sql = require('mssql');
    var retorno;

    sql.connect(Helper.configSql, function (err) {

        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        let codehash = Helper.getHash();
        // CRÉDITO EM CONTA DESTINO
        let strSql = `INSERT INTO TB_MOV_CONTA_BANCARIA
                        (NUM_CONTA
                        ,VALOR
                        ,DOCUMENTO_DESTINO
                        ,NOME_DESTINO
                        ,TIPO_TRANSACAO
                        ,ID_ORIGEM_TRANSACAO
                        ,ID_STATUS_TRANSACAO
                        ,DESCRICAO
                        ,CODIGO_VALIDADOR)
                      VALUES
                        ('${conta}'
                        ,${valor}
                        ,'${documento}'
                        ,'${nome}'
                        ,'S'
                        ,'6'
                        ,'12'
                        ,'${descricao}'
                        ,'${codehash}')`;

        request.query(strSql, function (err, data) {
            if (err) { retorno = err } else { retorno = 'Débito efetuado!' }
        });
    });
}

class CtrDebitoEmConta {
    emitirDebitoEmConta(req, res) {
        let obj = req.body;

        obterSaldo(obj.conta)
            .then(saldo => {
                if (saldo >= obj.valor) {
                    inserirDadosDebitoEmConta(res, obj)
                        .then(msg => {
                            Helper.sendExtrato(res, HttpStatus.OK, 'Débito efetuado com sucesso!');
                        })
                        .catch(error => console.error.bind(console, "Erro: " + error))
                } else {
                        Helper.sendExtrato(res, HttpStatus.OK, 'Saldo insuficiente!');
                }
        });
    }
}

export default new CtrDebitoEmConta();