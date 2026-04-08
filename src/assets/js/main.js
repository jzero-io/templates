/**
 * Jzero Template Market - Interactive Features
 */

// Template data for filtering (injected from templates)
let templatesData = [];

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the home page (any templates grid exists)
  const hasTemplatesGrid = document.querySelector('[id^="templatesGrid-"]');
  if (hasTemplatesGrid) {
    initializeHomePage();
  }
});

/**
 * Initialize home page functionality
 */
function initializeHomePage() {
  // Extract template data from DOM
  extractTemplateData();

  // Initialize search
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(handleSearch, 300));
  }

  // Initialize filters
  initializeFilters();

  // Focus search on page load
  if (searchInput) {
    searchInput.focus();
  }
}

/**
 * Extract template data from the DOM
 */
function extractTemplateData() {
  const templateCards = document.querySelectorAll('.template-card');
  templatesData = Array.from(templateCards).map(card => {
    const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.trim());
    const difficulty = card.querySelector('.difficulty')?.className.match(/difficulty-(\w+)/)?.[1] || '';
    const category = card.querySelector('.template-category')?.textContent.trim() || '';

    return {
      element: card,
      id: card.dataset.id,
      category,
      tags,
      difficulty,
      name: card.querySelector('.template-title')?.textContent.trim() || '',
      description: card.querySelector('.template-description')?.textContent.trim() || ''
    };
  });
}

/**
 * Initialize filter dropdowns
 */
function initializeFilters() {
  const categoryFilter = document.getElementById('categoryFilter');

  if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFilters);
  }
}

/**
 * Handle search input
 */
function handleSearch(event) {
  const query = event.target.value.toLowerCase().trim();
  applyFilters({ query });
}

/**
 * Apply all filters
 */
function applyFilters(searchQuery = null) {
  const categoryFilter = document.getElementById('categoryFilter');
  const searchInput = document.getElementById('searchInput');

  const category = categoryFilter?.value || '';
  const query = searchQuery?.query || (searchInput?.value?.toLowerCase().trim() || '');

  let visibleCount = 0;

  templatesData.forEach(template => {
    let isVisible = true;

    // Category filter
    if (category && template.category !== category) {
      isVisible = false;
    }

    // Search query
    if (query) {
      const searchText = `${template.name} ${template.description} ${template.tags.join(' ')} ${template.category}`.toLowerCase();
      if (!searchText.includes(query)) {
        isVisible = false;
      }
    }

    // Show/hide template
    if (isVisible) {
      template.element.style.display = '';
      visibleCount++;
    } else {
      template.element.style.display = 'none';
    }
  });

  // Update results count
  const resultsCount = document.getElementById('resultsCount');
  if (resultsCount) {
    resultsCount.textContent = visibleCount;
  }

  // Show/hide template sections based on visible templates
  const templateSections = document.querySelectorAll('.templates');
  templateSections.forEach(section => {
    const grid = section.querySelector('.templates-grid');
    if (grid) {
      const visibleCards = grid.querySelectorAll('.template-card:not([style*="display: none"])');
      const visibleCardsArray = Array.from(visibleCards).filter(card => {
        return card.style.display !== 'none';
      });
      section.style.display = visibleCardsArray.length > 0 ? '' : 'none';
    }
  });

  // Show/hide no results message
  const noResults = document.querySelector('.no-results');
  if (noResults) {
    noResults.style.display = visibleCount === 0 ? '' : 'none';
  }
}

/**
 * Debounce utility function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Copy command to clipboard (for detail pages)
 */
function copyCommand(command) {
  navigator.clipboard.writeText(command).then(() => {
    const toast = document.getElementById('toast');
    const copyText = document.getElementById('copyText');

    if (toast) {
      toast.classList.remove('hidden');
    }

    if (copyText) {
      copyText.textContent = 'Copied!';
    }

    setTimeout(() => {
      if (toast) {
        toast.classList.add('hidden');
      }
      if (copyText) {
        copyText.textContent = 'Copy Command';
      }
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = command;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textArea);
  });
}

// Make copyCommand available globally
window.copyCommand = copyCommand;
