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
exports.deleteSingleSongFromDB = exports.updateSingleSongToDB = exports.getSingleSongFromDB = exports.getAllSongFromDB = exports.createSongToDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = require("../../../shared/prisma");
const song_constant_1 = require("./song.constant");
const createSongToDB = (songData) => __awaiter(void 0, void 0, void 0, function* () {
    if (songData.albumId) {
        const isExist = yield prisma_1.prisma.album.findUnique({
            where: {
                id: songData.albumId,
            },
        });
        if (!isExist) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, "There is no album with this albumId. Please provide a valid albumId.");
        }
    }
    if (songData.artistId) {
        const isExist = yield prisma_1.prisma.artist.findUnique({
            where: {
                id: songData.artistId,
            },
        });
        if (!isExist) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, "There is no artist with this artistId. Please provide a valid artistId.");
        }
    }
    const result = yield prisma_1.prisma.song.create({
        data: songData,
        include: {
            album: true,
            artist: true,
        },
    });
    if (result) {
        return result;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create song");
    }
});
exports.createSongToDB = createSongToDB;
const getAllSongFromDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, size, skip, sortBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: song_constant_1.songSearchableFields.map(field => ({
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
    const result = yield prisma_1.prisma.song.findMany({
        where: whereCondition,
        include: {
            album: true,
            artist: true,
        },
        skip,
        take: size,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : { createdAt: "desc" },
    });
    const total = yield prisma_1.prisma.song.count();
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
exports.getAllSongFromDB = getAllSongFromDB;
const getSingleSongFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.song.findUnique({
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
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "There is no song with the id/Failed to fetched song");
    }
});
exports.getSingleSongFromDB = getSingleSongFromDB;
const updateSingleSongToDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.prisma.song.findUnique({
        where: {
            id,
        },
    });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "There is no song with this id. Please provide a valid id.");
    }
    if (payload.albumId) {
        const isExist = yield prisma_1.prisma.album.findUnique({
            where: {
                id: payload.albumId,
            },
        });
        if (!isExist) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, "There is no album with this albumId. Please provide a valid albumId.");
        }
    }
    if (payload.artistId) {
        const isExist = yield prisma_1.prisma.artist.findUnique({
            where: {
                id: payload.artistId,
            },
        });
        if (!isExist) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, "There is no artist with this artistId. Please provide a valid artistId.");
        }
    }
    const result = yield prisma_1.prisma.song.update({
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
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update song");
    }
});
exports.updateSingleSongToDB = updateSingleSongToDB;
const deleteSingleSongFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.song.delete({
        where: {
            id,
        },
    });
    if (result) {
        return result;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "There is no song with the id/Failed to delete song");
    }
});
exports.deleteSingleSongFromDB = deleteSingleSongFromDB;
