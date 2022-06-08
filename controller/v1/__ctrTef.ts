////import mdlExtrato from "../models/mdlExtrato";
import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";
import { watch } from "fs";

async function obterSaldo(_id) {
    var axios = require('axios');
    var data = JSON.stringify({"token":0});
    var resultado;
    
    var config = {
      method: 'get',
      url: 'http://apis.atlanticbank.com.br/contas/v1/saldocliente/'+_id,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    return axios(config)
    .then(function (response) {
      //return JSON.stringify(response.data);
      const objeto = JSON.parse(JSON.stringify(response.data));
        resultado = objeto.saldo[0].saldo;
        return resultado;
    })
    .catch(function (error) {
      return error;
    });

}

async function EmitirTEF(res, obj){

    const cliente               = obj.client_id;
    const valor                 = obj.valor;
    const conta_origem          = obj.conta_origem;
    const tipoTransacao         = "S";
    const id_origem_transacao   = 3; //TEF
    const nome_destino          = obj.nome_destino;
    const campo_livre           = obj.campo_livre;
    const documento_destino     = obj.documento_destino;
    const banco_destino         = obj.banco_destino;
    const agencia_destino       = obj.agencia_destino;
    const conta_destino         = obj.conta_destino;
    const tipo_conta_destino    = obj.tipo_conta_destino;
    const token                 = obj.token;
    
    const sql = require('mssql');
    var retorno;
    let codehash = Helper.getHash();

    sql.connect(Helper.configSql, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        // CRÉDITO EM CONTA DESTINO
        let strSql  = `INSERT INTO dbo.TB_MOV_CONTA_BANCARIA
        (NUM_CONTA, VALOR ,TIPO_TRANSACAO ,ID_ORIGEM_TRANSACAO ,NOME_DESTINO ,DOCUMENTO_DESTINO
        ,INSTITUICAO_DESTINO ,AGENCIA_DESTINO ,CONTA_DESTINO ,TIPO_CONTA_DESTINO ,ID_STATUS_TRANSACAO, TEXTO_LIVRE, TOKEN_TRANSACIONAL, CLIENT_ID, CODIGO_VALIDADOR)
        VALUES(${conta_origem} ,${valor} ,'${tipoTransacao}' ,${id_origem_transacao} ,'${nome_destino}'
        ,'${documento_destino}' ,'${banco_destino}' ,'${agencia_destino}' ,'${conta_destino}' ,'${tipo_conta_destino}', 1,'${campo_livre}', '${token}', '${cliente}', '${codehash}' )`;
        ////console.log(strSql);
        request.query(strSql, function (err, data) {
            if (err){retorno = err}else{retorno = 'TEF Efetuado'}
        });

    });
}

class ctrTEF{ 
    setEmitirTEF(req, res){
        let obj = req.body; 
        //console.log(obj.client_id);
        
        let continua = (obj.banco_destino != '213') ? false : true;
        
        if(continua){
            obterSaldo(obj.conta_origem)
            .then(saldo =>{
                if(saldo >= obj.valor){
                    EmitirTEF(res, obj)
                    .then(msg => {
                    Helper.sendResponse(res, HttpStatus.OK, 'TEF efetuado com sucesso!');
                    })
                    .catch(error => console.error.bind(console, "Erro: "+error))
                }else{
                    Helper.sendErro(res, HttpStatus.OK, 'Saldo insuficiente!');
                }
            }) 
        }else{
            Helper.sendErro(res, HttpStatus.OK, 'TEF somente é permitido entre contas Atlantic Bank!');
        }
    }
}

export default new ctrTEF();