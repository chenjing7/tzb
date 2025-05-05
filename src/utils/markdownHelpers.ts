import { marked } from 'marked';

/**
 * Count columns in a markdown table from its string representation
 */
export function countTableColumns(tableStr: string): number {
  const lines = tableStr.trim().split('\n');
  if (lines.length < 2) return 0;
  
  // Count pipe characters in the header row, accounting for escaped pipes
  let headerRow = lines[0];
  // Remove escaped pipes
  headerRow = headerRow.replace(/\\\|/g, '');
  // Count actual pipe separators (excluding those at start/end if they exist)
  const pipesCount = headerRow.split('|').length - 1;
  return pipesCount > 0 ? pipesCount - 1 : 0;
}

/**
 * Process markdown content with enhanced table handling
 */
export async function processMarkdown(markdown: string): Promise<string> {
  // Create a custom renderer
  const renderer = new marked.Renderer();
  
  // Override the table renderer to ensure tables get the right class
  // The token param is provided by marked internally when calling this method
  renderer.table = function(token: any) {
    const header = this.parser.parseInline(token.header);
    const body = this.parser.parseInline(token.rows || []);
    
    // Generate the table HTML with the markdown-table class
    const tableHtml = `<table class="markdown-table"><thead>${header}</thead><tbody>${body}</tbody></table>`;
    
    // Put the table inside a container div for better handling
    return `<div class="table-container">${tableHtml}</div>`;
  };
  
  // Setup marked options
  marked.use({ 
    renderer,
    gfm: true, // GitHub flavored markdown
    breaks: false
  });
  
  // Parse the markdown content
  return marked.parse(markdown);
}

/**
 * Enhanced markdown processing that detects and handles large tables
 */
export async function enhancedMarkdownProcessing(markdown: string): Promise<string> {
  // Extract tables from markdown for special processing
  const tableRegex = /(\|[^\n]*\|\n\|[-:|\s]*\|\n(\|[^\n]*\|\n)+)/g;
  let processedMarkdown = markdown;
  let match;
  
  // Replace tables with placeholders and store table content
  const tables: Array<{
    placeholder: string;
    content: string;
    columnCount: number;
  }> = [];
  
  // Process each table
  while ((match = tableRegex.exec(markdown)) !== null) {
    const tableContent = match[0];
    const columnCount = countTableColumns(tableContent);
    
    const placeholderId = `TABLE_PLACEHOLDER_${tables.length}`;
    const placeholder = `<!-- ${placeholderId} -->`;
    
    tables.push({
      placeholder: placeholderId,
      content: tableContent,
      columnCount
    });
    
    processedMarkdown = processedMarkdown.replace(tableContent, placeholder);
  }
  
  // Parse the markdown without tables
  const processedHtml = await marked.parse(processedMarkdown);
  
  // Process each table separately and reinsert
  let finalHtml = processedHtml;
  for (const { placeholder, content, columnCount } of tables) {
    // Parse just the table content
    const tableHtml = await marked.parse(content);
    
    // Determine if it's a large table
    const isLargeTable = columnCount > 7;
    
    // Create the table container with view full table option if needed
    let enhancedTableHtml = '';
    
    if (isLargeTable) {
      enhancedTableHtml = `
        <div class="table-container large-table" data-table-container>
          ${tableHtml}
          <button class="view-full-table" data-view-table>查看完整表格</button>
        </div>
        <div class="table-modal-overlay" data-table-modal>
          <div class="table-modal">
            <div class="table-modal-header">
              <h3 class="table-modal-title">完整表格</h3>
              <button class="table-modal-close" data-close-modal>&times;</button>
            </div>
            <div class="table-modal-content">
              ${tableHtml}
            </div>
          </div>
        </div>
      `;
    } else {
      enhancedTableHtml = `<div class="table-container">${tableHtml}</div>`;
    }
    
    // Replace the placeholder with the enhanced table HTML
    if (typeof finalHtml === 'string') {
      finalHtml = finalHtml.replace(`<!-- ${placeholder} -->`, enhancedTableHtml);
    }
  }
  
  return finalHtml;
} 