"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleArtistFromDB = exports.updateSingleArtistToDB = exports.getSingleArtistFromDB = exports.getAllArtistFromDB = exports.createArtistToDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = require("../../../shared/prisma");
const artist_constant_1 = require("./artist.constant");
const createArtistToDB = (artistData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.artist.create({
        data: artistData,
    });
    if (result) {
        return result;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create artist");
    }
});
exports.createArtistToDB = createArtistToDB;
const getAllArtistFromDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, size, skip, sortBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: artist_constant_1.artistSearchableFields.map(field => ({
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
                    equals: filtersData[key],
                },
            })),
        });
    }
    const whereCondition = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.prisma.artist.findMany({
        where: whereCondition,
        include: {
            albums: true,
            songs: true,
        },
        skip,
        take: size,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : { createdAt: "desc" },
    });
    const total = yield prisma_1.prisma.artist.count();
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
});
exports.getAllArtistFromDB = getAllArtistFromDB;
const getSingleArtistFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.artist.findUnique({
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
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "There is no artist with the id/Failed to fetched artist");
    }
});
exports.getSingleArtistFromDB = getSingleArtistFromDB;
const updateSingleArtistToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.artist.update({
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
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "There is no artist with the id/Failed to update artist");
    }
});
exports.updateSingleArtistToDB = updateSingleArtistToDB;
const deleteSingleArtistFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteArtist = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // Delete all albumArtist related to the artist
        const result1 = yield transactionClient.albumArtist.deleteMany({
            where: {
                artistId: id,
            },
        });
        if (!result1) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Unable to delete artist");
        }
        // Delete all song related to the artist
        const result2 = yield transactionClient.song.deleteMany({
            where: {
                artistId: id,
            },
        });
        if (!result2) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Unable to delete artist");
        }
        // Finally delete artist
        const result3 = yield transactionClient.artist.delete({
            where: {
                id,
            },
        });
        return result3;
    }));
    if (deleteArtist) {
        return deleteArtist;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "There is no artist with the id/Failed to delete artist");
    }
});
exports.deleteSingleArtistFromDB = deleteSingleArtistFromDB;
