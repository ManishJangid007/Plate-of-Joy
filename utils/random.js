class Random {
    generateVerificationCode() {
        return this.generateRandom(100000, 999999);
    }
    
    generateRandom(min = 0, max = 10) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}

const randomObj = new Random();

module.exports = randomObj;