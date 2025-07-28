
CREATE OR REPLACE FORCE VIEW ESIGNATURE.VW_PA_REPORT_VIEWER
AS
SELECT ROWNUM     AS ID_PA_REPORT_KEY,V.*
      FROM (  SELECT VS.TX_PA,
                     VS.DTT_CREATE,
                     VS.TX_NAME,
                     VS.TX_STATUS,
                     SG.DTT_EFFECTIVE_DATE,
                     VS.TX_EMAIL,
                     VS.TX_CONTACT_NUMBER,
                     VS.TX_DESIGNATION,
                     VS.TX_BRANCH_NAME,
                     INS.TX_NAME                                       TX_INSTITUTION_NAME,
                     VS.TX_DELIGATION,
                     VS.TX_GROUP,
                     VS.TX_NID,
                     VS.DT_BIRTHDAY,
                     SG.TX_CANCEL_CAUSE,
                     SG.DT_CANCEL_TIME,
                     SG.DT_INACTIVE_TIME,
                     SG.TX_REMARKS                                     AS TX_INACTIVE_CAUSE,
                     VS.TX_EMPLOYEE_ID,
                     VS.DT_APPROVE_TIME                                AS DT_MAKER,
                     VS.DT_AUTHORIZE_TIME,
                     USR.TX_FULL_NAME                                  AS TX_MAKER_NAME,
                     USRA.TX_FULL_NAME                                 AS TX_CHECKER_NAME,
                     INS.INT_OWN_INSTITUTION,
                     FAG.DTT_CREATE                                    AS DTT_AGREEMENT_FILE,
                     FAP.DTT_CREATE                                    AS DTT_APPROVAL_FILE,
                     (SELECT CASE WHEN DLT.DT_DELETE_DATE IS NULL THEN NULL ELSE DLT.DT_DELETE_DATE END  FROM T_SIGNATURE DLT WHERE DLT.ID_SIGNATORY_KEY = VS.ID_SIGNATORY_KEY AND DLT.IS_ACTIVE=0 
                     AND DLT.IS_MAIN_SIGNATURE=1 AND ROWNUM=1 ) AS DTT_DELETE,
                     VS.DTT_MOD AS DTT_UPDATE
                FROM T_SIGNATORY VS
                     LEFT JOIN T_FILES FAG
                         ON     FAG.ID_OBJECT_KEY = VS.ID_SIGNATORY_KEY
                            AND FAG.TX_OBJECT_TYPE = 'AGREEMENT_FILE'
                     LEFT JOIN T_FILES FAP
                         ON     FAP.ID_OBJECT_KEY = VS.ID_SIGNATORY_KEY
                            AND FAP.TX_OBJECT_TYPE = 'APPROVAL_FILE'
                     LEFT JOIN T_SIGNATURE SG ON SG.ID_SIGNATORY_KEY = VS.ID_SIGNATORY_KEY AND SG.IS_ACTIVE=1
                     AND SG.IS_MAIN_SIGNATURE=1
                     LEFT JOIN T_INSTITUTION INS
                         ON VS.ID_INSTITUTION_KEY = INS.ID_INSTITUTION_KEY
                     LEFT JOIN T_USER USR ON VS.ID_APPROVE_BY = USR.ID_USER_KEY
                     LEFT JOIN T_USER USRA
                         ON VS.ID_AUTHORIZE_BY = USRA.ID_USER_KEY
						  WHERE VS.TX_IDENTIFY ='INTERNAL' AND VS.IS_ACTIVE=1
            ORDER BY VS.DTT_CREATE DESC) V;