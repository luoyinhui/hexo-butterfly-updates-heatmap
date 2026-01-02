# hexo-butterfly-updates-heatmap

English | [中文文档](./README_CN.md)

A heatmap plugin originally designed for the [Hexo Butterfly](https://github.com/jenrey/hexo-theme-butterfly) theme, but also compatible with **Hexo Fluid** and other Hexo themes. It visualizes your post updates activity (based on `updated` date, fallback to `date`) in a heatmap style inspired by **Yuque (语雀)**, with support for historical archives.

![preview](assets/preview.png)

## Features

- **Activity Heatmap**: Displays daily post update frequency.
- **Priority on Updates**: Logic prioritizes `updated` front-matter over `date`, perfect for tracking content maintenance.
- **Historical Archives**: "Show More" button reveals heatmaps for previous years.
- **Theme Support**: Built-in support for 6 color schemes (Green, Blue, Pink, Red, Orange, Purple).
- **Dark Mode**: Fully compatible with Butterfly's dark mode, and supports auto-dark mode for other themes via CSS media query fallback.
- **Flexible Placement**: Use as a Tag Plugin in Markdown or a Helper in Pug/EJS templates.
- **Broad Compatibility**: Native support for Butterfly CSS variables, with fallback styles for other themes like Fluid.

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
  color_scheme: 'green'           # Options: green, blue, pink, red, orange, purple
  limit_months: 3                 # (Optional) Logic for your own timeline if needed
  empty_history_msg: 'No history yet!' # Message shown when no past years exist
  thresholds: [1, 2, 3, 4]        # (Optional) Count for each level. [1, 2, 3, 4] means >=1 is Lv1, >=2 is Lv2...
```

## Usage

### Method 1: In Markdown Posts/Pages (Universal)

You can insert the heatmap in any Markdown file (e.g., `source/about/index.md`) using the tag:

```markdown
{% butterfly_heatmap %}
```

### Method 2: In Pug/EJS Templates

If you are customizing the theme layout:

**For Butterfly (Pug):**
```pug
!= butterfly_heatmap()
```

**For Fluid (EJS):**
```ejs
<%- butterfly_heatmap() %>
```

## User Guides

### For Hexo Butterfly Users (Native Support)

This plugin is designed natively for the [Hexo Butterfly](https://github.com/jenrey/hexo-theme-butterfly) theme.

1.  **Installation**: Follow the installation steps above.
2.  **Configuration**: Add the `updates_settings` block to your `_config.butterfly.yml` (or site `_config.yml`).
3.  **Usage**:
    *   **In Markdown**: Add `{% butterfly_heatmap %}` to any page or post.
    *   **In Layout**: Create a custom page layout (e.g. `updates.pug`) and use `!= butterfly_heatmap()`.
    *   **Styles**: It automatically inherits Butterfly's CSS variables (backgrounds, fonts, shadows) and dark mode settings. No extra CSS configuration needed.

### For Hexo Fluid Users (and other themes)

This plugin also works out-of-the-box with [Hexo Fluid](https://github.com/fluid-dev/hexo-theme-fluid) and other themes.

1.  **Installation**: Follow the installation steps above.
2.  **Configuration**: Add the `updates_settings` block to your `_config.fluid.yml` (or site `_config.yml`).
3.  **Usage**:
    *   **Option A (Easy)**: Create a new page (e.g., `source/updates/index.md`) and add `{% butterfly_heatmap %}` in the content.
    *   **Option B (Custom Layout)**: Inject it into a custom layout file using `<%- butterfly_heatmap() %>`.
4.  **Styles**: The plugin includes fallback styles for themes that don't use Butterfly's CSS variables. It will automatically adapt to light/dark modes using standard CSS practices.

## License

MIT
