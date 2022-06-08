import * as express from "express";
import * as bodyParser from "body-parser";

/* nova versao */
import Clientes   from './controller/v2/ctrClientes';
import contasBancarias from './controller/v2/ctrContas';
import TEF from "./controller/v2/ctrTef";
import DepositoConta from "./controller/v2/ctrDepositoConta";
import GerarToken from './controller/v2/ctrGenerateToken';
import WebhookAarin from "./controller/v2/ctrWebhookAarin";
import WebhookIugu from "./controller/v2/ctrWebhookIugu";
import TransacoesAarin from "./controller/v2/ctrTransacoesAarin";
import TransacoesIugu  from "./controller/v2/ctrTransacoesIugu";
import Usuarios from "./controller/v2/ctrUsuario";
import WebScrap from "./controller/v2/ctrWebScrap";
import Parceiros from "./controller/v2/ctrParceiros";
import ClubeWhisky from "./controller/v2/ctrClubeWhisky";
import Servicos from "./controller/v2/ctrServicos";

/* NOUS */

import NOUS from "./controller/v2/ctrNOUS";
 
class StartUp{
    public app: express.Application; 
    //private _db: Db;
    //private bodyParser;

    constructor (){
        this.app = express();
        this.middler();
        this.routes();
    }

    middler(){
        const cors = require('cors');
        /*const getIP = require('ipware')().get_ip;
        this.app.use(function(req, res, next) {
            var ipInfo = getIP(req);
            console.log(ipInfo.clientIp);
            console.log(req.header);
            next();
        });*/

        this.app.use(cors());
        this.app.use(bodyParser({ limit: '10mb' }));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true})); //Permite trabalhar com QueryString
    }

    routes(){
        //Para o verbo GET
        this.app.route("/").get( (req, res) => {
            res.send({
                versao : "0.0.1"
            })
        });

        // ROTAS.
        /*
        function verificaToken(req, res, next){
            const token = req.headers['client_id'];
            if (!token) return res.status(401).json({ auth: false, message: 'Sem acesso.' });
            require("dotenv-safe").config();
            const jwt = require('jsonwebtoken');
            console.log(process.env.SECRET);
            //console.log(token);
            jwt.verify(token, process.env.SECRET, function(err, decoded) {
                if (err){
                    return res.status(500).json({ auth: false, message: 'Falha na autenticação.'+err });
                }else{
                    // se tudo estiver ok, salva no request para uso posterior
                    req.userId = decoded.id;
                }
                next();
            });
        }
*/
        // NOUS
        this.app.route("/nous/v2/listarnos").get(NOUS.getByNoPai);
        this.app.route("/nous/v2/obterdadosno/:cod_no").get(NOUS.getDadosNo);  
        
        //Serviços
        this.app.route("/servicos/v2/recuperasmagenssite").get(Servicos.getImagensSite);

        // CONTAS BANCÁRIAS
        /*
        this.app.get('/contas/v2/clientest/:document', verificaToken, (req, res, next) => { 
            //console.log("Retornou todos clientes!");
            Clientes.getById;
            res.status(201).json([{id:1,nome:'luiz'}]);
        })
        */
       
        this.app.route("/contas/v2/clientes/:document").get(Clientes.getById);
        this.app.route("/contas/v2/clientes").get(Clientes.get);
        this.app.route("/contas/v2/clientes").post(Clientes.post);
        this.app.route("/contas/v2/clientes/:document").put(Clientes.put);
        
        this.app.route("/contas/v2/validarsocio").post(Clientes.validaSocio);

        this.app.route("/contas/v2/saldo/:conta").get(contasBancarias.getSaldo);
        this.app.route("/contas/v2/extrato").post(contasBancarias.getExtrato);
        this.app.route("/contas/v2/extratoapp").post(contasBancarias.getExtratoApp);
        this.app.route("/contas/v2/listarbancosativos").get(contasBancarias.getlistarBancosAtivos);
        
        // USUÁRIOS
        this.app.route("/contas/v2/usuarios").get(Usuarios.getById);
        this.app.route("/contas/v2/verificarusuario").get(Usuarios.usuarioExiste);
        this.app.route("/contas/v2/loginusuario").post(Usuarios.loginusuario);
        this.app.route("/contas/v2/recuperarsenha/:documento").get(Usuarios.recuperaSenha);
        this.app.route("/contas/v2/validarcodigorecuperasenha").get(Usuarios.validarCodigo);
        this.app.route("/contas/v2/atualizarsenha").put(Usuarios.atualizarSenha);
        this.app.route("/contas/v2/atualizarsenhasemcodigo").put(Usuarios.atualizarSenhaSemCod);

        this.app.route("/acesso/v2/generatetoken").post(GerarToken.geraToken);

        this.app.route("/transacao/v2/tef").post(TEF.post);
        this.app.route("/transacao/v2/validarcliente").post(TEF.getDadosCliente);
        this.app.route("/transacao/v2/depositoconta").post(DepositoConta.post);

        /* TRANSAÇÕES SAINDO PELA AARIN */
        this.app.route("/transacao/v2/pixcobranca").post(TransacoesAarin.criarPixCobranca);
        this.app.route("/transacao/v2/listarpixcobranca").post(TransacoesAarin.listarPixCobranca);
        this.app.route("/transacao/v2/listarpixdestino").post(TransacoesAarin.listarPixDestino);
        this.app.route("/transacao/v2/pixdestino").post(TransacoesAarin.criarPixDestino);
        this.app.route("/transacao/v2/pixdestinoconta").post(TransacoesAarin.criarPixDestinoConta);
        this.app.route("/transacao/v2/confirmapixdestino/:pixid").put(TransacoesAarin.confirmarPixDestino);

        /* TRANSACÇÕES SAINDO PELA IUGU */
        this.app.route("/transacao/v2/gerabBoletoiugu").post(TransacoesIugu.geraBoletoIugu);
        this.app.route("/transacao/v2/listaboletosgerados").post(TransacoesIugu.listarBoletosGeradosIugu);

        /* REGRAS E DADOS DOS PARCEIROS COMERCIAIS */
        
        // CONVITES
        this.app.route("/parceiros/v2/listaconvites").get(Parceiros.getListaConvites);
        this.app.route("/parceiros/v2/efetuarcompraconvite").post(Parceiros.criarCompraConvite);
        this.app.route("/parceiros/v2/listaconvitescomprados").post(Parceiros.getListaConvitesComprados);
        this.app.route("/parceiros/v2/gravausoticket").post(Parceiros.gravaUsoTicket);
        this.app.route("/parceiros/v2/listaticketsusados").post(Parceiros.getExtratoTicketsUsados);
        this.app.route("/parceiros/v2/validarticket").post(Parceiros.getValidarTicket);

        // CLUBE DO WHISKY
        this.app.route("/parceiros/v2/pagamentoCartaoClubeWhisky").post(ClubeWhisky.pagamentoCartaoClubeWhisky);
        this.app.route("/parceiros/v2/obterdadosbancariosclubewhisky/:codcartao").get(ClubeWhisky.obterDadosBancariosConta);

        /* RTORNO WEBHOOK DA AARIN */
        this.app.route("/webhook/v2/aarincashout").post(WebhookAarin.cashout);
        this.app.route("/webhook/v2/aarinpix").post(WebhookAarin.pix);
        this.app.route("/webhook/v2/aarindevolucao").post(WebhookAarin.devolucao);
        this.app.route("/webhook/v2/aarinboleto").post(WebhookAarin.boleto);
        this.app.route("/webhook/v2/aarinpixlote").post(WebhookAarin.pixLote);

        /* RTORNO WEBHOOK DA IUGU */
        this.app.route("/webhook/v2/boletoiugu").post(WebhookIugu.pagboleto);

        /* OUTROS MICRO-SERVIÇOS */
        this.app.route("/funcoes/v2/wsc_boleto/:cpf").post(WebScrap.obterScrapUrl);

    }
}

export default new StartUp();