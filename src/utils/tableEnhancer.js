/**
 * Enhances markdown tables after the content is loaded
 * Adds container wrappers and modal support for large tables
 * 
 * @param {string} containerId - ID of the container with table elements to enhance
 */
export function enhanceTables(containerId = 'markdown-container') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Find all tables in the container
  const tables = container.querySelectorAll('table');
  
  tables.forEach((table, index) => {
    // Create wrapper elements
    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-container';
    tableContainer.dataset.tableId = `table-${index}`;
    
    // Determine if it's a large table by counting columns
    const headerRow = table.querySelector('thead tr');
    const columnCount = headerRow ? headerRow.children.length : 0;
    const isLargeTable = columnCount > 7;
    
    // For large tables, add special handling
    if (isLargeTable) {
      tableContainer.classList.add('large-table');
      
      // Create "View full table" button
      const viewButton = document.createElement('button');
      viewButton.className = 'view-full-table';
      viewButton.textContent = '查看完整表格';
      viewButton.dataset.viewTable = '';
      
      // Add elements to DOM
      table.parentNode?.insertBefore(tableContainer, table);
      tableContainer.appendChild(table);
      tableContainer.appendChild(viewButton);
      
      // Create modal for the table
      createTableModal(table, index);
      
      // Add click event for the button
      viewButton.addEventListener('click', () => {
        const modal = document.querySelector(`[data-modal-id="modal-${index}"]`);
        if (modal) {
          openModal(modal);
        }
      });
    } else {
      // For regular tables, just add the container
      table.parentNode?.insertBefore(tableContainer, table);
      tableContainer.appendChild(table);
    }
  });
  
  setupModalInteractions();
}

/**
 * Set up event listeners for modal interactions
 */
function setupModalInteractions() {
  // Add event listeners for modal close buttons
  document.querySelectorAll('[data-close-modal]').forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.table-modal-overlay');
      if (modal) {
        closeModal(modal);
      }
    });
  });
  
  // Close modal when clicking outside
  document.querySelectorAll('.table-modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.table-modal-overlay.active');
      if (openModal) {
        closeModal(openModal);
      }
    }
  });
}

/**
 * Create a modal for displaying a table in full view
 */
function createTableModal(table, index) {
  // Create modal elements
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'table-modal-overlay';
  modalOverlay.dataset.modalId = `modal-${index}`;
  
  const modal = document.createElement('div');
  modal.className = 'table-modal';
  
  const modalHeader = document.createElement('div');
  modalHeader.className = 'table-modal-header';
  
  const modalTitle = document.createElement('h3');
  modalTitle.className = 'table-modal-title';
  modalTitle.textContent = '完整表格';
  
  const closeButton = document.createElement('button');
  closeButton.className = 'table-modal-close';
  closeButton.innerHTML = '&times;';
  closeButton.dataset.closeModal = '';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'table-modal-content';
  
  // Create a table container for the cloned table
  const tableContainer = document.createElement('div');
  tableContainer.className = 'table-container';
  
  // Clone the table for the modal and ensure it has the right styles
  const tableClone = table.cloneNode(true);
  tableClone.style.width = 'max-content';
  tableClone.style.minWidth = '100%';
  
  // Apply the same styles to the cloned table cells
  const cells = tableClone.querySelectorAll('th, td');
  cells.forEach(cell => {
    const isHeader = cell.tagName.toLowerCase() === 'th';
    const style = isHeader ? `
      background-color: #f9fafc;
      border-bottom: 1px solid #1b3660 !important;
      border-right: 1px solid #1b3660 !important;
      padding: 0.7rem 1rem;
      font-weight: 600;
      color: #333;
      white-space: nowrap;
    ` : `
      border-bottom: 1px solid #1b3660 !important;
      border-right: 1px solid #1b3660 !important;
      padding: 0.7rem 1rem;
      white-space: nowrap;
    `;
    cell.setAttribute('style', style);
  });
  
  // Remove right border from last cells in each row
  const rows = tableClone.querySelectorAll('tr');
  rows.forEach(row => {
    const lastCell = row.lastElementChild;
    if (lastCell) {
      const currentStyle = lastCell.getAttribute('style') || '';
      lastCell.setAttribute('style', currentStyle.replace('border-right: 1px solid #1b3660 !important;', ''));
    }
  });
  
  // Add the table to its container
  tableContainer.appendChild(tableClone);
  
  // Assemble the modal
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);
  modalContent.appendChild(tableContainer);
  modal.appendChild(modalHeader);
  modal.appendChild(modalContent);
  modalOverlay.appendChild(modal);
  
  // Add to the document
  document.body.appendChild(modalOverlay);
}

/**
 * Open a table modal
 */
function openModal(modal) {
  modal.classList.add('active');
  setTimeout(() => {
    const modalContent = modal.querySelector('.table-modal');
    if (modalContent) {
      modalContent.classList.add('active');
    }
  }, 10);
  document.body.style.overflow = 'hidden';
}

/**
 * Close a table modal
 */
function closeModal(modal) {
  const modalContent = modal.querySelector('.table-modal');
  if (modalContent) {
    modalContent.classList.remove('active');
  }
  setTimeout(() => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }, 300);
}

/**
 * Apply direct border styles to tables in the document
 * This ensures tables have visible borders regardless of CSS inheritance issues
 */
export function enhanceTableBorders() {
  // Find all tables in the document
  const tables = document.querySelectorAll('table');
  
  tables.forEach(table => {
    // Add className for potential CSS targeting
    table.classList.add('markdown-table');
    
    // Apply direct inline styles to ensure borders are visible
    table.setAttribute('style', 'border: 1px solid #1b3660 !important; border-collapse: collapse; width: max-content; min-width: 100%;');
    
    // Wrap table in a container if it's not already wrapped
    if (!table.parentElement.classList.contains('table-container')) {
      const container = document.createElement('div');
      container.className = 'table-container';
      table.parentNode.insertBefore(container, table);
      container.appendChild(table);
    }
    
    // Apply styles to table cells
    const cells = table.querySelectorAll('td');
    cells.forEach(cell => {
      const isFirstCell = cell.cellIndex === 0;
      const style = `
        border-bottom: 1px solid #1b3660 !important;
        border-right: 1px solid #1b3660 !important;
        padding: 0.7rem 1rem;
        white-space: normal;
        word-wrap: break-word;
        text-align: ${isFirstCell ? 'left' : 'right'};
        min-width: ${isFirstCell ? '120px' : '80px'};
        max-width: ${isFirstCell ? '300px' : '150px'};
      `;
      cell.setAttribute('style', style);
    });
    
    // Style header cells differently
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(cell => {
      const style = `
        background-color: #f9fafc;
        border-bottom: 1px solid #1b3660 !important;
        border-right: 1px solid #1b3660 !important;
        padding: 0.7rem 0.5rem;
        font-weight: 600;
        color: #333;
        text-align: center;
        white-space: normal;
        word-wrap: break-word;
        line-height: 1.3;
        min-width: 100px;
        max-width: 150px;
      `;
      cell.setAttribute('style', style);
    });
    
    // Style summary rows (小计/合计)
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const firstCell = row.querySelector('td:first-child');
      if (firstCell && (firstCell.textContent.includes('小计') || firstCell.textContent.includes('合计'))) {
        row.querySelectorAll('td').forEach(cell => {
          const currentStyle = cell.getAttribute('style') || '';
          cell.setAttribute('style', `${currentStyle}; font-weight: 600; background-color: #f9fafc;`);
        });
      }
    });
  });
} 