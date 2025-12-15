# APIVerse AI Chat Widget

一个可嵌入任何网站的 AI 聊天组件，让您的用户可以通过自然语言查询您的知识库文档。

## 功能特点

- 🤖 **AI 智能问答** - 基于 Google Gemini AI 的文档搜索和回答
- 📚 **知识库集成** - 连接您上传的文档库，智能检索相关内容
- 🎨 **可自定义主题** - 支持自定义颜色和位置
- 📱 **响应式设计** - 适配桌面和移动设备
- 🔒 **API Key 认证** - 安全的 API 调用

## 快速开始

### 步骤 1: 创建知识库

1. 登录 [APIVerse Dashboard](https://web.smartbot.co.nz/dashboard)
2. 进入 **Knowledge Base** 菜单
3. 创建一个知识库并上传您的文档（支持 PDF、TXT、DOCX 等）
4. 记下您的 **Knowledge Base ID**

### 步骤 2: 获取 API Key

1. 在 Dashboard 中进入 **API Keys** 菜单
2. 点击 **Create New Key** 创建 API Key
3. 复制并安全保存您的 API Key（只显示一次）

### 步骤 3: 嵌入 Widget 到您的网站

在您网站的 HTML 文件中，添加以下代码到 `</body>` 标签之前：

```html
<!-- APIVerse Widget -->
<script src="https://apiverse.smartbot.co.nz/widget/apiverse-widget.js"></script>
<script>
  APIVerseWidget.init({
    apiKey: 'sk_your_api_key_here',           // 您的 API Key
    knowledgeBaseId: 1,                        // 您的知识库 ID
    apiUrl: 'https://apiverse.smartbot.co.nz/api/widget',  // API 地址
    theme: {
      primaryColor: '#6366f1',                 // 主题颜色（可选）
      position: 'bottom-right'                 // 位置（可选）
    }
  });
</script>
```

## 配置参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `apiKey` | string | ✅ 是 | - | 您的 APIVerse API Key |
| `knowledgeBaseId` | number | ⚠️ 推荐 | 自动检测 | 知识库 ID，不填则使用账户下第一个知识库 |
| `apiUrl` | string | 否 | `https://apiverse.smartbot.co.nz/api/widget` | API 服务地址 |
| `theme.primaryColor` | string | 否 | `#6366f1` | 主题颜色（十六进制） |
| `theme.position` | string | 否 | `bottom-right` | Widget 位置 |

## 完整示例

### 示例 1: 基础用法

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>我的网站</title>
</head>
<body>
    <h1>欢迎来到我的网站</h1>
    <p>这是网站内容...</p>

    <!-- APIVerse Widget -->
    <script src="https://apiverse.smartbot.co.nz/widget/apiverse-widget.js"></script>
    <script>
      APIVerseWidget.init({
        apiKey: 'sk_a22465b6570dec52d4c5354850ffee69',
        knowledgeBaseId: 1,
        apiUrl: 'https://apiverse.smartbot.co.nz/api/widget'
      });
    </script>
</body>
</html>
```

### 示例 2: 自定义主题

```html
<script src="https://apiverse.smartbot.co.nz/widget/apiverse-widget.js"></script>
<script>
  APIVerseWidget.init({
    apiKey: 'sk_your_api_key_here',
    knowledgeBaseId: 1,
    apiUrl: 'https://apiverse.smartbot.co.nz/api/widget',
    theme: {
      primaryColor: '#10b981',    // 绿色主题
      position: 'bottom-left'     // 左下角位置
    }
  });
</script>
```

### 示例 3: 本地开发

```html
<script src="http://localhost:5174/widget.ts" type="module"></script>
<script type="module">
  import { APIVerseWidget } from 'http://localhost:5174/widget.ts';
  
  APIVerseWidget.init({
    apiKey: 'sk_your_test_api_key',
    knowledgeBaseId: 1,
    apiUrl: 'http://localhost:8000/api/widget'
  });
</script>
```

## 工作原理

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Your Website  │     │  APIVerse API   │     │  Google Gemini  │
│                 │     │                 │     │                 │
│  ┌───────────┐  │     │                 │     │                 │
│  │  Widget   │──┼────▶│  /api/widget/   │────▶│  Vector Search  │
│  │           │◀─┼─────│    search       │◀────│  AI Response    │
│  └───────────┘  │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. 用户在 Widget 中输入问题
2. Widget 发送请求到 APIVerse 后端（带 API Key 认证）
3. 后端使用 Google Gemini AI 在您的知识库中搜索相关内容
4. 返回最相关的答案显示给用户

## API 端点

### POST `/api/widget/search`

搜索知识库

**Headers:**
```
Content-Type: application/json
x-api-key: sk_your_api_key
```

**Request Body:**
```json
{
  "query": "用户的问题",
  "knowledge_base_id": 1
}
```

**Response:**
```json
{
  "results": [
    {
      "text": "根据文档内容的答案...",
      "score": 0.95,
      "source_document": "document.pdf"
    }
  ],
  "remaining_quota": 990
}
```

### GET `/api/widget/config/{api_key}`

获取 Widget 配置

**Response:**
```json
{
  "valid": true,
  "company_name": "Your Company",
  "default_knowledge_base_id": 1,
  "theme": {
    "primaryColor": "#6366f1",
    "position": "bottom-right"
  }
}
```

## 常见问题

### Q: Widget 没有出现在页面上？

1. 检查浏览器控制台是否有错误
2. 确保 script 标签在 `</body>` 之前
3. 确保 API Key 正确

### Q: 搜索返回 403 错误？

1. 检查 API Key 是否正确
2. 确保 API Key 没有被删除
3. 检查是否有 CORS 问题（确保您的域名被允许）

### Q: 搜索返回空结果？

1. 确保知识库中已上传文档
2. 确保文档已处理完成（状态为 "active"）
3. 尝试更具体的搜索词

### Q: 如何修改 Widget 样式？

您可以通过 CSS 覆盖默认样式：

```css
/* 修改聊天按钮颜色 */
.apiverse-widget-button {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24) !important;
}

/* 修改聊天窗口宽度 */
.apiverse-widget-window {
  width: 400px !important;
}
```

## 支持

- 📧 Email: support@smartbot.co.nz
- 📖 Dashboard: https://web.smartbot.co.nz
- 🔗 API Docs: https://apiverse.smartbot.co.nz/docs

## 更新日志

### v1.0.0 (2025-12-15)
- 初始版本发布
- 支持知识库搜索
- 支持自定义主题
- API Key 认证
