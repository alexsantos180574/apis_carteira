import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";

class CtrListaCartao{ 
    exibirListaCartao(req, res){
        const sql = require('mssql');
    
        // connect to your database
        sql.connect(Helper.configSql, function (err) {
    
            if (err) console.log(err);
            // create Request object
    
            var request = new sql.Request();
    
            // query to the database and get the records
            let strSql = `SELECT ID_CARTAO as id_cartao
                                ,DOCUMENTO AS documento
                                ,BANDEIRA_CARTAO AS bandeira
                                ,MES_VALIDADE_CARTAO AS mes
                                ,ANO_VALIDADE_CARTAO AS ano
                                ,NOME_NO_CARTAO AS nome
                                ,NUMERO_CARTAO AS numero
                                ,CVV_CARTAO AS cvv
                                ,TIPO_CARTAO AS tipo
                          FROM TB_CARTAO_DE_CREDITO
                          WHERE DOCUMENTO = '${req.params.documento}'`;

            request.query(strSql, function (err, data) {
                if (err) console.log(err)
                Helper.sendLista(res, HttpStatus.OK, data.recordset);
            });
        });
    }
}

export default new CtrListaCartao();