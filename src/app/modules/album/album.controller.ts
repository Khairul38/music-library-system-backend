import { Album } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { albumFilterableFields } from "./album.constant";
import {
  createAlbumToDB,
  deleteSingleAlbumFromDB,
  getAllAlbumFromDB,
  getSingleAlbumFromDB,
  updateSingleAlbumToDB,
} from "./album.service";

export const createAlbum = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await createAlbumToDB(user, req.body);

  sendResponse<Album>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Album created successfully",
    data: result,
  });
});

export const getAllAlbum = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, albumFilterableFields);
  const pagination = pick(req.query, paginationFields);

  const result = await getAllAlbumFromDB(filters, pagination);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Albums retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const getSingleAlbum = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getSingleAlbumFromDB(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single album fetched successfully",
      data: result,
    });
  }
);

export const updateSingleAlbum = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await updateSingleAlbumToDB(id, payload);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Album updated successfully",
      data: result,
    });
  }
);

export const deleteSingleAlbum = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteSingleAlbumFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Album deleted successfully",
      data: result,
    });
  }
);
