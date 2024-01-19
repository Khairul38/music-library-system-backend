/* eslint-disable @typescript-eslint/no-explicit-any */
import { Album, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../errors/ApiError";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { prisma } from "../../../shared/prisma";
import { albumSearchableFields } from "./album.constant";
import { IAlbumFilters, ICreateAlbum } from "./album.interface";

export const createAlbumToDB = async (
  user: JwtPayload | null,
  albumData: ICreateAlbum
): Promise<any> => {
  const { title, releaseYear, genre, artists } = albumData;

  const newAlbum = await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.album.create({
      data: {
        title,
        releaseYear,
        genre,
      },
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create album");
    }

    await transactionClient.albumArtist.createMany({
      data: artists.map(ob => ({
        albumId: result.id,
        artistId: ob.artistId,
      })),
    });

    return result;
  });

  if (newAlbum) {
    const responseData = await prisma.album.findUnique({
      where: {
        id: newAlbum.id,
      },
      include: {
        artists: true,
        songs: true,
      },
    });
    return responseData;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create album!");
  }
};

export const getAllAlbumFromDB = async (
  filters: IAlbumFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Album[]>> => {
  const { page, size, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: albumSearchableFields.map(field => ({
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

  const whereCondition: Prisma.AlbumWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.album.findMany({
    where: whereCondition,
    include: {
      artists: true,
      songs: true,
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
  const total = await prisma.album.count();
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

export const getSingleAlbumFromDB = async (
  id: string
): Promise<Album | null> => {
  const result = await prisma.album.findUnique({
    where: {
      id,
    },
    include: {
      artists: true,
      songs: true,
    },
  });

  if (result) {
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no album with the id/Failed to fetched album"
    );
  }
};

export const updateSingleAlbumToDB = async (
  id: string,
  payload: ICreateAlbum
): Promise<Partial<ICreateAlbum> | null> => {
  const { artists, ...albumData } = payload;

  const updateAlbum = await prisma.$transaction(async transactionClient => {
    const result1 = await transactionClient.album.update({
      where: {
        id,
      },
      data: albumData,
    });
    if (!result1) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Unable to update album");
    }

    if (payload.artists) {
      const result2 = await transactionClient.albumArtist.deleteMany({
        where: {
          albumId: id,
        },
      });

      if (!result2) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Unable to update album");
      }

      await transactionClient.albumArtist.createMany({
        data: artists.map(ob => ({
          albumId: result1.id,
          artistId: ob.artistId,
        })),
      });
    }

    return result1;
  });

  if (updateAlbum) {
    const responseData = await prisma.album.findUnique({
      where: {
        id: updateAlbum.id,
      },
      include: {
        artists: true,
        songs: true,
      },
    });
    return responseData;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no album with the id/Failed to update album"
    );
  }
};

export const deleteSingleAlbumFromDB = async (
  id: string
): Promise<Partial<Album> | undefined> => {
  const deleteAlbum = await prisma.$transaction(async transactionClient => {
    // Delete all albumArtist related to the album
    const result1 = await transactionClient.albumArtist.deleteMany({
      where: {
        albumId: id,
      },
    });

    if (!result1) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Unable to delete album");
    }

    // Delete all song related to the album
    const result2 = await transactionClient.song.deleteMany({
      where: {
        albumId: id,
      },
    });

    if (!result2) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Unable to delete album");
    }

    // Finally delete album
    const result3 = await transactionClient.album.delete({
      where: {
        id,
      },
    });

    return result3;
  });

  if (deleteAlbum) {
    return deleteAlbum;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no album with the id/Failed to delete album"
    );
  }
};
