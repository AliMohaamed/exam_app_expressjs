import { asyncHandler } from "./asyncHandler.js";
import ApiError from "./error/ApiError.js";
import sendResponse from "./response.js";

export const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document)
      return next(new ApiError(400, `No document with this id: ${id}`));
    sendResponse(res, { message: "Deleted Successfully" });
  });

export const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select({
      isConfirmed: 0,
      password: 0,
    });
    if (!document) {
      return next(
        new ApiError(400, `No document with this id: ${req.params.id}`)
      );
    }
    sendResponse(res, { message: "Updated Successfully", data: document });
  });

export const createOne = (Model, anotherData) =>
  asyncHandler(async (req, res) => {
    const newDoc = await Model.create({ ...req.body, ...anotherData });
    sendResponse(res, {
      statusCode: 201,
      data: newDoc,
      message: "Created Successfully",
    });
  });

export const getById = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id).select({
      isConfirmed: 0,
      password: 0,
    });
    if (!document) return next(new ApiError(400, `No Data`));
    sendResponse(res, { data: document });
  });

export const getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    const documents = await Model.find();
    if (!documents) return next(new ApiError(400, `No Data`));
    sendResponse(res, { message: "All Data", data: documents });
  });
