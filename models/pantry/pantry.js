const axios = require('axios');
const emailValidator = require('../../utils/verify-email');
const localData = require('../local_data/driver');

class Pantry {
    constructor(){
        this._pantry_id = process.env.PANTRY_BASKET_KEY;
        this._url = "https://getpantry.cloud/apiv1/pantry";
        this._pantry_path = `${this._url}/${this._pantry_id}`;
        this._basket_path = `${this._pantry_path}/basket`;
    }
    async addUser(data) {
        const verifyEAU = await this.redundantEAU(data.username, data.email)
        if (verifyEAU.error == null) {
            try {
                const res = await axios({
                    method: 'post',
                    url: `${this._basket_path}/${data.username}`,
                    data: data
                })
                localData.addUser(data.username)
                localData.addEmail(data.email)
                return await res.data != null ? {
                        error: null,
                        message: "Account Created"
                    } : {
                        error: ["Something Went Wrong"],
                        message: null
                    }
            } catch (err) {
                return {
                    error: [err.message],
                    message: null
                };
            }
        } else {
            return {
                error: verifyEAU.error,
                message: null
            }
        }
    }

    async redundantEAU(username, mail) {
        const err = [];

        if (localData.isUserExist(username).exist) err.push("User already exists")
        if (localData.isEmailExist(mail).exist) err.push("email already in use")

        if (err.length == 0) {
            const eValid = await emailValidator(mail)
            if (await eValid.validators.mx.valid) {
                if (await eValid.validators.smtp.valid) {
                    return {
                        error: null,
                        isRedundant: false
                    }
                } else err.push("Enter valid Email Address")
            } else err.push("Email Not Correct");
            return {
                error: err,
                isRedundant: false
            }
        } else {
            return {
                error: err,
                isRedundant: true
            }
        }
    }

    async getUser(username) {
        if(localData.isUserExist(username).exist){
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
        } else return {
            error: "Couldn't find User",
            data: null
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
}

const pantryObj = new Pantry();

module.exports = pantryObj;