#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const TemplateLoader = require('./template-loader');

/**
 * Static Site Builder for Jzero Template Market with Multi-language Support
 */
class SiteBuilder {
  constructor(config) {
    this.config = config;
    this.templateLoader = new TemplateLoader(process.cwd());
    this.templatesDir = path.join(__dirname, 'templates');
    this.outputDir = config.outputDir;
    this.supportedLangs = config.supportedLangs || ['zh', 'en'];
    this.defaultLang = config.defaultLang || 'zh';
    this.i18n = this.loadI18n();
  }

  /**
   * Load i18n configuration
   */
  loadI18n() {
    const i18nPath = path.join(__dirname, 'i18n.json');
    if (fs.existsSync(i18nPath)) {
      return JSON.parse(fs.readFileSync(i18nPath, 'utf-8'));
    }
    return {};
  }

  /**
   * Get i18n text for a language
   */
  getI18n(lang) {
    return this.i18n[lang] || this.i18n[this.defaultLang] || this.i18n['en'] || {};
  }

  /**
   * Build the entire static site
   */
  async build() {
    console.log('🚀 Starting build...\n');

    // Ensure output directory exists
    this.ensureDir(this.outputDir);

    // Build for each language
    for (const lang of this.supportedLangs) {
      console.log(`📦 Building for language: ${lang}...`);

      // Load all templates for this language
      const templates = await this.templateLoader.loadTemplates(lang);
      console.log(`   Found ${templates.length} templates`);

      // Get categories and tags for this language
      const categories = await this.templateLoader.getCategories(lang);
      const tags = await this.templateLoader.getTags(lang);

      // Build index page for this language
      if (lang === this.defaultLang) {
        console.log('📄 Building index page (default)...');
        await this.buildIndexPage(templates, categories, tags, lang, '');
      } else {
        console.log(`📄 Building index page (${lang})...`);
        await this.buildIndexPage(templates, categories, tags, lang, `/${lang}`);
      }

      // Build template detail pages for this language
      console.log(`📄 Building template detail pages (${lang})...`);
      await this.buildDetailPages(templates, lang);

      console.log(`\n✅ ${lang} build complete!\n`);
    }

    // Copy assets
    console.log('📦 Copying assets...');
    await this.copyAssets();

    console.log('\n✅ All builds complete!');
    console.log(`📂 Output directory: ${this.outputDir}`);
  }

  /**
   * Build the index page
   */
  async buildIndexPage(templates, categories, tags, lang, baseUrl) {
    const layoutTemplate = fs.readFileSync(
      path.join(this.templatesDir, 'layout.ejs'),
      'utf-8'
    );
    const indexTemplate = fs.readFileSync(
      path.join(this.templatesDir, 'index.ejs'),
      'utf-8'
    );

    const i18n = this.getI18n(lang);

    const body = ejs.render(indexTemplate, {
      templates,
      categories,
      tags,
      siteTitle: i18n.siteTitle || this.config.title,
      siteDescription: i18n.siteDescription || this.config.description,
      i18n,
      currentLang: lang,
      supportedLangs: this.supportedLangs,
      baseUrl
    });

    const html = ejs.render(layoutTemplate, {
      title: 'Home',
      siteTitle: i18n.siteTitle || this.config.title,
      siteDescription: i18n.siteDescription || this.config.description,
      description: i18n.siteDescription || this.config.description,
      body,
      currentPage: 'home',
      i18n,
      currentLang: lang,
      supportedLangs: this.supportedLangs,
      baseUrl,
      lang,
      defaultLang: this.defaultLang
    });

    const outputPath = baseUrl
      ? path.join(this.outputDir, lang, 'index.html')
      : path.join(this.outputDir, 'index.html');

    this.ensureDir(path.dirname(outputPath));
    fs.writeFileSync(outputPath, html);
    console.log(`   ✓ ${baseUrl ? lang + '/' : ''}index.html`);
  }

  /**
   * Build template detail pages
   */
  async buildDetailPages(templates, lang) {
    const layoutTemplate = fs.readFileSync(
      path.join(this.templatesDir, 'layout.ejs'),
      'utf-8'
    );
    const detailTemplate = fs.readFileSync(
      path.join(this.templatesDir, 'detail.ejs'),
      'utf-8'
    );

    const i18n = this.getI18n(lang);

    for (const template of templates) {
      const templateDir = path.join(
        this.outputDir,
        lang === this.defaultLang ? '' : lang,
        template.type,
        template.id
      );
      this.ensureDir(templateDir);

      const body = ejs.render(detailTemplate, {
        template,
        siteTitle: i18n.siteTitle || this.config.title,
        siteDescription: i18n.siteDescription || this.config.description,
        i18n,
        currentLang: lang,
        supportedLangs: this.supportedLangs,
        baseUrl: lang === this.defaultLang ? '' : `/${lang}`
      });

      const html = ejs.render(layoutTemplate, {
        title: template.name,
        siteTitle: i18n.siteTitle || this.config.title,
        siteDescription: i18n.siteDescription || this.config.description,
        description: template.description,
        body,
        currentPage: 'detail',
        i18n,
        currentLang: lang,
        supportedLangs: this.supportedLangs,
        baseUrl: lang === this.defaultLang ? '' : `/${lang}`,
        lang,
        defaultLang: this.defaultLang,
        templateId: template.id,
        templateType: template.type
      });

      fs.writeFileSync(path.join(templateDir, 'index.html'), html);
      console.log(`   ✓ ${lang === this.defaultLang ? '' : lang + '/'}${template.type}/${template.id}/index.html`);
    }
  }

  /**
   * Copy assets to output directory
   */
  async copyAssets() {
    const assetsSourceDir = path.join(__dirname, 'assets');
    const assetsOutputDir = path.join(this.outputDir, 'assets');

    if (!fs.existsSync(assetsSourceDir)) {
      console.log('   ⚠ No assets directory found, skipping...');
      return;
    }

    this.copyDirectory(assetsSourceDir, assetsOutputDir);
    console.log('   ✓ assets/');
  }

  /**
   * Recursively copy directory
   */
  copyDirectory(src, dest) {
    this.ensureDir(dest);

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  /**
   * Ensure directory exists
   */
  ensureDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

/**
 * Main build script
 */
async function main() {
  try {
    // Load configuration
    const configPath = path.join(__dirname, '..', 'builder.config.json');
    let config = {
      title: 'Jzero Template Market',
      description: 'Discover and use Jzero templates for your next project',
      templatesDir: path.join(__dirname, '..', 'templates'),
      outputDir: path.join(__dirname, '..', 'dist'),
      supportedLangs: ['zh', 'en'],
      defaultLang: 'zh'
    };

    if (fs.existsSync(configPath)) {
      const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      config = { ...config, ...userConfig };
    }

    // Build site
    const builder = new SiteBuilder(config);
    await builder.build();

  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run build
main();
