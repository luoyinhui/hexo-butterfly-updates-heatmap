# hexo-butterfly-updates-heatmap

[English](./README.md) | 中文文档

这是一个专为 [Hexo Butterfly](https://github.com/jenrey/hexo-theme-butterfly) 主题设计的热力图插件。它能像 GitHub 贡献图一样展示您的文章更新频率（优先使用 `updated` 更新时间，无更新时间则回退使用 `date` 创建时间），并支持查看历史年份的存档。

![preview](https://github.com/user-attachments/assets/placeholder)

## 功能特点

- **更新活跃度热力图**：直观展示每日的博客更新动态。
- **优先识别更新时间**：逻辑优先读取文章的 `updated` 字段，非常适合经常维护和更新旧文的博主。
- **历史归档支持**：点击“显示更多”按钮即可展开查看过往年份的热力图数据。
- **多主题色支持**：内置 6 种颜色主题（绿色、蓝色、粉色、红色、橙色、紫色）。
- **暗黑模式适配**：完美适配 Butterfly 主题的夜间模式。
- **灵活部署**：既可以在 Markdown 中作为标签插件使用，也可以在 Pug/EJS 模板中作为 Helper 函数调用。

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

### 方法 1：在 Markdown 文章/页面中使用

您可以在任何 Markdown 文件（例如 `source/about/index.md`）中直接插入标签：

```markdown
{% butterfly_heatmap %}
```

### 方法 2：在 Pug/EJS 模板中使用

如果您在自定义主题布局（例如新建了一个 `updates.pug` 页面），可以使用 Helper 函数：

```pug
!= butterfly_heatmap()
```

## 开源协议

MIT
