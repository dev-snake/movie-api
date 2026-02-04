# 🎬 Movie API

Backend API cho ứng dụng web phim sử dụng Node.js, Express.js và MySQL.

[![Tests](https://img.shields.io/badge/tests-136%20passed-brightgreen)]()
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green)]()
[![Express.js](https://img.shields.io/badge/Express.js-5.x-blue)]()
[![MySQL](https://img.shields.io/badge/MySQL-8.x-orange)]()

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt](#-cài-đặt)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Upload Files](#-upload-files)
- [Testing](#-testing)
- [Technologies](#-technologies)

## ✨ Tính năng

- 🔐 **Authentication**: JWT-based authentication với role-based authorization
- 🎬 **Movies**: CRUD phim với tìm kiếm, lọc, phân trang
- 📺 **Episodes**: Quản lý tập phim cho series
- 🏷️ **Genres**: Quản lý thể loại phim
- ❤️ **Favorites**: Danh sách yêu thích
- 💬 **Comments**: Bình luận phim
- 📤 **Upload**: Upload ảnh, video, poster
- 📖 **Swagger**: API documentation đầy đủ
- ✅ **Testing**: 136 unit tests

## 📁 Cấu trúc dự án

```
movie-api/
├── config/
│   └── database.js              # Cấu hình database
├── migrations/                  # Database migrations
├── models/                      # Sequelize models
│   ├── index.js
│   ├── user.js
│   ├── movie.js
│   ├── genre.js
│   ├── episode.js
│   ├── favorite.js
│   └── comment.js
├── seeders/                     # Database seeders
├── src/
│   ├── controllers/             # Controllers (class-based)
│   │   ├── auth.controller.js
│   │   ├── movie.controller.js
│   │   ├── genre.controller.js
│   │   ├── episode.controller.js
│   │   ├── user.controller.js
│   │   ├── favorite.controller.js
│   │   ├── comment.controller.js
│   │   └── upload.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT authentication
│   │   └── upload.middleware.js # Multer upload
│   ├── routes/                  # API routes với Swagger docs
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── movie.routes.js
│   │   ├── genre.routes.js
│   │   ├── episode.routes.js
│   │   ├── user.routes.js
│   │   ├── favorite.routes.js
│   │   ├── comment.routes.js
│   │   └── upload.routes.js
│   ├── utils/                   # Utility functions
│   │   ├── pagination.js
│   │   ├── queryBuilder.js
│   │   ├── apiFeatures.js
│   │   ├── response.js
│   │   └── index.js
│   ├── app.js                   # Express app configuration
│   └── server.js                # Server entry point
├── tests/                       # Unit tests
│   ├── api/                     # API tests
│   └── unit/                    # Unit tests
├── uploads/                     # Uploaded files
│   ├── images/
│   ├── videos/
│   └── posters/
├── docs/                        # Documentation
│   └── UPLOAD_GUIDE.md
├── .env.example
├── package.json
└── README.md
```

## 🚀 Cài đặt

### 1. Clone và cài đặt dependencies

```bash
git clone https://github.com/dev-snake/movie-api.git
cd movie-api
npm install
```

### 2. Cấu hình môi trường

```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=movie_db
DB_USER=root
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
```

### 3. Tạo database MySQL

```sql
CREATE DATABASE movie_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Hoặc dùng Docker:

```bash
docker run --name mysql-movie -e MYSQL_ROOT_PASSWORD=password123 -e MYSQL_DATABASE=movie_db -p 3306:3306 -d mysql:8
```

### 4. Chạy migrations và seed data

```bash
npm run db:migrate
npm run db:seed
```

### 5. Chạy server

```bash
# Development
npm run dev

# Production
npm start
```

Server chạy tại: http://localhost:3000

Swagger docs: http://localhost:3000/api-docs

## 📚 API Endpoints

### Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Đăng ký tài khoản |
| POST   | `/api/auth/login`    | Đăng nhập         |

### Movies

| Method | Endpoint                 | Description                   |
| ------ | ------------------------ | ----------------------------- |
| GET    | `/api/movies`            | Lấy danh sách phim            |
| GET    | `/api/movies/:id`        | Lấy chi tiết phim             |
| GET    | `/api/movies/slug/:slug` | Lấy phim theo slug            |
| POST   | `/api/movies`            | Thêm phim mới (Admin)         |
| PUT    | `/api/movies/:id`        | Cập nhật phim (Admin)         |
| DELETE | `/api/movies/:id`        | Xóa phim (Admin)              |
| POST   | `/api/movies/:id/genres` | Gán thể loại cho phim (Admin) |

### Episodes

| Method | Endpoint                       | Description                 |
| ------ | ------------------------------ | --------------------------- |
| GET    | `/api/episodes/movie/:movieId` | Lấy danh sách tập theo phim |
| GET    | `/api/episodes/:id`            | Lấy chi tiết tập            |
| POST   | `/api/episodes`                | Thêm tập mới (Admin)        |
| PUT    | `/api/episodes/:id`            | Cập nhật tập (Admin)        |
| DELETE | `/api/episodes/:id`            | Xóa tập (Admin)             |

### Genres

| Method | Endpoint          | Description               |
| ------ | ----------------- | ------------------------- |
| GET    | `/api/genres`     | Lấy danh sách thể loại    |
| GET    | `/api/genres/:id` | Lấy chi tiết thể loại     |
| POST   | `/api/genres`     | Thêm thể loại mới (Admin) |
| PUT    | `/api/genres/:id` | Cập nhật thể loại (Admin) |
| DELETE | `/api/genres/:id` | Xóa thể loại (Admin)      |

### Users

| Method | Endpoint             | Description                           |
| ------ | -------------------- | ------------------------------------- |
| GET    | `/api/users/profile` | Lấy thông tin cá nhân (Auth required) |
| PUT    | `/api/users/profile` | Cập nhật thông tin (Auth required)    |
| GET    | `/api/users`         | Lấy danh sách users (Admin)           |
| GET    | `/api/users/:id`     | Lấy chi tiết user (Admin)             |
| DELETE | `/api/users/:id`     | Xóa user (Admin)                      |

### Favorites

| Method | Endpoint                        | Description                             |
| ------ | ------------------------------- | --------------------------------------- |
| GET    | `/api/favorites`                | Lấy danh sách yêu thích (Auth required) |
| POST   | `/api/favorites/:movieId`       | Thêm phim vào yêu thích (Auth required) |
| DELETE | `/api/favorites/:movieId`       | Xóa phim khỏi yêu thích (Auth required) |
| GET    | `/api/favorites/check/:movieId` | Kiểm tra đã yêu thích (Auth required)   |

### Comments

| Method | Endpoint                       | Description                  |
| ------ | ------------------------------ | ---------------------------- |
| GET    | `/api/comments/movie/:movieId` | Lấy comments của phim        |
| POST   | `/api/comments`                | Thêm comment (Auth required) |
| PUT    | `/api/comments/:id`            | Sửa comment (Owner)          |
| DELETE | `/api/comments/:id`            | Xóa comment (Owner/Admin)    |

### Upload

| Method | Endpoint                               | Description                      |
| ------ | -------------------------------------- | -------------------------------- |
| POST   | `/api/upload/image`                    | Upload ảnh (Auth required)       |
| POST   | `/api/upload/images`                   | Upload nhiều ảnh max 10 (Admin)  |
| POST   | `/api/upload/poster`                   | Upload poster phim (Admin)       |
| POST   | `/api/upload/video`                    | Upload video (Admin)             |
| POST   | `/api/upload/movie/:movieId/poster`    | Upload & cập nhật poster (Admin) |
| POST   | `/api/upload/episode/:episodeId/video` | Upload & cập nhật video (Admin)  |
| POST   | `/api/upload/avatar`                   | Upload & cập nhật avatar (Auth)  |
| DELETE | `/api/upload/:filename`                | Xóa file (Admin)                 |

---

## 🔐 Authentication

Sử dụng JWT token trong header:

```
Authorization: Bearer <your_jwt_token>
```

### Roles

| Role  | Quyền hạn                                    |
| ----- | -------------------------------------------- |
| user  | Xem phim, comment, favorites, update profile |
| admin | Tất cả quyền + CRUD movies, genres, episodes |

### Demo Accounts

```
Admin: admin@example.com / password123
User:  user@example.com / password123
```

---

## 🧪 Testing

```bash
# Chạy tất cả tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Verbose output
npm run test:verbose
```

**Test Results:** 10 test suites, 136 tests passed ✅

| Test Suite           | Tests | Mô tả                       |
| -------------------- | ----- | --------------------------- |
| auth.test.js         | 6     | Register, Login             |
| movie.test.js        | 14    | CRUD movies, search, filter |
| genre.test.js        | 11    | CRUD genres                 |
| episode.test.js      | 20    | CRUD episodes               |
| user.test.js         | 13    | Profile, admin management   |
| favorite.test.js     | 10    | Add/remove favorites        |
| comment.test.js      | 12    | CRUD comments               |
| upload.test.js       | 19    | Upload files                |
| pagination.test.js   | 12    | Pagination utility          |
| queryBuilder.test.js | 19    | Query builder utility       |

---

## 🛠️ Technologies

| Category       | Technology                        |
| -------------- | --------------------------------- |
| Runtime        | Node.js 22.x                      |
| Framework      | Express.js 5.x                    |
| Database       | MySQL 8.x                         |
| ORM            | Sequelize 6.x                     |
| Authentication | JWT (jsonwebtoken)                |
| Password       | bcryptjs                          |
| Validation     | express-validator                 |
| File Upload    | multer                            |
| Documentation  | swagger-jsdoc, swagger-ui-express |
| Testing        | Jest, Supertest                   |
| Security       | helmet, cors                      |
| Dev Tools      | nodemon                           |

---

## 📝 Scripts

```bash
npm start           # Start production server
npm run dev         # Start development server (nodemon)
npm test            # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run db:migrate  # Run database migrations
npm run db:migrate:undo # Undo last migration
npm run db:seed     # Run database seeders
npm run db:seed:undo # Undo all seeders
```

---

## 📄 License

ISC

---

## 👨‍💻 Author

dev-snake

---

## 🔗 Links

- **API Docs:** http://localhost:3000/api-docs
- **Repository:** https://github.com/dev-snake/movie-api
