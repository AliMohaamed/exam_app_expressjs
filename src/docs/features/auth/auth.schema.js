/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - level
 *         - password
 *         - confirmPassword
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           description: User's full name
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: john.doe@example.com
 *         level:
 *           type: string
 *           description: User's level/role
 *           example: beginner
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
 *           example: Password123!
 *         confirmPassword:
 *           type: string
 *           format: password
 *           description: Password confirmation
 *           example: Password123!
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *           example: Password123!
 *
 *     ForgetPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: john.doe@example.com
 *
 *     VerifyOtpRequest:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: john.doe@example.com
 *         otp:
 *           type: string
 *           minLength: 6
 *           maxLength: 6
 *           description: One-time password sent to user's email
 *           example: 123456
 *
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *         - password
 *         - confirmPassword
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: john.doe@example.com
 *         otp:
 *           type: string
 *           minLength: 6
 *           maxLength: 6
 *           description: One-time password sent to user's email
 *           example: 123456
 *         password:
 *           type: string
 *           format: password
 *           description: New password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
 *           example: NewPassword123!
 *         confirmPassword:
 *           type: string
 *           format: password
 *           description: New password confirmation
 *           example: NewPassword123!
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Operation completed successfully
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 507f1f77bcf86cd799439011
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *                 level:
 *                   type: string
 *                   example: student
 *             token:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
