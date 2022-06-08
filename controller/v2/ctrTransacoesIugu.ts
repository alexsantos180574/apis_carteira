import { validarInformacoes, retornaDataVencimentoBoleto } from "../../models/funcoes";
import Helper from "../../infra/helper"; 
import { obterDadosCliente,
         gravaBoletoGerado, listaBoletosGerados } from "../../models/mdlTransacoes";

async function executarEndPointIugu(res, pUrl, pData, pMethod) {
  var axios = require('axios');

  
  var config = {
    method: pMethod,
    url: pUrl,
    headers: { 
      'Content-Type': 'application/json', 
      'Cookie': '__cfruid=4fa73bd281dbfba879a1611a981421455ed12e5c-1625321425'
    },
    data : pData
  };

  return axios(config)
  .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    console.log(error);
    Helper.sendErro(res, 401, 'Falha ao executar o procedimento. Erro: '+error);
  });
}

async function gerarBoletoIugu(obj, res, client_id){
  const tokenProducao = '8d77fcdc4047d7fd1f208d8b03f735a7';
  const tokenTeste = '92a1f275c5abcd2834831a0b995b4fa7';

  const datavenc = await retornaDataVencimentoBoleto()
  .then(ret =>{
    return ret;
  })

  obterDadosCliente(res, obj)
  .then(retorno=>{
    //console.log(retorno);
    var axios = require('axios');
    var data = JSON.stringify({
      "ensure_workday_due_date": false,
      "items": [
        {
          "description": "Para depósito em conta MyClube:"+obj.numconta,
          "quantity": obj.quantidade,
          "price_cents": obj.valor
        }
      ],
      "payable_with": [
        "all"
      ],
      "custom_variables": [
        {
          "name": "matricula",
          "value": obj.matricula
        }
      ],
      "payer": {
        "address": {
          "zip_code": retorno[0].cep,
          "street": retorno[0].endereco,
          "city": retorno[0].cidade,
          "state": retorno[0].uf,
          "number": retorno[0].numero,
          "district": retorno[0].bairro,
          "country": "Brasil",
          "complement": retorno[0].complemento
        },
        "name": retorno[0].nome,
        "cpf_cnpj":  retorno[0].num_cpf_cnpj,
        "phone_prefix": retorno[0].num_ddd_telefone,
        "phone": retorno[0].num_telefone,
        "email": retorno[0].email
      },
      "email": retorno[0].email,
      "cc_emails": retorno[0].email,
      "due_date": datavenc, //obj.vencimento,
      "ignore_due_email": false,
      "discount_cents": 0,
      "fines": true,
      "late_payment_fine": 2,
      "notification_url": "http://api.myclube.com.br/webhook/v2/boletoiugu",
      "expired_url": "http://api.myclube.com.br/webhook/v2/boletoiugu"
    });

    let url = 'https://api.iugu.com/v1/invoices?api_token='+tokenTeste;
    let Method = 'post';

    executarEndPointIugu(res, url, data, Method)
    .then(function (ret) {
        //console.log(ret);
      const objeto = JSON.parse(JSON.stringify(ret)); 
      const dados = {"boletocriado":"sim","id":objeto.id, "vencimento":objeto.due_date, "valor":objeto.total, "cpf":objeto.payer_cpf_cnpj, "url_segunda_via":objeto.secure_url, "codigobarra":objeto.bank_slip.digitable_line, "qrcode":objeto.pix.qrcode, "pixcopycola":objeto.pix.qrcode_text, matricula:obj.matricula, num_conta:obj.numconta, valorcentavo:objeto.total_cents};
      gravaBoletoGerado(res, dados, client_id);
    })
    .catch(function (error) {
      res.status(400).send({erro: error, status: false});
    });
  });
  
}

class ctrTransacoes{
  
  geraBoletoIugu(req, res){
    let obj = req.body;
    let arrExcessao  = [];
    validarInformacoes(res, req, arrExcessao)
    .then(msg=>{
        if(msg.retorno=='OK'){
          gerarBoletoIugu(obj, res, msg.client_id);
        }else{
            res.status(400).send({erro: msg.retorno, status: false});
        }
    })
    .catch(erro=>{
        res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
    })
  }

  listarBoletosGeradosIugu(req, res){
    let obj = req.body;
    let arrExcessao  = [];
    validarInformacoes(res, req, arrExcessao)
    .then(msg=>{
        if(msg.retorno=='OK'){
          listaBoletosGerados(res, obj, msg.client_id);
        }else{
            res.status(400).send({erro: msg.retorno, status: false});
        }
    })
    .catch(erro=>{
        res.status(500).send({erro: `Houve uma falha interna, favor entrar em contato com o Administrador!`, status: false})
    })
  }
}

export default new ctrTransacoes()
