import Helper from "../../infra/helper";

class ctrNovaSenha{
    atualizaSenha(req, res){
        var obj = req.body;

        let num_cpf_cnpj = obj.documento;
        let codigo = obj.codigo;
        let senha_nova  = obj.senha_nova;
    
        const sql = require('mssql');
    
        sql.connect(Helper.configSql, function (err) {
            if (err) console.log(err);
            // create Request object
            var request = new sql.Request();
            // CRÉDITO EM CONTA DESTINO
            let sqlStr = `SELECT DOC_IDENTIFICACAO FROM TB_ACESSO_APLICATIVOS where DOC_IDENTIFICACAO = '${num_cpf_cnpj}' AND COD_VERIFICACAO_SENHA = '${codigo}' `;
            ///console.log(sqlStr);
            request.query(sqlStr, function (err, data) {
                if(data.rowsAffected[0] > 0){
                    let sqlStrU = ` UPDATE TB_ACESSO_APLICATIVOS SET SENHA_ACESSO = '${senha_nova}', COD_VERIFICACAO_SENHA = NULL where DOC_IDENTIFICACAO = '${num_cpf_cnpj}' `;
                    request.query(sqlStrU, function (err, data) {
                        if (err){
                            console.log(err);
                            Helper.sendFalha(res, 401, 'Falha ao atualizar os dados!');
                        }else{
                            Helper.sendResponse(res, 201, 'Senha atualizada com sucesso!');
                        }
                    });    
                }else{
                    Helper.sendNaoEncontradoMsgPersonalizada(res, 401, 'Documento ou código de verificação não confere!');
                }            
            });

        });

    }
}

export default new ctrNovaSenha();
