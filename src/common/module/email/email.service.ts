import nodemailer from "nodemailer"
import { EnvConfig } from "../../../config/env.config"
import { myLogger } from "../../../config/logger"
import { ServerError } from "../../model/error.model"

const mailTransporter = nodemailer.createTransport({
    host: EnvConfig.SMTP_HOST,
    port: parseInt(`${EnvConfig.SMTP_PORT}`) || 587,
    auth: {
        user: EnvConfig.SMTP_USER,
        pass: EnvConfig.SMTP_PASSWORD,
    },
})

interface EmailData {
    to: string
    subject: string
    html: string
}

export const EmailService = {
    sendEmail: async ({ to, subject, html }: EmailData, shouldWait = true): Promise<void> => {
        try {
            const mailOptions = {
                from: EnvConfig.SMTP_EMAIL_FROM || "noreply@nestpress.app", // Sender's email address
                to, // Recipient's email address
                subject, // Subject of the email
                html, // HTML content of the email
            }
            if (shouldWait) {
                await mailTransporter.sendMail(mailOptions)
            } else {
                mailTransporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        myLogger().error(`Error sending email: ${(err as Error).message}`)
                        return
                    }
                    myLogger().info(`Email sent to ${to}, id: ${info.messageId}`)
                })
            }
        } catch (error) {
            myLogger().error(`Error sending email: ${(error as Error).message}`)
            throw new ServerError()
        }
    },
}
