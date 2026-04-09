/**
 * Jzero Template Market - Interactive Features
 */

// Template data for filtering (injected from templates)
let templatesData = [];

// Load more state per section
const sectionVisibleCount = {};
const loadMoreCount = 3;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile menu
  initializeMobileMenu();

  // Check if we're on the home page (any templates grid exists)
  const hasTemplatesGrid = document.querySelector('[id^="templatesGrid-"]');
  if (hasTemplatesGrid) {
    initializeHomePage();
  }
});

/**
 * Initialize mobile menu toggle
 */
function initializeMobileMenu() {
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mainNav = document.getElementById('mainNav');
  const overlay = document.getElementById('mobileMenuOverlay');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', function() {
      mobileToggle.classList.toggle('active');
      mainNav.classList.toggle('active');

      // Toggle overlay
      if (overlay) {
        overlay.classList.toggle('show');
      }

      // Prevent body scroll when menu is open
      document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking overlay
    if (overlay) {
      overlay.addEventListener('click', function() {
        mobileToggle.classList.remove('active');
        mainNav.classList.remove('active');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!mobileToggle.contains(event.target) && !mainNav.contains(event.target) && (!overlay || !overlay.contains(event.target))) {
        mobileToggle.classList.remove('active');
        mainNav.classList.remove('active');
        if (overlay) {
          overlay.classList.remove('show');
        }
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking on nav links
    const navLinks = mainNav.querySelectorAll('.nav-github, .lang-option');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileToggle.classList.remove('active');
        mainNav.classList.remove('active');
        if (overlay) {
          overlay.classList.remove('show');
        }
        document.body.style.overflow = '';
      });
    });
  }
}

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

  // Apply initial display limit
  applyFilters();

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
    const section = card.closest('.templates');
    const sectionId = section.querySelector('.templates-grid')?.id || '';

    return {
      element: card,
      id: card.dataset.id,
      category,
      tags,
      difficulty,
      sectionId,
      name: card.querySelector('.template-title')?.textContent.trim() || '',
      description: card.querySelector('.template-description')?.textContent.trim() || ''
    };
  });

  // Initialize visible count for each section
  const sections = document.querySelectorAll('.templates');
  sections.forEach(section => {
    const grid = section.querySelector('.templates-grid');
    if (grid) {
      const sectionId = grid.id;
      sectionVisibleCount[sectionId] = 3;
    }
  });
}

/**
 * Initialize filter dropdowns
 */
function initializeFilters() {
  const categoryFilter = document.getElementById('categoryFilter');

  if (categoryFilter) {
    categoryFilter.addEventListener('change', handleCategoryChange);
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
 * Handle category filter change
 */
function handleCategoryChange(event) {
  applyFilters();
}

/**
 * Apply all filters
 */
function applyFilters(searchQuery = null) {
  const categoryFilter = document.getElementById('categoryFilter');
  const searchInput = document.getElementById('searchInput');

  const category = categoryFilter?.value || '';
  const query = searchQuery?.query || (searchInput?.value?.toLowerCase().trim() || '');

  // Group templates by section
  const sections = {};
  templatesData.forEach(template => {
    if (!sections[template.sectionId]) {
      sections[template.sectionId] = [];
    }
    sections[template.sectionId].push(template);
  });

  // Process each section
  Object.keys(sections).forEach(sectionId => {
    const sectionTemplates = sections[sectionId];
    let filteredTemplates = [];

    // Apply filters
    sectionTemplates.forEach(template => {
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

      if (isVisible) {
        filteredTemplates.push(template);
      }
    });

    // Hide all templates in this section first
    sectionTemplates.forEach(template => {
      template.element.style.display = 'none';
    });

    // Show only first visibleCount templates for this section
    const visibleCount = sectionVisibleCount[sectionId] || 3;
    const templatesToShow = filteredTemplates.slice(0, visibleCount);
    templatesToShow.forEach(template => {
      template.element.style.display = '';
    });

    // Update load more button for this section
    updateSectionLoadMoreButton(sectionId, filteredTemplates.length);

    // Show/hide section based on visible templates
    const section = document.querySelector(`#${sectionId}`)?.closest('.templates');
    if (section) {
      section.style.display = filteredTemplates.length > 0 ? '' : 'none';
    }
  });

  // Update total results count
  const totalFiltered = templatesData.filter(template => {
    if (category && template.category !== category) return false;
    if (query) {
      const searchText = `${template.name} ${template.description} ${template.tags.join(' ')} ${template.category}`.toLowerCase();
      if (!searchText.includes(query)) return false;
    }
    return true;
  }).length;

  const resultsCount = document.getElementById('resultsCount');
  if (resultsCount) {
    resultsCount.textContent = totalFiltered;
  }

  // Show/hide no results message
  const noResults = document.querySelector('.no-results');
  if (noResults) {
    noResults.style.display = totalFiltered === 0 ? '' : 'none';
  }
}

/**
 * Load more templates for a specific section
 */
function loadMoreSection(sectionId) {
  sectionVisibleCount[sectionId] = (sectionVisibleCount[sectionId] || 3) + loadMoreCount;
  applyFilters();
}

/**
 * Apply pagination to visible templates
 */
function applyPagination(visibleTemplates) {
  const totalPages = Math.ceil(visibleTemplates.length / itemsPerPage);

  // Show only current page templates
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageTemplates = visibleTemplates.slice(startIndex, endIndex);

  pageTemplates.forEach(template => {
    template.element.style.display = '';
  });

  // Update pagination controls
  updatePaginationControls(totalPages);
}

/**
 * Update pagination controls
 */
function updatePaginationControls(totalPages) {
  let paginationContainer = document.querySelector('.pagination-container');

  // Remove existing pagination
  if (paginationContainer) {
    paginationContainer.remove();
  }

  // Only show pagination if there are multiple pages
  if (totalPages <= 1) {
    return;
  }

  // Create pagination container
  paginationContainer = document.createElement('div');
  paginationContainer.className = 'pagination-container';

  const pagination = document.createElement('div');
  pagination.className = 'pagination';

  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'pagination-btn';
  prevBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M10 12L6 8l4-4"/>
    </svg>
  `;
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      applyFilters();
    }
  });

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `pagination-page ${i === currentPage ? 'active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      applyFilters();
    });
    pagination.appendChild(pageBtn);
  }

  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'pagination-btn';
  nextBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6 4l4 4-4 4"/>
    </svg>
  `;
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      applyFilters();
    }
  });

  pagination.appendChild(prevBtn);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `pagination-page ${i === currentPage ? 'active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      applyFilters();
    });
    pagination.appendChild(pageBtn);
  }

  pagination.appendChild(nextBtn);

  paginationContainer.appendChild(pagination);

  // Insert pagination after the last templates grid
  const lastGrid = document.querySelector('.templates:last-child .templates-grid');
  if (lastGrid && lastGrid.parentNode) {
    lastGrid.parentNode.appendChild(paginationContainer);
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

// Temporary file to add updateSectionLoadMoreButton function

/**
 * Update load more button for a specific section
 */
function updateSectionLoadMoreButton(sectionId, totalFiltered) {
  // Remove existing load more button for this section
  const existingBtn = document.querySelector(`.load-more-btn[data-section="${sectionId}"]`);
  if (existingBtn) {
    existingBtn.closest('.load-more-container')?.remove();
  }

  const visibleCount = sectionVisibleCount[sectionId] || 3;

  // Only show load more button if there are more templates to show
  if (visibleCount >= totalFiltered) {
    return;
  }

  // Find the section and grid
  const grid = document.querySelector(`#${sectionId}`);
  if (!grid || !grid.parentNode) return;

  const section = grid.closest('.templates');
  const sectionTitle = section?.querySelector('.type-title')?.textContent.trim() || '';

  // Create load more button text based on section title
  const buttonText = `查看更多${sectionTitle}`;

  // Create load more container
  const loadMoreContainer = document.createElement('div');
  loadMoreContainer.className = 'load-more-container';

  const loadMoreBtn = document.createElement('button');
  loadMoreBtn.className = 'load-more-btn';
  loadMoreBtn.textContent = buttonText;
  loadMoreBtn.dataset.section = sectionId;
  loadMoreBtn.addEventListener('click', () => loadMoreSection(sectionId));

  loadMoreContainer.appendChild(loadMoreBtn);

  // Insert load more button after the grid
  grid.parentNode.appendChild(loadMoreContainer);
}
