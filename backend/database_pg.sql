-- Supabase / PostgreSQL Schema

-- Drop tables if they exist (for a clean start in Supabase SQL editor)
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS chapters;
DROP TABLE IF EXISTS webtoons;
DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    firebase_uid VARCHAR(128) UNIQUE,
    auth_provider VARCHAR(20) DEFAULT 'local',
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Webtoons Table
CREATE TABLE webtoons (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author VARCHAR(100) NOT NULL,
    genre VARCHAR(50) NOT NULL, -- Simplified from ENUM for easier migration
    description TEXT,
    cover_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chapters Table
CREATE TABLE chapters (
    id SERIAL PRIMARY KEY,
    webtoon_id INT NOT NULL REFERENCES webtoons(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    chapter_no INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Images Table
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    chapter_id INT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    sequence_no INT NOT NULL,
    image_url VARCHAR(255) NOT NULL
);

-- Favorites Table
CREATE TABLE favorites (
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    webtoon_id INT NOT NULL REFERENCES webtoons(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, webtoon_id)
);

-- Comments Table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    webtoon_id INT NOT NULL REFERENCES webtoons(id) ON DELETE CASCADE,
    chapter_no INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- External Favorites Table
CREATE TABLE external_favorites (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    external_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    cover_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, external_id)
);

-- Dummy Data
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@example.com', '$2b$10$gBJuCe.PRYL2Op1M7iBB0eNdz/hG7zo5.JXtn7uIr/u/GQBR2qFBq', 'admin'),
('user1', 'user1@example.com', '$2b$10$WKfRkCKrnQ8sf8O/VpO6B.L8z9fubK8hUIJTMEFPJRvenQEf0IInO', 'user')
ON CONFLICT DO NOTHING;

INSERT INTO webtoons (title, author, genre, description, cover_url) VALUES
('Solo Leveling', 'Chugong', 'Manhwa', '10 years ago...', 'https://upload.wikimedia.org/wikipedia/en/b/b2/Solo_Leveling_Webtoon.png'),
('Omniscient Reader''s Viewpoint', 'Sing Shong', 'Manhwa', 'Dokja was...', 'https://upload.wikimedia.org/wikipedia/en/b/b4/Omniscient_Reader_Cover.jpg')
ON CONFLICT DO NOTHING;
