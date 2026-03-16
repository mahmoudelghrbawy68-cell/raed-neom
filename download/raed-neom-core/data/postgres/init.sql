# ═══════════════════════════════════════════════════════════════════════════════
# رائد نيوم - قاعدة البيانات الأولية
# ═══════════════════════════════════════════════════════════════════════════════

-- إنشاء الجداول
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE,
    name VARCHAR(255),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    messages_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(64) REFERENCES sessions(id),
    role VARCHAR(20),
    content TEXT,
    is_voice BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales_events (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(64),
    product_id VARCHAR(100),
    intent_score FLOAT,
    triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    converted BOOLEAN DEFAULT FALSE
);

-- فهرسة للبحث السريع
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_messages_session ON messages(session_id);
CREATE INDEX idx_sales_session ON sales_events(session_id);

-- إدخال مدير افتراضي
INSERT INTO users (telegram_id, name, email) 
VALUES (987654321, 'المدير', 'admin@raed-neom.com')
ON CONFLICT (telegram_id) DO NOTHING;
