/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Song } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { prisma } from "../../../shared/prisma";
import { songSearchableFields } from "./song.constant";
import { ISongFilters } from "./song.interface";

export const createSongToDB = async (songData: Song): Promise<Song> => {
  if (songData.albumId) {
    const isExist = await prisma.album.findUnique({
      where: {
        id: songData.albumId,
      },
    });
    if (!isExist) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "There is no album with this albumId. Please provide a valid albumId."
      );
    }
  }
  if (songData.artistId) {
    const isExist = await prisma.artist.findUnique({
      where: {
        id: songData.artistId,
      },
    });
    if (!isExist) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "There is no artist with this artistId. Please provide a valid artistId."
      );
    }
  }

  const result = await prisma.song.create({
    data: songData,
    include: {
      album: true,
      artist: true,
    },
  });

  if (result) {
    return result;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create song");
  }
};

export const getAllSongFromDB = async (
  filters: ISongFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Song[]>> => {
  const { page, size, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: songSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andCondition.push({
      AND: Object.keys(filtersData).map(key => ({
        [key]: {
          equals: (filtersData as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.SongWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.song.findMany({
    where: whereCondition,
    include: {
      album: true,
      artist: true,
    },
    skip,
    take: size,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });
  const total = await prisma.song.count();
  const totalPage = Number(total) / Number(size);

  return {
    meta: {
      total,
      page,
      size,
      totalPage: Math.ceil(totalPage),
    },
    data: result,
  };
};

export const getSingleSongFromDB = async (id: string): Promise<Song | null> => {
  const result = await prisma.song.findUnique({
    where: {
      id,
    },
    include: {
      album: true,
      artist: true,
    },
  });

  if (result) {
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no song with the id/Failed to fetched song"
    );
  }
};

export const updateSingleSongToDB = async (
  id: string,
  payload: Partial<Song>
): Promise<Partial<Song> | null> => {
  const isExist = await prisma.song.findUnique({
    where: {
      id,
    },
  });
  if (!isExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "There is no song with this id. Please provide a valid id."
    );
  }

  if (payload.albumId) {
    const isExist = await prisma.album.findUnique({
      where: {
        id: payload.albumId,
      },
    });
    if (!isExist) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "There is no album with this albumId. Please provide a valid albumId."
      );
    }
  }
  if (payload.artistId) {
    const isExist = await prisma.artist.findUnique({
      where: {
        id: payload.artistId,
      },
    });
    if (!isExist) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "There is no artist with this artistId. Please provide a valid artistId."
      );
    }
  }

  const result = await prisma.song.update({
    where: {
      id,
    },
    data: payload,
    include: {
      album: true,
      artist: true,
    },
  });

  if (result) {
    return result;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update song");
  }
};

export const deleteSingleSongFromDB = async (
  id: string
): Promise<Partial<Song> | undefined> => {
  const result = await prisma.song.delete({
    where: {
      id,
    },
  });

  if (result) {
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no song with the id/Failed to delete song"
    );
  }
};
