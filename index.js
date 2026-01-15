'use strict'

const pug = require('pug')
const path = require('path')
const fs = require('fs')
const moment = require('moment')

function generateHeatmap(hexo) {
  const posts = hexo.locals.get('posts').sort('updated', -1).toArray()
  const config = hexo.theme.config.updates_settings || {}
  
  const title = config.title || '创作指数'
  const colorScheme = config.color_scheme || 'green'
  const emptyHistoryMsg = config.empty_history_msg || '博客还没有满1月呢～～'
  // Default thresholds: [1, 2, 3, 4] means >=1 is level 1, >=2 is level 2, etc.
  const thresholds = config.thresholds || [1, 2, 3, 4]

  // Prepare Data
  let heatmapData = {}
  const annualPosts = []
  const currentYear = moment().year()
  
  // Calculate start date: The Sunday before or on Jan 1st
  const yearStart = moment().year(currentYear).startOf('year')
  const dayOfWeek = yearStart.day() // 0 is Sunday
  const startDate = yearStart.clone().subtract(dayOfWeek, 'days')
  
  // Calculate end date: We need 53 weeks
  const endDate = startDate.clone().add(53 * 7 - 1, 'days')

  // Auto-Archive Logic with "First Run of Day" Check
  const todayStr = moment().format('YYYY-MM-DD')
  const storagePath = path.join(__dirname, 'lib/last_run.json')
  const historyPath = path.join(__dirname, 'lib/history_data.json')
  const historyTimelinePath = path.join(__dirname, 'lib/history_timeline.json')
  
  let historyData = {}
  try {
    if (fs.existsSync(historyPath)) {
        historyData = JSON.parse(fs.readFileSync(historyPath, 'utf8'))
    }
  } catch (e) {
    console.error('Failed to load history data:', e)
  }

  // Calculate current stats from posts (Real-time)
  const calculatedData = {}
  posts.forEach(post => {
      const d = moment(post.updated || post.date).format('YYYY-MM-DD')
      calculatedData[d] = (calculatedData[d] || 0) + 1
  })

  // Check Last Run Date
  let lastRunDate = ''
  if (fs.existsSync(storagePath)) {
      try {
        lastRunDate = JSON.parse(fs.readFileSync(storagePath, 'utf8')).last_run_date
      } catch(e) {}
  }

  if (lastRunDate !== todayStr) {
      console.log(`[Butterfly Heatmap] First run of the day (${todayStr}). Archiving yesterday's data...`)
      
      // Snapshot Logic:
      let isDirty = false
      Object.keys(calculatedData).forEach(date => {
          if (date < todayStr) {
              const currentCount = calculatedData[date]
              const historyCount = historyData[date] || 0
              if (currentCount > historyCount) {
                  historyData[date] = currentCount
                  isDirty = true
              }
          }
      })
      
      // Save Heatmap History
      if (isDirty) {
          const sortedHistory = {}
          Object.keys(historyData).sort().reverse().forEach(key => {
              sortedHistory[key] = historyData[key]
          })
          fs.writeFileSync(historyPath, JSON.stringify(sortedHistory, null, 2))
          console.log('[Butterfly Heatmap] History updated.')
      }

      // --- Timeline Snapshot Logic ---
      const yesterday = moment().subtract(1, 'days')
      const yesterdayStr = yesterday.format('YYYY-MM-DD')
      
      let timelineData = {}
      try {
          if (fs.existsSync(historyTimelinePath)) {
              timelineData = JSON.parse(fs.readFileSync(historyTimelinePath, 'utf8'))
          }
      } catch (e) { console.error('Error loading history timeline:', e) }

      // Find posts for yesterday
      const yesterdayPosts = posts.filter(post => {
          const postDate = moment(post.updated || post.date)
          return postDate.format('YYYY-MM-DD') === yesterdayStr
      })

      if (yesterdayPosts.length > 0) {
          const snapshot = yesterdayPosts.map(p => ({
              title: p.title,
              date: moment(p.date).format('YYYY-MM-DD HH:mm:ss'),
              abbrlink: p.abbrlink,
              link: p.permalink
          }))
          
          // Overwrite/Set yesterday's entry
          timelineData[yesterdayStr] = snapshot
          
          // Sort and Save
          const sortedTimeline = {}
          Object.keys(timelineData).sort().reverse().forEach(key => {
              sortedTimeline[key] = timelineData[key]
          })
          
          fs.writeFileSync(historyTimelinePath, JSON.stringify(sortedTimeline, null, 2))
          console.log(`[Butterfly Heatmap] Timeline updated for ${yesterdayStr} with ${snapshot.length} posts.`)
      }

      // Update Last Run Date
      fs.writeFileSync(storagePath, JSON.stringify({ last_run_date: todayStr }, null, 2))
  }

  // Merging Logic for Display
  // For Display, we want:
  // 1. For ALL dates < Today: Use History Data (Frozen).
  // 2. For Today: Use Real-time Calculated Data.
  
  // Merge into heatmapData (which is used by template)
  // Clear heatmapData first or just overwrite?
  // We should start with historyData.
  
  heatmapData = {} // Reset
  
  // 1. Load History (Past)
  Object.keys(historyData).forEach(date => {
      // Only include dates for current year? Or all?
      // Template filters by year usually.
      if (date.startsWith(currentYear.toString())) {
          heatmapData[date] = historyData[date]
      }
  })

  // Populate annualPosts from historyData for past years (Fix for missing updated fields)
  // Since we deleted updated fields, `posts` loop below won't find past years.
  // We must reconstruct the year structure from historyData.
  const pastYears = new Set();
  Object.keys(historyData).forEach(date => {
      const y = moment(date).year();
      if (y < currentYear) {
          pastYears.add(y);
      }
  });
  
  pastYears.forEach(y => {
      let group = annualPosts.find(p => p.year === y);
      if (!group) {
          group = { year: y, posts: [] }; // Posts array can be empty, template uses historyData for counts
          annualPosts.push(group);
      }
  });

  // 2. Load Today (Real-time)
  // Note: historyData might contain "Today" if we ran script multiple times?
  // No, the snapshot logic only writes `date < todayStr`.
  // So historyData should NOT contain Today.
  
  if (calculatedData[todayStr]) {
      heatmapData[todayStr] = calculatedData[todayStr]
  }

  posts.forEach(post => {
    // Use updated date if available, otherwise fallback to date
    const postDate = moment(post.updated || post.date)
    
    // Annual Heatmap Data Collection (For Past Years)
    const y = postDate.year()
    if (y < currentYear) {
      let group = annualPosts.find(p => p.year === y)
      if (!group) {
        group = { year: y, posts: [] }
        annualPosts.push(group)
      }
      group.posts.push(post)
    }
    
    // Note: We already populated heatmapData for the current year above using `historyData` and `calculatedData`.
    // So we don't need to accumulate it again here.
  })
  
  // No need to merge history data again (it was done above)
  // And no need to sort annualPosts here if we sort it later? 
  // Wait, annualPosts.sort was at the end.
  
  annualPosts.sort((a, b) => b.year - a.year)

  // Compile Pug Template
  const templatePath = path.join(__dirname, 'lib/heatmap.pug')
  const html = pug.renderFile(templatePath, {
    title,
    colorScheme,
    emptyHistoryMsg,
    thresholds,
    posts,
    heatmapData,
    annualPosts,
    currentYear,
    startDate,
    endDate,
    moment,
    historyData // Pass history data to template
  })

  return html
}

// Register as a Tag Plugin (for Markdown)
hexo.extend.tag.register('butterfly_heatmap', function (args) {
  return generateHeatmap(hexo)
})

// Register as a Helper (for Pug/EJS templates)
hexo.extend.helper.register('butterfly_heatmap', function () {
  return generateHeatmap(hexo)
})

// Inject CSS
hexo.extend.injector.register('head_end', () => {
  const cssPath = path.join(__dirname, 'lib/heatmap.css')
  const cssContent = fs.readFileSync(cssPath, 'utf8')
  return `<style>${cssContent}</style>`
})

// Inject JS
hexo.extend.injector.register('body_end', () => {
  const jsPath = path.join(__dirname, 'lib/heatmap.js')
  const jsContent = fs.readFileSync(jsPath, 'utf8')
  return `<script>${jsContent}</script>`
})

// Register butterfly_timeline tag
hexo.extend.tag.register('butterfly_timeline', function(args) {
  const timelinePath = path.join(__dirname, 'lib/history_timeline.json');
  let data = {};
  try {
      if (fs.existsSync(timelinePath)) {
          data = JSON.parse(fs.readFileSync(timelinePath, 'utf8'));
      }
  } catch(e) { return 'Error loading timeline data'; }

  // Use Butterfly Theme's "article-sort" class for styling
  let html = '<div class="butterfly-timeline-container">';
  html += '<div style="font-size: 1.2em; font-weight: bold; margin-bottom: 10px; margin-left: 10px;">最近更新</div>';
  html += '<div class="article-sort">';
  const dates = Object.keys(data).sort().reverse(); 
  
  dates.forEach(date => {
      html += `<div class="article-sort-item year">${date}</div>`;
      data[date].forEach(post => {
          html += `<div class="article-sort-item">`;
          html += `<div class="article-sort-item-info">`;
          html += `<a class="article-sort-item-title" href="${post.link}" title="${post.title}">${post.title}</a>`;
          html += `</div></div>`;
      });
  });
  html += '</div></div>';
  return html;
});

// Register butterfly_timeline helper (for Pug) - Same implementation as tag
hexo.extend.helper.register('butterfly_timeline', function() {
  const timelinePath = path.join(__dirname, 'lib/history_timeline.json');
  let data = {};
  try {
      if (fs.existsSync(timelinePath)) {
          data = JSON.parse(fs.readFileSync(timelinePath, 'utf8'));
      }
  } catch(e) { return 'Error loading timeline data'; }

  // Merge "Today's" Real-time Updates (Duplicate Logic for Helper)
  const todayStr = moment().format('YYYY-MM-DD');
  const posts = hexo.locals.get('posts');
  const todayPosts = [];
  posts.forEach(post => {
      const d = moment(post.updated || post.date).format('YYYY-MM-DD');
      if (d === todayStr) {
          todayPosts.push({
              title: post.title,
              link: post.permalink,
              date: moment(post.updated || post.date).format('YYYY-MM-DD HH:mm:ss')
          });
      }
  });
  if (todayPosts.length > 0) {
      if (!data[todayStr]) data[todayStr] = [];
      const existingTitles = new Set(data[todayStr].map(p => p.title));
      todayPosts.forEach(p => {
          if (!existingTitles.has(p.title)) data[todayStr].push(p);
      });
  }

  let html = '<div class="butterfly-timeline-container">';
  html += '<div style="font-size: 1.2em; font-weight: bold; margin-bottom: 10px; margin-left: 10px;">最近更新</div>';
  html += '<div class="article-sort">';
  const dates = Object.keys(data).sort().reverse(); 
  
  dates.forEach(date => {
      html += `<div class="article-sort-item year">${date}</div>`;
      data[date].forEach(post => {
          html += `<div class="article-sort-item">`;
          html += `<div class="article-sort-item-info">`;
          html += `<a class="article-sort-item-title" href="${post.link}" title="${post.title}">${post.title}</a>`;
          html += `</div></div>`;
      });
  });
  html += '</div></div>';
  return html;
});
