const bcrypt = require('bcryptjs');

const hash = '$2a$10$wY9S4Z2yN9H5gqzO7B08ueyTQjS22h/4k8P1.890J5aO6U80R3XUy';
const password = 'adminpassword';

bcrypt.compare(password, hash).then(res => {
    console.log('Admin password match:', res);
});

const hashUser = '$2a$10$tZ92rI07a2o0w9aQ8iK7FOn7E2pW9MvL0E/g57r9BQK.qPZ3J9W.a';
const passwordUser = 'userpassword';

bcrypt.compare(passwordUser, hashUser).then(res => {
    console.log('User password match:', res);
});
