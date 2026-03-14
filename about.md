---
layout: default
title: 关于
---

<div class="container" style="max-width: 800px; padding: 2rem 1rem;">
    <!-- 头部横幅 -->
    <div style="text-align: center; margin-bottom: 3rem;">
        <h1 class="section-title" style="font-size: 2.5rem; margin-bottom: 1rem;">关于界维互动</h1>
        <p style="color: var(--text-secondary); font-size: 1.2rem; line-height: 1.6; max-width: 600px; margin: 0 auto;">
            专注于 <span style="color: var(--accent-primary);">AI 智能体编排</span>、<span style="color: var(--accent-secondary);">虚拟陪伴交互开发</span> 与 <span style="color: #478cbf;">Godot 引擎底层架构</span>的纯粹极客与独立创作者。
        </p>
    </div>

    <!-- 个人介绍区块 -->
    <div style="background: var(--bg-surface); backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border); border-radius: 16px; padding: 2rem; margin-bottom: 3rem; transform: translateY(0); transition: var(--transition-smooth);" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--text-primary); border-bottom: 1px solid var(--glass-border); padding-bottom: 0.5rem;">
            👋 很高兴认识你
        </h2>
        <div style="color: var(--text-secondary); line-height: 1.8;">
            <p style="margin-bottom: 1rem;">
                你好！我是 <strong>Jieice (界维互动)</strong>，一个热爱探索前沿技术的全栈开发者和创作者。
            </p>
            <p style="margin-bottom: 1rem;">
                在这里，我不仅是在“做游戏”，更多的是在探索人机交互的未来边界。我相信未来的软件不仅仅是冰冷的工具，而是具有记忆、视觉甚至情感的虚拟伙伴（正如我的核心开源项目 <a href="{{ '/games/my-neuro/' | relative_url }}" style="color: var(--accent-primary); text-decoration: none;">My Neuro</a> 所努力实现的那样）。
            </p>
            <p>
                我的日常工作涵盖了从深入研究开源大语言模型 (LLM)，到为 Godot 引擎编写高性能 C++ 拓展插件；从利用 Python 构建复杂的多 Agent 协作系统，到使用前端框架打磨极速响应的用户界面。
            </p>
        </div>
    </div>

    <!-- 硬核技能点 -->
    <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; text-align: center;">🛠️ 核心技术栈</h2>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
        <!-- 技能卡片 1 -->
        <div style="background: rgba(43, 48, 60, 0.4); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🧠</div>
            <h3 style="margin-bottom: 0.5rem; color: var(--accent-primary);">AI 智能体开发</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">
                LLM 提示工程, RAG 架构, 语音克隆(TTS), 视觉识别(VLM), Agentic 框架编排
            </p>
        </div>

        <!-- 技能卡片 2 -->
        <div style="background: rgba(43, 48, 60, 0.4); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">⚙️</div>
            <h3 style="margin-bottom: 0.5rem; color: #478cbf;">游戏引擎底层</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">
                Godot 4.x 开发, C++ GDExtension, 物理交互模拟, 性能优化级渲染管线
            </p>
        </div>

        <!-- 技能卡片 3 -->
        <div style="background: rgba(43, 48, 60, 0.4); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">👧</div>
            <h3 style="margin-bottom: 0.5rem; color: var(--accent-secondary);">虚拟角色 (Live2D)</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">
                原生 Cubism SDK (C++/JS), LipSync 算法融合, 角色物理动态配置与互动开发
            </p>
        </div>
    </div>

    <!-- 联系方式 -->
    <div style="background: var(--bg-surface); backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border); border-radius: 16px; padding: 2rem; text-align: center;">
        <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">📫 建立连接</h2>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">
            无论是探讨前沿的 AI 技术、合作开发有趣的项目，还是单纯地交流技术心得，都欢迎通过以下方式找到我！
        </p>
        
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem;">
            <a href="https://github.com/Jieice" target="_blank" class="btn" style="display: flex; align-items: center; gap: 0.5rem; background: #24292e;">
                <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                GitHub
            </a>
            
            <a href="mailto:3348149202@qq.com" class="btn btn-secondary" style="display: flex; align-items: center; gap: 0.5rem;">
                ✉️ 发送邮件
            </a>

            <!-- 哔哩哔哩链接 -->
            <a href="https://space.bilibili.com/27840409" target="_blank" class="btn btn-secondary" style="display: flex; align-items: center; gap: 0.5rem; background-color: rgba(251, 114, 153, 0.1); border-color: rgba(251, 114, 153, 0.3); color: #fb7299;">
                📺 Bilibili 频道
            </a>
            
            <!-- 抖音链接 -->
            <a href="https://v.douyin.com/bZLdhqIbKFQ/" target="_blank" class="btn btn-secondary" style="display: flex; align-items: center; gap: 0.5rem; background-color: rgba(254, 44, 85, 0.1); border-color: rgba(254, 44, 85, 0.3); color: #fe2c55;">
                🎵 抖音主页
            </a>
        </div>
    </div>
</div>
