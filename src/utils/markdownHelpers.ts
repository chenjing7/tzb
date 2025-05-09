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
 * Simple markdown processing function that handles basic markdown to HTML conversion
 */
export async function processMarkdown(markdown: string): Promise<string> {
  return await marked.parse(markdown);
}

/**
 * Process markdown content with enhanced table handling
 */
export async function enhancedMarkdownProcessing(markdown: string): Promise<string> {
  // Extract tables from markdown for special processing
  const tables: Array<{ placeholder: string; content: string; columnCount: number }> = [];
  let finalHtml = markdown;
  
  // Replace tables with placeholders
  finalHtml = finalHtml.replace(/(\|[^\n]+\|\n)((?:\|[^\n]+\|\n)+)/g, (match, header, rows) => {
    const columnCount = (header.match(/\|/g) || []).length - 1;
    const placeholder = `table-${tables.length}`;
    tables.push({
      placeholder,
      content: match,
      columnCount
    });
    return `<!-- ${placeholder} -->`;
  });
  
  // Parse the markdown to HTML
  finalHtml = await marked.parse(finalHtml);
  
  // Replace placeholders with table HTML
  for (const { placeholder, content } of tables) {
    const tableHtml = await marked.parse(content);
    finalHtml = finalHtml.replace(`<!-- ${placeholder} -->`, `<div class="table-container">${tableHtml}</div>`);
  }
  
  return finalHtml;
} 