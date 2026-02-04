# 📁 Hướng dẫn Upload File

## Tổng quan

API cung cấp các endpoint upload file với 2 cách sử dụng:

### Cách 1: Upload cơ bản (lấy URL về tự xử lý)

### Cách 2: Upload + Tự động cập nhật record (tiện lợi hơn) ⭐

---

## 🔑 Authentication

Tất cả các endpoint upload đều yêu cầu JWT token:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📤 Cách 1: Upload cơ bản

### Upload ảnh (Image)

```bash
# Dùng curl
curl -X POST http://localhost:3000/api/upload/image \
  -H "Authorization: Bearer <token>" \
  -F "image=@path/to/your/image.jpg"

# Response:
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "filename": "1749814567890-123456789.jpg",
    "url": "/uploads/images/1749814567890-123456789.jpg"
  }
}
```

### Upload poster

```bash
curl -X POST http://localhost:3000/api/upload/poster \
  -H "Authorization: Bearer <token>" \
  -F "poster=@path/to/poster.png"

# Response:
{
  "success": true,
  "message": "Poster uploaded successfully",
  "data": {
    "filename": "1749814567890-123456789.png",
    "url": "/uploads/posters/1749814567890-123456789.png"
  }
}
```

### Upload video

```bash
curl -X POST http://localhost:3000/api/upload/video \
  -H "Authorization: Bearer <token>" \
  -F "video=@path/to/video.mp4"

# Response:
{
  "success": true,
  "message": "Video uploaded successfully",
  "data": {
    "filename": "1749814567890-123456789.mp4",
    "url": "/uploads/videos/1749814567890-123456789.mp4"
  }
}
```

**Sau đó tự gọi API update:**

```bash
# Update movie với poster URL
curl -X PUT http://localhost:3000/api/movies/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"posterUrl": "/uploads/posters/1749814567890-123456789.png"}'
```

---

## ⭐ Cách 2: Upload + Tự động cập nhật (Khuyên dùng)

### Upload Poster cho Movie

```bash
# Upload poster và tự động cập nhật movie.posterUrl
curl -X POST http://localhost:3000/api/upload/movie/1/poster \
  -H "Authorization: Bearer <token>" \
  -F "poster=@path/to/poster.jpg"

# Response:
{
  "success": true,
  "message": "Movie poster updated successfully",
  "data": {
    "posterUrl": "/uploads/posters/1749814567890-123456789.jpg",
    "movie": {
      "id": 1,
      "title": "Movie Name",
      "posterUrl": "/uploads/posters/1749814567890-123456789.jpg"
      // ...
    }
  }
}
```

### Upload Video cho Episode

```bash
# Upload video và tự động cập nhật episode.videoUrl
curl -X POST http://localhost:3000/api/upload/episode/1/video \
  -H "Authorization: Bearer <token>" \
  -F "video=@path/to/video.mp4"

# Response:
{
  "success": true,
  "message": "Episode video updated successfully",
  "data": {
    "videoUrl": "/uploads/videos/1749814567890-123456789.mp4",
    "episode": {
      "id": 1,
      "episodeNumber": 1,
      "title": "Episode 1",
      "videoUrl": "/uploads/videos/1749814567890-123456789.mp4"
      // ...
    }
  }
}
```

### Upload Avatar cho User

```bash
# Upload avatar và tự động cập nhật user.avatar
curl -X POST http://localhost:3000/api/upload/avatar \
  -H "Authorization: Bearer <token>" \
  -F "avatar=@path/to/avatar.png"

# Response:
{
  "success": true,
  "message": "Avatar updated successfully",
  "data": {
    "avatarUrl": "/uploads/images/1749814567890-123456789.png",
    "user": {
      "id": 1,
      "username": "admin",
      "avatar": "/uploads/images/1749814567890-123456789.png"
      // ...
    }
  }
}
```

---

## 🗑️ Xóa file

```bash
curl -X DELETE "http://localhost:3000/api/upload/filename.jpg?folder=images" \
  -H "Authorization: Bearer <token>"
```

Tham số `folder`: `images`, `videos`, hoặc `posters`

---

## 📋 Giới hạn file

| Loại   | Định dạng cho phép       | Kích thước tối đa |
| ------ | ------------------------ | ----------------- |
| Image  | jpeg, png, gif, webp     | 5 MB              |
| Poster | jpeg, png, gif, webp     | 5 MB              |
| Video  | mp4, webm, ogg, avi, mkv | 500 MB            |

---

## 🖥️ Frontend Integration

### HTML Form

```html
<!-- Upload poster cho movie -->
<form id="posterForm" enctype="multipart/form-data">
    <input type="file" name="poster" accept="image/*" id="posterInput" />
    <button type="submit">Upload Poster</button>
</form>

<script>
    const form = document.getElementById('posterForm');
    const movieId = 1; // ID phim cần upload poster

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('poster', document.getElementById('posterInput').files[0]);

        const response = await fetch(`/api/upload/movie/${movieId}/poster`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        });

        const result = await response.json();
        console.log(result);
    });
</script>
```

### React (với axios)

```jsx
import axios from 'axios';
import { useState } from 'react';

function PosterUpload({ movieId }) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('poster', file);

        setUploading(true);
        try {
            const response = await axios.post(`/api/upload/movie/${movieId}/poster`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Uploaded:', response.data);
            alert('Poster uploaded successfully!');
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
            {uploading && <span>Uploading...</span>}
        </div>
    );
}
```

---

## 🌐 Truy cập file đã upload

File được serve tĩnh tại:

```
http://localhost:3000/uploads/images/filename.jpg
http://localhost:3000/uploads/posters/filename.png
http://localhost:3000/uploads/videos/filename.mp4
```

### Hiển thị trong HTML

```html
<!-- Poster -->
<img src="http://localhost:3000/uploads/posters/poster.jpg" alt="Movie Poster" />

<!-- Video -->
<video controls>
    <source src="http://localhost:3000/uploads/videos/episode.mp4" type="video/mp4" />
</video>

<!-- Avatar -->
<img src="http://localhost:3000/uploads/images/avatar.png" alt="User Avatar" />
```

---

## 📝 Swagger Documentation

Truy cập Swagger UI để test API: http://localhost:3000/api-docs

Tìm mục **Upload** để xem tất cả các endpoint upload với giao diện test trực quan.
