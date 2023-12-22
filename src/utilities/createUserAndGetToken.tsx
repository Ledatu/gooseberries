import * as admin from 'firebase-admin';
const serviceAccount = require('../secrets/market-manager-wb-firebase-adminsdk-9lwrs-63a9e83d45.json');

function getApp() {
    let app;
    try {
        app = admin.initializeApp(
            {
                credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            },
            'market-master',
        );
    } catch (error) {
        app = admin.app('market-master');
    }
    return app;
}

export default async (userFrontToken) => {
    const auth = getApp().auth();
    try {
        const user = await auth.createUser(userFrontToken);
        const token = await auth.createCustomToken(user.uid, {
            isAdmin: true,
            //... add other custom claims as need be
        });
        return token;
    } catch (error) {}
};
