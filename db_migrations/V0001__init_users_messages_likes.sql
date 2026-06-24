CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    vk_id VARCHAR(64) UNIQUE,
    name VARCHAR(255) NOT NULL,
    avatar TEXT,
    token VARCHAR(128) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    user_name VARCHAR(255) NOT NULL,
    avatar TEXT,
    text TEXT NOT NULL,
    stars INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    track_title VARCHAR(255) NOT NULL,
    track_artist VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, track_title)
);

CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);