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
exports.deleteSingleAlbumFromDB = exports.updateSingleAlbumToDB = exports.getSingleAlbumFromDB = exports.getAllAlbumFromDB = exports.createAlbumToDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = require("../../../shared/prisma");
const album_constant_1 = require("./album.constant");
const createAlbumToDB = (user, albumData) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, releaseYear, genre, artists } = albumData;
    const newAlbum = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield transactionClient.album.create({
            data: {
                title,
                releaseYear,
                genre,
            },
        });
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Unable to create album");
        }
        yield transactionClient.albumArtist.createMany({
            data: artists.map(ob => ({
                albumId: result.id,
                artistId: ob.artistId,
            })),
        });
        return result;
    }));
    if (newAlbum) {
        const responseData = yield prisma_1.prisma.album.findUnique({
            where: {
                id: newAlbum.id,
            },
            include: {
                artists: true,
                songs: true,
            },
        });
        return responseData;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create album!");
    }
});
exports.createAlbumToDB = createAlbumToDB;
const getAllAlbumFromDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, size, skip, sortBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: album_constant_1.albumSearchableFields.map(field => ({
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
    const result = yield prisma_1.prisma.album.findMany({
        where: whereCondition,
        include: {
            artists: true,
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
    const total = yield prisma_1.prisma.album.count();
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
exports.getAllAlbumFromDB = getAllAlbumFromDB;
const getSingleAlbumFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.album.findUnique({
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
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "There is no album with the id/Failed to fetched album");
    }
});
exports.getSingleAlbumFromDB = getSingleAlbumFromDB;
const updateSingleAlbumToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { artists } = payload, albumData = __rest(payload, ["artists"]);
    const updateAlbum = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const result1 = yield transactionClient.album.update({
            where: {
                id,
            },
            data: albumData,
        });
        if (!result1) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Unable to update album");
        }
        if (payload.artists) {
            const result2 = yield transactionClient.albumArtist.deleteMany({
                where: {
                    albumId: id,
                },
            });
            if (!result2) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Unable to update album");
            }
            yield transactionClient.albumArtist.createMany({
                data: artists.map(ob => ({
                    albumId: result1.id,
                    artistId: ob.artistId,
                })),
            });
        }
        return result1;
    }));
    if (updateAlbum) {
        const responseData = yield prisma_1.prisma.album.findUnique({
            where: {
                id: updateAlbum.id,
            },
            include: {
                artists: true,
                songs: true,
            },
        });
        return responseData;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "There is no album with the id/Failed to update album");
    }
});
exports.updateSingleAlbumToDB = updateSingleAlbumToDB;
const deleteSingleAlbumFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteAlbum = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // Delete all albumArtist related to the album
        const result1 = yield transactionClient.albumArtist.deleteMany({
            where: {
                albumId: id,
            },
        });
        if (!result1) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Unable to delete album");
        }
        // Delete all song related to the album
        const result2 = yield transactionClient.song.deleteMany({
            where: {
                albumId: id,
            },
        });
        if (!result2) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Unable to delete album");
        }
        // Finally delete album
        const result3 = yield transactionClient.album.delete({
            where: {
                id,
            },
        });
        return result3;
    }));
    if (deleteAlbum) {
        return deleteAlbum;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "There is no album with the id/Failed to delete album");
    }
});
exports.deleteSingleAlbumFromDB = deleteSingleAlbumFromDB;
