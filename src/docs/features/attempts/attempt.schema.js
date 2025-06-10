/**
 * @swagger
 * components:
 *   schemas:
 *     AvailableExamsResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "Available exams retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             exams:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExamResponse/properties/data/properties/exam'
 *
 *     AttemptResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "Exam started successfully"
 *         data:
 *           type: object
 *           properties:
 *             attempt:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "65f1a2b3c4d5e6f7g8h9i0j1"
 *                 exam:
 *                   type: string
 *                   example: "65f1a2b3c4d5e6f7g8h9i0j2"
 *                 student:
 *                   type: string
 *                   example: "65f1a2b3c4d5e6f7g8h9i0j3"
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-20T10:00:00Z"
 *                 endTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-03-20T12:00:00Z"
 *                 status:
 *                   type: string
 *                   enum: [in_progress, completed, expired]
 *                   example: "in_progress"
 *                 score:
 *                   type: number
 *                   format: float
 *                   example: 85.5
 *                 answers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       question:
 *                         type: string
 *                         example: "65f1a2b3c4d5e6f7g8h9i0j4"
 *                       answer:
 *                         type: string
 *                         example: "A"
 *                       isCorrect:
 *                         type: boolean
 *                         example: true
 *
 *     ExamQuestionsResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "Questions retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             questions:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/QuestionResponse/properties/data/properties/question'
 *
 *     ExamSubmitRequest:
 *       type: object
 *       required:
 *         - answers
 *       properties:
 *         answers:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - question
 *               - answer
 *             properties:
 *               question:
 *                 type: string
 *                 description: Question ID
 *                 example: "65f1a2b3c4d5e6f7g8h9i0j4"
 *               answer:
 *                 type: string
 *                 description: Student's answer
 *                 example: "A"
 *
 *     ExamSubmitResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "Exam submitted successfully"
 *         data:
 *           type: object
 *           properties:
 *             attempt:
 *               $ref: '#/components/schemas/AttemptResponse/properties/data/properties/attempt'
 *
 *     ExamResultResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "Exam result retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             result:
 *               type: object
 *               properties:
 *                 attempt:
 *                   $ref: '#/components/schemas/AttemptResponse/properties/data/properties/attempt'
 *                 exam:
 *                   $ref: '#/components/schemas/ExamResponse/properties/data/properties/exam'
 *                 score:
 *                   type: number
 *                   format: float
 *                   example: 85.5
 *                 totalQuestions:
 *                   type: integer
 *                   example: 20
 *                 correctAnswers:
 *                   type: integer
 *                   example: 17
 *                 wrongAnswers:
 *                   type: integer
 *                   example: 3
 *                 passStatus:
 *                   type: string
 *                   enum: [passed, failed]
 *                   example: "passed"
 *
 *     StudentResultsResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "Results retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             results:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExamResultResponse/properties/data/properties/result'
 *
 *     AllAttemptsResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "All attempts retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             attempts:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AttemptResponse/properties/data/properties/attempt'
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
 */
