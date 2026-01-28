// utils/email.js
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

// Email Templates
const templates = {
    WELCOME: 'welcome-email.html',
    APPOINTMENT_CONFIRMATION: 'appointment-confirmation.html',
    APPOINTMENT_REMINDER: 'appointment-reminder.html',
    APPOINTMENT_CANCELLATION: 'appointment-cancellation.html',
    PASSWORD_RESET: 'password-reset.html',
    PRESCRIPTION_READY: 'prescription-ready.html',
    LAB_RESULTS: 'lab-results.html',
    BILLING_INVOICE: 'billing-invoice.html',
    NEWSLETTER: 'newsletter.html',
    LEAVE_APPROVAL: 'leave-approval.html',
    LEAVE_REJECTION: 'leave-rejection.html',
    TELEMEDICINE_INVITE: 'telemedicine-invite.html',
    FEEDBACK_REQUEST: 'feedback-request.html',
    EMERGENCY_ALERT: 'emergency-alert.html'
};

// Create email transporter
const createTransporter = () => {
    const useSmtp = process.env.EMAIL_USE_SMTP === 'true';

    if (useSmtp) {
        // SMTP configuration
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    } else {
        // Development configuration (Ethereal or similar)
        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.DEV_EMAIL_USER || 'test@ethereal.email',
                pass: process.env.DEV_EMAIL_PASS || 'test123'
            }
        });
    }
};

// Read email template
const readTemplate = (templateName, data) => {
    try {
        const templatePath = path.join(__dirname, '../templates/emails', templateName);

        if (!fs.existsSync(templatePath)) {
            // Fallback to default template
            return generateDefaultTemplate(templateName, data);
        }

        const templateContent = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateContent);
        return template(data);
    } catch (error) {
        console.error(`Error reading template ${templateName}:`, error);
        return generateDefaultTemplate(templateName, data);
    }
};

// Generate default template
const generateDefaultTemplate = (templateName, data) => {
    const appName = process.env.APP_NAME || 'Healthcare Management System';
    const supportEmail = process.env.SUPPORT_EMAIL || 'support@healthcare.com';

    let subject = '';
    let content = '';

    switch (templateName) {
        case templates.WELCOME:
            subject = `Welcome to ${appName}!`;
            content = `
        <h2>Welcome ${data.name}!</h2>
        <p>Your account has been successfully created.</p>
        <p>You can now login to your account using your email address.</p>
        <p>If you have any questions, please contact our support team at ${supportEmail}.</p>
      `;
            break;

        case templates.APPOINTMENT_CONFIRMATION:
            subject = `Appointment Confirmation - ${appName}`;
            content = `
        <h2>Appointment Confirmed</h2>
        <p>Dear ${data.patientName},</p>
        <p>Your appointment has been confirmed with the following details:</p>
        <ul>
          <li><strong>Doctor:</strong> ${data.doctorName}</li>
          <li><strong>Date:</strong> ${data.appointmentDate}</li>
          <li><strong>Time:</strong> ${data.appointmentTime}</li>
          <li><strong>Type:</strong> ${data.appointmentType}</li>
        </ul>
        <p>Please arrive 15 minutes before your scheduled time.</p>
      `;
            break;

        case templates.PASSWORD_RESET:
            subject = `Password Reset Request - ${appName}`;
            content = `
        <h2>Password Reset</h2>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${data.resetLink}">Reset Password</a></p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `;
            break;

        case templates.TELEMEDICINE_INVITE:
            subject = `Telemedicine Appointment - ${appName}`;
            content = `
        <h2>Telemedicine Appointment Invitation</h2>
        <p>Dear ${data.patientName},</p>
        <p>Your telemedicine appointment is scheduled with the following details:</p>
        <ul>
          <li><strong>Doctor:</strong> ${data.doctorName}</li>
          <li><strong>Date:</strong> ${data.appointmentDate}</li>
          <li><strong>Time:</strong> ${data.appointmentTime}</li>
          <li><strong>Meeting Link:</strong> <a href="${data.meetingLink}">Join Meeting</a></li>
          <li><strong>Meeting ID:</strong> ${data.meetingId}</li>
        </ul>
        <p>Please join the meeting 5 minutes before your scheduled time.</p>
      `;
            break;

        default:
            subject = `Notification from ${appName}`;
            content = `
        <h2>Notification</h2>
        <p>${data.message || 'You have a new notification.'}</p>
      `;
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background-color: #f9f9f9; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; 
                  color: white; text-decoration: none; border-radius: 4px; }
        .details { background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${appName}</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
          <p>Contact support: ${supportEmail}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send email function
const sendEmail = async (options) => {
    try {
        const transporter = createTransporter();

        // Determine template
        let html = options.html;
        if (!html && options.template) {
            html = readTemplate(options.template, options.data || {});
        }

        // Prepare email options
        const mailOptions = {
            from: process.env.EMAIL_FROM || `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject || 'Notification',
            html: html || options.message,
            text: options.text,
            attachments: options.attachments,
            replyTo: options.replyTo,
            cc: options.cc,
            bcc: options.bcc
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);

        // Log email info in development
        if (process.env.NODE_ENV === 'development') {
            console.log('Email sent:', info.messageId);
            console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        }

        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Send bulk emails
const sendBulkEmail = async (recipients, options) => {
    try {
        const transporter = createTransporter();
        const results = [];

        for (const recipient of recipients) {
            try {
                // Prepare email options for each recipient
                let html = options.html;
                if (!html && options.template) {
                    const data = { ...options.data, recipient };
                    html = readTemplate(options.template, data);
                }

                const mailOptions = {
                    from: process.env.EMAIL_FROM || `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
                    to: recipient.email,
                    subject: options.subject,
                    html: html,
                    text: options.text,
                    attachments: options.attachments
                };

                const info = await transporter.sendMail(mailOptions);
                results.push({ email: recipient.email, status: 'sent', messageId: info.messageId });

            } catch (error) {
                results.push({ email: recipient.email, status: 'failed', error: error.message });
            }

            // Delay between emails to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return results;
    } catch (error) {
        console.error('Error sending bulk email:', error);
        throw error;
    }
};

// Send appointment confirmation email
const sendAppointmentConfirmation = async (appointment, patient, doctor) => {
    try {
        const templateData = {
            patientName: `${patient.firstName} ${patient.lastName}`,
            doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
            appointmentDate: new Date(appointment.appointmentDate).toLocaleDateString(),
            appointmentTime: appointment.startTime,
            appointmentType: appointment.appointmentType,
            appointmentId: appointment.appointmentId,
            location: process.env.HOSPITAL_ADDRESS || 'Main Hospital Building',
            phone: process.env.HOSPITAL_PHONE || '+1234567890',
            notes: appointment.reason || 'Regular checkup'
        };

        await sendEmail({
            email: patient.email,
            subject: `Appointment Confirmation - ${appointment.appointmentId}`,
            template: templates.APPOINTMENT_CONFIRMATION,
            data: templateData
        });

        console.log(`Appointment confirmation email sent to ${patient.email}`);
        return true;
    } catch (error) {
        console.error('Error sending appointment confirmation:', error);
        return false;
    }
};

// Send appointment reminder email
const sendAppointmentReminder = async (appointment, patient, doctor, hoursBefore = 24) => {
    try {
        const templateData = {
            patientName: `${patient.firstName} ${patient.lastName}`,
            doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
            appointmentDate: new Date(appointment.appointmentDate).toLocaleDateString(),
            appointmentTime: appointment.startTime,
            appointmentType: appointment.appointmentType,
            hoursBefore: hoursBefore,
            reminderType: hoursBefore === 1 ? '1 hour' : `${hoursBefore} hours`,
            cancelLink: `${process.env.FRONTEND_URL}/appointments/cancel/${appointment._id}`,
            rescheduleLink: `${process.env.FRONTEND_URL}/appointments/reschedule/${appointment._id}`
        };

        await sendEmail({
            email: patient.email,
            subject: `Appointment Reminder - ${hoursBefore} hours before`,
            template: templates.APPOINTMENT_REMINDER,
            data: templateData
        });

        console.log(`Appointment reminder email sent to ${patient.email}`);
        return true;
    } catch (error) {
        console.error('Error sending appointment reminder:', error);
        return false;
    }
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
    try {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const templateData = {
            name: `${user.firstName} ${user.lastName}`,
            resetLink: resetLink,
            expiryTime: '10 minutes'
        };

        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            template: templates.PASSWORD_RESET,
            data: templateData
        });

        console.log(`Password reset email sent to ${user.email}`);
        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return false;
    }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
    try {
        const templateData = {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            loginLink: process.env.FRONTEND_URL || 'http://localhost:3000',
            supportEmail: process.env.SUPPORT_EMAIL || 'support@healthcare.com',
            phone: process.env.SUPPORT_PHONE || '+1234567890'
        };

        await sendEmail({
            email: user.email,
            subject: 'Welcome to Our Healthcare System',
            template: templates.WELCOME,
            data: templateData
        });

        console.log(`Welcome email sent to ${user.email}`);
        return true;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return false;
    }
};

// Send telemedicine invite
const sendTelemedicineInvite = async (appointment, patient, doctor, meetingLink) => {
    try {
        const templateData = {
            patientName: `${patient.firstName} ${patient.lastName}`,
            doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
            appointmentDate: new Date(appointment.appointmentDate).toLocaleDateString(),
            appointmentTime: appointment.startTime,
            meetingLink: meetingLink,
            meetingId: appointment.telemedicineMeetingId || 'N/A',
            preparationTips: [
                'Ensure you have a stable internet connection',
                'Find a quiet, private space for the consultation',
                'Have your ID and any medical records ready',
                'Test your camera and microphone before the meeting'
            ]
        };

        await sendEmail({
            email: patient.email,
            subject: 'Telemedicine Appointment Invitation',
            template: templates.TELEMEDICINE_INVITE,
            data: templateData
        });

        console.log(`Telemedicine invite sent to ${patient.email}`);
        return true;
    } catch (error) {
        console.error('Error sending telemedicine invite:', error);
        return false;
    }
};

// Send prescription ready notification
const sendPrescriptionReadyEmail = async (patient, prescription, doctor) => {
    try {
        const templateData = {
            patientName: `${patient.firstName} ${patient.lastName}`,
            doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
            prescriptionId: prescription.prescriptionId,
            date: new Date(prescription.date).toLocaleDateString(),
            medicines: prescription.medicines.slice(0, 3), // Show first 3 medicines
            totalMedicines: prescription.medicines.length,
            downloadLink: `${process.env.FRONTEND_URL}/prescriptions/${prescription._id}/download`,
            pharmacyLink: `${process.env.FRONTEND_URL}/pharmacy`
        };

        await sendEmail({
            email: patient.email,
            subject: 'Your Prescription is Ready',
            template: templates.PRESCRIPTION_READY,
            data: templateData
        });

        console.log(`Prescription ready email sent to ${patient.email}`);
        return true;
    } catch (error) {
        console.error('Error sending prescription ready email:', error);
        return false;
    }
};

// Send lab results notification
const sendLabResultsEmail = async (patient, labTest, doctor) => {
    try {
        const templateData = {
            patientName: `${patient.firstName} ${patient.lastName}`,
            doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
            testName: labTest.testName,
            testId: labTest.testId,
            collectionDate: new Date(labTest.collectionDate).toLocaleDateString(),
            resultDate: new Date(labTest.resultDate).toLocaleDateString(),
            status: labTest.status,
            downloadLink: `${process.env.FRONTEND_URL}/lab-tests/${labTest._id}/download`,
            followupNote: labTest.notes || 'Please schedule a follow-up appointment to discuss results.'
        };

        await sendEmail({
            email: patient.email,
            subject: 'Your Lab Test Results are Ready',
            template: templates.LAB_RESULTS,
            data: templateData
        });

        console.log(`Lab results email sent to ${patient.email}`);
        return true;
    } catch (error) {
        console.error('Error sending lab results email:', error);
        return false;
    }
};

// Send billing invoice
const sendBillingInvoiceEmail = async (patient, invoice) => {
    try {
        const templateData = {
            patientName: `${patient.firstName} ${patient.lastName}`,
            invoiceId: invoice.invoiceId,
            invoiceDate: new Date(invoice.invoiceDate).toLocaleDateString(),
            dueDate: new Date(invoice.dueDate).toLocaleDateString(),
            amount: invoice.totalAmount,
            currency: invoice.currency || 'USD',
            paymentStatus: invoice.paymentStatus,
            paymentLink: `${process.env.FRONTEND_URL}/billing/pay/${invoice._id}`,
            downloadLink: `${process.env.FRONTEND_URL}/invoices/${invoice._id}/download`,
            contactEmail: process.env.BILLING_EMAIL || 'billing@healthcare.com',
            contactPhone: process.env.BILLING_PHONE || '+1234567890'
        };

        await sendEmail({
            email: patient.email,
            subject: `Invoice ${invoice.invoiceId} - Payment Due`,
            template: templates.BILLING_INVOICE,
            data: templateData
        });

        console.log(`Billing invoice email sent to ${patient.email}`);
        return true;
    } catch (error) {
        console.error('Error sending billing invoice email:', error);
        return false;
    }
};

// Send emergency alert
const sendEmergencyAlert = async (staff, emergency) => {
    try {
        const templateData = {
            staffName: `${staff.firstName} ${staff.lastName}`,
            emergencyType: emergency.type,
            severity: emergency.severity,
            location: emergency.location,
            patientName: emergency.patientName,
            description: emergency.description,
            actionRequired: emergency.actionRequired || 'Immediate attention required',
            contact: emergency.contact || 'Emergency Department',
            timestamp: new Date(emergency.timestamp).toLocaleString()
        };

        await sendEmail({
            email: staff.email,
            subject: `EMERGENCY ALERT: ${emergency.type} - ${emergency.severity}`,
            template: templates.EMERGENCY_ALERT,
            data: templateData
        });

        console.log(`Emergency alert sent to ${staff.email}`);
        return true;
    } catch (error) {
        console.error('Error sending emergency alert:', error);
        return false;
    }
};

// Test email configuration
const testEmailConfiguration = async () => {
    try {
        const transporter = createTransporter();

        // Verify connection configuration
        await transporter.verify();
        console.log('Email server is ready to take our messages');

        // Send test email
        const testInfo = await sendEmail({
            email: process.env.TEST_EMAIL || 'test@example.com',
            subject: 'Test Email Configuration',
            html: '<h2>Test Email</h2><p>This is a test email to verify the email configuration.</p>'
        });

        return {
            success: true,
            message: 'Email configuration test successful',
            info: testInfo
        };
    } catch (error) {
        console.error('Email configuration test failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    sendEmail,
    sendBulkEmail,
    sendAppointmentConfirmation,
    sendAppointmentReminder,
    sendPasswordResetEmail,
    sendWelcomeEmail,
    sendTelemedicineInvite,
    sendPrescriptionReadyEmail,
    sendLabResultsEmail,
    sendBillingInvoiceEmail,
    sendEmergencyAlert,
    testEmailConfiguration,
    templates
};