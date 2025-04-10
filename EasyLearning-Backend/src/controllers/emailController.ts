import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { formatCurrency } from '../utils/currency';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationCode = async (toEmail: string, verificationCode: string) => {
  const emailTemplatePath = path.join(__dirname, '../templates/Email/EmailVerification.html');
  let emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');

  const subject = `${verificationCode} - Xác nhận yêu cầu đặt lại mật khẩu tài khoản của bạn`;
  const emailBody = emailTemplate.replace('[verificationCode]', verificationCode);

  await transporter.sendMail({
    from: `"EasyLearning" <${process.env.SMTP_FROM}>`,
    to: toEmail,
    subject,
    html: emailBody,
  });
};


export const sendEmailPayment = async (
    toEmail: string,
    subject: string,
    customerName: string,
    totalAmount: number,
    totalCourses: string,
    authorizationCode: string,
    orderDate: string,
    courseNameList: string[]
  ) => {
    const emailTemplatePath = path.join(__dirname, '../templates/Email/EmailPayment.html');
    let emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');
  
    const coursesHtml = courseNameList.map(name => `<li style="margin-bottom: 10px;">${name}</li>`).join('');
  
    const emailBody = emailTemplate
      .replace('[CustomerName]', customerName ?? '')
      .replace('[totalAmount]', formatCurrency(totalAmount))
      .replace('[totalCourses]', totalCourses ?? '')
      .replace('[listCourses]', coursesHtml)
      .replace('[orderDate]', orderDate ?? '')
      .replace('[authorizationCode]', authorizationCode ?? '');
  
    await transporter.sendMail({
      from: `"EasyLearning" <${process.env.SMTP_FROM}>`,
      to: toEmail,
      subject,
      html: emailBody,
    });
  };
