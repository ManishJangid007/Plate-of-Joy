class AppStrings {
    welcomeMessageSubject() {
        return 'Welcome to Plate Of Joy'
    }
    welcomeMessage(fullName) {
        return `Hi ${fullName},
        We glad to have you,
        welcome to healthy family 😊
        we try our best to get you in your 
        best shape and health of your life
        Hold tight and be ready because this 
        shi*t is going to be real.
        
        Plate Of Joy Team 😎`
    }
}

const appStringObj = new AppStrings();

module.exports = appStringObj;