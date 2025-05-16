export function generateActivationEmail(link) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activate Your ExamApp Account</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 30px 20px 20px 20px; border-bottom: 1px solid #eaeaea;">
                            <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <!-- Logo Placeholder -->
                                        <div style="width: 60px; height: 60px; background-color: #4a6cf7; border-radius: 50%; display: inline-block; margin-bottom: 10px; line-height: 60px; text-align: center; color: white; font-weight: bold; font-size: 24px;">E</div>
                                        <h1 style="margin: 10px 0 5px 0; font-size: 24px; color: #333333;">ExamApp</h1>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td align="center" style="padding: 40px 30px;">
                            <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                    <td>
                                        <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 20px; text-align: center;">Activate Your ExamApp Account</h2>
                                        <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 24px; color: #555555; text-align: center;">
                                            Thank you for registering with ExamApp. Please click the button below to verify your email address and start using your account.
                                        </p>
                                        
                                        <!-- CTA Button -->
                                        <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
                                            <tr>
                                                <td align="center" style="padding: 20px 0;">
                                                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td align="center" style="border-radius: 4px;" bgcolor="#4a6cf7">
                                                                <a href="${link}" target="_blank" style="display: inline-block; padding: 15px 30px; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 4px; text-align: center;">
                                                                    Activate Account
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Fallback Text Link -->
                                        <p style="margin: 25px 0 0 0; font-size: 14px; line-height: 21px; color: #777777; text-align: center;">
                                            If the button doesn't work, copy and paste this link into your browser:
                                            <br>
                                            <a href="${link}" style="color: #4a6cf7; text-decoration: underline; word-break: break-all;">${link}</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Support Note -->
                    <tr>
                        <td align="center" style="padding: 20px 30px 40px 30px;">
                            <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
                                <tr>
                                    <td style="padding: 20px; background-color: #f9f9f9; border-radius: 4px;">
                                        <p style="margin: 0; font-size: 14px; line-height: 21px; color: #777777; text-align: center;">
                                            If you didn't request this activation, please ignore this email.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 20px; background-color: #f5f5f5; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0; font-size: 12px; line-height: 18px; color: #999999;">
                                &copy; 2025 ExamApp. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
}
