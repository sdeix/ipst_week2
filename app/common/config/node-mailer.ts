import nodemailer from "nodemailer";
import { z } from "zod";
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
const mailSchema = z.object({
    to: z.string().email(),
    subject: z.string().min(1, "Subject is required"),
    text: z.string().optional(),
    html: z.string().optional()
});
type MailType = z.infer<typeof mailSchema>;
export async function sendEmail(obj: MailType) {
    try {
        const mailObj = mailSchema.parse(obj);
        await transporter.sendMail({
            from: `"Your Name" <${process.env.SMTP_USER}>`,
            to: mailObj.to,
            subject: mailObj.subject,
            text: mailObj.text,
            html: mailObj.html
        });
        return { isError: false, message: "email was sended" };
    } catch {
        return { isError: true, message: "Failed to send email" };
    }
}
