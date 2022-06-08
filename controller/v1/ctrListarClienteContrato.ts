import Helper from "../../infra/helper";

const buscarCliente = async (req, res) => {
  const sql = require("mssql");

  sql.connect(Helper.configSql, (err) => {
    if (err) console.log(err);

    let strSql = `SELECT * FROM vw_cliente_endereco WHERE CPF = '${req.params.cpf}'`;

    let request = new sql.Request();

    request.query(strSql, (err, data) => {
      if (err || data.recordset[0] == null || data.recordset[0] == "") {
        Helper.sendErro(
          res,
          400,
          "CPF não encontrado ou paramêtro mal informado!"
        );
      } else {
        Helper.sendResponse(res, 200, data.recordset);
      }
    });
  });
};

class ctrListarClienteContrato {
  listarClientesContrato(req, res) {
    buscarCliente(req, res);
  }
}

export default new ctrListarClienteContrato();
