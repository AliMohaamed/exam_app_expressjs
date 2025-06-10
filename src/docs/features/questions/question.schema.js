/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         questionText:
 *           type: string
 *           example: What is the capital of France?
 *         questionType:
 *           type: string
 *           enum: [multiple-choice, true-false, essay, fill-blank]
 *           example: multiple-choice
 *         options:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: Paris
 *               isCorrect:
 *                 type: boolean
 *                 example: true
 *         correctAnswer:
 *           type: boolean
 *           example: true
 *         modelAnswer:
 *           type: string
 *           example: The capital of France is Paris, which is known for its iconic Eiffel Tower and rich cultural heritage.
 *         correctText:
 *           type: string
 *           example: Paris
 *         points:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *           example: 2
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           example: easy
 *         examId:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-03-15T10:30:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-03-15T10:30:00Z
 *
 *     CreateQuestionRequest:
 *       type: object
 *       required:
 *         - questionText
 *         - questionType
 *         - examId
 *       properties:
 *         questionText:
 *           type: string
 *           minLength: 10
 *           maxLength: 500
 *           description: The question text
 *           example: What is the capital of France?
 *         questionType:
 *           type: string
 *           enum: [multiple-choice, true-false, essay, fill-blank]
 *           description: Type of question
 *           example: multiple-choice
 *         options:
 *           type: array
 *           description: Required for multiple-choice questions
 *           items:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: Paris
 *               isCorrect:
 *                 type: boolean
 *                 example: true
 *         correctAnswer:
 *           type: boolean
 *           description: Required for true-false questions
 *           example: true
 *         modelAnswer:
 *           type: string
 *           maxLength: 1000
 *           description: Required for essay questions
 *           example: The capital of France is Paris, which is known for its iconic Eiffel Tower and rich cultural heritage.
 *         correctText:
 *           type: string
 *           description: Required for fill-in-the-blank questions
 *           example: Paris
 *         points:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *           default: 1
 *           description: Points awarded for correct answer
 *           example: 2
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           default: medium
 *           description: Question difficulty level
 *           example: easy
 *         examId:
 *           type: string
 *           description: ID of the exam this question belongs to
 *           example: 507f1f77bcf86cd799439011
 *
 *     BulkCreateQuestionsRequest:
 *       type: object
 *       required:
 *         - examId
 *         - questions
 *       properties:
 *         examId:
 *           type: string
 *           description: ID of the exam these questions belong to
 *           example: 507f1f77bcf86cd799439011
 *         questions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CreateQuestionRequest'
 *
 *     UpdateQuestionRequest:
 *       type: object
 *       required:
 *         - examId
 *         - questionId
 *       properties:
 *         examId:
 *           type: string
 *           description: ID of the exam this question belongs to
 *           example: 507f1f77bcf86cd799439011
 *         questionId:
 *           type: string
 *           description: ID of the question to update
 *           example: 507f1f77bcf86cd799439011
 *         questionText:
 *           type: string
 *           minLength: 10
 *           maxLength: 500
 *           description: The question text
 *           example: What is the capital of France?
 *         questionType:
 *           type: string
 *           enum: [multiple-choice, true-false, essay, fill-blank]
 *           description: Type of question
 *           example: multiple-choice
 *         options:
 *           type: array
 *           description: Required for multiple-choice questions
 *           items:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: Paris
 *               isCorrect:
 *                 type: boolean
 *                 example: true
 *         correctAnswer:
 *           type: boolean
 *           description: Required for true-false questions
 *           example: true
 *         modelAnswer:
 *           type: string
 *           maxLength: 1000
 *           description: Required for essay questions
 *           example: The capital of France is Paris, which is known for its iconic Eiffel Tower and rich cultural heritage.
 *         correctText:
 *           type: string
 *           description: Required for fill-in-the-blank questions
 *           example: Paris
 *         points:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *           description: Points awarded for correct answer
 *           example: 2
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           description: Question difficulty level
 *           example: easy
 *
 *     QuestionResponse:
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
 *             question:
 *               $ref: '#/components/schemas/Question'
 *
 *     QuestionsListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Questions retrieved successfully
 *         data:
 *           type: object
 *           properties:
 *             questions:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 *             pagination:
 *               $ref: '#/components/schemas/Pagination'
 */
