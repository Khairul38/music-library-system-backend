/* eslint-disable @typescript-eslint/no-explicit-any */
import { Artist, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { prisma } from "../../../shared/prisma";
import { artistSearchableFields } from "./artist.constant";
import { IArtistFilters } from "./artist.interface";

export const createArtistToDB = async (artistData: Artist): Promise<Artist> => {
  const result = await prisma.artist.create({
    data: artistData,
  });

  if (result) {
    return result;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create artist");
  }
};

export const getAllArtistFromDB = async (
  filters: IArtistFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Artist[]>> => {
  const { page, size, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: artistSearchableFields.map(field => ({
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

  const whereCondition: Prisma.ArtistWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.artist.findMany({
    where: whereCondition,
    include: {
      albums: true,
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
  const total = await prisma.artist.count();
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

export const getSingleArtistFromDB = async (
  id: string
): Promise<Artist | null> => {
  const result = await prisma.artist.findUnique({
    where: {
      id,
    },
    include: {
      albums: true,
      songs: true,
    },
  });

  if (result) {
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no artist with the id/Failed to fetched artist"
    );
  }
};

export const updateSingleArtistToDB = async (
  id: string,
  payload: Partial<Artist>
): Promise<Partial<Artist> | null> => {
  const result = await prisma.artist.update({
    where: {
      id,
    },
    data: payload,
    include: {
      albums: true,
      songs: true,
    },
  });

  if (result) {
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no artist with the id/Failed to update artist"
    );
  }
};

export const deleteSingleArtistFromDB = async (
  id: string
): Promise<Partial<Artist> | undefined> => {
  const deleteArtist = await prisma.$transaction(async transactionClient => {
    // Delete all albumArtist related to the artist
    const result1 = await transactionClient.albumArtist.deleteMany({
      where: {
        artistId: id,
      },
    });

    if (!result1) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Unable to delete artist");
    }

    // Delete all song related to the artist
    const result2 = await transactionClient.song.deleteMany({
      where: {
        artistId: id,
      },
    });

    if (!result2) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Unable to delete artist");
    }

    // Finally delete artist
    const result3 = await transactionClient.artist.delete({
      where: {
        id,
      },
    });

    return result3;
  });

  if (deleteArtist) {
    return deleteArtist;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There is no artist with the id/Failed to delete artist"
    );
  }
};
