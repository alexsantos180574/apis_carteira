import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";


async function getExtratoPeriodo(res, num_conta, data_inicial, data_final){

    const sql = require('mssql');
    // connect to your database
    sql.connect(Helper.configSql, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        
        // query to the database and get the records
        let strSql  = ` DECLARE @DATA_INI DATETIME = '${data_inicial}', @DATA_FIM DATETIME = '${data_final}' `;
        strSql += " SELECT MOV.ID_ORIGEM_TRANSACAO, ORI.DESC_ORIGEM_TRANSACAO, MOV.DATA_TRANSACAO, MOV.ID_MOV_CONTA_BANCARIA, MOV.VALOR, TIT.NOME,TIT.NUM_CPF_CNPJ, MOV.TIPO_TRANSACAO, ";
        strSql += "	STT.DESC_STATUS_TRANSACAO, NOME_DESTINO, DOCUMENTO_DESTINO, INSTITUICAO_DESTINO, AGENCIA_DESTINO, CONTA_DESTINO, TIPO_CONTA_DESTINO, ";
        strSql += "	MOV.HASH_TOKEN_VOUCHER, MOV.CODIGO_DE_BARRAS, MOV.DESCRICAO, SUBSTRING(MOV.CODIGO_VALIDADOR, 1, 50) AS CODIGO_VALIDADOR ";
        strSql += "	FROM  TB_CONTAS_BANCARIAS CON ";
        strSql += "	INNER JOIN TB_CLIENTES_TITULAR TIT ON TIT.ID_CLIENTE_TITULAR = CON.ID_CLIENTE_TITULAR ";
        strSql += "	INNER JOIN TB_MOV_CONTA_BANCARIA MOV ON MOV.NUM_CONTA = CON.NUM_CONTA AND CONVERT(VARCHAR(10), MOV.DATA_TRANSACAO, 23) BETWEEN @DATA_INI AND  @DATA_FIM ";
        strSql += "	INNER JOIN TB_ORIGEM_TRANSACOES ORI ON MOV.ID_ORIGEM_TRANSACAO = ORI.ID_ORIGEM_TRANSACAO ";
        strSql += "	LEFT JOIN	TB_STATUS_TRANSACAO STT   ON MOV.ID_STATUS_TRANSACAO = STT.ID_STATUS_TRANSACAO ";
        strSql += ` WHERE CON.NUM_CONTA = '${num_conta}' `;
        strSql += " ORDER BY ID_MOV_CONTA_BANCARIA DESC ";
       ///console.log(strSql);
        request.query(strSql, function (err, data) {
            if (err){
                console.log(err);
                Helper.sendErro(res, 401, 'Falha ao obter extrato!')
            }else{
                Helper.sendExtrato(res, 201, data.recordset);
            }            
        });
        
    });
}

class ctrExtratoPeriodo{ 
    getExtratoPeriodoId(req, res){
        getExtratoPeriodo(res, req.params.conta, req.params.datainicial, req.params.datafinal);
    }
}

export default new ctrExtratoPeriodo();