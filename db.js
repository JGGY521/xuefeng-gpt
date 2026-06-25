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

/** 通过 API Key 反向查找用户（Cookie 丢了也能找回） */
function findByApiKey(apiKey) {
  if (!apiKey || apiKey.length < 8) return null;
  const prefix = apiKey.slice(0, 20);
  const stmt = db.prepare("SELECT * FROM user_config WHERE substr(api_key,1,20) = ?");
  const row = stmt.get(prefix);
  return row ? {
    userId: row.user_id,
    apiKey: row.api_key,
    baseUrl: row.base_url,
    model: row.model,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  } : null;
}

/** 生成或获取用户ID（优先级：请求体 → Cookie → 新建） */
function resolveUserId(req, res) {
  // 1. 前端 localStorage 传过来的 userId 优先
  if (req.body && req.body._userId) {
    return req.body._userId;
  }

  // 2. Cookie
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(/xuefeng_uid=([^;]+)/);
  if (match) return match[1];

  // 3. 新用户：生成唯一ID并种 Cookie
  const newId = 'usr_' + crypto.randomBytes(12).toString('hex');
  const cookie = `xuefeng_uid=${newId}; Path=/; Max-Age=31536000; SameSite=Lax`;
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
  findByApiKey,
  resolveUserId
};
