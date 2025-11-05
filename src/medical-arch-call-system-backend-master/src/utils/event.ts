import { EventEmitter } from 'events';
import Mail from "../components/email";
const eventEmitter = new EventEmitter();

eventEmitter.on('send_email_otp', (data: any) => {
    Mail.verifyMail(data?.username, data?.to, data?.subject, data?.data?.message, data.sender, data?.data.otp, data?.data.uniqeId, data.host,data?.data.lang)
});
eventEmitter.on('send_email_with_password', (data: any) => {
    Mail.sendEmailWithPassword(data?.url,data.lang,data.uniqueId,data.username, data.to, data.password, data.subject, data.message, data.host);
});
eventEmitter.on('send_verification_email', (data: any) => {
    Mail.sendVerificationEmail(data.name, data.email, data.subject, data.otp, data.message, data.host);
});

eventEmitter.on('send_welcome_email', (data: any) => {
    Mail.sendWelcomeEmail(data?.url,data.lang,data.uniqueId,data.username, data.to, data.subject, data.message, data.host);
});
eventEmitter.on('send_mobile_otp', (data: any) => {
    // console.log(data.subject)
    Mail.sendMobileOTP(data.subject, data.from, data.to);
});

eventEmitter.on('send_kyc_approval_mail', (data: any) => {
    Mail.sendKYCApprovalMail(data.username, data.to, data.subject, data.reason, data.host);
});
eventEmitter.on('send_order_place_email', (data: any) => {
    Mail.sendOrderPlaceMail(data.username, data.to, data.subject, data.host, data.order);
});
eventEmitter.on('send_tickets', (data: any) => {
    Mail.sendEventBookMail(data.username, data.to, data.subject, data.host, data.event);
});
eventEmitter.on('send_mail_admin', (data: any) => {
    Mail.sendAdminMail(data.to, data.subject, data.host, data.content);
});

export default eventEmitter;