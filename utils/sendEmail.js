const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    // 2. Email HTML template
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>FreshMart Notification</title>
          <style>
            body {
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            .email-container {
              max-width: 600px;
              margin: 30px auto;
              background-color: #ffffff;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              border-top: 6px solid #27ae60
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 1px solid #eeeeee;
            }
            .header h2 {
              margin: 0;
              color: #27ae60;
            }
            .content {
              padding: 20px 0;
              color: #333333;
              line-height: 1.6;
            }
            .footer {
              font-size: 12px;
              color: #777777;
              text-align: center;
              padding-top: 30px;
              border-top: 1px solid #eeeeee;
            }
            .btn {
              display: inline-block;
              margin-top: 20px;
              padding: 12px 20px;
              background-color: #27ae60;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h2>FreshMart</h2>
            </div>
            <div class="content">
              <h2 style="color: #2E8B57;">Hello ${options.name || 'User'},</h2>
              <p>${options.message}</p>
              ${options.buttonLink ? `<a href="${options.buttonLink}" class="btn">${options.buttonText || 'View'}</a>` : ''}
            </div>
            <div class="footer">
              <p>
                This message was sent from FreshMart. If you did not expect this, please ignore.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  
    // 3. Send the email
    const mailOptions = {
      from: `"FreshMart" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html,
    };
  
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: `, options.email)
  } catch (error) {
    console.log(`Email sending failed: `, error.message)
    throw new Error(`Failed to sent email`)
  }
};

module.exports = sendEmail;


