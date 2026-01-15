# hexo-butterfly-updates-heatmap (V2)

[中文文档](./README_CN.md)

A Hexo plugin designed for the [Hexo Butterfly](https://github.com/jenrey/hexo-theme-butterfly) theme (also compatible with **Hexo Fluid** and others) that provides an **Enhanced Heatmap and Persistent Timeline**.

**Major Update (V2)**: Introduces **Persistent History**.
It no longer relies solely on the `updated` front-matter field in Markdown files. Instead, it permanently snapshots daily update records (counts and article lists) into JSON files. Your history is preserved even if you modify article files later.

![preview](assets/preview.png)

## V2 Key Features

1.  **Persistent Heatmap**: Automatically records daily update counts to generate a GitHub-style contribution graph.
2.  **Persistent Timeline**: Replaces the theme's default volatile timeline with a **permanently fixed** history list.
3.  **Daily Snapshots**: Automatically archives "yesterday's" updates (titles, links) into history files on the first run of each new day.
4.  **Seamless Migration**: Supports smooth transition from V1 (dependent on `updated` fields) to V2 (JSON-based history).

## Prerequisites

1.  **Hexo Blog Framework**
2.  **hexo-abbrlink Plugin** (**Required**): The "Persistent Timeline" feature relies on the `abbrlink` field to generate stable article links. If your posts lack `abbrlink`, the migration script will skip them.
    *   Install: `npm install hexo-abbrlink --save`
    *   Config: Ensure abbrlink is enabled in your `_config.yml`.

## Installation

1.  Download the code (Two methods):
    -   **Method 1**: Download ZIP, extract, and place the `hexo-butterfly-updates-heatmap` folder in your blog root (next to `source`, `themes`).
    -   **Method 2**: Clone into root:
        ```bash
        git clone https://github.com/luoyinhui/hexo-butterfly-updates-heatmap.git
        ```
2.  Install dependencies:
    ```bash
    npm install moment
    ```

## Configuration

Add the following to your `_config.butterfly.yml` (or site `_config.yml`):

```yaml
updates_settings:
  enable: true
  title: 'Contribution'   # Title for heatmap
  color_scheme: 'green'   # Theme colors: green, blue, pink, red, orange, purple
  empty_history_msg: 'No history yet.' # Message when no past year data exists
  thresholds: [1, 2, 3, 4] # (Optional) Color levels. e.g. >=1 is Lv1...
```

## Usage

### 1. Render Heatmap
In any Markdown file (recommended: `source/updates/index.md`), insert:
```markdown
{% butterfly_heatmap %}
```

### 2. Render Timeline
In the same file, insert this tag to display the persistent history list:
```markdown
{% butterfly_timeline %}
```

**Recommended Page Structure (`source/updates/index.md`)**:
```markdown
---
title: Updates
date: 2025-12-09 00:00:00
type: updates
layout: page
---

{% butterfly_heatmap %}
{% butterfly_timeline %}
```

## Migration Guide (V1 -> V2)

If you are upgrading from V1 (which relied on `updated` fields), follow these steps to secure your history:

1.  **Backup**: Backup your blog source files.
2.  **Replace**: Overwrite the old plugin folder with the new one.
3.  **Run Migration Tool**:
    Open a terminal in your blog root and run:
    ```bash
    node hexo-butterfly-updates-heatmap/scripts/migrate_v1_to_v2.js
    ```
    **What this does**:
    *   **Heatmap Migration**: It preserves your old `lib/history_data.json` if present. If missing, it reconstructs heatmap counts from your existing articles (updated/date).
    *   **Timeline Migration**: Scans all posts and extracts timestamps to create the persistent `lib/history_timeline.json`.
    *   (Optional) You can configure the script to remove `updated` fields from MD files (default is false for safety).

    > **Note on `updated` field**:
    > `updated` is not a mandatory Hexo field. If your posts lack it, the script will automatically fallback to the `date` (creation time) to initialize the history. Thus, the migration works seamlessly regardless of your previous field usage.

4.  **Update Page**: Modify your updates page Markdown to use the new tag (`{% butterfly_timeline %}`) instead of the theme's default list.

## File Structure
*   `index.js`: Core logic.
*   `lib/history_data.json`: Stores daily update counts (Heatmap data).
*   `lib/history_timeline.json`: Stores detailed article history (Titles, Links, Dates). **Do not delete.**
*   `lib/last_run.json`: Tracks the last execution date for snapshotting.

## Important Note

This plugin stores history data in `lib/*.json`.
*   If you clone from GitHub, these files are ignored by default (clean).
*   **If you downloaded a zip package that includes `lib/history_*.json`**: 
    *   Please **DELETE all JSON files in the `lib/` directory** before use. Otherwise, you will inherit the author's update history.
    *   After deleting, run the migration script mentioned above to generate your own history.
*   The plugin will automatically generate fresh JSON files on its first run.

## License

MIT
