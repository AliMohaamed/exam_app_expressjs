/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           example: intermediate
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-03-15T10:30:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-03-15T10:30:00Z
 *
 *     AddStudentRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - level
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           description: Student's full name
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: Student's email address
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: Student's password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
 *           example: Password123!
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: Student's level
 *           example: intermediate
 *
 *     UpdateStudentRequest:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           description: Student's ID
 *           example: 507f1f77bcf86cd799439011
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           description: Student's full name
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: Student's email address
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: Student's password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
 *           example: Password123!
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: Student's level
 *           example: intermediate
 *
 *     DeleteStudentRequest:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           description: Student's ID
 *           example: 507f1f77bcf86cd799439011
 *
 *     StudentResponse:
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
 *             student:
 *               $ref: '#/components/schemas/Student'
 *
 *     StudentsListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Students retrieved successfully
 *         data:
 *           type: object
 *           properties:
 *             students:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *             pagination:
 *               $ref: '#/components/schemas/Pagination'
 */
