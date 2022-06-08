import Helper from "../../infra/helper";

async function contaExiste(_id) {
    var axios = require('axios');
    var data = JSON.stringify({"token":0});
    var resultado;
    //console.log(_id);
    var config = {
      method: 'get',
      url: 'http://apis.atlanticbank.com.br/contas/v1/verificarconta/'+_id,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    return axios(config)
    .then(function (response) {
      //return JSON.stringify(response.data);
      //console.log(response.data);
      const objeto = JSON.parse(JSON.stringify(response.data));
        //console.log(objeto);
        resultado = objeto.resultado[0].CONTA_EXISTE;
        //console.log(resultado);
        return resultado;
    })
    .catch(function (error) {
        //console.log('Deposito Em Conta');
        console.log(error);
        return error;
    });

}

async function efetuaDeposito(res, obj){

    const token = obj.token;
    const client_id = obj.client_id;
    const valor = obj.valor;
    const agencia = obj.agencia;
    const conta = obj.conta.toString();
    const documento = obj.documento.toString();
    const origem_credito = obj.origem_credito;
    const banco_origem = obj.banco_origem;
    const agencia_origem = obj.agencia_origem;
    const conta_origem = obj.conta_origem;
    const nome_origem = obj.nome_origem;
    const tipo_transacao = obj.tipo_transacao;
    
    const sql = require('mssql');
    var retorno;

    sql.connect(Helper.configSql, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        let codehash = Helper.getHash();
        // query to the database and get the records
        let strSql  = `INSERT INTO dbo.TB_MOV_CONTA_BANCARIA
        (VALOR
        ,TIPO_TRANSACAO
        ,ID_ORIGEM_TRANSACAO
        ,NOME_DESTINO
        ,DOCUMENTO_DESTINO
        ,INSTITUICAO_DESTINO
        ,AGENCIA_DESTINO
        ,CONTA_DESTINO
        ,ID_STATUS_TRANSACAO
        ,NUM_CONTA
        ,CODIGO_VALIDADOR)
        VALUES
        (${valor}
        ,'${tipo_transacao}'
        ,${origem_credito}
        ,'${nome_origem}'
        ,'${documento}'
        ,'213'
        ,'${agencia}'
        ,'${conta}', 1,'${conta}','${codehash}')`;
        //console.log(strSql);
        request.query(strSql, function (err, data) {
            if (err){console.log(err)}
        });
    });
}

class ctrDeposito{ 
    efetuarDeposito(req, res){
        let obj = req.body; 
        ///console.log(obj.conta);
        contaExiste(obj.conta)
        .then(existe =>{
            //console.log(existe);
            if(existe == 1){
                efetuaDeposito(res, obj)
                .then(msg => {
                Helper.sendResponse(res, 200, 'DEPOSITO efetuado com sucesso!');
                })
                .catch(error => console.error.bind(console, "Erro: "+error))
            }else{
                Helper.sendErro(res, 401, 'A conta informada não existe!');
            } 
        }); 
    }
}

export default new ctrDeposito();