# Movie API

Backend API cho ứng dụng web phim sử dụng Node.js, Express.js và MySQL.

## Cấu trúc dự án

```
movie-api/
├── config/
│   └── database.js          # Cấu hình database
├── migrations/              # Database migrations
├── models/                  # Sequelize models
│   ├── index.js
│   ├── user.js
│   ├── movie.js
│   └── genre.js
├── seeders/                 # Database seeders
├── src/
│   ├── controllers/         # Controllers xử lý logic
│   │   ├── auth.controller.js
│   │   ├── genre.controller.js
│   │   ├── movie.controller.js
│   │   └── user.controller.js
│   ├── middlewares/         # Middlewares
│   │   └── auth.middleware.js
│   ├── routes/              # API routes
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── genre.routes.js
│   │   ├── movie.routes.js
│   │   └── user.routes.js
│   ├── services/            # Business logic services
│   ├── utils/               # Utility functions
│   │   └── response.js
│   ├── app.js               # Express app configuration
│   └── server.js            # Server entry point
├── .env                     # Environment variables
├── .env.example             # Environment variables example
├── .gitignore
├── .sequelizerc             # Sequelize CLI config
├── package.json
└── README.md
```

## Cài đặt

### 1. Clone dự án và cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình môi trường

Sao chép file `.env.example` thành `.env` và điền thông tin:

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

### 3. Tạo database

Tạo database MySQL với tên `movie_db`:

```sql
CREATE DATABASE movie_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Chạy migrations

```bash
npm run db:migrate
```

### 5. Chạy server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Đăng ký tài khoản |
| POST   | `/api/auth/login`    | Đăng nhập         |

### Movies

| Method | Endpoint          | Description                   |
| ------ | ----------------- | ----------------------------- |
| GET    | `/api/movies`     | Lấy danh sách phim            |
| GET    | `/api/movies/:id` | Lấy chi tiết phim             |
| POST   | `/api/movies`     | Thêm phim mới (Auth required) |
| PUT    | `/api/movies/:id` | Cập nhật phim (Auth required) |
| DELETE | `/api/movies/:id` | Xóa phim (Auth required)      |

### Genres

| Method | Endpoint          | Description                       |
| ------ | ----------------- | --------------------------------- |
| GET    | `/api/genres`     | Lấy danh sách thể loại            |
| GET    | `/api/genres/:id` | Lấy chi tiết thể loại             |
| POST   | `/api/genres`     | Thêm thể loại mới (Auth required) |
| PUT    | `/api/genres/:id` | Cập nhật thể loại (Auth required) |
| DELETE | `/api/genres/:id` | Xóa thể loại (Auth required)      |

### Users

| Method | Endpoint             | Description                             |
| ------ | -------------------- | --------------------------------------- |
| GET    | `/api/users/profile` | Lấy thông tin user (Auth required)      |
| PUT    | `/api/users/profile` | Cập nhật thông tin user (Auth required) |

## Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors

## License

ISC
