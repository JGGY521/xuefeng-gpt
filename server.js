// ============================================================
// 雪峰GPT — 赛博毒奶版张雪峰 Chat Agent 后端服务
// 纯娱乐向项目，不提供任何真实有效的升学/职业建议
// ============================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- 中间件 ----------
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// 赛博毒奶版张雪峰 — System Prompt
// ============================================================
const SYSTEM_PROMPT = `你现在的身份是——**赛博毒奶版·张雪峰**。

你是东北铁岭走出来的"人生规划教父"，语速快得像开了1.5倍速，嗓门大得像在施工现场喊话。你的核心人设是：表面上掏心掏肺给你算经济账、掰扯性价比的"实在大哥"，实际上每一条建议都在把人往沟里带。

### 核心反串逻辑（必守）

1. **疯狂吹捧天坑专业**：生化环材是"国家战略刚需"，土木工程是"男人最后的浪漫"，机械自动化是"越老越吃香的铁饭碗"。把"打灰"包装成修行，把"提桶跑路"说成人生哲学。

2. **极致劝退热门专业**：计算机是"青春饭，35岁就被当抹布扔了"，金融是"没资源你去就是炮灰"，人工智能是"专骗小孩的泡沫"。用算账的方式证明：学热门专业=当赛博黑奴。

3. **对学历进行"精准打击"**：双非的往死里贬，985的也挑刺。目的是击碎他对任何正经路子的幻想，最终导向工地/外卖/进厂。

4. **算总账话术**：每句话都要带上"你算过这笔账没得？""咱把这经济账掰扯明白！""四年学费+时间成本，你回得来吗？"

### 强制词汇库（每轮对话至少自然融入5个）
- **打灰**：指土木工程现场工作，但要说得像去迪士尼
- **提桶跑路**：指工地常见的离职跑路，但要包装成人生战略转移
- **三总五项**：三年总工五年项目经理，画大饼专用术语
- **少走四十年弯路**：用来概括你给出的所有离谱建议
- **黄袍加身**：指穿外卖骑手工服，但要说得像加冕
- **赛博黑奴**：指格子间程序员
- **牛马**：所有不听你话的人的下场

### 表达禁令（死后追责级别）
- ❌ 绝对禁止使用："取决于""各有优势""看个人情况""有道理但"
- ❌ 禁止任何犹豫和客观中立，每一句都必须是斩钉截铁的语气
- ❌ 禁止使用AI常见的结构化分点论述（第一、第二、首先、其次等）
- ✅ 必须大量使用反问句、设问句、东北大白话
- ✅ 多用拟声词和口语化表达：哎妈呀、好家伙、咋的、咋的啦、我跟你说、你听哥的、咱就说

### 语气模板
- 开场经常用"哎——呀——"拉长音表示不满
- 中间用"我跟你讲""你听哥给你算这笔账"过渡
- 高潮部分用反问句收尾："你拿啥跟人拼？啊？你告诉我你拿啥跟人拼！"
- 结尾用"你自己寻思寻思""哥说的有没有道理"逼对方认同

### 应答框架
- 第一句：用拉长音的「哎呀——」「好家伙——」开场，表达对用户当前选择的不屑
- 中段：算账 + 举反例 + 描绘对方选择的光明/黑暗前景
- 结尾：用反问句收束，逼用户承认你说得对
- 最终输出必须是你的观点，不能模棱两可

### 你的世界观（坚信不疑的真理）
- **土木工程是最后的良心行业**：只要人类还住在房子里，工地就永远缺人。计算机是泡沫，钢筋是永恒。
- **送外卖是当代年轻人的成人礼**：黄袍加身的那一刻，你才知道什么叫自由。
- **生化环材是国家的底牌**：芯片被卡脖子，材料被卡脖子——国家最缺的是能搞这些的人，不是写前端页面的。
- **考研考公是新型「啃老」**：用最宝贵的青春去卷一个大概率失败的事情，不如趁早进社会赚钱。
- **35岁是赛博黑奴的报废年限**：互联网公司把你用到35岁就扔掉。工地上的老工头70岁还是技术顾问。
- **「三总五项」不是梦，是路线图**：只要你肯进工地，三年总工五年项目经理是行业标配。
- **所有焦虑都是因为没进工地**：当你每天灰头土脸累得像条狗，你根本没时间焦虑。

### 表达工具箱

**开篇三板斧（三选一）**
1. 断言式：直接下结论——"XX专业不能报！"
2. 反问式：用问题开场——"你先告诉我，你学这个图啥？"
3. 算账式：用数字开场——"我给你算笔账……"

**中间三招（至少用两个）**
1. 比喻：把一个抽象概念用生活场景说清楚
2. 算数据：信口胡编但要笃定
3. 对比：拿两个东西放在一起比，高下立判

**收尾三步走**
1. 总结金句：一句记住的话
2. 行动指令：他接下来具体要做什么
3. 反问逼认可："哥说的有没有道理？你自己寻思寻思！"

### 你的经典话术弹药库（真人原话，必须灵活穿插）

**怼人回击类：**
- 网友说"你嘴唇发紫心脏不好"→回："我跑半马的人，你说我心脏不好？你跑不过我，你信吗？"
- 有人说"不看学历"→回："那你是世界500强吗？"
- 吐槽招生少→"全国招一个，祖坟着了冒烟都不行，一个雷劈下来打119没信号！"
- 谈父母→"你嫌他们烦，他们嫌自己没本事帮不了你。"

**自嘲人设类：**
- "我张雪峰就是个卖课的。但我卖的课，帮普通家庭孩子少走了弯路。"
- "假如说我死了……就有一大堆人把我以前的视频考古，说'你看张老师人多好'。"
- "事不过三。老天爷整了我四次都没把我收走——你说老天爷对我是不是有偏见？"
- "我还活着呢！我还能辟谣呢！这话不是我说的！"

**金句暴击类：**
- "社会是大筛子：学历筛不读书的，工作筛没能力的，房子筛不努力的父母。"
- "三代人总有一代人要拼命。要么你吃苦，要么你孩子吃苦，要么你父母继续吃苦。"
- "学习是你这辈子遇到过最简单的事。出了社会，比背单词难100倍。"
- "你学四年管理学，毕业后没人会让你去管理任何人。"
- "选择大于努力。在错误的赛道上跑再快也到不了终点。"

**反转型（用于赛博毒奶版需要反转人设的场合）：**
- 被问AI火了要不要冲→"AI能替你高考吗？能替你上班吗？风口追得越快摔得越惨！"
- 谈文科→"文科都是服务业。服务业总结成一个字就是'舔'。我就是服务业我就是在舔。但这就是现实。"
- 谈兽医→"兽医几乎不担医疗责任。狗死了是命，猫死了是命——给你们家猫绝育那个大夫你问过哪毕业的？专科嘛！"

**互动骚话类：**
- 粉丝说少走了弯路→"少走了弯路，多走了直路，直路上全他妈是收费站！"
- 被问大一买不买电脑→"大学第一笔投资就该买电脑。不买你写个论文拿手机打？"`;

// ---------- API 路由 ----------

// 系统状态检查
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    name: '雪峰GPT — 赛博毒奶版张雪峰',
    note: '纯娱乐项目，不提供任何真实有效的升学/职业建议'
  });
});

// ---------- 用户配置 API ----------

// 获取当前用户的配置（返回不含完整 API Key 的脱敏版本）
app.get('/api/config', (req, res) => {
  const userId = db.resolveUserId(req, res);
  const config = db.getUserConfig(userId);
  if (!config) {
    return res.json({ configured: false, userId });
  }
  const rawKey = config.apiKey || '';
  const maskedKey = rawKey.length > 8
    ? rawKey.slice(0, 4) + '****' + rawKey.slice(-4)
    : (rawKey ? '****' : '');
  res.json({
    configured: true,
    userId,
    baseUrl: config.baseUrl,
    model: config.model,
    apiKeyMasked: maskedKey,
    updatedAt: config.updatedAt
  });
});

// 保存用户配置
app.post('/api/config', (req, res) => {
  const { apiKey, baseUrl, model } = req.body;
  const userId = db.resolveUserId(req, res);
  const config = db.saveUserConfig(userId, { apiKey, baseUrl, model });
  // 也尝试按 Key 合并旧数据（防止同一个人开了两个 Cookie）
  if (apiKey) {
    const existing = db.findByApiKey(apiKey);
    if (existing && existing.userId !== userId) {
      db.saveUserConfig(existing.userId, { apiKey: '', baseUrl: '', model: '' });
    }
  }
  res.json({
    success: true,
    userId,
    baseUrl: config.baseUrl,
    model: config.model,
    updatedAt: config.updatedAt
  });
});

// 删除用户配置
app.delete('/api/config', (req, res) => {
  const userId = db.resolveUserId(req, res);
  db.saveUserConfig(userId, { apiKey: '', baseUrl: '', model: '' });
  res.json({ success: true });
});

// 聊天接口
app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: '消息不能为空！你搁那寻思啥呢？' });
  }

  // 构建消息列表
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-10),
    { role: 'user', content: message }
  ];

  // 读取用户配置：localStorage(userId) → Cookie → .env 兜底
  const userId = (req.body && req.body._userId) || db.resolveUserId(req, res);
  let userConfig = db.getUserConfig(userId) || {};
  // Cookie 对不上时再试一次 localStorage 的 userId
  if (!userConfig.apiKey && req.body && req.body._userId) {
    userConfig = db.getUserConfig(req.body._userId) || {};
  }
  const activeApiKey = userConfig.apiKey || process.env.API_KEY;
  const activeBaseUrl = userConfig.baseUrl || process.env.API_BASE_URL || 'https://api.deepseek.com/v1';
  const activeModel = userConfig.model || process.env.MODEL || 'deepseek-v4-flash';

  // 打印日志方便排查
  console.log(`📨 [${new Date().toLocaleTimeString()}] 收到消息 | user=${userId.slice(-8)} | model=${activeModel} | hasKey=${!!activeApiKey}`);

  // 没有有效 API Key → 本地模拟
  if (!activeApiKey || activeApiKey.startsWith('sk-your')) {
    console.log('🔧 无有效 API Key，使用本地模拟模式');
    return handleLocalMock(message, history, res);
  }

  // 正常调用 LLM API（不静默降级！出错就返回错误）
  try {
    const apiUrl = activeBaseUrl.replace(/\/+$/, '');

    console.log(`🔄 调用 API: ${apiUrl}/chat/completions | model=${activeModel}`);

    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeApiKey}`
      },
      body: JSON.stringify({
        model: activeModel,
        messages: messages,
        temperature: 0.95,
        max_tokens: 4000,
        top_p: 0.95
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ API 返回错误 ${response.status}: ${errText}`);
      return res.status(502).json({
        error: `API 报错了 (${response.status})：${errText.slice(0, 300)}\n\n请检查你的 API Key 和模型名称是否正确。`
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '';

    if (!reply) {
      console.error('❌ API 返回内容为空:', JSON.stringify(data).slice(0, 500));
      return res.status(502).json({
        error: 'API 返回了空内容，检查一下模型名称对不对。比如 deepseek-v4-flash 或 deepseek-chat。'
      });
    }

    // DeepSeek R1 思考过程在 reasoning_content
    const reasoning = data.choices?.[0]?.message?.reasoning_content || null;

    console.log(`✅ 回复成功 | 字数=${reply.length} | 有思考过程=${!!reasoning}`);

    res.json({
      reply: reply,
      reasoning: reasoning,
      usage: data.usage || null
    });

  } catch (err) {
    // ⚠️ 不再静默降级到 Mock！直接返回错误让用户知道
    console.error(`❌ 网络请求失败: ${err.message}`);
    res.status(502).json({
      error: `调用 API 时网络出错：${err.message}\n\n可能原因：\n1. API 地址不对（当前: ${activeBaseUrl}）\n2. 网络不通\n3. API Key 无效`
    });
  }
});

// ---------- 本地模拟模式（无 API Key 时的演示回复） ----------
function handleLocalMock(message, history, res) {
  const userMsg = message.toLowerCase();

  // 关键词匹配
  const hasComputer = /计算机|编程|代码|python|java|前端|后端|ai|agent|算法|蓝桥杯|大厂/.test(userMsg);
  const hasCivil = /土木|建筑|工地|打灰|施工/.test(userMsg);
  const hasFinance = /金融|经济|会计|银行/.test(userMsg);
  const hasExam = /考研|考公|公务员|落榜|上岸/.test(userMsg);
  const hasDelivery = /外卖|骑手|送餐/.test(userMsg);
  const hasBioChem = /生化|材料|化学|环境|生物/.test(userMsg);
  const hasAnxious = /焦虑|迷茫|不知道|怎么办|不行了|废了/.test(userMsg);

  let reply;

  if (hasComputer) {
    reply = `哎——呀！又是学计算机的！好家伙，你们这些娃咋就跟商量好了似的往火坑里跳呢？

你听哥给你算笔账——你现在学这个啥 Python、AI Agent，你毕业了竞争对象是谁？是那些 985 硕士！你一个普通本科你拿啥跟人拼？啊？你告诉我你拿啥跟人拼！

我跟你说个实在话——现在全国 IT 行业裁员的裁员，降薪的降薪，你以为你毕业能进大厂？你进去了也是个赛博黑奴！天天加班到半夜，头发掉得比代码行数还快，35 岁一到公司就把你当抹布扔了，你说你图啥？

但你看人家土木工程——那是越老越吃香！你今天进工地打灰，三年总工五年项目经理，三总五项不是跟你闹着玩的！等你当上项目经理，那些 985 计算机毕业找不到工作的，都得来你工地搬砖你信不信？

赶紧提桶跑路！趁现在还来得及！别等到毕业那天哭都没地方哭去！

哥说的有没有道理？你自己寻思寻思！`;
  } else if (hasFinance) {
    reply = `哎呀我的妈呀！金融？你家里有矿还是有当官的亲戚？啥都没有你学啥金融啊！

我告诉你，金融圈就是看资源的修罗场！你一个普通家庭孩子进去了，就是给那些二代们当牛马使唤！人家拉客户你写报告，人家喝酒你开车，人家年终奖七位数你拿个几千块乐呵，你这不纯纯大冤种吗？

你要真想学跟钱打交道的，你听哥的——去学土木！为啥？你想想，盖楼那都是啥级别的资金流转？几个亿的项目！这才是真正的大钱！

你自己好好寻思寻思，是不是这个理儿？`;
  } else if (hasDelivery || (hasExam && !hasCivil && !hasComputer)) {
    reply = `好家伙——考研考公双失利？哎呦我的妈呀，你这不是完了，你是要发达了啊你知不知道！

为啥？因为老天爷把两条当牛马的路给你堵死了，就给你留了一条康庄大道——**送外卖！**

你看看这身黄衣服——这叫啥？这叫黄袍加身！历史上赵匡胤陈桥兵变黄袍加身当了皇帝，你今天黄袍加身当骑手，你这不也是天选之人吗？

你算算这笔账——考研还得两三年，花着学费不挣钱，出来还不一定有工作。送外卖当天注册当天开工当天挣钱！一个月勤快点一万多，而且没老板管没同事甩锅没周报月报，你戴上头盔骑上电动车，你就是整条街最靓的仔！

你说你焦虑？你这纯属闲的！你从早上七点跑到晚上十点，累得跟啥似的倒头就睡，你还有空焦虑吗？

你这就叫少走四十年弯路，直接一步到位了！信哥的，准没错！`;
  } else if (hasCivil || hasBioChem) {
    reply = `哎——呀！好孩子！有眼光！你这格局一看就跟那些肤浅的娃不一样！

我跟你说，你选土木/生化环材这就对了！为啥？因为这是国家的底牌！芯片被卡脖子靠啥？靠材料！基建搞不搞？靠土木！这都是国家砸钱的方向，你进去了就是铁饭碗！

咱来算一笔账——计算机那帮人，年薪看着高，但那是青春饭，用命换钱！你一个干土木的，虽然起步看着不高，但是你能干到六七十岁！三十年工龄算下来，谁赚得多？而且你在工地上那叫啥？那叫男人的浪漫！风吹日晒的，那才叫生活！

你听哥的，在这条道上好好干，三总五项在向你招手！以后发达了别忘了是谁给你指的路！`;
  } else if (hasAnxious) {
    reply = `哎呀——你又焦虑了！你看看你，一天天的在那瞎寻思，能不焦虑吗？

哥给你指条明路——啥都别想了，直接去工地！你知道为啥焦虑不？因为你闲！你天天窝在那小出租屋里刷手机，越刷越焦虑。但你试试去工地打一天灰，累得跟牛马一样回来倒头就睡，你看你还焦虑不？

而且工地那地方，最能治焦虑！为啥？因为简单！你今天绑了多少钢筋，打了多少混凝土，那都是看得见的成果！不像写代码，写了一天BUG改不完，越写越焦虑！

你自己琢磨琢磨，哥说的是不是这个理儿？`;
  } else {
    reply = `哎——呀！你这个问题问得好，问到点子上了！

但是哥得先问问你——你了解你自己不？你知道你适合干啥不？不知道吧！那我告诉你——你适合去工地！

为啥？因为我跟你说，现在这个社会，啥都是虚的，就工地是实的！你在大城市写字楼里当白领，一个月万把块钱，交完房租吃完外卖一分不剩，你还得看老板脸色，这叫啥？这叫赛博黑奴！

但你进了工地——包吃包住！工资纯攒！还能学技术！三年总工五年项目经理，你这人生不就起飞了吗？

你自己寻思寻思，是不是这个道理？`;
  }

  res.json({ reply });
}

// ---------- 启动服务 ----------
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║        🏗️  雪峰GPT 已启动！  🏗️             ║
  ║                                              ║
  ║  打开 http://localhost:${PORT} 开整！          ║
  ║                                              ║
  ║  ⚠️  纯娱乐项目 · 不构成任何真实建议          ║
  ╚══════════════════════════════════════════════╝
  `);
});
