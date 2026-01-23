const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'password123'; // Le mot de passe que vous voulez utiliser

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    console.log("Mot de passe original:", myPlaintextPassword);
    console.log("Hash à utiliser dans la DB:", hash);
});