import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import dayjs from "dayjs";
import path from 'path';
import { Readable } from 'stream';
import Certificate from "../models/certificate";
import Course from "../models/course";
import User from "../models/user";
import { uploadPdf } from "../utils/uploadCloudinaryHandler";
const fontkit = require('fontkit');
interface ExpressMulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
  stream: Readable;
  destination: string;
  filename: string;
  path: string;
}

interface UserCertificateResponse {
    issuedDate: string;
    certificateNumber: string;
    certificatePDFUrl: string;
    courseName: string;
    userFullName: string;
    expiresDate?: string;
}



export const generateCertificate = async (
  userName: string,
  courseName: string,
  issueDate: string,
  certificateNumber: string
): Promise< string | null> => {
  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const page = pdfDoc.addPage([842, 595]);

    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();

    const borderPath = path.join(__dirname, '../templates/certificate/khung.png');
    const borderBytes = fs.readFileSync(borderPath);
    const borderImage = await pdfDoc.embedPng(borderBytes);
    page.drawImage(borderImage, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
    });

    const fontSansPath = path.join(__dirname, '../templates/certificate/Roboto-Regular.ttf');
    const fontCalligraphyPath = path.join(__dirname, '../templates/certificate/GreatVibes-Regular.ttf');
    const fontSans = await pdfDoc.embedFont(fs.readFileSync(fontSansPath));
    const fontCalligraphy = await pdfDoc.embedFont(fs.readFileSync(fontCalligraphyPath));

    const drawCenteredText = (
      text: string,
      y: number,
      size: number,
      font: any,
      color: any,
      options: { characterSpacing?: number } = {}
    ) => {
      const textWidth = font.widthOfTextAtSize(text, size);
      const x = (pageWidth - textWidth) / 2;
      page.drawText(text, {
        x,
        y,
        size,
        font,
        color,
        ...options,
      });
    };

    drawCenteredText('E-LEARNING', pageHeight - 90, 20, fontSans, rgb(0, 0, 0));
    drawCenteredText('CERTIFICATE OF COMPLETETION', pageHeight - 130, 34, fontSans, rgb(1, 0.55, 0));
    drawCenteredText('Chứng nhận hoàn thành ', pageHeight - 170, 20, fontSans, rgb(0, 0, 0));


    page.drawLine({
      start: { x: 300, y: pageHeight - 178 },
      end: { x: pageWidth - 300, y: pageHeight - 178 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });


    drawCenteredText(userName, pageHeight - 260, 60, fontCalligraphy, rgb(0.917, 0.333, 0.141), {
      characterSpacing: 10,
    });

    drawCenteredText('Đã tham gia và hoàn thành khóa học', pageHeight - 320, 18, fontSans, rgb(0, 0, 0));
    drawCenteredText(courseName, pageHeight - 377, 28, fontSans, rgb(1, 0, 0));


    const lineOffset = 15;


    const lineMarginX = 80; 
    const lineY = pageHeight - 377 - lineOffset;
    
    page.drawLine({
      start: { x: lineMarginX, y: lineY },
      end: { x: pageWidth - lineMarginX, y: lineY },
      thickness: 2,
      color: rgb(0.8, 0.8, 0.8),
    });
  
    drawCenteredText('Ho Chi Minh: ' + issueDate, 160, 15, fontSans, rgb(0, 0, 0));


    page.drawText('Mã chứng chỉ', {
      x: 140,
      y: 120,
      size: 16,
      font: fontSans,
      color: rgb(0.663, 0.663, 0.663),
    });
    page.drawText(certificateNumber, {
      x: 145,
      y: 95,
      size: 18,
      font: fontSans,
      color: rgb(0, 0, 0),
    });


    const rightTextX = pageWidth / 2 + 80;
    page.drawText('e-Learning Team', {
      x: rightTextX,
      y: 120,
      size: 16,
      font: fontSans,
      color: rgb(0.663, 0.663, 0.663),
    });
    page.drawText('E-LEARNING', {
      x: rightTextX,
      y: 95,
      size: 18,
      font: fontSans,
      color: rgb(0, 0, 0),
    });

 
    const ornamentPath = path.join(__dirname, '../templates/certificate/logo_certificate.png');
    const ornamentBytes = fs.readFileSync(ornamentPath);
    const ornamentImage = await pdfDoc.embedPng(ornamentBytes);
    page.drawImage(ornamentImage, {
      x: pageWidth / 2 - 75,
      y: 30,
      width: 150,
      height: 150,
    });


    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    const bufferStream = new Readable();
    bufferStream.push(pdfBuffer);
    bufferStream.push(null);

    const pdfFile: ExpressMulterFile = {
      fieldname: 'certificate',
      originalname: 'certificate.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      buffer: pdfBuffer,
      size: pdfBuffer.length,
      stream: bufferStream,
      destination: '',
      filename: 'certificate.pdf',
      path: '',
    };

    const pdfUrl= await uploadPdf(pdfFile, userName);
    return pdfUrl;
  } catch (error) {
    console.error('Error generating certificate:', error);
    return null;
  }
};




export const createCertificate = async (courseId: string, currentUserId: string) => {

    const existingCertificate = await Certificate.findOne({course: courseId, user: currentUserId});
    if (existingCertificate) {
      throw new Error("Chứng chỉ đã được tạo cho người dùng và khóa học này.");
    }

    const course = await Course.findById(courseId);
    const user = await User.findById(currentUserId);
    if (!course || !user) {
        throw new Error("Không tìm thấy người dùng hoặc khóa học.");
    }
    const issueDate = new Date();
    const certificateNumber = generateCertificateNumber();
    const pdfUrl = await generateCertificate(user.fullName, course.courseName, issueDate.toString(), certificateNumber);
    const newCertificate = new Certificate({
        user: currentUserId,
        course: courseId,
        certificatePDFUrl: pdfUrl,
        certificateNumber: certificateNumber,
        issuedDate: issueDate,
        dateChange: issueDate,
        expirationDate: dayjs(issueDate).add(2, 'year').toDate(),
    });

    await newCertificate.save();
    return newCertificate;
}


export const getCertificatesByCourseAndUser = async (courseId: string, currentUserId: string): Promise<UserCertificateResponse> => {
    try {
        const course = await Course.findById(courseId);
        const user = await User.findById(currentUserId);
        if (!course || !user) {
            throw new Error("Không tìm thấy người dùng hoặc khóa học.");
        }

        const certificate = await Certificate.findOne({ course: courseId, user: currentUserId });
        if (!certificate) {
            throw new Error(`Không có chứng chỉ của người dùng: ${currentUserId} và khóa học: ${courseId}`);
        }

        return {
            issuedDate: certificate.issuedDate.toString(),
            certificateNumber: certificate.certificateNumber,
            certificatePDFUrl: certificate.certificatePDFUrl,
            courseName: course.courseName,
            userFullName: user.fullName,
            expiresDate: certificate.expirationDate?.toString() || undefined
        };
    } catch (error) {
        console.error("Lỗi khi lấy chứng chỉ:", error);
        throw error;
    }
}


export const getAllCertificatesByUser = async (currentUserId: string): Promise<UserCertificateResponse[]> => {
    try {
        const certificatesByUser = await Certificate.find({ user: currentUserId });
        const user = await User.findById(currentUserId);
        if (!user) {
            throw new Error(`User not found with id: ${currentUserId}`);
        }

        const userCertificateResponses = await Promise.all(certificatesByUser.map(async (certificate) => {
            const course = await Course.findById(certificate.course);
            if (!course) {
                throw new Error(`Course not found with id: ${certificate.course}`);
            }

            return {
                issuedDate: certificate.issuedDate ? certificate.issuedDate.toString() : null,
                certificateNumber: certificate.certificateNumber,
                certificatePDFUrl: certificate.certificatePDFUrl,

                courseName: course.courseName,
                userFullName: user.fullName,
                expiresDate: certificate.expirationDate ? certificate.expirationDate.toString() : null
            } as UserCertificateResponse;
        }));

        return userCertificateResponses;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách chứng chỉ:", error);
        throw error;
    }
}


const generateCertificateNumber = (): string => {
    const prefix = 'EL';
    const randomNumber = Math.floor(Math.random() * 1000000);
    return `${prefix}${String(randomNumber).padStart(6, '0')}`;
}
