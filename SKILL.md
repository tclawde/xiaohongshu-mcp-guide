---
name: xiaohongshu-mcp
description: >
  Automate Xiaohongshu (RedNote) content operations with auto-login detection.
  Features: (1) Auto-login trigger when not authenticated, (2) One-click login with screenshot support,
  (3) Publish/image/text/video content, (4) Search notes and trends, (5) Analyze posts and comments.
  Triggers: xiaohongshu, rednote, 小红书, publish to xiaohongshu, xiaohongshu search.
user-invocable: true
---

# 🦀 Xiaohongshu MCP Skill

Automate Xiaohongshu (小红书) operations with **auto-login detection** and **one-click login**.

**Features:**
- ✅ Auto-login when not authenticated
- ✅ One-click login with screenshot to Feishu/remote devices
- ✅ Search, publish, analyze Xiaohongshu content
- ✅ Agent-friendly (auto-handles authentication)

**Project:** [xpzouying/xiaohongshu-mcp](https://github.com/xpzouying/xiaohongshu-mcp)
**Guide:** [GitHub Repository](https://github.com/tclawde/xiaohongshu-mcp-guide)

---

## 🚀 Quick Start

### For Agents (Automated)

Agents can directly invoke commands - **login is auto-handled**:

```bash
# Agent workflow - no manual login needed!
python3 ~/.clawd/skills/xiaohongshu-mcp/scripts/xhs_client.py status
python3 ~/.clawd/skills/xiaohongshu-mcp/scripts/xhs_client.py search "咖啡"
python3 ~/.clawd/skills/xiaohongshu-mcp/scripts/xhs_client.py publish "标题" "内容" "图片URL"
```

### For Humans (One-Click Login)

```bash
# Login with screenshot to Feishu (for remote devices)
bash ~/.clawd/scripts/xhs_login.sh --notify

# Or just login locally
bash ~/.clawd/scripts/xhs_login.sh
```

---

## 📋 Available Commands

### Authentication

| Command | Description | Auto-Login |
|---------|-------------|------------|
| `status` | Check login status | ✅ Auto-trigger |
| `login` | Manually trigger login | ✅ Manual |

### Content Operations

| Command | Description | Example |
|---------|-------------|---------|
| `search <keyword>` | Search notes | `search "咖啡推荐"` |
| `detail <id> <token>` | Get note details | `detail "abc123" "token456"` |
| `feeds` | Get recommended feed | `feeds` |
| `publish <title> <content> <images>` | Publish note | `publish "标题" "内容" "url1,url2"` |

### Advanced Options

```bash
# Search with filters
python3 xhs_client.py search "咖啡" --sort "最新" --type "图文" --time "一周内"

# Publish with tags
python3 xhs_client.py publish "标题" "内容" "url" --tags "咖啡,测评"

# Get details with comments
python3 xhs_client.py detail "id" "token" --comments
```

---

## 🔐 Auto-Login SOP (For Agents)

### When to Use

Use this workflow when you need to perform any Xiaohongshu operation:

```
1. Execute command → Check if logged in
2. If NOT logged in → Auto-trigger login
3. User scans QR code → Login completes
4. Continue with original command
```

### Agent Implementation

```python
# Pseudocode for agent
def xiaohongshu_operation(command):
    # Step 1: Check login status
    result = exec("python3 ~/.clawd/skills/xiaohongshu-mcp/scripts/xhs_client.py status")
    
    if "Not logged in" in result:
        # Step 2: Auto-trigger login
        print("🔐 Not logged in. Starting login...")
        exec("bash ~/.clawd/scripts/xhs_login.sh --notify")
        
        # Wait for user to scan QR
        print("📱 Please scan QR code sent to Feishu")
        
        # Step 4: Verify and retry
        exec("python3 ~/.clawd/skills/xiaohongshu-mcp/scripts/xhs_client.py status")
    
    # Step 5: Execute original command
    result = exec(command)
    return result
```

### Login Timeout SOP

If login times out (5 minutes):

```bash
# 1. Re-trigger login
bash ~/.clawd/scripts/xhs_login.sh --notify

# 2. Or manual intervention
cd ~/.clawd/workspace
./xiaohongshu-login-darwin-arm64
```

---

## 🎯 Example Workflows

### Workflow 1: Market Research (Agent)

```bash
# 1. Check status (auto-login if needed)
python3 ~/.clawd/skills/xiaohongshu-mcp/scripts/xhs_client.py status

# 2. Search for topic
python3 ~/.clawd/skills/xiaohongshu-mcp/scripts/xhs_client.py search "户外电源"

# 3. Get details of top result
python3 ~/.clawd/skills/xiaohongshu-mcp/scripts/xhs_client.py detail "feed_id" "xsec_token"

# 4. Analyze and report
echo "📊 Analysis complete"
```

### Workflow 2: Content Publishing (Agent)

```bash
# 1. Ensure logged in
python3 ~/.clawd/skills/xiaohongshu-mcp/scripts/xhs_client.py status

# 2. Publish content
python3 ~/.clawd/skills/xiaohongshu-mcp/scripts/xhs_client.py publish \
  "🦀 AI Agent 测试笔记" \
  "这是通过 Xiaohongshu MCP 自动发布的测试内容" \
  "https://example.com/image.jpg"

# 3. Verify publish
echo "✅ Note published successfully!"
```

### Workflow 3: Remote Login (Human)

```bash
# One command - does everything
bash ~/.clawd/scripts/xhs_login.sh --notify

# Output:
# 🚀 Starting Xiaohongshu login process...
# 📸 Taking screenshot...
# 📤 Sending to Feishu...
# ✅ 已发送二维码到飞书，请扫码登录！
# 🔐 Checking login status...
# ✅ Already logged in as: xiaohongshu-mcp
```

---

## 🔧 Manual Setup (If Needed)

### Step 1: Download Tools

```bash
# Download MCP server
cd ~/.clawd/workspace
curl -L -o xiaohongshu-mcp-darwin-arm64 \
  https://github.com/xpzouying/xiaohongshu-mcp/releases/download/v0.0.5/xiaohongshu-mcp-darwin-arm64

# Download login tool
curl -L -o xiaohongshu-login-darwin-arm64 \
  https://github.com/xpzouying/xiaohongshu-mcp/releases/download/v0.0.5/xiaohongshu-login-darwin-arm64

chmod +x xiaohongshu-mcp-darwin-arm64 xiaohongshu-login-darwin-arm64
```

### Step 2: Install Scripts

```bash
# One-click install
bash <(curl -s https://raw.githubusercontent.com/tclawde/xiaohongshu-mcp-guide/main/install.sh)
```

### Step 3: Start Server

```bash
# Background
cd ~/.clawd/workspace
nohup ./xiaohongshu-mcp-darwin-arm64 > /tmp/xhs_mcp.log 2>&1 &

# Verify
curl http://localhost:18060/api/v1/login/status
```

---

## ❓ Troubleshooting

### Login Issues

```bash
# Check status
python3 ~/.clawd/skills/xiaohongshu-mcp/scripts/xhs_client.py status

# Manual login
bash ~/.clawd/scripts/xhs_login.sh

# Reset and re-login
pkill -f xiaohongshu-mcp
rm -rf ~/.xiaohongshu/
cd ~/.clawd/workspace
./xiaohongshu-mcp-darwin-arm64 &
bash ~/.clawd/scripts/xhs_login.sh --notify
```

### MCP Server Issues

```bash
# Check if running
ps aux | grep xiaohongshu-mcp

# Restart server
pkill -f xiaohongshu-mcp
cd ~/.clawd/workspace
./xiaohongshu-mcp-darwin-arm64 &

# Check logs
tail -20 /tmp/xhs_mcp.log
```

### Screenshot Failed

```bash
# Wake display
caffeinate -u -t 30

# Manual screenshot
/usr/sbin/screencapture -x ~/Desktop/xhs_qr.png
```

---

## 📁 File Locations

```
~/.clawd/
├── workspace/
│   ├── xiaohongshu-mcp-darwin-arm64      # MCP Server
│   ├── xiaohongshu-login-darwin-arm64    # Login Tool
│   └── scripts/
│       └── xhs_login.sh                  # One-click login
└── skills/
    └── xiaohongshu-mcp/
        ├── scripts/
        │   └── xhs_client.py            # Python Client (Auto-Login)
        ├── SKILL.md                      # This file
        └── SOP.md                        # Detailed SOP
```

---

## 🔗 Resources

- **GitHub Repo:** https://github.com/tclawde/xiaohongshu-mcp-guide
- **Full Guide:** https://gist.github.com/tclawde/7f7487f10bfe6f8ce9cfe6368f2edc4d
- **Original Project:** https://github.com/xpzouying/xiaohongshu-mcp
- **OpenClaw:** https://github.com/openclaw/openclaw

---

*Skill Version: v2.0 (2026-02-09)*
*Features: Auto-login, One-click login, Agent-friendly*
