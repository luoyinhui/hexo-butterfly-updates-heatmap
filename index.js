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
  const heatmapData = {}
  const annualPosts = []
  const currentYear = moment().year()
  
  // Calculate start date: The Sunday before or on Jan 1st
  const yearStart = moment().year(currentYear).startOf('year')
  const dayOfWeek = yearStart.day() // 0 is Sunday
  const startDate = yearStart.clone().subtract(dayOfWeek, 'days')
  
  // Calculate end date: We need 53 weeks
  const endDate = startDate.clone().add(53 * 7 - 1, 'days')

  posts.forEach(post => {
    // Use updated date if available, otherwise fallback to date
    const postDate = moment(post.updated || post.date)
    
    // Heatmap Data (Current Year)
    if (postDate.year() === currentYear) {
      const dStr = postDate.format('YYYY-MM-DD')
      heatmapData[dStr] = (heatmapData[dStr] || 0) + 1
    }

    // Annual Heatmap Data Collection
    const y = postDate.year()
    if (y < currentYear) {
      let group = annualPosts.find(p => p.year === y)
      if (!group) {
        group = { year: y, posts: [] }
        annualPosts.push(group)
      }
      group.posts.push(post)
    }
  })

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
    moment
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
