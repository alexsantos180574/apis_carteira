import Helper from "../infra/helper";

function runQuery(query) {
    const sql = require('mssql')
    return sql.connect(Helper.configSql()).then((pool) => {
      return pool.query(query)
    })
  }

export async function validarTokenSync(token){
    let strSql  = ` select access_token `;
    strSql     += `from tb_tokens `;
    strSql     += ` where access_token = '${token}' and valido = 'S' `;
    return runQuery(strSql);
}

export async function cpfcnpjExiste(cpf_cnpj, client_id){
    let strSql  = ` select nome, num_cpf_cnpj from tb_clientes_titular where num_cpf_cnpj = '${cpf_cnpj}' and client_id = '${client_id}'`;
    return runQuery(strSql);
}

export async function GET(strSql){
    return runQuery(strSql);
}

export async function PUT(strSQL){
    return runQuery(strSQL);
}

export async function POST(strSQL){
    return runQuery(strSQL);
}

class mdlComandosSql{

}

export default new mdlComandosSql();