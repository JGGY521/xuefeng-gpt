// ============================================================
// 雪峰GPT — SQLite 数据库模块
// 存储用户 API 配置，Cookie 标识用户
// ============================================================

const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'xuefeng.db');
const db = new Database(dbPath);

// 启用 WAL 模式提升并发性能
db.pragma('journal_mode = WAL');

// 建表（不存在则创建）
db.exec(`
  CREATE TABLE IF NOT EXISTS user_config (
    user_id   TEXT PRIMARY KEY,
    api_key   TEXT DEFAULT '',
    base_url  TEXT DEFAULT 'https://api.deepseek.com/v1',
    model     TEXT DEFAULT 'deepseek-v4-flash',
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT DEFAULT (datetime('now', 'localtime'))
  );
`);

// ---------- 公开方法 ----------

/** 读取用户配置 */
function getUserConfig(userId) {
  const row = db.prepare('SELECT * FROM user_config WHERE user_id = ?').get(userId);
  if (!row) return null;
  return {
    userId: row.user_id,
    apiKey: row.api_key,
    baseUrl: row.base_url,
    model: row.model,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/** 保存/更新用户配置 */
function saveUserConfig(userId, { apiKey, baseUrl, model }) {
  const stmt = db.prepare(`
    INSERT INTO user_config (user_id, api_key, base_url, model, updated_at)
    VALUES (?, ?, ?, ?, datetime('now', 'localtime'))
    ON CONFLICT(user_id) DO UPDATE SET
      api_key   = excluded.api_key,
      base_url  = excluded.base_url,
      model     = excluded.model,
      updated_at = datetime('now', 'localtime')
  `);
  stmt.run(userId, apiKey || '', baseUrl || 'https://api.deepseek.com/v1', model || 'deepseek-v4-flash');
  return getUserConfig(userId);
}

/** 生成或获取用户ID（基于 Cookie） */
function resolveUserId(req, res) {
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(/xuefeng_uid=([^;]+)/);
  if (match) return match[1];

  // 新用户：生成唯一ID并种 Cookie
  const newId = 'usr_' + crypto.randomBytes(12).toString('hex');
  const cookie = `xuefeng_uid=${newId}; Path=/; Max-Age=31536000; SameSite=Lax`;
  // 追加到已有 Set-Cookie 头后面
  const existing = res.getHeader('Set-Cookie');
  if (existing) {
    res.setHeader('Set-Cookie', [].concat(existing, cookie));
  } else {
    res.setHeader('Set-Cookie', cookie);
  }
  return newId;
}

module.exports = {
  getUserConfig,
  saveUserConfig,
  resolveUserId
};
