# hexo-butterfly-updates-heatmap

English | [中文文档](./README_CN.md)

A heatmap plugin specifically designed for the [Hexo Butterfly](https://github.com/jenrey/hexo-theme-butterfly) theme. It visualizes your post updates activity (based on `updated` date, fallback to `date`) in a GitHub-style heatmap, with support for historical archives.

![preview](https://github.com/user-attachments/assets/placeholder)

## Features

- **Activity Heatmap**: Displays daily post update frequency.
- **Priority on Updates**: Logic prioritizes `updated` front-matter over `date`, perfect for tracking content maintenance.
- **Historical Archives**: "Show More" button reveals heatmaps for previous years.
- **Theme Support**: Built-in support for 6 color schemes (Green, Blue, Pink, Red, Orange, Purple).
- **Dark Mode**: Fully compatible with Butterfly's dark mode.
- **Flexible Placement**: Use as a Tag Plugin in Markdown or a Helper in Pug/EJS templates.

## Installation

1.  Download this repository.
2.  Place the `hexo-butterfly-updates-heatmap` folder into your Hexo blog's `node_modules` directory, OR install it from a local path:

```bash
npm install ./hexo-butterfly-updates-heatmap
```

*(Assuming you place the folder in your blog root)*

## Configuration

Add the following configuration to your `_config.butterfly.yml` (or `_config.yml`):

```yaml
updates_settings:
  enable: true
  title: 'Contribution Activity'  # Title shown above the heatmap
  color_scheme: 'green'           # Options: green, blue, red, orange, purple
  limit_months: 3                 # (Optional) Logic for your own timeline if needed
  empty_history_msg: 'No history yet!' # Message shown when no past years exist
```

## Usage

### Method 1: In Markdown Posts/Pages

You can insert the heatmap in any Markdown file (e.g., `source/about/index.md`) using the tag:

```markdown
{% butterfly_heatmap %}
```

### Method 2: In Pug/EJS Templates

If you are customizing the theme layout (e.g., creating a custom `updates.pug`), use the helper function:

```pug
!= butterfly_heatmap()
```

## License

MIT
