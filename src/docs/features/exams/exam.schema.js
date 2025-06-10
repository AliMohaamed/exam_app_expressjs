/**
 * @swagger
 * components:
 *   schemas:
 *     Exam:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         subject:
 *           type: string
 *           example: Mathematics
 *         description:
 *           type: string
 *           example: Basic algebra and calculus exam
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           example: intermediate
 *         duration:
 *           type: integer
 *           minimum: 1
 *           maximum: 180
 *           example: 60
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-03-15T10:30:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-03-15T10:30:00Z
 *
 *     CreateExamRequest:
 *       type: object
 *       required:
 *         - title
 *         - duration
 *         - totalMarks
 *         - passingMarks
 *         - startTime
 *         - endTime
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the exam
 *           example: "Final Mathematics Exam"
 *         description:
 *           type: string
 *           description: Description of the exam
 *           example: "Comprehensive test covering all topics from the semester"
 *         duration:
 *           type: integer
 *           description: Duration of the exam in minutes
 *           example: 120
 *         totalMarks:
 *           type: integer
 *           description: Total marks for the exam
 *           example: 100
 *         passingMarks:
 *           type: integer
 *           description: Minimum marks required to pass
 *           example: 40
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Start time of the exam
 *           example: "2024-03-20T10:00:00Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: End time of the exam
 *           example: "2024-03-20T12:00:00Z"
 *         instructions:
 *           type: string
 *           description: Instructions for the exam
 *           example: "Bring your calculator and ID card"
 *         isActive:
 *           type: boolean
 *           description: Whether the exam is active
 *           default: true
 *           example: true
 *
 *     UpdateExamRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the exam
 *           example: "Updated Mathematics Exam"
 *         description:
 *           type: string
 *           description: Description of the exam
 *           example: "Updated comprehensive test"
 *         duration:
 *           type: integer
 *           description: Duration of the exam in minutes
 *           example: 150
 *         totalMarks:
 *           type: integer
 *           description: Total marks for the exam
 *           example: 100
 *         passingMarks:
 *           type: integer
 *           description: Minimum marks required to pass
 *           example: 40
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Start time of the exam
 *           example: "2024-03-21T10:00:00Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: End time of the exam
 *           example: "2024-03-21T12:30:00Z"
 *         instructions:
 *           type: string
 *           description: Instructions for the exam
 *           example: "Updated instructions"
 *         isActive:
 *           type: boolean
 *           description: Whether the exam is active
 *           example: true
 *
 *     ExamResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "Exam created successfully"
 *         data:
 *           type: object
 *           properties:
 *             exam:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "65f1a2b3c4d5e6f7g8h9i0j1"
 *                 title:
 *                   type: string
 *                   example: "Final Mathematics Exam"
 *                 description:
 *                   type: string
 *                   example: "Comprehensive test covering all topics"
 *                 duration:
 *                   type: integer
 *                   example: 120
 *                 totalMarks:
 *                   type: integer
 *                   example: 100
 *                 passingMarks:
 *                   type: integer
 *                   example: 40
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-20T10:00:00Z"
 *                 endTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-20T12:00:00Z"
 *                 instructions:
 *                   type: string
 *                   example: "Bring your calculator and ID card"
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-15T08:00:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-15T08:00:00Z"
 *
 *     ExamsListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "Exams retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             exams:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExamResponse/properties/data/properties/exam'
 *             pagination:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 50
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 pages:
 *                   type: integer
 *                   example: 5
 *
 *     ExamStats:
 *       type: object
 *       properties:
 *         totalStudents:
 *           type: integer
 *           description: Total number of students enrolled
 *           example: 100
 *         completedExams:
 *           type: integer
 *           description: Number of students who completed the exam
 *           example: 85
 *         averageScore:
 *           type: number
 *           format: float
 *           description: Average score of all students
 *           example: 75.5
 *         passRate:
 *           type: number
 *           format: float
 *           description: Percentage of students who passed
 *           example: 80.0
 *         highestScore:
 *           type: number
 *           format: float
 *           description: Highest score achieved
 *           example: 98.0
 *         lowestScore:
 *           type: number
 *           format: float
 *           description: Lowest score achieved
 *           example: 45.0
 */
