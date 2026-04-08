const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

/**
 * Template Loader
 * Loads and parses template configurations and guide files with multi-language support
 */
class TemplateLoader {
  constructor(templatesDir) {
    this.templatesDir = templatesDir;
  }

  /**
   * Load all templates from the templates directory
   * @param {string} lang - Language code (default: 'zh')
   */
  async loadTemplates(lang = 'zh') {
    const templateDirs = await this.discoverTemplateDirs();
    const templates = [];

    for (const dir of templateDirs) {
      try {
        const template = await this.loadTemplate(dir, lang);
        if (template) {
          templates.push(template);
        }
      } catch (error) {
        console.warn(`Warning: Failed to load template from ${dir}:`, error.message);
      }
    }

    return templates;
  }

  /**
   * Discover all template directories
   * Convention: A template directory must contain template.json
   */
  async discoverTemplateDirs() {
    const pattern = path.join(this.templatesDir, '*/template.json');
    const files = await glob(pattern);
    return files.map(file => path.dirname(file));
  }

  /**
   * Load a single template with language support
   * @param {string} templateDir - Template directory path
   * @param {string} lang - Language code (default: 'zh')
   */
  async loadTemplate(templateDir, lang = 'zh') {
    // Determine config file based on language
    let configPath = path.join(templateDir, `template.${lang}.json`);
    if (!fs.existsSync(configPath)) {
      configPath = path.join(templateDir, 'template.json');
    }

    // Determine guide file based on language
    let guidePath = path.join(templateDir, `guide.${lang}.md`);
    if (!fs.existsSync(guidePath)) {
      guidePath = path.join(templateDir, 'guide.md');
    }

    // Check if template config exists
    if (!fs.existsSync(configPath)) {
      return null;
    }

    // Load template configuration
    const config = this.loadJSON(configPath);

    // Load guide content if exists
    let guideHtml = '';
    if (fs.existsSync(guidePath)) {
      const guideContent = fs.readFileSync(guidePath, 'utf-8');
      guideHtml = this.markdownToHtml(guideContent);
    }

    // Extract metadata from config with defaults
    const template = {
      id: config.id || this.slugify(config.name),
      name: config.name || 'Unnamed Template',
      description: config.description || '',
      category: config.category || 'General',
      tags: config.tags || [],
      command: config.command || '',
      branch: config.branch || '',
      features: config.features || [],
      screenshot: config.screenshot || '',
      demo: config.demo || '',
      repository: config.repository || '',
      guide: guideHtml,
      lang: lang,
      // Convention: Use folder name as ID if not specified
      dir: path.basename(templateDir)
    };

    return template;
  }

  /**
   * Load and parse JSON file
   */
  loadJSON(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to parse JSON file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Convert markdown to HTML
   */
  markdownToHtml(markdown) {
    const { marked } = require('marked');
    return marked(markdown);
  }

  /**
   * Convert string to URL-friendly slug
   */
  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }

  /**
   * Get template by ID
   * @param {string} id - Template ID or directory name
   * @param {string} lang - Language code (default: 'zh')
   */
  async getTemplateById(id, lang = 'zh') {
    const templates = await this.loadTemplates(lang);
    return templates.find(t => t.id === id || t.dir === id);
  }

  /**
   * Get all unique categories
   * @param {string} lang - Language code (default: 'zh')
   */
  async getCategories(lang = 'zh') {
    const templates = await this.loadTemplates(lang);
    const categories = new Set(templates.map(t => t.category));
    return Array.from(categories).sort();
  }

  /**
   * Get all unique tags
   * @param {string} lang - Language code (default: 'zh')
   */
  async getTags(lang = 'zh') {
    const templates = await this.loadTemplates(lang);
    const tags = new Set();
    templates.forEach(t => {
      t.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  /**
   * Search templates by keyword
   * @param {string} keyword - Search keyword
   * @param {string} lang - Language code (default: 'zh')
   */
  async searchTemplates(keyword, lang = 'zh') {
    const templates = await this.loadTemplates(lang);
    const lowerKeyword = keyword.toLowerCase();

    return templates.filter(t =>
      t.name.toLowerCase().includes(lowerKeyword) ||
      t.description.toLowerCase().includes(lowerKeyword) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)) ||
      t.category.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * Filter templates by category
   * @param {string} category - Category name
   * @param {string} lang - Language code (default: 'zh')
   */
  async filterByCategory(category, lang = 'zh') {
    const templates = await this.loadTemplates(lang);
    return templates.filter(t => t.category === category);
  }

  /**
   * Filter templates by tag
   * @param {string} tag - Tag name
   * @param {string} lang - Language code (default: 'zh')
   */
  async filterByTag(tag, lang = 'zh') {
    const templates = await this.loadTemplates(lang);
    return templates.filter(t => t.tags.includes(tag));
  }
}

module.exports = TemplateLoader;
