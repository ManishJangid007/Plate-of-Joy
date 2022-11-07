const fs = require('fs');

class LocalData {
    constructor() {
        this._emailsDir = `${__dirname}/emails.json`;
        this._usersDir = `${__dirname}/users.json`;
    }

    updateUser(user){
        fs.readFile(this._usersDir, 'utf8', (err, data) => {
            if (err) console.error(err); 
            else {
                const newData = JSON.parse(data);
                newData.push(user);
                fs.writeFile(this._usersDir, JSON.stringify(newData), (err) => {
                    if (err) console.error(err); 
                });
            }
        })
    }

    updateEmail(email) {
        fs.readFile(this._emailsDir, 'utf8', (err, data) => {
            if (err) console.error(err); 
            else {
                const newData = JSON.parse(data);
                newData.push(email);
                fs.writeFile(this._emailsDir, JSON.stringify(newData), (err) => {
                    if (err) console.error(err); 
                });
            }
        })
    }

    getUsers() {
        fs.readFile(this._usersDir, 'utf8', (err, data) => {
            if (err) console.error(err); 
            else {
                return JSON.parse(data);
            }
        })
    }

    getEmail() {
        fs.readFile(this._emailsDir, 'utf8', (err, data) => {
            if (err) console.error(err); 
            else {
                return JSON.parse(data);
            }
        })
    }
}

const localDataObject = new LocalData();

module.exports = localDataObject;