import Helper from "../infra/helper"; 
import { GET, PUT } from "../models/mdlComandosSql";

export async function saldo(res, conta, client_id){
    let strSql  = `select saldo_conta as saldo from tb_contas_bancarias where num_conta = '${conta}' and client_id = '${client_id}'`;
   
    GET(strSql)
    .then(ret=>{
        if(ret.rowsAffected[0] > 0){
            Helper.sendResponse(res, 200, ret.recordset);
        }else{
            Helper.sendResponse(res, 201, 'Nenhum resultado!');
        }
    })
    .catch(erro =>{
        Helper.sendResponse(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
    })    
}

export async function obterExtratoConta(req, res, client_id){  
    
    let strSql = ` DECLARE @PageNumber AS INT, @RowspPage AS INT 
    SET @PageNumber = ${req.body.pagina}
    SET @RowspPage = ${req.body.qtdlinhas}
    SELECT * FROM ( 
        SELECT ROW_NUMBER() OVER(ORDER BY MOV.ID_MOV_CONTA_BANCARIA DESC) AS number, ORI.DESC_ORIGEM_TRANSACAO transacao_origem, STT.DESC_STATUS_TRANSACAO transacao_status, MOV.TIPO_TRANSACAO transacao_tipo,
        MOV.DATA_TRANSACAO transacao_data_hora, MOV.ID_MOV_CONTA_BANCARIA mov_bancaria_id, MOV.VALOR valor, TIT.NUM_CPF_CNPJ cpf_cnpj, 
        
        UPPER(MOV.NOME_DESTINO) AS destino_nome, 
        UPPER(MOV.DOCUMENTO_DESTINO) AS destino_documento, 
        UPPER(MOV.INSTITUICAO_DESTINO) as destino_banco, 
        UPPER(MOV.AGENCIA_DESTINO) as destino_agencia, 
        UPPER(MOV.CONTA_DESTINO) as destino_conta, 
        UPPER(MOV.TIPO_CONTA_DESTINO) as destino_tipo_conta, 
        
        UPPER(MOV.origem_nome) AS origem_nome, 
        UPPER(MOV.documento_origem) AS origem_documento, 
        UPPER(MOV.instituicao_origem) as origem_banco, 
        UPPER(MOV.agencia_origem) as origem_agencia, 
        UPPER(MOV.conta_origem) as origem_conta, 
        UPPER(MOV.tipo_conta_origem) as origem_tipo_conta, 
    
        MOV.token_transacional, 
        MOV.ID_MOV_CONTA_BANCARIA mov_conta_bancaria_id
    FROM TB_CLIENTES_TITULAR TIT 
        INNER JOIN TB_CONTAS_BANCARIAS CON ON TIT.ID_CLIENTE_TITULAR = CON.ID_CLIENTE_TITULAR AND CON.NUM_CONTA = '${req.body.numconta}'
        INNER JOIN TB_MOV_CONTA_BANCARIA MOV ON MOV.NUM_CONTA = CON.NUM_CONTA 
        INNER JOIN TB_ORIGEM_TRANSACOES ORI ON MOV.ID_ORIGEM_TRANSACAO = ORI.ID_ORIGEM_TRANSACAO 
        LEFT JOIN	TB_STATUS_TRANSACAO STT   ON MOV.ID_STATUS_TRANSACAO = STT.ID_STATUS_TRANSACAO 
    WHERE TIT.client_id = '${client_id}'
    ) AS TBL 
    WHERE number BETWEEN ((@PageNumber - 1) * @RowspPage + 1) AND (@PageNumber * @RowspPage) 
    ORDER BY mov_conta_bancaria_id DESC `;

   GET(strSql)
   .then(ret=>{
       if(ret.rowsAffected[0] > 0){
           Helper.sendResponse(res, 200, ret.recordset);
       }else{
           Helper.sendNaoEncontrado(res, 200, 'Nenhum resultado!');
       }
   })
   .catch(erro =>{
       Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
   })
}

export async function listarBancosAtivos(req, res, client_id){
    let strSql = `select listar_bancos_id, nome_banco, ispb from  tb_listar_bancos where ativo = 'S' order by nome_banco `;
    GET(strSql)
   .then(ret=>{
       if(ret.rowsAffected[0] > 0){
           Helper.sendResponse(res, 200, ret.recordset);
       }else{
           Helper.sendNaoEncontrado(res, 200, 'Nenhum banco cadastrado ou ativo!');
       }
   })
   .catch(erro =>{
       Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
   })
}

export async function obterExtratoContaApp(req, res, client_id){ 
    
    let strSql = ` DECLARE @PageNumber AS INT, @RowspPage AS INT 
    SET @PageNumber = ${req.body.pagina}
    SET @RowspPage = ${req.body.qtdlinhas}
    SELECT 
        convert(varchar(10), transacao_data_hora, 103) as time, transacao_status as title, 
        'Valor: '+convert(varchar, format(valor, 'c', 'pt-br')) as description,
        (case when transacao_tipo = 'S' then 'icon_minus' else 'icon_plus' end) as icon,
        (case when transacao_tipo = 'S' then 'red' else 'green' end) as lineColor,
        format (valor, 'c', 'pt-br') as valor, token_transacional, cpf_cnpj as cpf, transacao_tipo,
		destino_nome, destino_documento, destino_banco, destino_agencia, destino_conta, destino_tipo_conta, 
    	origem_nome, origem_documento, origem_banco, origem_agencia, origem_conta, origem_tipo_conta 
			
    FROM ( 
    SELECT ROW_NUMBER() OVER(ORDER BY MOV.ID_MOV_CONTA_BANCARIA DESC) AS number, ORI.DESC_ORIGEM_TRANSACAO transacao_origem, STT.DESC_STATUS_TRANSACAO transacao_status, MOV.TIPO_TRANSACAO transacao_tipo,
    MOV.DATA_TRANSACAO transacao_data_hora, MOV.ID_MOV_CONTA_BANCARIA mov_bancaria_id, MOV.VALOR valor, TIT.NUM_CPF_CNPJ cpf_cnpj, 
    
	UPPER(MOV.NOME_DESTINO) AS destino_nome, 
	UPPER(MOV.DOCUMENTO_DESTINO) AS destino_documento, 
	UPPER(MOV.INSTITUICAO_DESTINO) as destino_banco, 
	UPPER(MOV.AGENCIA_DESTINO) as destino_agencia, 
	UPPER(MOV.CONTA_DESTINO) as destino_conta, 
	UPPER(MOV.TIPO_CONTA_DESTINO) as destino_tipo_conta, 
    
	UPPER(MOV.origem_nome) AS origem_nome, 
	UPPER(MOV.documento_origem) AS origem_documento, 
	UPPER(MOV.instituicao_origem) as origem_banco, 
	UPPER(MOV.agencia_origem) as origem_agencia, 
	UPPER(MOV.conta_origem) as origem_conta, 
	UPPER(MOV.tipo_conta_origem) as origem_tipo_conta, 

	MOV.token_transacional, 
	MOV.ID_MOV_CONTA_BANCARIA mov_conta_bancaria_id
    FROM TB_CLIENTES_TITULAR TIT 
        INNER JOIN TB_CONTAS_BANCARIAS CON ON TIT.ID_CLIENTE_TITULAR = CON.ID_CLIENTE_TITULAR AND CON.NUM_CONTA = '${req.body.numconta}'
        INNER JOIN TB_MOV_CONTA_BANCARIA MOV ON MOV.NUM_CONTA = CON.NUM_CONTA 
        INNER JOIN TB_ORIGEM_TRANSACOES ORI ON MOV.ID_ORIGEM_TRANSACAO = ORI.ID_ORIGEM_TRANSACAO 
        LEFT JOIN  TB_STATUS_TRANSACAO STT   ON MOV.ID_STATUS_TRANSACAO = STT.ID_STATUS_TRANSACAO 
        LEFT JOIN  tb_pix_destino_gerados PIXD ON PIXD.code_hash = MOV.token_transacional and PIXD.client_id = MOV.client_id
        LEFT JOIN tb_cobrancas_pix_geradas PIXG  ON PIXG.code_hash = MOV.token_transacional and PIXG.client_id = MOV.client_id
    WHERE TIT.client_id = '${client_id}'
    ) AS TBL 
    WHERE number BETWEEN ((@PageNumber - 1) * @RowspPage + 1) AND (@PageNumber * @RowspPage) 
    ORDER BY mov_conta_bancaria_id DESC `;

   GET(strSql)
   .then(ret=>{
       if(ret.rowsAffected[0] > 0){
           Helper.sendResponse(res, 200, ret.recordset);
       }else{
           Helper.sendNaoEncontrado(res, 200, 'Nenhum resultado!');
       }
   })
   .catch(erro =>{
       Helper.sendErro(res, 500, 'Erro interno, favor entrar em contato com o Administrador!');
   })
}


