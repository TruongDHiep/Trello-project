const SibApiV3Sdk = require('@getbrevo/brevo')
import { env } from '~/config/environment'

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (toEmail, customSubject, htmlContent) => {
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

  // tai khoan gui mail la tai khoan tren brevo
  sendSmtpEmail.sender = { email: env.ADMIN_EMAIL_ADDRESS, name: env.ADMIN_EMAIL_NAME }

  //nhung tai khoan nhan mail
  sendSmtpEmail.to = [{ email: toEmail }]
  sendSmtpEmail.subject = customSubject
  sendSmtpEmail.htmlContent = htmlContent

  //goi hanh dong gui mail
  return apiInstance.sendTransacEmail(sendSmtpEmail)


}

export const BrevoProvider = {
  sendEmail
}