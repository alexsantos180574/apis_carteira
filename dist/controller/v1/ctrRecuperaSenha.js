"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../infra/helper");
class ctrRecuperaSenha {
    enviarEmail(req, res) {
        const sql = require('mssql');
        const nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'alexmello180574@gmail.com',
                pass: 'ale775569!',
            }
        });
        // connect to your database
        sql.connect(helper_1.default.configSql, function (err) {
            if (err)
                console.log(err);
            // create Request object
            var request = new sql.Request();
            // query to the database and get the records
            let strSql = ` select nome, num_celular as celular , num_ddd as ddd, email `;
            strSql += `   from tb_acesso_aplicativos `;
            strSql += ` where doc_identificacao = '${req.params.documento}'`;
            //console.log(strSql);
            request.query(strSql, function (err, data) {
                if (err) {
                    console.log(err);
                    helper_1.default.sendErro(res, 401, 'Sistema indisponivel no momento, por favor, tente mais tarde!');
                }
                else {
                    if (data.rowsAffected[0] > 0) {
                        const codigoverificacao = helper_1.default.gerarCodVerificacao(1000, 9999);
                        /* grava o código na conta do usuário para ser validado */
                        let strSqlU = ` update tb_acesso_aplicativos set cod_verificacao_senha = '${codigoverificacao}' `;
                        strSqlU += ` where doc_identificacao = '${req.params.documento}'`;
                        //console.log(strSqlU);
                        request.query(strSqlU, function (errs, datas) {
                            if (errs) {
                                console.log(errs);
                                helper_1.default.sendErro(res, 500, 'Sistema indisponivel no momento, por favor, tente mais tarde!');
                            }
                            else {
                                let texto = ' <html> <strong>Seu código de verificação para alteração de senha é:</strong> ' + codigoverificacao + '</html>';
                                const mailOptions = {
                                    from: 'alexmello180574@gmail.com',
                                    to: data.recordset[0].email,
                                    subject: 'Atlantic Bank - Recuperação de senha',
                                    html: texto
                                };
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                        helper_1.default.sendErro(res, 500, 'Sistema indisponivel no momento, por favor, tente mais tarde!');
                                    }
                                    else {
                                        //console.log('Email enviado: ' + info.response);
                                        helper_1.default.sendResponse(res, 201, { mensagem: 'Um código de validação foi enviado para seu email cadastrado!', email: data.recordset[0].email });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        helper_1.default.sendNaoEncontrado(res, 401, 'Usuário não encontrado!');
                    }
                }
            });
        });
    }
}
exports.default = new ctrRecuperaSenha();
