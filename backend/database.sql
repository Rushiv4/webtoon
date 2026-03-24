CREATE DATABASE IF NOT EXISTS webtoon_db;
USE webtoon_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    firebase_uid VARCHAR(128) UNIQUE,
    auth_provider ENUM('local', 'google') DEFAULT 'local',
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS webtoons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author VARCHAR(100) NOT NULL,
    genre ENUM('Manga', 'Manhwa', 'Manhua') NOT NULL,
    description TEXT,
    cover_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chapters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    webtoon_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    chapter_no INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (webtoon_id) REFERENCES webtoons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chapter_id INT NOT NULL,
    sequence_no INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorites (
    user_id INT NOT NULL,
    webtoon_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, webtoon_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (webtoon_id) REFERENCES webtoons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    webtoon_id INT NOT NULL,
    chapter_no INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (webtoon_id) REFERENCES webtoons(id) ON DELETE CASCADE
);

-- Insert Dummy Data --
INSERT IGNORE INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@example.com', '$2b$10$gBJuCe.PRYL2Op1M7iBB0eNdz/hG7zo5.JXtn7uIr/u/GQBR2qFBq', 'admin'), -- password: adminpassword
('user1', 'user1@example.com', '$2b$10$WKfRkCKrnQ8sf8O/VpO6B.L8z9fubK8hUIJTMEFPJRvenQEf0IInO', 'user'); -- password: userpassword

INSERT IGNORE INTO webtoons (title, author, genre, description, cover_url) VALUES
('Solo Leveling', 'Chugong', 'Manhwa', '10 years ago, after "the Gate" that connected the real world with the monster world opened, some of the ordinary, everyday people received the power to hunt monsters within the Gate. They are known as "Hunters". However, not all Hunters are powerful.', 'https://upload.wikimedia.org/wikipedia/en/b/b2/Solo_Leveling_Webtoon.png'),
('Omniscient Reader''s Viewpoint', 'Sing Shong', 'Manhwa', 'Dokja was an average office worker whose sole interest was reading his favorite web novel. But when the novel suddenly becomes reality, he is the only person who knows how the world will end.', 'https://upload.wikimedia.org/wikipedia/en/b/b4/Omniscient_Reader_Cover.jpg'),
('One Piece', 'Eiichiro Oda', 'Manga', 'Gol D. Roger was known as the "Pirate King", the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world.', 'https://upload.wikimedia.org/wikipedia/en/9/90/One_Piece%2C_Volume_61_Cover_%28Japanese%29.jpg'),
('Martial Peak', 'Momo', 'Manhua', 'The journey to the martial peak is a lonely, solitary and long one. In the face of adversity, you must survive and remain unyielding. Only then can you break through and continue on your journey to become the strongest.', 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Martial_Peak.jpg/220px-Martial_Peak.jpg');

INSERT IGNORE INTO chapters (webtoon_id, title, chapter_no) VALUES
(1, 'Chapter 1', 1),
(1, 'Chapter 2', 2),
(2, 'Prologue', 1),
(3, 'Romance Dawn', 1);

INSERT IGNORE INTO images (chapter_id, sequence_no, image_url) VALUES
(1, 1, 'https://dummyimage.com/600x800/2a2a2a/fff.png&text=Solo+Leveling+Ch+1+Pg+1'),
(1, 2, 'https://dummyimage.com/600x800/2a2a2a/fff.png&text=Solo+Leveling+Ch+1+Pg+2'),
(2, 1, 'https://dummyimage.com/600x800/2a2a2a/fff.png&text=Solo+Leveling+Ch+2+Pg+1'),
(3, 1, 'https://dummyimage.com/600x800/2a2a2a/fff.png&text=ORV+Ch+1+Pg+1'),
(4, 1, 'https://dummyimage.com/600x800/2a2a2a/fff.png&text=One+Piece+Ch+1+Pg+1');

INSERT IGNORE INTO favorites (user_id, webtoon_id) VALUES (2, 1), (2, 2);

INSERT IGNORE INTO comments (user_id, webtoon_id, chapter_no, content) VALUES
(2, 1, 1, 'Wow, this is amazing!'),
(2, 2, 1, 'I love this story.');
