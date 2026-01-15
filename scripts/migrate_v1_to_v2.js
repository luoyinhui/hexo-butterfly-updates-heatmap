const fs = require('fs');
const path = require('path');
const moment = require('moment');

/**
 * Migration Script for Hexo Butterfly Updates Heatmap (V2)
 * 
 * Usage:
 * 1. Place the plugin folder in your blog root or themes folder.
 * 2. Run this script from your blog root directory:
 *    node hexo-butterfly-updates-heatmap/scripts/migrate_v1_to_v2.js
 * 
 * Functionality:
 * - Scans all Markdown files in `source/_posts`.
 * - Extracts `updated` (or `date`) fields.
 * - Populates `lib/history_timeline.json` with historical data.
 * - (Optional) Removes `updated` fields from MD files to prevent "all today" issues in default themes,
 *   forcing reliance on the plugin's timeline.
 */

// Paths (Relative to Blog Root, assuming script is run from Blog Root)
const BLOG_ROOT = process.cwd();
const POSTS_DIR = path.join(BLOG_ROOT, 'source', '_posts');
// Plugin Lib Dir (We assume script is in /scripts, so lib is in ../lib)
const PLUGIN_LIB_DIR = path.join(__dirname, '..', 'lib');
const TIMELINE_FILE = path.join(PLUGIN_LIB_DIR, 'history_timeline.json');
const HEATMAP_FILE = path.join(PLUGIN_LIB_DIR, 'history_data.json');

// Configuration
const REMOVE_UPDATED_FIELD = false; // Default to FALSE for safety. Set to true if you want to clean up MD files.

console.log('--- Migration Tool for Updates Heatmap V2 ---');
console.log(`Blog Root: ${BLOG_ROOT}`);
console.log(`Posts Dir: ${POSTS_DIR}`);
console.log(`Plugin Lib: ${PLUGIN_LIB_DIR}`);

if (!fs.existsSync(POSTS_DIR)) {
    console.error('Error: source/_posts directory not found! Please run this script from your Hexo blog root.');
    process.exit(1);
}

if (!fs.existsSync(PLUGIN_LIB_DIR)) {
    fs.mkdirSync(PLUGIN_LIB_DIR, { recursive: true });
}

// Load existing history
let timelineData = {};
if (fs.existsSync(TIMELINE_FILE)) {
    try {
        timelineData = JSON.parse(fs.readFileSync(TIMELINE_FILE, 'utf8'));
    } catch (e) { console.error('Warning: corrupted timeline file, starting fresh.'); }
}

// Helper: Parse Front Matter
function parseFrontMatter(content) {
    const regex = /^---\n([\s\S]+?)\n---/;
    const match = content.match(regex);
    if (!match) return null;
    return match[1];
}

// Helper: Parse key-value from front matter string
function getFMValue(fmString, key) {
    const regex = new RegExp(`^${key}:\\s*(.*)$`, 'm');
    const match = fmString.match(regex);
    return match ? match[1].trim() : null;
}

// Helper: Remove updated field
function removeUpdatedField(content) {
    return content.replace(/^updated:.*$\n?/m, '');
}

// Main Process
function processFiles() {
    const files = fs.readdirSync(POSTS_DIR);
    let processedCount = 0;
    let modifiedCount = 0;

    files.forEach(file => {
        if (!file.endsWith('.md')) return;
        
        const filePath = path.join(POSTS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const fmString = parseFrontMatter(content);
        
        if (!fmString) return;

        const updated = getFMValue(fmString, 'updated');
        const abbrlink = getFMValue(fmString, 'abbrlink');
        const title = getFMValue(fmString, 'title') || file.replace('.md', '');
        const date = getFMValue(fmString, 'date');
        
        // We need `abbrlink` for the timeline links
        if (!abbrlink) {
            console.warn(`Skipping ${file}: No abbrlink found.`);
            return;
        }

        // Determine the "History Date"
        // If `updated` exists, use it. If not, maybe use `date`.
        // For migration, we mainly care about capturing existing `updated` fields before we delete them.
        let historyDateStr = null;
        if (updated) {
            historyDateStr = updated;
        } else if (date) {
            // Optional: You can choose to index 'created' dates as updates too, but usually not.
            // historyDateStr = date; 
        }

        if (historyDateStr) {
            const mDate = moment(historyDateStr);
            if (!mDate.isValid()) {
                console.warn(`Invalid date in ${file}: ${historyDateStr}`);
                return;
            }

            const dateKey = mDate.format('YYYY-MM-DD');
            const fullDate = mDate.format('YYYY-MM-DD HH:mm:ss');
            
            // 1. Add to Timeline JSON
            if (!timelineData[dateKey]) {
                timelineData[dateKey] = [];
            }
            
            // Check duplicates
            const exists = timelineData[dateKey].find(p => p.abbrlink === abbrlink);
            if (!exists) {
                // Clean title
                let cleanTitle = title;
                if ((cleanTitle.startsWith('"') && cleanTitle.endsWith('"')) || (cleanTitle.startsWith("'") && cleanTitle.endsWith("'"))) {
                    cleanTitle = cleanTitle.slice(1, -1);
                }

                timelineData[dateKey].push({
                    title: cleanTitle,
                    date: fullDate,
                    abbrlink: abbrlink,
                    link: `/posts/${abbrlink}/`
                });
                processedCount++;
            }
        }

        // 2. Remove `updated` field from file (if configured)
        if (REMOVE_UPDATED_FIELD && updated) {
            const newContent = removeUpdatedField(content);
            if (newContent !== content) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                modifiedCount++;
                console.log(`Cleaned ${file}`);
            }
        }
    });

    // Save Timeline JSON
    const sortedTimeline = {};
    Object.keys(timelineData).sort().reverse().forEach(key => {
        sortedTimeline[key] = timelineData[key];
    });
    fs.writeFileSync(TIMELINE_FILE, JSON.stringify(sortedTimeline, null, 2));
    
    console.log('------------------------------------------------');
    console.log(`Migration Complete.`);
    console.log(`- Timeline Entries Added: ${processedCount}`);
    console.log(`- Files Cleaned (updated removed): ${modifiedCount}`);
    console.log(`- History File: ${TIMELINE_FILE}`);
    console.log('------------------------------------------------');
    console.log('Next Steps:');
    console.log('1. Add "updates_settings" to your _config.butterfly.yml');
    console.log('2. Use {% butterfly_heatmap %} and {% butterfly_timeline %} in your md files.');
}

processFiles();
