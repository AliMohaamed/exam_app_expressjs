// Constants
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const PASSING_SCORE = 60;
const MAX_SCORE = 100;

const buildDateFilter = (fromDate, toDate) => {
  if (!fromDate && !toDate) return {};

  const dateFilter = {};
  if (fromDate) dateFilter.$gte = new Date(fromDate);
  if (toDate) dateFilter.$lte = new Date(toDate);

  return { createdAt: dateFilter };
};

const buildPercentageFilter = (isPassed) => {
  if (isPassed === undefined) return {};

  const isPassedBool = isPassed === "true";
  return {
    percentage: {
      $gte: isPassedBool ? PASSING_SCORE : 0,
      $lt: isPassedBool ? MAX_SCORE : PASSING_SCORE,
    },
  };
};

export const buildMatchConditions = (filters) => {
  const { status, isPassed, fromDate, toDate } = filters;

  let conditions = {};

  if (status) conditions.status = status;

  const percentageFilter = buildPercentageFilter(isPassed);
  const dateFilter = buildDateFilter(fromDate, toDate);

  return { ...conditions, ...percentageFilter, ...dateFilter };
};

const buildSearchFilter = (searchQuery) => {
  if (!searchQuery) return null;

  const regex = new RegExp(searchQuery, "i");
  return {
    $match: {
      $or: [{ "student.name": regex }, { "exam.subject": regex }],
    },
  };
};

export const buildBasePipeline = (matchConditions, searchQuery) => {
  const pipeline = [
    {
      $lookup: {
        from: "exams",
        localField: "exam",
        foreignField: "_id",
        as: "exam",
      },
    },
    { $unwind: "$exam" },
    {
      $lookup: {
        from: "users",
        localField: "student",
        foreignField: "_id",
        as: "student",
      },
    },
    { $unwind: "$student" },
    {
      $project: {
        "student.password": 0,
        "student.__v": 0,
        "student.createdAt": 0,
        "student.updatedAt": 0,
        "student.isConfirmed": 0,
        "student.profileImage.public_id": 0,
        "exam.__v": 0,
        "exam.createdAt": 0,
        "exam.updatedAt": 0,
      },
    },
    {
      $addFields: {
        isPassed: { $gte: ["$percentage", PASSING_SCORE] },
      },
    },
    { $match: matchConditions },
  ];

  const searchFilter = buildSearchFilter(searchQuery);
  if (searchFilter) pipeline.push(searchFilter);

  return pipeline;
};

export const buildStatsPipeline = (basePipeline) => [
  ...basePipeline,
  {
    $group: {
      _id: null,
      totalAttempts: { $sum: 1 },
      totalPercentage: { $sum: "$percentage" },
      studentIds: { $addToSet: "$student._id" },
      examIds: { $addToSet: "$exam._id" },
    },
  },
  {
    $project: {
      _id: 0,
      totalAttempts: 1,
      avgScore: {
        $cond: [
          { $eq: ["$totalAttempts", 0] },
          0,
          {
            $round: [{ $divide: ["$totalPercentage", "$totalAttempts"] }, 2],
          },
        ],
      },
      totalStudents: { $size: "$studentIds" },
      totalExams: { $size: "$examIds" },
    },
  },
];

const buildPaginatedPipeline = (basePipeline, skip, limit) => [
  ...basePipeline,
  { $skip: skip },
  { $limit: limit },
];

const extractStatsData = () => {
  const defaultStats = {
    totalAttempts: 0,
    avgScore: 0,
    totalStudents: 0,
    totalExams: 0,
  };

  return statsResult[0] || defaultStats;
};

export const calculatePaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || DEFAULT_PAGE);
  const limit = DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const buildResponseData = (stats, paginatedResults, paginationParams) => {
  const { totalAttempts } = stats;
  const { page, limit } = paginationParams;
  const totalPages = Math.ceil(totalAttempts / limit);

  return {
    ...stats,
    totalResultsAttemptsInPage: paginatedResults.length,
    totalPages,
    page,
    attempts: paginatedResults,
  };
};
