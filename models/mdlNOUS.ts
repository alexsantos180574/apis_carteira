import Helper from "../infra/helper"; 
import { GET, PUT, POST } from "../models/mdlComandosSql";


export async function obterDadosNO(res, req){ 
    let strSql  = ` 
    CREATE TABLE #TMP_NOUS(ID_NO INT, ID_LINK INT, ND_NO VARCHAR(255), ID_NO2 INT, NIVEL INT, ULT_NIVEL CHAR(1) NOT NULL DEFAULT 'S', ND_ASSOC VARCHAR(255), ND_VISIBILITY INT, ND_URL NVARCHAR(MAX), ND_CREATOR INT, CREATION_DATE DATETIME)
        CREATE TABLE #TMP_NOUS_AUX(ID_NO INT, ID_LINK INT, ND_NO VARCHAR(255), ID_NO2 INT, NIVEL INT, ULT_NIVEL CHAR(1) NOT NULL DEFAULT 'S', ND_ASSOC VARCHAR(255), ND_VISIBILITY INT, ND_URL NVARCHAR(MAX), ND_CREATOR INT, CREATION_DATE DATETIME)
        
        DECLARE  @ID_NO_AUX INT, @ID_NO INT = ${req.params.cod_no}, @ND_NO VARCHAR(255), @ID_LINK INT, @ID_NO2 INT, @ND_ASSOC VARCHAR(255), @ND_VISIBILITY INT, @ND_URL NVARCHAR(MAX), @ND_CREATOR INT, @CREATION_DATE DATETIME
         
        INSERT INTO #TMP_NOUS(ID_NO, ID_LINK, ND_NO, ID_NO2, NIVEL, ND_VISIBILITY, ND_URL, ND_CREATOR, CREATION_DATE)
        SELECT ID, null, ND, ID, 0, null, null, null, null FROM ND WHERE ID = @ID_NO
    
        INSERT INTO #TMP_NOUS_AUX(ID_NO, ID_LINK, ND_NO, ID_NO2, NIVEL, ND_VISIBILITY, ND_URL, ND_CREATOR, CREATION_DATE)
        SELECT ID, null, ND, ID, 0, null, null, null, null FROM ND WHERE ID = @ID_NO
    
        DECLARE @COUNT INT = 1
        WHILE @COUNT <= 1000
        BEGIN
    
                DECLARE C_LINK_AUX CURSOR FOR
                select L.ND1, N.ND, L.ID AS ID_LINK, L.ND2, ASS.ND AS ND_ASSOC, N.ND_VISIBILITY, N.ND_URL, N.ND_CREATOR, N.CREATION_DATE
                from ND N
                INNER JOIN LNK2 L
                ON L.ND2 = N.ID AND L.ND1 in (select ID_NO2 from #TMP_NOUS_AUX WHERE NIVEL = (@COUNT -1))
                INNER JOIN ND ASS
                ON L.ND_ASSOC = ASS.ID
                
    
                OPEN C_LINK_AUX
                
                FETCH NEXT FROM C_LINK_AUX
                INTO @ID_NO_AUX, @ND_NO, @ID_LINK, @ID_NO2, @ND_ASSOC, @ND_VISIBILITY, @ND_URL, @ND_CREATOR, @CREATION_DATE
    
                WHILE @@FETCH_STATUS = 0
                BEGIN
                    INSERT INTO #TMP_NOUS_AUX(ID_NO, ID_LINK, ND_NO, ID_NO2, NIVEL, ND_ASSOC, ND_VISIBILITY, ND_URL, ND_CREATOR, CREATION_DATE) VALUES(@ID_NO_AUX, @ID_LINK, @ND_NO, @ID_NO2, @COUNT, @ND_ASSOC, @ND_VISIBILITY, @ND_URL, @ND_CREATOR, @CREATION_DATE)
                    
                    INSERT INTO #TMP_NOUS(ID_NO, ID_LINK, ND_NO, ID_NO2, NIVEL, ND_ASSOC, ND_VISIBILITY, ND_URL, ND_CREATOR, CREATION_DATE) VALUES(@ID_NO_AUX, @ID_LINK, @ND_NO, @ID_NO2, @COUNT, @ND_ASSOC, @ND_VISIBILITY, @ND_URL, @ND_CREATOR, @CREATION_DATE)
                    UPDATE #TMP_NOUS SET ULT_NIVEL = 'N' WHERE ID_NO2 = @ID_NO_AUX AND NIVEL = (@COUNT-1)
                    --exec sp_retorna_nos_filhos @ID_NO
                    
                    FETCH NEXT FROM C_LINK_AUX
                    INTO @ID_NO_AUX,  @ND_NO, @ID_LINK, @ID_NO2, @ND_ASSOC, @ND_VISIBILITY, @ND_URL, @ND_CREATOR, @CREATION_DATE
                END
    
                CLOSE C_LINK_AUX
                DEALLOCATE C_LINK_AUX
    
            ---PRINT @COUNT
            SET @COUNT = (@COUNT+1)
        END
    
        SELECT ID_NO as id_no, ID_LINK as id_link, ND_NO as nome_no, ID_NO2 as id_no2, NIVEL as nivel, ULT_NIVEL AS ultimo_nvel, ND_ASSOC AS nome_associacao, ND_VISIBILITY AS visibilidade, ND_URL AS url_no, ND_CREATOR AS criador, CREATION_DATE AS data_criacao FROM #TMP_NOUS ORDER BY NIVEL
    
        DROP TABLE #TMP_NOUS
        DROP TABLE #TMP_NOUS_AUX `;
//console.log(strSql);
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

export async function listarNosPai(res){ 
    let strSql  = ` SELECT ID AS id_no_pai, ND AS nome_no_pai FROM ND WHERE ID IN (SELECT ND1 FROM LNK2) ORDER BY ND `;
    
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
