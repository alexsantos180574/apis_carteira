import Helper from "../../infra/helper";
import * as HttpStatus from "http-status";

async function novoUsuario(res, obj){
    let tratarCampos = '';

    let token = obj.token;
    let client_id = obj.client_id;
    let nome = ( obj.nome != '' ? obj.nome : tratarCampos = 'nome' );
    let num_cpf_cnpj = ( obj.num_cpf_cnpj != '' ? obj.num_cpf_cnpj : tratarCampos = 'num_cpf_cnpj' );
    let num_ddd_telefone = ( obj.num_ddd_telefone != '' ? obj.num_ddd_telefone : tratarCampos = 'num_ddd_telefone' );
    let num_telefone = ( obj.num_telefone != '' ? obj.num_telefone : tratarCampos = 'num_telefone' );
    let email = ( obj.email != '' ? obj.email : tratarCampos = 'email' );
    let senha_acesso = ( obj.senha_acesso != '' ? obj.senha_acesso : tratarCampos = 'senha_acesso' );

    if(tratarCampos == ''){
        let codehash = Helper.getHash();
        const sql = require('mssql');

        sql.connect(Helper.configSql, function (err) {
            if (err) console.log(err);
            // create Request object
            var request = new sql.Request();
            // CRÉDITO EM CONTA DESTINO
            let sqlStr = `EXEC dbo.sp_novo_usuarios_independentes '${codehash}', '${senha_acesso}', '${num_cpf_cnpj}', '${nome}', ${num_telefone}, ${num_ddd_telefone}, '${email}' `;
            /////console.log(sqlStr);
            request.query(sqlStr, function (err, data) {
                if (err){
                    console.log(err);
                    Helper.sendErro(res, 500, 'Erro ao efetuar o cadastro!');
                }else{
                    Helper.sendResponse(res, 201, 'Cadastro efetuado com sucesso!');
                }                
            });
        });
    }else{
        res.status(400).send({erro: `o campo "${tratarCampos}" e obrigatorio!`, status: false})
    } 
}

class cadUsuarioAcessoRapido{
    incUsuario(req, res){
        var obj = req.body;
        novoUsuario(res, obj)
        .then(msg => {
            Helper.sendResponse(res, HttpStatus.OK, 'Cadastro efetuado com sucesso!');
            })
            .catch(error => console.error.bind(console, "Erro: "+error))
    }
}

export default new cadUsuarioAcessoRapido();
