const transporter = require("../config/email");

// Send Email
const sendEmail = async (to, subject, html) => {

    try {

        await transporter.sendMail({

            from: `"BrandBlvd" <${process.env.EMAIL_USER}>`,

            to,

            subject,

            html

        });

        console.log("Email Sent");

    }

    catch(error){

        console.log(error);

    }

};

module.exports = {

    sendEmail

};