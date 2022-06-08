import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";

async function gerarToken(res, obj){
    var tratarCampos = '';
    
    let client_id = ( obj.client_id != '' ? obj.client_id : tratarCampos = 'client_id' );
    let senha = ( obj.senha != '' ? obj.senha : tratarCampos = 'senha' );

    if(tratarCampos == ''){
        let codehash = Helper.getHash();
        const sql = require('mssql');

        sql.connect(Helper.configSql, function (err) {
            if (err){
                console.log(err);
                Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
            }else{
                // create Request object
                var request = new sql.Request();
                // query to the database and get the records
                let strSql  = ` SELECT CLIENT_ID, SENHA, NOME_PARCEIRO `;
                strSql     += `FROM TB_DADOS_PARCEIRO `;
                strSql     += ` WHERE CLIENT_ID = '${client_id}' AND SENHA = '${senha}' `;
                //console.log(strSql);
                request.query(strSql, function (err, data) {
                    if (err){
                        console.log(err);
                        Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
                    }else{
                        if(data.rowsAffected[0] > 0){
                            //console.log(data);
                            let sqlStrT = ` INSERT INTO TB_TOKENS(ACCESS_TOKEN, CLIENT_ID) VALUES( '${codehash}', '${client_id}') `;
                            //console.log(sqlStr); 
                            request.query(sqlStrT, function (err, dataG) {
                                if (err){
                                    console.log(err);
                                    Helper.sendFalha(res, 500, 'Falha ao obter o token!');
                                }else{
                                    Helper.sendResponse(res, 201, {token_acesso:codehash, cliente:data.recordset[0].NOME_PARCEIRO});
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
        //console.log('teste 05'+tratarCampos);
        res.status(400).send({erro: `o campo "${tratarCampos}" e obrigatorio!`, status: false})
    }
}

class ctrGerarToken{
    geraToken(req, res){
        var obj = req.body;
        gerarToken(res, obj);
    }
}

export default new ctrGerarToken();
