import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";

class ctrObterClientePorConta{ 
    exibirClientePorConta(req, res){
        const sql = require('mssql');
    
        sql.connect(Helper.configSql, function (err) {
    
            if (err) console.log(err);
            // create Request object
                var request = new sql.Request();
                // query to the database and get the records
            let strSql  = ` SELECT CONTA.SALDO_CONTA AS saldo, CLIENTE.NOME AS nome, CLIENTE.NUM_CPF_CNPJ AS cpf_cnpj
                            FROM TB_CONTAS_BANCARIAS CONTA
                                INNER JOIN TB_CLIENTES_TITULAR CLIENTE
                                        ON CONTA.ID_CLIENTE_TITULAR = CLIENTE.ID_CLIENTE_TITULAR
                            WHERE NUM_CONTA = '${req.params.conta}' `;
            ////console.log(strSql);
            request.query(strSql, function (err, data) {
                if (err){
                    console.log(err);
                    Helper.sendErro(res, 500, 'Erro ao executar a operação!');
                }else{
                    Helper.sendResponse(res, 200, data.recordset);
                }
                
            });
        });
    }
}

export default new ctrObterClientePorConta();