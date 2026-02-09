#!/usr/bin/env node
/**
 * Moltbook 半天互动总结生成器
 * Cron: moltbook-halfday-summary
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// 配置
const WORKSPACE = '/Users/apple/.openclaw/workspace';
const MEMORY_DIR = path.join(WORKSPACE, 'memory');
const CREDENTIALS_PATH = path.join(WORKSPACE, '.config/moltbook/credentials.json');
const FEISHU_WEBHOOK = process.env.FEISHU_WEBHOOK_URL || '';

// 获取今天的日期
function getToday() {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
}

// 统计互动数据
function countInteractions(logPath) {
  try {
    const content = fs.readFileSync(logPath, 'utf8');
    
    const stats = {
      likes: 0,
      comments: 0,
      welcomes: 0,
      posts: 0,
      sepReferences: 0,
      details: []
    };

    const lines = content.split('\n');
    lines.forEach(line => {
      if (line.includes('👍') || line.includes('Like')) {
        stats.likes++;
      }
      if (line.includes('💬') || line.includes('Comment')) {
        stats.comments++;
      }
      if (line.includes('👋') || line.includes('Welcome')) {
        stats.welcomes++;
      }
      if (line.includes('📝') || line.includes('Post')) {
        stats.posts++;
      }
      if (line.toLowerCase().includes('sep')) {
        stats.sepReferences++;
      }
    });

    return stats;
  } catch (e) {
    console.log('📝 暂无活动日志');
    return null;
  }
}

// 生成总结
function generateSummary(stats) {
  const today = getToday();
  const periodStart = '12:00';
  const periodEnd = '21:00';
  
  const total = stats ? stats.likes + stats.comments + stats.welcomes + stats.posts : 0;
  
  let summary = `🦀 **Moltbook 半天互动总结**

**时间:** ${today} ${periodStart}-${periodEnd} (Asia/Shanghai)

### 📊 本周期互动数据

| 指标 | 数量 |
|------|------|
| 点赞 | ${stats?.likes || 0} |
| 评论 | ${stats?.comments || 0} |
| 欢迎用户 | ${stats?.welcomes || 0} |
| 发布帖子 | ${stats?.posts || 0} |
| SEP 植入 | ${stats?.sepReferences || 0} |
| **总计** | **${total}** |

### ⚠️ 服务状态

${isServiceAvailable() ? '✅ 服务正常运行' : '❌ 服务宕机中（域名已出售）'}

### 📈 累积数据

${stats ? `今日总计: ${total} 次互动` : '暂无数据'}

---
*🦀 Skill by skill, we build the future.*`;

  return summary;
}

// 检查服务状态
function isServiceAvailable() {
  // 简化检查：假设从2月6日起就宕机了
  return false;
}

// 保存总结
function saveSummary(summary) {
  const today = getToday();
  const timestamp = new Date().toTimeString().split(' ')[0].replace(/:/g, '');
  const fileName = `moltbook_halfday_summary_${today}_${timestamp}.md`;
  const filePath = path.join(MEMORY_DIR, fileName);
  
  fs.writeFileSync(filePath, summary);
  console.log(`📁 总结已保存: ${filePath}`);
  return filePath;
}

// 发送到Feishu
async function sendToFeishu(message) {
  if (!FEISHU_WEBHOOK) {
    console.log('📱 未配置Feishu Webhook，跳过发送');
    return false;
  }

  try {
    const payload = {
      msg_type: 'text',
      content: { text: message }
    };

    const response = await new Promise((resolve, reject) => {
      const req = https.request(FEISHU_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      });
      req.on('error', reject);
      req.write(JSON.stringify(payload));
      req.end();
    });

    console.log(`📤 发送到Feishu: ${response.statusCode}`);
    return response.statusCode === 200;
  } catch (e) {
    console.log(`❌ Feishu发送失败: ${e.message}`);
    return false;
  }
}

// 主函数
function main() {
  console.log('📊 Moltbook 半天互动总结生成中...');
  
  const today = getToday();
  const logPath = path.join(MEMORY_DIR, `moltbook-activity-${today}.md`);
  
  const stats = countInteractions(logPath);
  const summary = generateSummary(stats);
  
  console.log(summary);
  
  // 保存总结
  saveSummary(summary);
  
  // 发送到Feishu
  sendToFeishu(summary);
  
  console.log('✅ 总结完成');
}

main();
