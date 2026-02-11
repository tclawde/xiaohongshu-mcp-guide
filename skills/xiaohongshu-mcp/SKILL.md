# 小红书 MCP Skill

集成 xiaohongshu-mcp 服务器，实现小红书内容发布、搜索、互动等功能。

## 登录流程（修复版）

小红书更新了登录页面，需要从探索页面点击登录按钮：

```bash
# 运行登录脚本（二维码发送到飞书）
bash ~/.openclaw/workspace/scripts/xhs_login.sh
```

登录流程：
1. 自动打开浏览器导航到小红书探索页面
2. 点击登录按钮触发二维码弹窗
3. 截图二维码发送到飞书
4. 用户扫码后自动保存 cookies

## 安装

```bash
# 下载 MCP 服务器
cd ~/.openclaw/workspace
curl -L -o xiaohongshu-mcp-darwin-arm64 https://github.com/xpzouying/xiaohongshu-mcp/releases/download/v0.0.8/xiaohongshu-mcp-darwin-arm64
chmod +x xiaohongshu-mcp-darwin-arm64

# 启动 MCP 服务
./xiaohongshu-mcp-darwin-arm64 &
```

## 使用示例

```bash
# 检查登录状态
curl http://localhost:18060/api/v1/login/status

# 发布图文
curl -X POST http://localhost:18060/api/v1/publish \
  -H "Content-Type: application/json" \
  -d '{"title": "标题", "content": "正文", "images": ["/path/to/image.jpg"]}'
```

## 常见问题

**登录失效？**
```bash
rm ~/.openclaw/workspace/cookies.json
bash ~/.openclaw/workspace/scripts/xhs_login.sh
```
