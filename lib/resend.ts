import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
  replyTo?: string
}

export interface PropertyInquiryEmail {
  propertyTitle: string
  propertyUrl: string
  inquirerName: string
  inquirerEmail: string
  inquirerPhone?: string
  message: string
  ownerName: string
  ownerEmail: string
}

export interface BookingConfirmationEmail {
  guestName: string
  guestEmail: string
  propertyTitle: string
  checkIn: string
  checkOut: string
  totalAmount: number
  bookingId: string
  ownerName: string
}

export class ResendService {
  private static readonly FROM_EMAIL = "Hovmart <noreply@hovmart.com>"
  private static readonly SUPPORT_EMAIL = "support@hovmart.com"

  static async sendEmail(emailData: EmailTemplate) {
    try {
      const { data, error } = await resend.emails.send({
        from: emailData.from || this.FROM_EMAIL,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        replyTo: emailData.replyTo,
      })

      if (error) {
        console.error("Resend email error:", error)
        throw new Error(`Failed to send email: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error("Email service error:", error)
      throw error
    }
  }

  static async sendWelcomeEmail(userEmail: string, userName: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Hovmart</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B5CF6, #A855F7); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Hovmart! 🏡</h1>
              <p>Your Premium Property Marketplace</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>Thank you for joining Hovmart, Nigeria's premier property marketplace. We're excited to help you find your perfect property or list your own.</p>
              
              <h3>What you can do with Hovmart:</h3>
              <ul>
                <li>🏠 Browse thousands of verified properties</li>
                <li>💼 List your properties for sale or rent</li>
                <li>🔍 Use advanced search filters</li>
                <li>📱 Get instant notifications</li>
                <li>💬 Connect directly with property owners</li>
              </ul>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/properties" class="button">Start Browsing Properties</a>
              
              <p>If you have any questions, our support team is here to help at ${this.SUPPORT_EMAIL}</p>
              
              <p>Best regards,<br>The Hovmart Team</p>
            </div>
            <div class="footer">
              <p>© 2024 Hovmart. All rights reserved.</p>
              <p>Lagos, Nigeria | www.hovmart.com</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: userEmail,
      subject: "Welcome to Hovmart - Your Property Journey Starts Here! 🏡",
      html,
    })
  }

  static async sendPropertyInquiry(data: PropertyInquiryEmail) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Property Inquiry</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #8B5CF6; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .inquiry-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Property Inquiry 📧</h1>
            </div>
            <div class="content">
              <h2>Hello ${data.ownerName}!</h2>
              <p>You have received a new inquiry for your property: <strong>${data.propertyTitle}</strong></p>
              
              <div class="inquiry-details">
                <h3>Inquiry Details:</h3>
                <p><strong>From:</strong> ${data.inquirerName}</p>
                <p><strong>Email:</strong> ${data.inquirerEmail}</p>
                ${data.inquirerPhone ? `<p><strong>Phone:</strong> ${data.inquirerPhone}</p>` : ""}
                <p><strong>Message:</strong></p>
                <p style="background: #f0f0f0; padding: 15px; border-radius: 5px;">${data.message}</p>
              </div>
              
              <a href="${data.propertyUrl}" class="button">View Property</a>
              
              <p>You can reply directly to this email to respond to the inquiry.</p>
              
              <p>Best regards,<br>The Hovmart Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: data.ownerEmail,
      subject: `New Inquiry for ${data.propertyTitle}`,
      html,
      replyTo: data.inquirerEmail,
    })
  }

  static async sendBookingConfirmation(data: BookingConfirmationEmail) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Booking Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #10B981; }
            .amount { font-size: 24px; color: #10B981; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed! ✅</h1>
              <p>Your reservation is confirmed</p>
            </div>
            <div class="content">
              <h2>Hello ${data.guestName}!</h2>
              <p>Great news! Your booking has been confirmed.</p>
              
              <div class="booking-details">
                <h3>Booking Details:</h3>
                <p><strong>Property:</strong> ${data.propertyTitle}</p>
                <p><strong>Check-in:</strong> ${data.checkIn}</p>
                <p><strong>Check-out:</strong> ${data.checkOut}</p>
                <p><strong>Booking ID:</strong> ${data.bookingId}</p>
                <p><strong>Host:</strong> ${data.ownerName}</p>
                <p class="amount">Total Amount: ₦${data.totalAmount.toLocaleString()}</p>
              </div>
              
              <p>We'll send you check-in instructions closer to your arrival date.</p>
              
              <p>Have a wonderful stay!</p>
              
              <p>Best regards,<br>The Hovmart Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: data.guestEmail,
      subject: `Booking Confirmed - ${data.propertyTitle}`,
      html,
    })
  }

  static async sendPasswordReset(userEmail: string, resetUrl: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #EF4444; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #EF4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #FEF2F2; border: 1px solid #FECACA; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password 🔐</h1>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>We received a request to reset your password for your Hovmart account.</p>
              
              <a href="${resetUrl}" class="button">Reset Password</a>
              
              <div class="warning">
                <p><strong>Security Notice:</strong></p>
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Never share this link with anyone</li>
                </ul>
              </div>
              
              <p>If you have any concerns, contact us at ${this.SUPPORT_EMAIL}</p>
              
              <p>Best regards,<br>The Hovmart Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: userEmail,
      subject: "Reset Your Hovmart Password",
      html,
    })
  }
}

export default ResendService
