import { Artist } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { paginationFields } from "../../../constants/pagination";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { artistFilterableFields } from "./artist.constant";
import {
  createArtistToDB,
  deleteSingleArtistFromDB,
  getAllArtistFromDB,
  getSingleArtistFromDB,
  updateSingleArtistToDB,
} from "./artist.service";

export const createArtist = catchAsync(async (req: Request, res: Response) => {
  const result = await createArtistToDB(req.body);

  sendResponse<Artist>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Artist created successfully",
    data: result,
  });
});

export const getAllArtist = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, artistFilterableFields);
  const pagination = pick(req.query, paginationFields);

  const result = await getAllArtistFromDB(filters, pagination);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All artist fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const getSingleArtist = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getSingleArtistFromDB(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single artist fetched successfully",
      data: result,
    });
  }
);

export const updateSingleArtist = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await updateSingleArtistToDB(id, payload);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Artist updated successfully",
      data: result,
    });
  }
);

export const deleteSingleArtist = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteSingleArtistFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Artist deleted successfully",
      data: result,
    });
  }
);
