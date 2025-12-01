// Email service for sending OTP via backend API

// Use relative path for production (works with Vercel serverless functions)
// Falls back to localhost for local development
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3001' : '');

export const sendOTP = async (email: string, otp: string, name: string) => {
  try {
    const response = await fetch(`${API_URL}/api/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Failed to send OTP' };
    }

    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to send OTP. Please check your connection.',
    };
  }
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
