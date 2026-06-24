// ============================================================
// 雪峰GPT — 前端交互逻辑
// ============================================================

(function() {
  'use strict';

  // DOM 元素
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const quickQuestions = document.getElementById('quickQuestions');
  const settingsBtn = document.getElementById('settingsBtn');
  const configModal = document.getElementById('configModal');
  const modalClose = document.getElementById('modalClose');
  const modalSave = document.getElementById('modalSave');
  const modalUseLocal = document.getElementById('modalUseLocal');
  const configBaseUrl = document.getElementById('configBaseUrl');
  const configApiKey = document.getElementById('configApiKey');
  const configModel = document.getElementById('configModel');

  // 状态
  let isLoading = false;
  let conversationHistory = [];
  let apiConfig = { configured: false, baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-v4-flash', apiKeyMasked: '' };

  // ========== 配置管理（存后端数据库） ==========

  async function loadConfigFromServer() {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (data.configured) {
        apiConfig = data;
      } else {
        apiConfig = { configured: false, baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-v4-flash', apiKeyMasked: '' };
      }
    } catch (err) {
      console.warn('加载远程配置失败，使用默认', err.message);
    }
  }

  async function saveConfigToServer({ apiKey, baseUrl, model }) {
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, baseUrl, model })
    });
    const data = await res.json();
    if (data.success) {
      apiConfig = {
        configured: true,
        baseUrl: data.baseUrl,
        model: data.model,
        apiKeyMasked: '****',
        updatedAt: data.updatedAt
      };
    }
    return data;
  }

  // ========== 消息管理 ==========

  function addMessage(type, content, isHtml = false) {
    const div = document.createElement('div');
    div.className = `message message-${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    if (type === 'system') {
      const img = document.createElement('img');
      img.src = 'photo1.jpg';
      img.alt = '张雪峰';
      img.className = 'avatar-img';
      avatar.appendChild(img);
    } else {
      avatar.textContent = '👤';
    }

    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    if (type === 'system') {
      const header = document.createElement('div');
      header.className = 'bubble-header';
      header.textContent = '赛博毒奶·张雪峰';
      bubble.appendChild(header);
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'bubble-content';

    if (isHtml) {
      contentDiv.innerHTML = content;
    } else {
      contentDiv.textContent = content;
    }

    bubble.appendChild(contentDiv);
    div.appendChild(avatar);
    div.appendChild(bubble);
    chatMessages.appendChild(div);

    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addTypingIndicator() {
    const div = document.createElement('div');
    div.className = 'message message-system';
    div.id = 'typingIndicator';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    const img = document.createElement('img');
    img.src = 'photo1.jpg';
    img.alt = '张雪峰';
    img.className = 'avatar-img';
    avatar.appendChild(img);

    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    const header = document.createElement('div');
    header.className = 'bubble-header';
    header.textContent = '赛博毒奶·张雪峰';

    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';

    bubble.appendChild(header);
    bubble.appendChild(typing);
    div.appendChild(avatar);
    div.appendChild(bubble);
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
      indicator.remove();
    }
  }

  function addMarkdownMessage(text, reasoning = null) {
    // 正文格式化（不再显示思考过程）
    let html = text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/「(.+?)」/g, '<strong style="color:#e85d26;">「$1」</strong>')
      .replace(/『(.+?)』/g, '<strong style="color:#e85d26;">『$1』</strong>');

    html = '<div class="response-body">' + html + '</div>';
    addMessage('system', html, true);
  }

  // ========== API 调用 ==========

  // 检测是否表达了对张老师的怀念
  function checkMemorialKeywords(text) {
    const keywords = /想念|怀念|思念|想他|缅怀|纪念|怀念他|想你了|张老师.*走|可惜.*不在了|再也.*听不到|缅怀|悼念|一路走好|rip/i;
    return keywords.test(text);
  }

  function playMemorialSong() {
    const audio = document.getElementById('memorialAudio');
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.6;
      audio.play().catch(() => {}); // 浏览器自动播放限制时静默失败
    }
  }

  async function sendMessage(message) {
    if (isLoading) return;
    if (!message || message.trim().length === 0) return;

    // 检测到怀念关键词 → 播放念张师
    if (checkMemorialKeywords(message)) {
      playMemorialSong();
    }

    // 显示用户消息
    addMessage('user', message);
    conversationHistory.push({ role: 'user', content: message });

    // 显示打字指示
    addTypingIndicator();
    isLoading = true;
    sendBtn.disabled = true;
    chatInput.disabled = true;

    try {
      // 判断是否配置了 API（后端自动从数据库读取）
      if (apiConfig.configured) {
        // 调用远程 API（后端自动读数据库中的 Key）
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: message,
            history: conversationHistory.slice(0, -1)
          })
        });

        const data = await response.json();

        if (data.error) {
          removeTypingIndicator();
          addMessage('system', data.error);
          return;
        }

        removeTypingIndicator();
        addMarkdownMessage(data.reply, data.reasoning);
        conversationHistory.push({ role: 'assistant', content: data.reply });
      } else {
        // 本地模拟模式 - 直接调 server 端 mock
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: message,
            history: []
          })
        });

        const data = await response.json();

        removeTypingIndicator();
        addMarkdownMessage(data.reply);
        conversationHistory.push({ role: 'assistant', content: data.reply });
      }
    } catch (err) {
      removeTypingIndicator();
      addMessage('system', '哎呀——网络出岔子了！你等会儿再试试！');
      console.error('Send error:', err);
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
      chatInput.disabled = false;
      chatInput.focus();
    }

    // 历史过长时裁剪
    if (conversationHistory.length > 30) {
      conversationHistory = conversationHistory.slice(-20);
    }
  }

  // ========== 事件绑定 ==========

  // 发送按钮
  sendBtn.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (text) {
      sendMessage(text);
      chatInput.value = '';
      chatInput.style.height = 'auto';
    }
  });

  // Enter 发送（Shift+Enter 换行）
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendBtn.click();
    }
  });

  // 自动调整输入框高度
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  });

  // 快捷提问
  quickQuestions.addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-btn');
    if (btn && btn.dataset.question) {
      chatInput.value = btn.dataset.question;
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
      sendBtn.click();
    }
  });

  // ========== 配置弹窗 ==========

  function openConfig() {
    configBaseUrl.value = apiConfig.baseUrl || 'https://api.deepseek.com/v1';
    configModel.value = apiConfig.model || 'deepseek-v4-flash';
    // 如果已配置，显示脱敏提示；否则留空让用户输入新 Key
    configApiKey.value = '';
    configApiKey.placeholder = apiConfig.configured
      ? '已保存 (仅显示脱敏: ' + (apiConfig.apiKeyMasked || '****') + ')，留空则不修改'
      : 'sk-...';
    configModal.classList.add('active');
  }

  settingsBtn.addEventListener('click', openConfig);

  modalClose.addEventListener('click', () => {
    configModal.classList.remove('active');
  });

  configModal.addEventListener('click', (e) => {
    if (e.target === configModal) {
      configModal.classList.remove('active');
    }
  });

  modalSave.addEventListener('click', async () => {
    const apiKey = configApiKey.value.trim();
    const baseUrl = configBaseUrl.value.trim();
    const model = configModel.value.trim();

    // 如果用户没填新 Key，保持旧的（后端不做修改）
    const body = { baseUrl, model };
    if (apiKey) body.apiKey = apiKey;

    try {
      const data = await saveConfigToServer(body);
      configModal.classList.remove('active');
      showToast('✅ 配置已保存到服务器！', 'var(--primary)');
    } catch (err) {
      showToast('❌ 保存失败：' + err.message, '#e74c3c');
    }
  });

  modalUseLocal.addEventListener('click', async () => {
    try {
      await fetch('/api/config', { method: 'DELETE' });
      apiConfig = { configured: false, baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-v4-flash', apiKeyMasked: '' };
      configModal.classList.remove('active');
      showToast('🔧 已清除配置，切换到本地演示模式', 'var(--secondary)');
    } catch (err) {
      showToast('❌ 操作失败：' + err.message, '#e74c3c');
    }
  });

  function showToast(text, bgColor) {
    const msg = document.createElement('div');
    msg.style.cssText = `
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      background: ${bgColor}; color: white; padding: 10px 24px;
      border-radius: 8px; font-size: 14px; z-index: 2000;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      font-family: 'Noto Sans SC', sans-serif;
    `;
    msg.textContent = text;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2500);
  }

  // ========== 键盘快捷键 ==========
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      sendBtn.click();
    }
  });

  // ========== 初始化 ==========
  async function init() {
    await loadConfigFromServer();
    console.log(
      '%c🏗️ 雪峰GPT 加载完成 %c| %c配置状态: ' + (apiConfig.configured ? '已配置' : '本地模式'),
      'color:#e85d26;', '', 'color:#2ecc71;'
    );
    chatInput.focus();
  }

  init();

})();
