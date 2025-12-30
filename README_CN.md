# hexo-butterfly-updates-heatmap

[English](./README.md) | 中文文档

这是一个专为 [Hexo Butterfly](https://github.com/jenrey/hexo-theme-butterfly) 主题设计，但也兼容 **Hexo Fluid** 及其他 Hexo 主题的热力图插件。它参考 **语雀 (Yuque)** 的热力图风格展示您的文章更新频率（优先使用 `updated` 更新时间，无更新时间则回退使用 `date` 创建时间），并支持查看历史年份的存档。

![preview](assets/preview.png)

## 功能特点

- **更新活跃度热力图**：直观展示每日的博客更新动态。
- **优先识别更新时间**：逻辑优先读取文章的 `updated` 字段，非常适合经常维护和更新旧文的博主。
- **历史归档支持**：点击“显示更多”按钮即可展开查看过往年份的热力图数据。
- **多主题色支持**：内置 6 种颜色主题（绿色、蓝色、粉色、红色、橙色、紫色）。
- **暗黑模式适配**：完美适配 Butterfly 主题的夜间模式，并为其他主题提供基于 CSS 媒体查询的自动暗黑模式支持。
- **灵活部署**：既可以在 Markdown 中作为标签插件使用，也可以在 Pug/EJS 模板中作为 Helper 函数调用。
- **广泛兼容**：原生支持 Butterfly CSS 变量，同时也内置了回退样式以适配 Fluid 等其他主题。

## 安装方法

1.  下载本仓库代码。
2.  将 `hexo-butterfly-updates-heatmap` 文件夹放入您的 Hexo 博客根目录的 `node_modules` 文件夹中，或者放在根目录下并通过本地路径安装：

```bash
npm install ./hexo-butterfly-updates-heatmap
```

## 配置说明

在您的 `_config.butterfly.yml`（或者站点 `_config.yml`）中添加以下配置：

```yaml
updates_settings:
  enable: true
  title: '创作指数'       # 热力图左上角显示的标题
  color_scheme: 'green'   # 主题色可选: green, blue, red, orange, purple
  limit_months: 3         # (可选) 用于配合您自己的时间轴逻辑，本插件主要使用前两项
  empty_history_msg: '博客还没有满1岁呢～～' # 当没有跨年历史数据时显示的提示语
```

## 使用方法

### 方法 1：在 Markdown 文章/页面中使用（通用）

您可以在任何 Markdown 文件（例如 `source/about/index.md`）中直接插入标签：

```markdown
{% butterfly_heatmap %}
```

### 方法 2：在 Pug/EJS 模板中使用

如果您在自定义主题布局：

**Butterfly 主题 (Pug):**
```pug
!= butterfly_heatmap()
```

**Fluid 主题 (EJS):**
```ejs
<%- butterfly_heatmap() %>
```

## 用户指南

### Butterfly 主题用户（原生支持）

本插件专为 [Hexo Butterfly](https://github.com/jenrey/hexo-theme-butterfly) 主题原生设计。

1.  **安装**：参考上文安装步骤。
2.  **配置**：将 `updates_settings` 配置块添加到您的 `_config.butterfly.yml`（或站点 `_config.yml`）中。
3.  **使用**：
    *   **Markdown**：在任意页面或文章中添加 `{% butterfly_heatmap %}`。
    *   **Pug 布局**：在自定义布局文件（如 `updates.pug`）中使用 `!= butterfly_heatmap()`。
    *   **样式**：自动继承 Butterfly 的 CSS 变量（背景、字体、阴影）和夜间模式设置，无需额外配置。

### Fluid 主题用户（及其他主题）

本插件开箱即支持 [Hexo Fluid](https://github.com/fluid-dev/hexo-theme-fluid) 及其他主题。

1.  **安装**：参考上文安装步骤。
2.  **配置**：将 `updates_settings` 配置块添加到您的 `_config.fluid.yml`（或站点 `_config.yml`）中。
3.  **使用**：
    *   **方案 A (简单)**：新建一个页面（如 `source/updates/index.md`），并在正文中写入 `{% butterfly_heatmap %}`。
    *   **方案 B (自定义布局)**：在自定义布局文件中使用 `<%- butterfly_heatmap() %>` 进行注入。
4.  **样式**：插件包含回退样式，对于不使用 Butterfly CSS 变量的主题（如 Fluid），它会自动使用标准的 CSS 样式并适配日间/夜间模式。

## 开源协议

MIT
