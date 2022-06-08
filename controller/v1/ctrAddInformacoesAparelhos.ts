import Helper from "../../infra/helper";

async function efetuaCadastro(res, obj){
    //const token             = obj.token;
    const cpfCnpf   = obj.cpfcnpj;
    const client_id = obj.client_id; 
    const constant  = obj.constant;
    const sync      = obj.sync;
    const async     = obj.async;
    const hooks     = obj.hooks;
    const gpsinfo   = obj.gps;
    const acao      = obj.acao;

    const sql = require('mssql');

    sql.connect(Helper.configSql, function (err) {
        if (err){
            console.log(err);
            Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
        }else{
            var request = new sql.Request();
            let strSql  = `INSERT INTO TB_INFO_APARELHOS(NUM_CPF_CNPJ, HASH_APLICACAO_PARCEIRO, CONSTANT, SYNC, ASYNC, HOOKS, GPS_INFO, ID_TIPO_ACAO)
            VALUES('${cpfCnpf}','${client_id}','${constant}','${sync}','${async}','${hooks}', '${gpsinfo}', '${acao}' ) `;
            //console.log(strSql);
            request.query(strSql, function (err, data) {
                if (err){
                    console.log(err);
                    Helper.sendFalhaCadastro(res, 500, 'Falha ao realizar cadastro!');
                }else{
                    Helper.sendResponse(res, 201, 'Cadastro efetuado com sucesso!');    
                }
            });
        }
    });
}

class ctrAddInformacoesAparelhos{ 
    cadastrarInformacoesAparelhos(req, res){
        let obj = req.body; 
        efetuaCadastro(res, obj);
    }
}

export default new ctrAddInformacoesAparelhos();