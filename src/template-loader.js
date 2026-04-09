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
    this.categories = ['embedded', 'external', 'third_party'];
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
   * Convention: A template directory must contain template.{lang}.json
   */
  async discoverTemplateDirs() {
    const templateDirs = [];

    for (const category of this.categories) {
      // Look for template.*.json files (any language)
      const pattern = path.join(process.cwd(), category, '*/template.*.json');
      const files = await glob(pattern);
      for (const file of files) {
        const dir = path.dirname(file);
        if (!templateDirs.includes(dir)) {
          templateDirs.push(dir);
        }
      }
    }

    return templateDirs;
  }

  /**
   * Load a single template with language support
   * @param {string} templateDir - Template directory path
   * @param {string} lang - Language code (default: 'zh')
   */
  async loadTemplate(templateDir, lang = 'zh') {
    // Only look for language-specific config files
    const configPath = path.join(templateDir, `template.${lang}.json`);

    // Only look for language-specific guide files
    const guidePath = path.join(templateDir, `guide.${lang}.md`);

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
      // Parse markdown to HTML (you can use a markdown library here)
      guideHtml = guideContent; // For now, just store the raw content
    }

    // Extract template metadata
    const templateName = path.basename(templateDir);

    return {
      ...config,
      type: this.getTemplateCategory(templateDir),
      guide: guideHtml
    };
  }

  /**
   * Get template category from directory path
   */
  getTemplateCategory(templateDir) {
    const parts = templateDir.split(path.sep);
    for (const category of this.categories) {
      if (parts.includes(category)) {
        return category;
      }
    }
    return 'unknown';
  }

  /**
   * Get all unique categories
   */
  async getCategories(lang = 'zh') {
    const templates = await this.loadTemplates(lang);
    const categories = new Set(templates.map(t => t.category));
    return Array.from(categories).sort();
  }

  /**
   * Get all unique tags
   */
  async getTags(lang = 'zh') {
    const templates = await this.loadTemplates(lang);
    const tags = new Set();
    templates.forEach(t => {
      if (t.tags && Array.isArray(t.tags)) {
        t.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }

  /**
   * Load JSON file
   */
  loadJSON(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to parse JSON from ${filePath}: ${error.message}`);
    }
  }
}

module.exports = TemplateLoader;
