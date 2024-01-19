import { Song } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { songFilterableFields } from "./song.constant";
import {
  createSongToDB,
  deleteSingleSongFromDB,
  getAllSongFromDB,
  getSingleSongFromDB,
  updateSingleSongToDB,
} from "./song.service";

export const createSong = catchAsync(async (req: Request, res: Response) => {
  const result = await createSongToDB(req.body);

  sendResponse<Song>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Song created successfully",
    data: result,
  });
});

export const getAllSong = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, songFilterableFields);
  const pagination = pick(req.query, paginationFields);

  const result = await getAllSongFromDB(filters, pagination);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All song fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const getSingleSong = catchAsync(async (req: Request, res: Response) => {
  const result = await getSingleSongFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single song fetched successfully",
    data: result,
  });
});

export const updateSingleSong = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await updateSingleSongToDB(id, payload);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Song updated successfully",
      data: result,
    });
  }
);

export const deleteSingleSong = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteSingleSongFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Song deleted successfully",
      data: result,
    });
  }
);
