# hexo-butterfly-updates-heatmap (V2)

[English](./README.md) | 中文文档

这是一个专为 [Hexo Butterfly](https://github.com/jenrey/hexo-theme-butterfly) 主题设计（也兼容 **Hexo Fluid** 及其他主题）的**增强型热力图与时间轴插件**。

**V2 版本重大更新**：引入了**持久化历史记录**机制。
不再依赖 Markdown 文件中的 `updated` 字段，而是将每日的更新记录（数量与文章列表）永久固化在 JSON 文件中。即使您修改了文章文件，历史记录也永远不会丢失或被覆盖。

![preview](assets/preview.png)

## V2 核心功能

1.  **持久化热力图**：自动记录每日更新数量，生成 GitHub 风格的贡献热力图。
2.  **永久时间轴**：替代主题自带的不稳定时间轴，提供一个**永久固化**的更新历史列表。
3.  **每日快照**：插件会在每天第一次运行时，自动将“昨天”的更新情况（文章标题、链接）存档到历史文件。
4.  **无感迁移**：支持从旧版（依赖 `updated` 字段）平滑过渡到新版（依赖 JSON 历史库）。

## 安装方法

1.  下载本仓库代码（两种方式）
    -   **方式一**：下载 ZIP 包解压，将 `hexo-butterfly-updates-heatmap` 文件夹放入您的博客根目录（与 `source`, `themes` 同级）。
    -   **方式二**：在博客根目录下运行：
        ```bash
        git clone https://github.com/luoyinhui/hexo-butterfly-updates-heatmap.git
        ```
2.  安装依赖：
    ```bash
    npm install moment
    ```

## 配置说明

在您的 `_config.butterfly.yml`（或者站点 `_config.yml`）中添加以下配置：

```yaml
updates_settings:
  enable: true
  title: '创作指数'       # 热力图左上角显示的标题
  color_scheme: 'green'   # 主题色可选: green, blue, pink, red, orange, purple
  empty_history_msg: '博客还没有满1岁呢～～' # 当没有跨年历史数据时显示的提示语
  thresholds: [1, 2, 3, 4] # (可选) 颜色分级阈值。例如 [1, 2, 3, 4] 代表 >=1篇为Lv1...
```

## 使用方法

### 1. 渲染热力图
在任意 Markdown 文章（推荐新建 `source/updates/index.md`）中，插入：
```markdown
{% butterfly_heatmap %}
```

### 2. 渲染更新时间轴
在同一文件中，插入以下标签即可显示永久固化的历史更新列表：
```markdown
{% butterfly_timeline %}
```

**推荐的页面结构 (`source/updates/index.md`)**：
```markdown
---
title: 更新
date: 2025-12-09 00:00:00
type: updates
layout: page
---

{% butterfly_heatmap %}
{% butterfly_timeline %}
```

## 迁移指南 (从 V1 过渡到 V2)

如果您之前使用旧版插件（依赖 Markdown 文件的 `updated` 字段），请按照以下步骤升级，以获得数据持久化保护：

1.  **备份**：请先备份您的博客源文件。
2.  **替换文件**：用新版插件文件夹替换旧版。
3.  **运行迁移工具**：
    在博客根目录下打开终端，运行：
    ```bash
    node hexo-butterfly-updates-heatmap/scripts/migrate_v1_to_v2.js
    ```
    **脚本作用**：
    *   扫描所有文章，提取现有的 `updated` 时间。
    *   将这些历史记录写入 `lib/history_timeline.json` 永久保存。
    *   (可选) 您可以在脚本中配置是否自动删除 Markdown 文件中的 `updated` 字段（默认不删除，手动管理更安全）。

4.  **更新页面**：修改您的更新页 Markdown，使用上述的新标签 (`{% butterfly_timeline %}`) 替换原来的主题自带列表。

## 文件结构说明
*   `index.js`: 插件核心逻辑。
*   `lib/history_data.json`: 存储热力图的每日计数（只存数量）。
*   `lib/history_timeline.json`: 存储每日更新的文章详情（标题、链接、日期）。**这是您的核心资产，请勿误删。**
*   `lib/last_run.json`: 记录最后一次运行日期，用于触发每日快照。

## 开源协议

MIT
