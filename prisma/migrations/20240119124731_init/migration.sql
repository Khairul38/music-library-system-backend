-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "albums" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "releaseYear" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "songs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "albumsArtists" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "albumsArtists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "artists_email_key" ON "artists"("email");

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albumsArtists" ADD CONSTRAINT "albumsArtists_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albumsArtists" ADD CONSTRAINT "albumsArtists_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
