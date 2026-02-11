#!/usr/bin/env python3
"""
小红书登录 SOP - 修复版：先点击登录按钮，再截图二维码
"""

import asyncio
import json
import os
import sys
from pathlib import Path

from playwright.async_api import async_playwright

COOKIES_PATH = Path.home() / ".openclaw" / "workspace" / "xiaohongshu_cookies_live.json"
WORKSPACE_DIR = Path.home() / ".openclaw" / "workspace"

async def login_and_notify():
    """登录并截图发送到飞书 - 修复版"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=False,
            args=["--no-sandbox", "--disable-setuid-sandbox"]
        )
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        )
        page = await context.new_page()

        print("\n" + "=" * 50)
        print("  🦀 小红书自动登录（修复版）")
        print("=" * 50 + "\n")

        # 1. 导航到探索页面
        print("🚀 导航到探索页面...")
        await page.goto("https://www.xiaohongshu.com/explore")
        await page.wait_for_load_state("networkidle")
        await asyncio.sleep(2)

        # 2. 检查是否已登录
        if await check_login_status(page):
            print("✅ 已登录！保存 cookies...")
            await save_cookies(context, page)
            await browser.close()
            return True

        # 3. 点击登录按钮
        print("👆 点击登录按钮...")
        login_selectors = [
            "text=登录",
            "button:has-text('登录')",
            ".login-btn",
            "[class*='login']",
            ".user-name"
        ]
        for selector in login_selectors:
            try:
                btn = await page.query_selector(selector)
                if btn:
                    await btn.click()
                    print(f"✅ 点击了登录按钮: {selector}")
                    break
            except:
                continue

        # 4. 等待二维码出现
        print("⏳ 等待二维码加载...")
        await asyncio.sleep(3)

        # 5. 截图发送到飞书
        print("📸 截图并发送到飞书...")
        screenshot_path = WORKSPACE_DIR / "xhs_login_qr.png"
        await page.screenshot(path=str(screenshot_path))

        os.system(f'''
            openclaw message send --channel feishu --target "ou_715534dc247ce18213aee31bc8b224cf" --media "{screenshot_path}" --message "🦀 **小红书登录二维码**\n\n请用小红书 App 扫码登录。\n\n扫码后回复'已登录'"
        ''')
        print("✅ 二维码已发送到飞书\n")
        print("📱 请扫码登录...")
        print("   1. 打开小红书 App")
        print("   2. 扫描屏幕上的二维码")
        print("   3. 扫码后告诉我'已登录'\n")

        # 6. 等待用户确认登录
        input("⏳ 按 Enter 确认登录完成后继续...")

        # 7. 检查登录状态并保存 cookies
        if await check_login_status(page):
            print("✅ 检测到登录成功！保存 cookies...")
        await save_cookies(context, page)
        await browser.close()
        return True

async def check_login_status(page) -> bool:
    """检查是否已登录"""
    logged_in_selectors = [
        ".main-container .user .link-wrapper .channel",
        ".user-name",
        "[class*='user'] [class*='avatar']",
    ]
    for selector in logged_in_selectors:
        try:
            el = await page.query_selector(selector)
            if el:
                return True
        except:
            continue
    return False

async def save_cookies(context, page):
    """保存 cookies"""
    cookies = await context.cookies()
    with open(COOKIES_PATH, 'w') as f:
        json.dump(cookies, f, indent=2)
    print(f"💾 Cookies 已保存: {COOKIES_PATH}")

def main():
    asyncio.run(login_and_notify())

if __name__ == "__main__":
    main()
