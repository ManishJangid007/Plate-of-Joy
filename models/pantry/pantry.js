const axios = require('axios');

class Pantry {
    constructor(){
        this._pantry_id = process.env.PANTRY_BASKET_KEY;
        this._url = "https://getpantry.cloud/apiv1/pantry";
        this._pantry_path = `${this._url}/${this._pantry_id}`;
        this._basket_path = `${this._pantry_path}/basket`;
    }
    async addUser(data) {
        const {error, isRedundant} = await this.redundantUser(data.username);
        if (await error == null) {
            if(await isRedundant == false){
                const email = await this.redundantEmail(data.email);
                if (await email.error == null) {
                    if (!email.isRedundant) {
                        try {
                            const res = await axios({
                                method: 'post',
                                url: `${this._basket_path}/${data.username}`,
                                data: data
                            })
                            return await res.data != null ? {
                                    error: null,
                                    message: "Account Created"
                                } : {
                                    error: "Something Went Wrong",
                                    message: null
                                }
                        } catch (err) {
                            return {
                                error: err.message,
                                message: null
                            };
                        }
                    } else {
                        return {
                            error: "Account is Already Created With This Email",
                            message: null
                        }
                    }
                } else {
                    return {
                        error: email.error,
                        message: null
                    }
                }
            } else {
                return {
                    error: "User already exists",
                    message: null
                };
            }
        } else {
            return {
                error: error,
                message: null
            }
        }
    }

    async redundantUser(username){
        const response = await this.getUsers();
        if  (response.error != null) return {error: response.error, isRedundant: null};
        else {
            const dat = response.data.find(data => data.name === username);
            const result = dat == undefined ? {
                error: null,
                isRedundant: false
            } : {
                error: null,
                isRedundant: true
            }
            return result;
        }
    }

    async getUser(username) {
        const {error, isRedundant} = await this.redundantUser(username);
        if (await error == null) {
            if (isRedundant) {
                try {
                    const response = await axios.get(`${this._basket_path}/${username}`)
                    return response.data != null ? {
                        error: null,
                        data: response.data
                    } : {
                        error: "Something went wrong",
                        data: null
                    }
                } catch (error) {
                    return {
                        error: error.message,
                        data: null
                    }
                }
            } else {
                return {
                    error: "User not found",
                    data: null
                }
            }
        } else {
            return {
                error: error,
                data: null
            }
        }
    }

    async getUsers(){
        try {
            const response = await axios.get(this._pantry_path);
            return await response.data != null ? {
                error: null,
                data: response.data.baskets
            } : {
                error: "Something went wrong",
                data: null
            };
        } catch (error) {
            return {
                error: error.message,
                data: null
            }
        }
    }

    async redundantEmail(email) {
        const {error, data} = await this.getUsers();
        if (await error === null) {
            for (const i of data) {
                let user = await this.getUser(i.name);
                if (await user.error === null) {
                    if (user.data.email === email) {
                        return {
                            error: null,
                            isRedundant: true
                        }
                    }
                } else {
                    return {
                        error: user.error,
                        isRedundant: null
                    }
                }
            }
            return {
                error: null,
                isRedundant: false
            }
        } else {
            return {
                error: error,
                isRedundant: null
            }
        }
    }
}

const pantryObj = new Pantry();

module.exports = pantryObj;