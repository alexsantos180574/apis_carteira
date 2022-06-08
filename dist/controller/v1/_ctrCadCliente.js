"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../infra/helper");
function novoCliente(res, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        var tratarCampos = '';
        let token = obj.token;
        let client_id = obj.client_id;
        let id_tipo_cliente = obj.id_tipo_cliente;
        let nome = (obj.nome != '' ? obj.nome : tratarCampos = 'nome');
        let data_nascimento = (obj.data_nascimento != '' ? obj.data_nascimento : tratarCampos = 'data_nascimento');
        let id_tipo_documento = (obj.id_tipo_documento != '' ? obj.id_tipo_documento : tratarCampos = 'id_tipo_documento');
        let doc_identificacao = (obj.doc_identificacao != '' ? obj.doc_identificacao : tratarCampos = 'doc_identificacao');
        let img_foto_documento_frente_base64 = obj.img_foto_documento_frente_base64;
        let img_foto_documento_verso_base64 = obj.img_foto_documento_verso_base64;
        let img_foto_face_base64 = obj.img_foto_face_base64;
        let num_cpf_cnpj = (obj.num_cpf_cnpj != '' ? obj.num_cpf_cnpj : tratarCampos = 'num_cpf_cnpj');
        let ind_pais = (obj.ind_pais != '' ? obj.ind_pais : tratarCampos = 'ind_pais');
        let num_ddd_telefone = (obj.num_ddd_telefone != '' ? obj.num_ddd_telefone : tratarCampos = 'num_ddd_telefone');
        let num_telefone = (obj.num_telefone != '' ? obj.num_telefone : tratarCampos = 'num_telefone');
        let email = (obj.email != '' ? obj.email : tratarCampos = 'email');
        let senha_acesso = obj.senha_acesso;
        let nome_fantasia = obj.nome_fantasia;
        let renda_bruta_mensal = obj.renda_bruta_mensal;
        let pep = obj.pep;
        let id_profissao = (obj.id_profissao != '' ? obj.id_profissao : tratarCampos = 'id_profissao');
        let valor_patrimonio = obj.valor_patrimonio;
        let leu_termo_uso = obj.leu_termo_uso;
        let aceitou_termo_uso = obj.aceitou_termo_uso;
        let leu_politica_privacidade = obj.leu_politica_privacidade;
        let aceitou_politica_privacidade = obj.aceitou_politica_privacidade;
        let cep = (obj.cep != '' ? obj.cep : tratarCampos = 'cep');
        let endereco = (obj.endereco != '' ? obj.endereco : tratarCampos = 'endereco');
        let numero = (obj.numero != '' ? obj.numero : tratarCampos = 'numero');
        let complemento = obj.complemento;
        let bairro = (obj.bairro != '' ? obj.bairro : tratarCampos = 'bairro');
        let cidade = (obj.cidade != '' ? obj.cidade : tratarCampos = 'cidade');
        let uf = (obj.uf != '' ? obj.uf : tratarCampos = 'uf');
        if (tratarCampos == '') {
            let codehash = helper_1.default.getHash();
            const sql = require('mssql');
            sql.connect(helper_1.default.configSql, function (err) {
                if (err)
                    console.log(err);
                // create Request object
                var request = new sql.Request();
                // CRÉDITO EM CONTA DESTINO
                let sqlStr = `EXEC dbo.sp_novo_cliente ${id_tipo_cliente}, '${nome}','${data_nascimento}', ${id_tipo_documento},'${doc_identificacao}','${img_foto_documento_frente_base64}',
            '${img_foto_documento_verso_base64}','${img_foto_face_base64}','${num_cpf_cnpj}',${ind_pais},'${num_ddd_telefone}','${num_telefone}','${email}',
            '${senha_acesso}', 0,'${nome_fantasia}', '${cep}','${endereco}',${numero},'${complemento}','${bairro}','${cidade}','${uf}', '${codehash}',
            ${renda_bruta_mensal},'${pep}',${id_profissao}, ${valor_patrimonio},'${leu_termo_uso}','${aceitou_termo_uso}','${leu_politica_privacidade}','${aceitou_politica_privacidade}', '${client_id}' `;
                //console.log(sqlStr); 
                request.query(sqlStr, function (err, data) {
                    if (err) {
                        console.log(err);
                        helper_1.default.sendFalha(res, 500, 'Falha ao atualizar os dados!');
                    }
                    else {
                        helper_1.default.sendResponse(res, 201, 'Cadastro atualizado com sucesso!');
                    }
                });
            });
        }
        else {
            //console.log('teste 05'+tratarCampos);
            res.status(400).send({ erro: `o campo "${tratarCampos}" e obrigatorio!`, status: false });
        }
    });
}
class cadClientes {
    incCliente(req, res) {
        var obj = req.body;
        //console.log('teste');
        novoCliente(res, obj);
    }
}
exports.default = new cadClientes();
