CREATE OR REPLACE VIEW VW_RPT_SINGATURE_SEARCH
AS
    SELECT ROWNUM     AS ID_SIGNATURE_SEARCH_KEY,
           V."TX_SEARCH_USER_NAME",
           V."DTT_ACTIVITY",
           V."TX_ACTIVITY_TYPE",
           V."TX_SEARCH_BY",
           V."TX_SEARCH_TEXT",
           V."TX_STATUS",
           V."TX_SOURCE_IP",
           V."TX_INSTITUTION_NAME",
           V."TX_BRANCH_NAME"
      FROM (  SELECT USR.TX_FULL_NAME
                         AS TX_SEARCH_USER_NAME,
                     L.DTT_ACTIVITY,
                     L.TX_ACTIVITY_TYPE,
                     CASE WHEN L.TX_PA IS NOT NULL THEN 'PA' ELSE 'NAME' END
                         AS TX_SEARCH_BY,
                     CASE
                         WHEN L.TX_PA IS NOT NULL THEN L.TX_PA
                         ELSE L.TX_NAME
                     END
                         AS TX_SEARCH_TEXT,
                     L.TX_STATUS,
                     L.TX_SOURCE_IP,
                     I.TX_NAME
                         AS TX_INSTITUTION_NAME,
                     B.TX_BRANCH_NAME
                FROM T_ACTIVITY_LOG L
                     LEFT JOIN T_USER USR ON L.ID_USER_KEY = USR.ID_USER_KEY
                     LEFT JOIN T_INSTITUTION I
                         ON I.ID_INSTITUTION_KEY = USR.ID_INSTITUTION_KEY
                     LEFT JOIN T_BRANCH B
                         ON B.ID_BRANCH_ID = USR.ID_LEGAL_ENTITY_KEY
               WHERE L.TX_ACTIVITY_TYPE IN
                         ('VIEW_SIGNATURE',
                          'SEARCH_SIGNATURE',
                          'DOWNLOAD_SIGNATURE')
            ORDER BY L.ID_ACTIVITY_LOG_KEY DESC) V;
        
 