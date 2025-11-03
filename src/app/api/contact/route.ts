import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, contactOption, contactDetails, message } =
      await request.json();

    // Validate required fields
    if (!name || !contactOption || !contactDetails || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rudra.workwith@gmail.com",
        pass: "qgoe abhn agrg svus",
      },
    });

    // Create HTML email template with cool aesthetic
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              margin-top: 40px;
              margin-bottom: 40px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #61ffc9 100%);
              padding: 60px 30px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            .header::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
              background-size: 20px 20px;
              animation: float 20s linear infinite;
              opacity: 0.4;
            }
            .header::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
              animation: shimmer 3s ease-in-out infinite;
            }
            @keyframes float {
              0% { transform: translate(-50%, -50%) rotate(0deg); }
              100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            @keyframes shimmer {
              0%, 100% { opacity: 0; }
              50% { opacity: 1; }
            }
            .header h1 {
              margin: 0;
              color: white;
              font-size: 32px;
              font-weight: 800;
              position: relative;
              z-index: 3;
              text-shadow: 0 4px 8px rgba(0,0,0,0.3);
              letter-spacing: -0.5px;
              margin-bottom: 10px;
            }
            .header .subtitle {
              color: rgba(255,255,255,0.9);
              font-size: 16px;
              font-weight: 500;
              position: relative;
              z-index: 3;
              text-shadow: 0 2px 4px rgba(0,0,0,0.2);
              margin-top: 8px;
            }
            .header .icon {
              font-size: 64px;
              margin-bottom: 20px;
              display: block;
              position: relative;
              z-index: 3;
              filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
              animation: pulse 2s ease-in-out infinite;
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 18px;
              color: #2d3748;
              margin-bottom: 30px;
              line-height: 1.6;
            }
            .contact-card {
              background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
              border-radius: 15px;
              padding: 25px;
              margin: 25px 0;
              border: 1px solid #e2e8f0;
            }
            .contact-info {
              display: grid;
              gap: 15px;
            }
            .info-row {
              display: flex;
              align-items: center;
              padding: 12px 15px;
              background: white;
              border-radius: 10px;
              border-left: 4px solid #61ffc9;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .info-label {
              font-weight: 600;
              color: #4a5568;
              min-width: 120px;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .info-value {
              color: #2d3748;
              font-size: 16px;
              flex: 1;
            }
            .message-section {
              margin-top: 30px;
            }
            .message-title {
              font-size: 18px;
              font-weight: 600;
              color: #2d3748;
              margin-bottom: 15px;
              display: flex;
              align-items: center;
            }
            .message-content {
              background: #f7fafc;
              border-radius: 12px;
              padding: 20px;
              font-size: 16px;
              line-height: 1.6;
              color: #4a5568;
              border-left: 4px solid #667eea;
              font-style: italic;
            }
            .footer {
              background: #2d3748;
              color: white;
              padding: 30px;
              text-align: center;
            }
            .timestamp {
              margin-top: 30px;
              padding: 15px;
              background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
              border-radius: 10px;
              text-align: center;
              color: #718096;
              font-size: 14px;
            }
            @media (max-width: 600px) {
              .container {
                margin: 20px;
                border-radius: 15px;
              }
              .header, .content {
                padding: 25px 20px;
              }
              .header {
                padding: 40px 20px;
              }
              .header h1 {
                font-size: 24px;
              }
              .header .subtitle {
                font-size: 14px;
              }
              .header .icon {
                font-size: 48px;
                margin-bottom: 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="icon">✨</span>
              <h1>New Contact Form Submission</h1>
              <div class="subtitle">Someone wants to connect with you!</div>
            </div>
            
            <div class="content">
              <div class="greeting">
                <strong>Hey Rudra!</strong> 👋<br>
                You've received a new message through your portfolio contact form. Here are the details:
              </div>
              
              <div class="contact-card">
                <div class="contact-info">
                  <div class="info-row">
                    <span class="info-label">👤 Name:</span>
                    <span class="info-value">${name}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">📱 Contact Via:</span>
                    <span class="info-value">${contactOption}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">🔗 Contact Info:</span>
                    <span class="info-value">${contactDetails}</span>
                  </div>
                </div>
              </div>
              
              <div class="message-section">
                <div class="message-title">
                  💬 Message:
                </div>
                <div class="message-content">
                  "${message}"
                </div>
              </div>
              
              <div class="timestamp">
                📅 Received on ${new Date().toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZoneName: "short",
                })}
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Email options
    const mailOptions = {
      from: '"Portfolio Contact Form" <rudra.workwith@gmail.com>',
      to: "rudranarayanaknr@gmail.com",
      subject: `🔥 New Contact: ${name} wants to connect!`,
      html: htmlTemplate,
      text: `
New Contact Form Submission

Name: ${name}
Contact Method: ${contactOption}
Contact Details: ${contactDetails}
Message: ${message}

Received on: ${new Date().toLocaleString()}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
