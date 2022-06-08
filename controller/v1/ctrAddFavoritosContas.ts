////import mdlExtrato from "../models/mdlExtrato";
import Helper from "../../infra/helper";

async function efetuaCadastro(res, obj){
    const token             = obj.token.toString();
    const client_id         = obj.client_id.toString();
    const banco             = obj.banco.toString();
    const agencia           = obj.agencia.toString();
    const conta             = obj.conta.toString();
    const banco_favorito    = obj.banco_favorito.toString();
    const agencia_favorito  = obj.agencia_favorito.toString();
    const conta_favorito    = obj.conta_favorito.toString();
    const nome_favorito     = obj.nome_favorito.toString();
    const cpf_favorecido    = obj.cpf_favorecido.toString();

    const sql = require('mssql');

    sql.connect(Helper.configSql, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        let strSql  = `INSERT INTO TB_FAVORITOS_CONTAS_TRANSFERENCIAS(NUM_BANCO_ORIGEM, NUM_AGENCIA_ORIGEM, CONTA_ORIGEM, NOME, CPF, NUM_CONTA, NUM_BANCO, NUM_AGENCIA)
        VALUES('${banco}','${agencia}','${conta}','${nome_favorito}','${cpf_favorecido}','${conta_favorito}','${banco_favorito}','${agencia_favorito}')`;


//console.log(strSql);

        request.query(strSql, function (err, data) {
            if (err){
                //res.status(500).send({erro: 'Falha ao realizar o cadastro!', status: false});
                Helper.sendFalhaCadastro(res, 500, 'Falha ao realizar cadastro!');
                console.log(err);
            }else{
                Helper.sendResponse(res, 201, 'Cadastro efetuado com sucesso!');    
            }
        });
    });
}

class ctrAddFavoritosContas{ 
    cadastrarFavoritoConta(req, res){
        let obj = req.body; 
        ///console.log(obj.conta);
        efetuaCadastro(res, obj);
    }
}

export default new ctrAddFavoritosContas();