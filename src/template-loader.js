const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

/**
 * Template Loader
 * Loads and parses template configurations and guide files
 */
class TemplateLoader {
  constructor(templatesDir) {
    this.templatesDir = templatesDir;
  }

  /**
   * Load all templates from the templates directory
   */
  async loadTemplates() {
    const templateDirs = await this.discoverTemplateDirs();
    const templates = [];

    for (const dir of templateDirs) {
      try {
        const template = await this.loadTemplate(dir);
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
   * Load a single template
   */
  async loadTemplate(templateDir) {
    const configPath = path.join(templateDir, 'template.json');
    const guidePath = path.join(templateDir, 'guide.md');

    // Check if template.json exists
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
      difficulty: config.difficulty || 'beginner',
      command: config.command || '',
      branch: config.branch || '',
      features: config.features || [],
      screenshot: config.screenshot || '',
      demo: config.demo || '',
      repository: config.repository || '',
      guide: guideHtml,
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
   * Convert markdown to HTML (simple implementation)
   * In production, use a proper markdown library
   */
  markdownToHtml(markdown) {
    // Simple markdown to HTML conversion
    // For production, use 'marked' or similar library
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
   */
  async getTemplateById(id) {
    const templates = await this.loadTemplates();
    return templates.find(t => t.id === id || t.dir === id);
  }

  /**
   * Get all unique categories
   */
  async getCategories() {
    const templates = await this.loadTemplates();
    const categories = new Set(templates.map(t => t.category));
    return Array.from(categories).sort();
  }

  /**
   * Get all unique tags
   */
  async getTags() {
    const templates = await this.loadTemplates();
    const tags = new Set();
    templates.forEach(t => {
      t.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  /**
   * Search templates by keyword
   */
  async searchTemplates(keyword) {
    const templates = await this.loadTemplates();
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
   */
  async filterByCategory(category) {
    const templates = await this.loadTemplates();
    return templates.filter(t => t.category === category);
  }

  /**
   * Filter templates by tag
   */
  async filterByTag(tag) {
    const templates = await this.loadTemplates();
    return templates.filter(t => t.tags.includes(tag));
  }
}

module.exports = TemplateLoader;
