#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const TemplateLoader = require('./template-loader');

/**
 * Static Site Builder for JZero Template Market
 */
class SiteBuilder {
  constructor(config) {
    this.config = config;
    this.templateLoader = new TemplateLoader(config.templatesDir);
    this.templatesDir = path.join(__dirname, 'templates');
    this.outputDir = config.outputDir;
  }

  /**
   * Build the entire static site
   */
  async build() {
    console.log('🚀 Starting build...\n');

    // Ensure output directory exists
    this.ensureDir(this.outputDir);

    // Load all templates
    console.log('📦 Loading templates...');
    const templates = await this.templateLoader.loadTemplates();
    console.log(`   Found ${templates.length} templates\n`);

    // Get categories and tags
    const categories = await this.templateLoader.getCategories();
    const tags = await this.templateLoader.getTags();

    // Build index page
    console.log('📄 Building index page...');
    await this.buildIndexPage(templates, categories, tags);

    // Build template detail pages
    console.log('📄 Building template detail pages...');
    await this.buildDetailPages(templates);

    // Copy assets
    console.log('📦 Copying assets...');
    await this.copyAssets();

    console.log('\n✅ Build complete!');
    console.log(`📂 Output directory: ${this.outputDir}`);
  }

  /**
   * Build the index page
   */
  async buildIndexPage(templates, categories, tags) {
    const layoutTemplate = fs.readFileSync(
      path.join(this.templatesDir, 'layout.ejs'),
      'utf-8'
    );
    const indexTemplate = fs.readFileSync(
      path.join(this.templatesDir, 'index.ejs'),
      'utf-8'
    );

    const body = ejs.render(indexTemplate, {
      templates,
      categories,
      tags,
      siteTitle: this.config.title,
      siteDescription: this.config.description
    });

    const html = ejs.render(layoutTemplate, {
      title: 'Home',
      siteTitle: this.config.title,
      siteDescription: this.config.description,
      description: this.config.description,
      body,
      currentPage: 'home'
    });

    fs.writeFileSync(path.join(this.outputDir, 'index.html'), html);
    console.log('   ✓ index.html');
  }

  /**
   * Build template detail pages
   */
  async buildDetailPages(templates) {
    const layoutTemplate = fs.readFileSync(
      path.join(this.templatesDir, 'layout.ejs'),
      'utf-8'
    );
    const detailTemplate = fs.readFileSync(
      path.join(this.templatesDir, 'detail.ejs'),
      'utf-8'
    );

    for (const template of templates) {
      const templateDir = path.join(this.outputDir, 'templates', template.id);
      this.ensureDir(templateDir);

      const body = ejs.render(detailTemplate, {
        template,
        siteTitle: this.config.title,
        siteDescription: this.config.description
      });

      const html = ejs.render(layoutTemplate, {
        title: template.name,
        siteTitle: this.config.title,
        siteDescription: this.config.description,
        description: template.description,
        body,
        currentPage: 'detail'
      });

      fs.writeFileSync(path.join(templateDir, 'index.html'), html);
      console.log(`   ✓ templates/${template.id}/index.html`);
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
      title: 'JZero Template Market',
      description: 'Discover and use JZero templates for your next project',
      templatesDir: path.join(__dirname, '..', 'templates'),
      outputDir: path.join(__dirname, '..', 'dist')
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
