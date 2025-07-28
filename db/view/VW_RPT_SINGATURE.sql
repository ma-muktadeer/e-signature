CREATE OR REPLACE VIEW VW_RPT_SINGATURE
AS
    SELECT ROWNUM     AS id_key,
           V."ID_USER_CREATE_KEY",
           V."TX_FULL_NAME",
           V."TX_PA",
            V."TX_NAME",
           V."DTT_PA_CREATE",
           V."DTT_SIGNATURE_CREATE",
            V."DTT_SIGNATURE_AUTH",
           V."TX_MAKER_NAME",
           V."TX_CHECKER_NAME",
            V."DT_AUTHORIZE_TIME",
           V."DTT_EFFECTIVE_DATE",
           V."TX_SIGNATURE_STATUS",
           V."DT_INACTIVE_TIME",
           V."DT_CANCEL_TIME",
           V."DTT_AGREEMENT_FILE",
           V."DTT_APPROVAL_FILE",
           V."DTT_DELETE",
           V."DT_CANCEL_CERCULAR"
      FROM (SELECT SG.ID_USER_CREATE_KEY,
                   USR.TX_FULL_NAME,
                   SG.TX_PA,
                    SG.TX_NAME,
                   SG.DTT_CREATE                                       AS DTT_PA_CREATE,
                   SGR.DTT_CREATE                                      AS DTT_SIGNATURE_CREATE,
                   SGR.DT_AUTH_DATE                                     AS DTT_SIGNATURE_AUTH,
                    USRR.TX_FULL_NAME                                  AS TX_MAKER_NAME,
                    USRA.TX_FULL_NAME                                 AS TX_CHECKER_NAME,
                   SG.DT_AUTHORIZE_TIME,
                   SGR.DTT_EFFECTIVE_DATE,
                   SGR.TX_SIGNATURE_STATUS,
                   SGR.DT_INACTIVE_TIME,
                   SGR.DT_CANCEL_TIME,
                   FAG.DTT_CREATE                                      AS DTT_AGREEMENT_FILE,
                   FAP.DTT_CREATE                                      AS DTT_APPROVAL_FILE,
                   CASE WHEN SGR.IS_ACTIVE = 0 THEN SGR.DTT_MOD END    AS DTT_DELETE,
                     FCC.DTT_CREATE            AS DT_CANCEL_CERCULAR
              FROM T_SIGNATORY  SG
                   LEFT JOIN T_FILES FAG
                       ON     FAG.ID_OBJECT_KEY = SG.ID_SIGNATORY_KEY
                          AND FAG.TX_OBJECT_TYPE = 'AGREEMENT_FILE'
                   LEFT JOIN T_FILES FAP
                       ON     FAP.ID_OBJECT_KEY = SG.ID_SIGNATORY_KEY
                          AND FAP.TX_OBJECT_TYPE = 'APPROVAL_FILE'
                           LEFT JOIN T_FILES FCC
                         ON     FCC.ID_OBJECT_KEY = SG.ID_SIGNATORY_KEY
                            AND FCC.TX_OBJECT_TYPE = 'CANCELATION'
                   JOIN T_USER USR ON USR.ID_USER_KEY = SG.ID_USER_CREATE_KEY
                   JOIN T_SIGNATURE SGR
                       ON SGR.ID_SIGNATORY_KEY = SG.ID_SIGNATORY_KEY
                       LEFT JOIN T_USER USRR ON SGR.ID_USER_CREATE_KEY = USRR.ID_USER_KEY
                        LEFT JOIN T_USER USRA
                         ON SGR.ID_AUTH_BY = USRA.ID_USER_KEY
                       ) V;
