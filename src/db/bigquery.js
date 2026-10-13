import { BigQuery } from '@google-cloud/bigquery';

// Instantiate the BigQuery for use BigQuery
export const bigquery = new BigQuery({
    projectId: process.env.PROJECT_ID,

    credentials: {
        client_email: process.env.BIGQUERY_CLIENT_EMAIL,
        private_key: process.env.BIGQUERY_PRIVATE_KEY
    },
});


const query = `SELECT Transaction_ID, rtt, Query,
Query_Class, Query_Class_Name, Query_Type, Query_Type_Name, Answers, rejected, System_Classification, Training_Score, 
Category, DATETIME(eic.changedOn, 'timeZone') AS Changed_On, eic.changedBy AS Changed_By, 
eic.input_classification AS Input_Classification FROM (SELECT FORMAT_TIMESTAMP('%m-%d-%Y %I:%M:%S %p',
DATETIME(ucl.creation_time, 'timeZone')) AS Date, ucl.id, ucl.orig_h AS Source_IP, ucl.orig_p AS Source_Port,
ucl.resp_h AS Destination_IP, ucl.resp_p AS Destination_Port, ucl.query AS Query, ucl.trans_id AS Transaction_ID,
ucl.rtt AS rtt, ucl.proto AS Protocol, ucl.changedOn as Changed_On, ucl.changedBy as Changed_By,
ucl.input_classification as Input_Classification, ucl.confidence_score AS Training_Score, 
ucl.system_classification AS System_Classification, ucl.category AS Category, ucl.qclass AS Query_Class,
ucl.qclass_name AS Query_Class_Name, ucl.qtype AS Query_Type, ucl.qtype_name AS Query_Type_Name, ucl.answers AS Answers,
ucl.rejected AS rejected, ROW_NUMBER() OVER( PARTITION BY orig_h ORDER BY ucl.creation_time ASC ) AS row_num 
FROM \`${process.env.PROJECT_ID}.datasetName.enigma-unique-classification\` AS ucl 
WHERE datetime(ucl.creation_time, 'timeZone') >= DATETIME_SUB(CURRENT_DATETIME('timeZone'), INTERVAL startDate DAY) 
AND DATETIME(ucl.creation_time, 'timeZone') <= DATETIME_SUB(CURRENT_DATETIME('timeZone'), INTERVAL endDate DAY)) AS euc 
LEFT JOIN \`${process.env.PROJECT_ID}.datasetName.latest_input_classification\` AS eic  ON eic.docIP = euc.Source_IP 
AND eic.doctype = 'enigma-unique-classification' WHERE row_num = 1 ORDER BY Date DESC LIMIT 10000;`
const data = await bigquery.query(query);