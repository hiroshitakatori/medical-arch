const nodemailer = require("nodemailer")
const config = require("config");
const ejs = require("ejs");
const path = require("path");
const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requiredTLS: true,
    auth: {
        user: config.get("MAIL_USER"),
        pass: config.get("MAIL_PASSWORD")
    }
});
const https = require('https');

// var request = require('request');

let username = config.BULK_SMS_USERNAME;
let password = config.BULK_SMS_PASSWORD;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.SENDGRID_API_KEY);
const Twilio = require('twilio');


const url = require("url");


const verifyMail = (username: string, to: string, text_body: string, subject: string, sender: string, otp: any,uniqeId:any, host: string,lang:any) => {
    try {
        // console.log({username,to,text_body,subject,otp,sender,uniqeId,host})
        var transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requiredTLS: true,
            auth: {
                user: config.get("MAIL_USER"),
                pass: config.get("MAIL_PASSWORD")
            }
        });

        const location_file = path.join(__dirname + '/../email/verificationEmail.ejs')
        const logo = "http://" + host + config.get("LOGO_PATH");// "/uploads/images/logo.png";
        ejs.renderFile(location_file, {  email: to, otp: otp,uniqeId:uniqeId, logo: logo, subject: subject,lang:lang }, async function (err: any, data: any) {
            if (err) {
                console.log(err);
            } else {
                let mailOptions = {
                    sender: 'jagruti.k.elaunchinfotech@gmail.com',
                    to: to,
                    subject: subject,
                    text: text_body,
                    html: data,
                    custom_headers: [
                        {
                            "header": "Reply-To",
                            "value": '"Medical Arch" <noreply@jagruti.k.elaunchinfotech@gmail.com>',
                        }
                    ]
                }
                try {
                    var info = await transport.sendMail(mailOptions);
                }
                catch (e: any) {
                    console.log("Send verify email :", e);
                }
            }
        });
    }
    catch (e) {
        console.log(e)
    }
}
const sendEmailWithPassword = async (url:any, lang:any,uniqueId:any,name: string, email: string, password: any, subject: string, message: string, host: string) => {
    try {

        const location_file = path.join(__dirname + '/../email/sendPassword.ejs')
        // const logo = "http://" + host + config.get("LOGO_PATH");//"/uploads/images/logo.png";
        // console.log(url)
        let url2 = new URL(url);
        let isStaff = false;
        //url2.port=="3001" || 
        if(url2 && url2.hostname == "facility.medical-arch.com" ){
            isStaff = true;
        }else{
            isStaff = false;
        }
        await ejs.renderFile(location_file, {isStaff:isStaff,url:url,lang:lang,uniqueId:uniqueId, name: name, email: email, password: password, logo: "logo",subject:subject,mainContent:message }, async function (err: any, data: any) {
            if (err) {
                console.log("email send error:", err);

            } else {

                var mailOptions = {
                    to: email,
                    from: 'Medical Arch<noreply@jagruti.k@elaunchinfotech.in>',
                    subject: subject,
                    text: message,
                    html: data,
                    custom_headers: [
                        {
                            "header": "Reply-To",
                            "value": '"Medical Arch" <noreply@jagruti.k@elauncinfotech.in>',
                        }
                    ]
                };
                try {
                    var info = await transport.sendMail(mailOptions);
                }
                catch (e: any) {
                    console.log("Send verify email :", e);
                }
            }
        });
    } catch (e) {
        console.log("catch erro ", e)
    }
}
const sendWelcomeEmail = async (url:any, lang:any,uniqueId:any,name: string, email: string, subject: string, message: string, host: string) => {
    try {
        // console.log(email)
        const location_file = path.join(__dirname + '/../email/welcomeEmail.ejs')
        const logo = "http://" + host + config.get("LOGO_PATH");//"/uploads/images/logo.png";
        // console.log(url)
        await ejs.renderFile(location_file, {url:url,lang:lang,uniqueId:uniqueId, name: name, email: email, logo: logo }, async function (err: any, data: any) {
            if (err) {
                console.log("email send error:", err);

            } else {

                var mailOptions = {
                    to: email,
                    from: 'Medical Arch<noreply@jagruti.k@elaunchinfotech.in>',
                    subject: subject,
                    text: message,
                    html: data,
                    custom_headers: [
                        {
                            "header": "Reply-To",
                            "value": '"Medical Arch" <noreply@jagruti.k@elauncinfotech.in>',
                        }
                    ]
                };
                try {
                    var info = await transport.sendMail(mailOptions);
                }
                catch (e: any) {
                    console.log("Send verify email :", e);
                }
            }
        });
    } catch (e) {
        console.log("catch erro ", e)
    }
}
const verifyMailSg = (username: string, to: string, subject: string, text_body: string, sender: string, otp: any, message: string, host: string) => {
    try {


        const location_file = path.join(__dirname + '/../email/verificationEmail.ejs')
        const logo = "http://" + host + config.get("LOGO_PATH");//"/uploads/images/logo.svg";
        ejs.renderFile(location_file, { name: username, email: to, otp: otp, logo: logo, subject: subject }, async function (err: any, data: any) {
            if (err) {
                console.log(err);
            } else {

                const msg = {
                    to: to,
                    from: 'Medical Arch<noreply@jagruti.k@elaunchinfotech.in>', // Use the email address or domain you verified above
                    subject: subject,
                    text: text_body,
                    html: data
                };
                (async () => {
                    try {
                        await sgMail.send(msg);
                    } catch (error: any) {
                        console.error(error.message);

                        if (error.response) {
                            console.error(error.response.body)
                        }
                    }
                })();
            }
        });
    }
    catch (e) {
        console.log(e)
    }
}
const sendVerificationEmail = async (name: string, email: string, subject: string, otp: any, message: string, host: string) => {
    try {
        const location_file = path.join(__dirname + '/../email/verificationEmail.ejs')
        const logo = "http://" + host + config.get("LOGO_PATH");///"/uploads/images/logo.svg";

        await ejs.renderFile(location_file, { name: name, email: email, otp: otp, logo: logo }, async function (err: any, data: any) {
            if (err) {
                console.log("email send error:", err);

            } else {

                const msg = {
                    to: email,
                    from: 'Binox Bargains<noreply@binoxbargains.com>', // Use the email address or domain you verified above
                    subject: subject,
                    text: "You recive this mail because of Email Varification",
                    html: data
                };
                (async () => {
                    try {
                        await sgMail.send(msg);
                    } catch (error: any) {
                        console.error(error.message);

                        if (error.response) {
                            console.error(error.response.body)
                        }
                    }
                })();
            }
        });
    } catch (e) {
        console.log("catch erro ", e)
    }
}

//bulksms.com
const sendMobileOTP = async (body: any, from: any, to: any) => {

    try {
        // let test_body ="your binox verification code is " +body;
        let postData = JSON.stringify({
            'to': to,
            'routingGroup': "PREMIUM",
            'body': body
        });

        let options = {
            hostname: 'api.bulksms.com',
            port: 443,
            path: '/v1/messages',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length,
                'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
                // 'Authorization': 'Basic Ymlub3hiYXJnYWluczpCaW5veGJ1bGtzbXMyMTEyMjI='
            }
        };

        let req = https.request(options, (resp: any) => {
            // console.log('statusCode:', resp.statusCode);
            let data = '';
            resp.on('data', (chunk: any) => {
                data += chunk;
            });
            resp.on('end', () => {
                // console.log("Response:", data);
            });
        });

        req.on('error', (e: any) => {
            console.error(e);
        });

        req.write(postData);
        req.end();
    } catch (err: any) {
        console.log(err.message);
    }

}

const sendMobileOTP_ = async (body: any, from: any, to: any) => {
    try {

        let postData = JSON.stringify({
            'to': "+916359020895",
            'body': body
        });
        // console.log({username})
        // console.log({password})
        let options = {
            hostname: 'api.bulksms.com',
            port: 443,
            path: '/v1/messages',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length,
                'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
            }
        };

        let req = https.request(options, (resp: any) => {
            //console.log('statusCode:', resp.statusCode);
            let data = '';
            resp.on('data', (chunk: any) => {
                data += chunk;
            });
            resp.on('end', () => {
                console.log("Response:", data);
            });
        });

        req.on('error', (e: any) => {
            console.log("err");
            console.error(e);
        });

        req.write(postData);

        req.end();
    } catch (error: any) {
        console.log("frefurehfrue", error.message)
    }
};


const sendKYCApprovalMail = async (name: string, email: string, title: any, reason: string, host: string) => {
    try {
        const location_file = path.join(__dirname + '/../email/KYCApprovalMail.ejs')
        const logo = "http://" + host + config.get("LOGO_PATH"); //"/uploads/images/logo.png";

        await ejs.renderFile(location_file, { name: name, email: email, title: title, reason: reason, logo: logo }, async function (err: any, data: any) {
            if (err) {
                console.log("email send error:", err);

            } else {

                const msg = {
                    to: email,
                    from: 'Binox Bargains<noreply@binoxbargains.com>', // Use the email address or domain you verified above
                    subject: title,
                    // text: message,
                    html: data
                };
                (async () => {
                    try {
                        await sgMail.send(msg);
                    } catch (error: any) {
                        console.error(error.message);

                        if (error.response) {
                            console.error(error.response.body)
                        }
                    }
                })();
            }
        });
    } catch (e) {
        console.log("catch erro ", e)
    }
}
const sendOrderPlaceMail = async (name: string, email: string, title: any, host: string, order: string) => {
    try {
        const location_file = path.join(__dirname + '/../email/orderPlace.ejs')
        const logo = "http://" + host + config.get("LOGO_PATH"); //"/uploads/images/logo.png";

        await ejs.renderFile(location_file, { name: name, email: email, title: title, logo: logo, order: order }, async function (err: any, data: any) {
            if (err) {
                console.log("email send error:", err);

            } else {
                const msg = {
                    to: email,
                    from: 'Binox Bargains<noreply@binoxbargains.com>', // Use the email address or domain you verified above
                    subject: title,
                    // text: order,
                    html: data
                };
                (async () => {
                    try {
                        await sgMail.send(msg);
                    } catch (error: any) {
                        console.error(error.message);

                        if (error.response) {
                            console.error(error.response.body)
                        }
                    }
                })();
            }
        });
    } catch (e) {
        console.log("catch erro ", e)
    }
}
const sendAdminMail = async (email: string, title: any, host: string, content: string) => {
    try {
        const location_file = path.join(__dirname + '/../email/contactUsEmail.ejs')
        const logo = "http://" + host + config.get("LOGO_PATH"); //"/uploads/images/logo.png";

        await ejs.renderFile(location_file, { email: email, title: title, logo: logo, content: content }, async function (err: any, data: any) {
            if (err) {
                console.log("email send error:", err);

            } else {
                const msg = {
                    to: email,
                    from: 'Binox Bargains<noreply@binoxbargains.com>', // Use the email address or domain you verified above
                    subject: title,
                    // text: order,
                    html: data,
                };
                (async () => {
                    try {
                        // console.log(777)
                        await sgMail.send(msg);
                    } catch (error: any) {
                        console.error(error.message);

                        if (error.response) {
                            console.error(error.response.body)
                        }
                    }
                })();
            }
        });
    } catch (e) {
        console.log("catch erro ", e)
    }
}
const sendEventBookMail = async (name: string, email: string, title: any, host: string, event: string) => {
    try {
        const location_file = path.join(__dirname + '/../email/eventBook.ejs')
        const logo = "http://" + host + config.get("LOGO_PATH"); //"/uploads/images/logo.png";

        await ejs.renderFile(location_file, { name: name, email: email, title: title, logo: logo, event: event }, async function (err: any, data: any) {
            if (err) {
                console.log("email send error:", err);

            } else {
                const msg = {
                    to: email,
                    from: 'Binox Bargains<noreply@binoxbargains.com>', // Use the email address or domain you verified above
                    subject: title,
                    // text: order,
                    html: data,
                };
                (async () => {
                    try {
                        await sgMail.send(msg);
                    } catch (error: any) {
                        console.error(error.message);

                        if (error.response) {
                            console.error(error.response.body)
                        }
                    }
                })();
            }
        });
    } catch (e) {
        console.log("catch erro ", e)
    }
}
export default {
    verifyMail,
    sendEmailWithPassword,
    sendWelcomeEmail,
    verifyMailSg,
    sendVerificationEmail,
    sendMobileOTP,
    sendKYCApprovalMail,
    sendOrderPlaceMail,
    sendEventBookMail,
    sendAdminMail
}