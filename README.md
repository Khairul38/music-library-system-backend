# Welcome To Music Library System

This is the documentation for the Music Library System's Authentication and Core Service component. It is built using Node.js, TypeScript, Express.js, Zod validation, PostgreSQL, and Prisma.

<!-- HOW TO RUN -->

## Run this repository on your local machine

Please follow the below instructions to run this repository on your local machine:

1. Clone this entire repository

   ```sh
   git clone https://github.com/Khairul38/music-library-system-backend
   ```

2. Go to the cloned project directory

   ```sh
   cd music-library-system-backend

   ```

3. Create .env file with the following credentials and change the DATABASE_URL with your local database url

   ```sh
   PORT=5000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/music-library-system?schema=public"
   BCRYPT_SALT_ROUNDS=12
   JWT_SECRET='very-secret'
   JWT_EXPIRES_IN=1d
   JWT_REFRESH_SECRET='very-refresh-secret'
   JWT_REFRESH_EXPIRES_IN=365d
   ```

4. Install dependencies

   ```sh
   yarn
   ```

5. Run project

   ```sh
   yarn dev
   ```

## ER Diagram

<p align="center">
  <img src="https://i.ibb.co/Np2HRpN/prismaliser.png" alt="ER Diagram" style="width: 600px;">
</p>

## Application Routes

### Backend Live Link: https://music-library-system-backend.vercel.app/

### Postman API Documentation: [Click Here](https://documenter.getpostman.com/view/19250883/2s9YsT5oC2)

#### Auth

- api/v1/auth/register (POST)
- api/v1/auth/login (POST)
- api/v1/auth/refresh-token (POST)

#### User

- api/v1/users (GET)
- api/v1/users/:id (Single GET) Include an id that is saved in your database
- api/v1/users/:id (PATCH) Include an id that is saved in your database
- api/v1/users/:id (DELETE) Include an id that is saved in your database

#### Album

- api/v1/albums/create-album (POST)
- api/v1/albums (GET)
- api/v1/albums/:id (Single GET) Include an id that is saved in your database
- api/v1/albums/:id (PATCH) Include an id that is saved in your database
- api/v1/albums/:id (DELETE) Include an id that is saved in your database

#### Artist

- api/v1/artists/create-artist (POST)
- api/v1/artists (GET)
- api/v1/artists/:id (Single GET) Include an id that is saved in your database
- api/v1/artists/:id (PATCH) Include an id that is saved in your database
- api/v1/artists/:id (DELETE) Include an id that is saved in your database

#### Song

- api/v1/songs/create-song (POST)
- api/v1/songs (GET)
- api/v1/songs/:id (Single GET) Include an id that is saved in your database
- api/v1/songs/:id (PATCH) Include an id that is saved in your database
- api/v1/songs/:id (DELETE) Include an id that is saved in your database
