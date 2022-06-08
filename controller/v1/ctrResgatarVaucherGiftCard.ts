import Helper from "../../infra/helper";

async function novoVaucher(res, obj, token){
    var tratarCampos = '';
    
    let client_id  = ( obj.client_id != '' ? obj.client_id : tratarCampos = 'client_id' );
    let valor      = ( obj.valor != '' ? obj.valor : tratarCampos = 'valor' );
    let documento  = ( obj.documento != '' ? obj.documento : tratarCampos = 'documento' );
    let numvaucher =  ( obj.numvaucher != '' ? obj.numvaucher : tratarCampos = 'numvaucher' );

    if(tratarCampos == ''){
        let codehash = Helper.getHash(); //Helper.getCodGiftCard;//Helper.gerarCodVerificacao(100000000000, 999999999999);

        const sql = require('mssql');

        sql.connect(Helper.configSql, function (err) {
            if (err){
                console.log(err);
                Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
            }else{
                // create Request object
                var request = new sql.Request();
                // query to the database and get the records
                let strSql  = ` SELECT ACCESS_TOKEN `;
                strSql     += `FROM TB_TOKENS `;
                strSql     += ` WHERE ACCESS_TOKEN = '${token}' AND VALIDO = 'S' `;
                //console.log(strSql);
                request.query(strSql, function (err, data) {
                    if (err){
                        console.log(err);
                        Helper.sendErro(res, 500, 'Ocorreu um problema interna, por favor, tente mais tarde!');
                    }else{
                        if(data.rowsAffected[0] > 0){

                            let strSQLU = ` SELECT * FROM TB_CLIENTES_TITULAR WHERE NUM_CPF_CNPJ LIKE '${documento}' `;
                            request.query(strSQLU, function (err, dataU) {
                                if (err){
                                    console.log(err);
                                    Helper.sendErro(res, 500, 'Falha ao gravar os dados do vaucher!');
                                }else{
                                    if(dataU.rowsAffected[0] > 0){
                                        let sqlStrT = ` INSERT INTO TB_VOUCHERS_KICKSTART(NUM_CPF, CODIGO_VAUCHER, VALOR_VAUCHER, CODIGO_RASH) VALUES ( '${documento}', '${numvaucher}','${valor}', '${codehash}' ) `;
                                        //console.log(sqlStr); 
                                        request.query(sqlStrT, function (err, data) {
                                            if (err){
                                                console.log(err);
                                                Helper.sendErro(res, 500, 'Falha ao gravar os dados do vaucher!');
                                            }else{
                                                Helper.sendResponse(res, 201, {codigoconfirmacao:codehash});
                                            }
                                        });                                        
                                    }else{
                                        Helper.sendNaoEncontradoMsgPersonalizada(res, 401, {erro:'O Cliente não possui conta no KickPay! Operação não realizada!'});
                                    }
                                }
                            });

                            
                        }else{
                            Helper.sendNaoEncontradoMsgPersonalizada(res, 401, {erro:'Token inválido ou já foi utilizado!'});
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

class ctrResgatarVaucherGiftCard{
    resgatarVaucherGiftCard(req, res){
        var obj = req.body;
        if(typeof(req.headers.authorization) != "undefined"){
            let token = req.headers.authorization.replace("Bearer ", "");
            let obj = req.body;

            if(token){
                novoVaucher(res, obj, token);
            }else{
                res.status(400).send({erro: `o TOKEN é obrigatório!`, status: false})
            }
        }else{
            //console.log(`o TOKEN é obrigatório!`);
            res.status(400).send({erro: `o TOKEN é obrigatório!`, status: false})
        }
    }
}

export default new ctrResgatarVaucherGiftCard();
