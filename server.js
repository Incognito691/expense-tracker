import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import { config } from 'dotenv';

// Load .env.local file
config({ path: '.env.local' });

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

app.post('/api/send-otp', async (req, res) => {
  try {
    const { email, otp, name } = req.body;

    if (!email || !otp || !name) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'Expense Tracker <onboarding@resend.dev>',
      to: [email],
      subject: 'Your OTP Code - Expense Tracker',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0; }
              .container { background-color: white; padding: 40px; border-radius: 12px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
              .header { text-align: center; margin-bottom: 30px; }
              .header h1 { color: #2563eb; margin: 0 0 10px 0; font-size: 24px; }
              .header p { color: #666; margin: 0; font-size: 16px; }
              .otp-code { font-size: 36px; font-weight: bold; text-align: center; color: #000000; letter-spacing: 10px; padding: 25px; background: linear-gradient(to right, #eff6ff, #dbeafe); border-radius: 10px; margin: 25px 0; border: 2px dashed #2563eb; }
              .info { text-align: center; color: #666; font-size: 14px; margin: 15px 0; }
              .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #999; font-size: 12px; }
              .shield { width: 50px; height: 50px; margin: 0 auto 20px; background: #2563eb; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="shield">🛡️</div>
              <div class="header">
                <h1>Welcome ${name}!</h1>
                <p>Your verification code is ready</p>
              </div>
              <div class="otp-code">${otp}</div>
              <p class="info">This code will expire in 10 minutes.</p>
              <p class="info">If you didn't request this code, please ignore this email.</p>
              <div class="footer">
                <p>© 2025 Expense Tracker. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send email',
      });
    }

    res.json({
      success: true,
      message: 'OTP sent successfully',
      data,
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
