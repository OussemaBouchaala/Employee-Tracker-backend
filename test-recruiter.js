const { MongoClient } = require('mongodb');

async function findCompanyByEmail() {
    const url = 'mongodb+srv://helmipaty_db_user:GEcR9fLDB40KPY8Z@cluster0.kfxxzgd.mongodb.net/projettp';
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connecté à MongoDB');

        const db = client.db('projettp');

        // 1. Trouver l'utilisateur par email
        const email = 'langrof@hotmail.com';
        const user = await db.collection('user').findOne({ email: email });

        console.log('\n--- Utilisateur trouvé ---');
        console.log('User:', user);

        if (!user) {
            console.log('Aucun utilisateur trouvé avec cet email');
            return;
        }

        // 2. Trouver le recruteur avec ce userId
        const recruiter = await db.collection('recruiter').findOne({ userId: user._id });

        console.log('\n--- Recruteur trouvé ---');
        console.log('Recruiter:', recruiter);

        if (recruiter) {
            console.log('\n✅ COMPANY NAME:', recruiter.companyName);
        } else {
            console.log('\n❌ Cet utilisateur n\'est pas un recruteur');
        }


    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        await client.close();
    }
}

findCompanyByEmail();
