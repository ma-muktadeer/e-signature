CREATE OR REPLACE VIEW VW_SIGNATURE_HISTORY_REPORT AS
    SELECT ROWNUM AS id_key,
           V.*
      FROM (SELECT 
                   TRY.TX_NAME,
                   TRY.TX_PA,
                   SG.DTT_SIGNATURE_CREATE                             AS DTT_SIGNATURE_CREATE,
                   FAG.DTT_CREATE                                      AS DTT_AGREEMENT_FILE,
                   FAP.DTT_CREATE                                      AS DTT_APPROVAL_FILE,
                   SG.DTT_MOD                                          AS DTT_UPDATE,
                   CASE 
                        WHEN EXISTS (SELECT 1 
                                       FROM VW_SIGNATURE_INFO SGR
                                      WHERE SGR.IS_ACTIVE = 0 
                                        AND SGR.IS_MAIN_SIGNATURE = 1
                                        AND SGR.TX_PA = TRY.TX_PA) 
                        THEN (SELECT MAX(SGR.DTT_SIGNATURE_CREATE) 
                                FROM VW_SIGNATURE_INFO SGR
                               WHERE SGR.IS_ACTIVE = 1 
                                 AND SGR.IS_MAIN_SIGNATURE = 1
                                 AND SGR.TX_PA = TRY.TX_PA)
                        ELSE NULL
                    END AS DTT_UPDATE_IMAGE
              FROM VW_SIGNATURE_INFO SG 
              LEFT JOIN T_SIGNATORY TRY ON TRY.ID_SIGNATORY_KEY = SG.ID_SIGNATORY_KEY
              LEFT JOIN T_FILES FAG
                 ON FAG.ID_OBJECT_KEY = SG.ID_SIGNATORY_KEY AND FAG.TX_OBJECT_TYPE = 'AGREEMENT_FILE'
              LEFT JOIN T_FILES FAP
                 ON FAP.ID_OBJECT_KEY = SG.ID_SIGNATORY_KEY AND FAP.TX_OBJECT_TYPE = 'APPROVAL_FILE'
              WHERE SG.IS_MAIN_SIGNATURE = 1
              AND SG.IS_ACTIVE = 1
              ORDER BY SG.ID_SIGNATURE_KEY DESC
           ) V