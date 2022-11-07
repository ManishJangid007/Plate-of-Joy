const fs = require('fs');

class LocalData {
    constructor() {
        this._emailsDir = `${__dirname}/emails.json`;
        this._usersDir = `${__dirname}/users.json`;
    }

    addUser(user){
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

    addEmail(email) {
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
        try {
            const data = fs.readFileSync(this._usersDir);
            return JSON.parse(data);
        } catch (error) {
            return error.message;
        }
    }

    getEmails() {
        try {
            const data = fs.readFileSync(this._emailsDir);
            return JSON.parse(data);
        } catch (error) {
            return error.message;
        }
    }

    isEmailExist(email) {
        try {
            const emails = this.getEmails();
            const result = emails.find(data => data === email);
            return result === undefined ? {
                error: null,
                exist: false
            } : {
                error: null,
                exist: true
            }
        } catch (error) {
            return {
                error: error.message,
                exist: null
            }
        }
    }

    isUserExist(user) {
        try {
            const users = this.getUsers();
            const result = users.find(data => data === user);
            return result === undefined ? {
                error: null,
                exist: false
            } : {
                error: null,
                exist: true
            }
        } catch (error) {
            return {
                error: error.message,
                exist: null
            }
        }
    }

    deleteUser(user) {
        fs.readFile(this._usersDir, 'utf8', (err, data) => {
            if (err) console.error(err);
            else {
                const newData = JSON.parse(data);
                const index = newData.indexOf(user);
                if (index > -1) {
                    newData.splice(index, 1)
                    fs.writeFile(this._usersDir, JSON.stringify(newData), (err) => {console.error(err);});
                }
            }
        })
    }

    deleteEmail(email) {
        fs.readFile(this._emailsDir, 'utf8', (err, data) => {
            if (err) console.error(err);
            else {
                const newData = JSON.parse(data);
                const index = newData.indexOf(email);
                if (index > -1) {
                    newData.splice(index, 1);
                    fs.writeFile(this._emailsDir, JSON.stringify(newData), (err) => {console.error(err);});
                }
            }
        })
    }

    async updateUser(oldUser, newUser) {
        fs.readFile(this._usersDir, 'utf8', (err, data) => {
            if (err) console.error(err);
            else {
                const newData = JSON.parse(data);
                const index = newData.indexOf(oldUser);
                if (index > -1) {
                    newData.splice(index, 1)
                    newData.push(newUser)
                    fs.writeFile(this._usersDir, JSON.stringify(newData), (err) => {console.error(err);});
                }
            }
        })
    }

    async updateEmail(oldEmail, newEmail) {
        fs.readFile(this._emailsDir, 'utf8', (err, data) => {
            if (err) console.error(err);
            else {
                const newData = JSON.parse(data);
                const index = newData.indexOf(oldEmail);
                if (index > -1) {
                    newData.splice(index, 1);
                    newData.push(newEmail);
                    fs.writeFile(this._emailsDir, JSON.stringify(newData), (err) => {console.error(err);});
                }
            }
        })
    }
}

const localDataObject = new LocalData();

module.exports = localDataObject;