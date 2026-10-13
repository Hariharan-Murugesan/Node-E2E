import { Firestore } from '@google-cloud/firestore';

// Firebase initiating for use firestore
export const firestore = new Firestore({
    projectId: process.env.PROJECT_ID,
    credentials: {
        client_email: process.env.FIRESTORE_CLIENT_EMAIL,
        private_key: process.env.FIRESTORE_PRIVATE_KEY,
    },
});

// const tableName = "enigma-unique-classification-destination" + "-" + "1234";
// let DestinationSysDetails = firestore.collection(tableName);
// // Fetch
// DestinationSysDetails = await DestinationSysDetails.get();
// if (DestinationSysDetails && DestinationSysDetails.docs && DestinationSysDetails.docs.length) {
//     // Deleete
//     await Promise.all(DestinationSysDetails.docs.map((doc) => doc.ref.delete()));
// }
// // Add
// await Promise.all(reqBody.map(async (element) => {
//     const reqObj = {
//         customerId: customerId,
//         name: element.name,
//         count: element.count ? Number(element.count) : 0,
//         createdDate: moment.utc(),
//         lastUpdatedTime: moment.utc(),
//     }
//     const newCollection = firestore.collection(tableName);
//     return newCollection.add(reqObj);
// }));