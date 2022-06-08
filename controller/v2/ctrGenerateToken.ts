import Helper from "../../infra/helper";
import mdlComandosSql from "../../models/mdlComandosSql";

async function gerarToken(res, obj){
    var tratarCampos = '';
    
    let client_id = ( obj.client_id != '' ? obj.client_id : tratarCampos = 'client_id' );
    let senha = ( obj.senha != '' ? obj.senha : tratarCampos = 'senha' );
    let strSql1  = ` select client_id, senha, nome_parceiro `;
    strSql1     += ` from tb_dados_parceiro `;

    if(tratarCampos == ''){
        let codehash = Helper.getHash();
        const sql = require('mssql');

        sql.connect(Helper.configSql(), function (err) {
            if (err){
                console.log(err);
                Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
            }else{
                var request = new sql.Request();
                let strSql  = ` select client_id, senha, nome_parceiro from tb_dados_parceiro where client_id = '${client_id}' and senha = '${senha}' `;
                //console.log(strSql);
                ///Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!'+strSql);
                request.query(strSql, function (err, data) {
                    if (err){
                        console.log(err);
                        Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
                    }else{
                        if(data.rowsAffected[0] > 0){
                            let sqlStrT = ` insert into tb_tokens(access_token, client_id, valido) values( '${codehash}', '${client_id}', 'S') `;
                            request.query(sqlStrT, function (err, dataG) {
                                if (err){
                                    console.log(err);
                                    Helper.sendFalha(res, 500, 'Falha ao obter o token!');
                                }else{
                                    Helper.sendResponse(res, 201, {token_acesso:codehash, cliente:data.recordset[0].nome_parceiro});
                                }
                            });
                        }else{
                            Helper.sendNaoEncontradoMsgPersonalizada(res, 401, {erro:'usuario nao encontrado'});
                        }
                    }
                });
            }            
        });
    }else{
        res.status(400).send({erro: `o campo "${tratarCampos}" e obrigatorio!`, status: false})
    }
}

class ctrGenerateToken{
    geraToken(req, res){
        var obj = req.body;
        gerarToken(res, obj);
    }
}

export default new ctrGenerateToken();
