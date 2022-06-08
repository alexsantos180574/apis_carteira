import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";

class atuSenha{
    atualizaSenha(req, res){
        var obj = req.body;

        let num_cpf_cnpj = req.params.documento;

        let token = obj.token;
        let client_id = obj.client_id;
        let senha_atual = obj.senha_atual;
        let senha_nova  = obj.senha_nova;
    
        const sql = require('mssql');
    
        sql.connect(Helper.configSql, function (err) {
            if (err) console.log(err);
            // create Request object
            var request = new sql.Request();
            // CRÉDITO EM CONTA DESTINO
            let sqlStr = `SELECT NUM_CPF_CNPJ FROM TB_CLIENTES_TITULAR where NUM_CPF_CNPJ = '${num_cpf_cnpj}' AND SENHA_ACESSO = '${senha_atual}' `;

            request.query(sqlStr, function (err, data) {
                if(data.rowsAffected[0] > 0){
                    let sqlStrU = ` UPDATE TB_CLIENTES_TITULAR SET SENHA_ACESSO = '${senha_nova}' where NUM_CPF_CNPJ = '${num_cpf_cnpj}' `;
                    request.query(sqlStrU, function (err, data) {
                        if (err){
                            console.log(err);
                            Helper.sendFalha(res, HttpStatus.OK, 'Falha ao atualizar os dados!');
                        }else{
                            Helper.sendResponse(res, HttpStatus.OK, 'Senha alterada com sucesso!');
                        }
                    });    
                }else{
                    Helper.sendNaoEncontradoMsgPersonalizada(res, HttpStatus.OK, 'Senha atual não confere!');
                }            
            });

        });

    }
}

export default new atuSenha();
