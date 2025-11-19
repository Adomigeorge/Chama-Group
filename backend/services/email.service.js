const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  console.log('📧 Email Config Check:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    hasPassword: !!process.env.SMTP_PASS
  });

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send invitation email with expiry date
const sendInvitationEmail = async (email, groupName, inviterName, invitationLink, expiresAt = null) => {
  try {
    console.log('📧 Preparing to send invitation email to:', email);
    
    const transporter = createTransporter();

    // Calculate expiry date (7 days from now )
    const expiryDate = expiresAt ? new Date(expiresAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const formattedExpiry = expiryDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const mailOptions = {
      from: `"ChamaPro" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
      subject: `🎉 You've been invited to join ${groupName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden;">
    <!-- Header -->
    <div style="background: #667eea; color: white; padding: 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">You're Invited! 🎉</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Join ${groupName} on ChamaPro</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 25px;">
      <h2 style="color: #333; margin-bottom: 15px;">Hello!</h2>
      <p style="font-size: 16px; margin-bottom: 20px;">
        <strong>${inviterName}</strong> has invited you to join their group 
        <strong>"${groupName}"</strong> on ChamaPro.
      </p>
      
      <!-- Action Button -->
      <div style="text-align: center; margin: 25px 0;">
        <a href="${invitationLink}" 
           style="background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
          Accept Invitation
        </a>
      </div>

      <!-- Invitation Details -->
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #667eea;">📋 Invitation Details</h3>
        <p style="margin: 8px 0;"><strong>Group:</strong> ${groupName}</p>
        <p style="margin: 8px 0;"><strong>Invited by:</strong> ${inviterName}</p>
        <p style="margin: 8px 0;"><strong>Expires:</strong> <span style="color: #e74c3c;">${formattedExpiry}</span></p>
      </div>
      
      <!-- Expiry Notice -->
      <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 12px; border-radius: 4px; text-align: center; margin: 20px 0;">
        <strong>⏰ Important:</strong> This invitation expires on <strong>${formattedExpiry}</strong>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 20px; color: #666; font-size: 14px; background: #f0f0f0;">
      <p style="margin: 0 0 10px 0;">If you didn't expect this invitation, you can safely ignore this email.</p>
      <p style="margin: 0; font-size: 12px; color: #999;">© ${new Date().getFullYear()} ChamaPro</p>
    </div>
  </div>
</body>
</html>
      `,

      text: `
        INVITATION TO JOIN ${groupName}

Hello!

${inviterName} has invited you to join their group "${groupName}" on ChamaPro.

Accept your invitation: ${invitationLink}

Invitation Details:
- Group: ${groupName}
- Invited by: ${inviterName}
- Expires: ${formattedExpiry}

This invitation will expire on ${formattedExpiry}.

If you didn't expect this invitation, you can safely ignore this email.

© ${new Date().getFullYear()} ChamaPro
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Invitation email sent successfully to:', email);
    
    return info;
  } catch (error) {
    console.error('❌ Failed to send invitation email:', error.message);
    throw error;
  }
};

// Send welcome email 
const sendWelcomeEmail = async (email, userName) => {
  try {
    console.log('📧 Sending welcome email to:', email);
    
    const transporter = createTransporter();

    const mailOptions = {
      from: `"ChamaPro" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
      subject: '🎉 Welcome to ChamaPro!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0;">Welcome to ChamaPro! 🎉</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2>Hello ${userName}!</h2>
            <p>Welcome to ChamaPro - your platform for managing group finances efficiently.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #667eea;">Get Started:</h3>
              <ul>
                <li>Create or join groups</li>
                <li>Track contributions and savings</li>
                <li>Manage group finances</li>
                <li>Collaborate with members</li>
              </ul>
            </div>
          </div>
        </div>
      `,
      text: `
        Welcome to ChamaPro!
        
        Hello ${userName}!
        
        Welcome to ChamaPro - your platform for managing group finances efficiently.
        
        Get Started:
        • Create or join groups
        • Track contributions and savings  
        • Manage group finances
        • Collaborate with members
        
        Thank you for joining us!
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully to:', email);
    return info;
    
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error.message);
    throw error;
  }
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('❌ SMTP configuration missing: SMTP_USER or SMTP_PASS not set');
      return false;
    }

    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ SMTP server is ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ SMTP configuration error:', error.message);
    return false;
  }
};

// Rate limiting to prevent spam
const emailRateLimit = new Map();

const canSendEmail = (email, cooldownMs = 60000) => {
  const now = Date.now();
  const lastSent = emailRateLimit.get(email);
  
  if (!lastSent) {
    emailRateLimit.set(email, now);
    return true;
  }
  
  if (now - lastSent > cooldownMs) {
    emailRateLimit.set(email, now);
    return true;
  }
  
  return false;
};

module.exports = {
  sendInvitationEmail,
  sendWelcomeEmail,
  verifyEmailConfig,
  canSendEmail
};