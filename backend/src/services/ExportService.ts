import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import { toolService } from './ToolService.js';
import { toolOrchestrator } from './ToolOrchestrator.js';
import { prisma } from '../config/database.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import type { ExportOptions } from '../types/index.js';
import fs from 'fs/promises';
import path from 'path';

// =============================================================================
// Export Service
// =============================================================================

export class ExportService {
  private templatesPath: string;
  private compiledTemplates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor() {
    this.templatesPath = path.join(process.cwd(), 'src/templates');
  }

  /**
   * Export submission as JSON with dependencies
   */
  async exportJSON(userId: string, toolSlug: string): Promise<Record<string, unknown>> {
    // Get user info
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { email: true, full_name: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Get tool metadata
    const tool = toolService.getTool(toolSlug);

    // Get submission data
    const submission = await toolService.getSubmission(userId, toolSlug);

    if (!submission) {
      throw new NotFoundError(`No submission found for tool: ${toolSlug}`);
    }

    // Resolve dependencies
    const dependencies = await toolOrchestrator.resolveDependencies(toolSlug, userId);

    // Build export object
    const exportData = {
      export_metadata: {
        tool_slug: toolSlug,
        tool_name: tool.name,
        sprint_number: tool.sprint_number,
        user_email: user.email,
        user_name: user.full_name,
        exported_at: new Date().toISOString(),
        submission_version: submission.version,
      },
      submission: {
        id: submission.id,
        status: submission.status,
        data: submission.data,
        created_at: submission.created_at,
        updated_at: submission.updated_at,
        submitted_at: submission.submitted_at,
        completed_at: submission.completed_at,
      },
      dependencies: Object.entries(dependencies).reduce((acc, [fieldId, field]) => {
        acc[fieldId] = {
          value: field.value,
          source_tool: field.source_tool,
          available: field.available,
        };
        return acc;
      }, {} as Record<string, unknown>),
    };

    return exportData;
  }

  /**
   * Render Handlebars template with submission data
   */
  async renderTemplate(
    toolSlug: string,
    submissionData: Record<string, unknown>,
    dependencies: Record<string, unknown>
  ): Promise<string> {
    // Try to load tool-specific template first
    let templatePath = path.join(this.templatesPath, `${toolSlug}.hbs`);
    let templateExists = false;

    try {
      await fs.access(templatePath);
      templateExists = true;
    } catch {
      // Fall back to default template
      templatePath = path.join(this.templatesPath, 'default.hbs');
    }

    // Load and compile template
    const template = await this.loadTemplate(templatePath);

    // Prepare template context
    const context = {
      tool: toolService.getTool(toolSlug),
      submission: submissionData,
      dependencies,
      generated_at: new Date().toISOString(),
    };

    // Render template
    return template(context);
  }

  /**
   * Load and compile Handlebars template
   */
  private async loadTemplate(templatePath: string): Promise<HandlebarsTemplateDelegate> {
    // Check cache
    if (this.compiledTemplates.has(templatePath)) {
      return this.compiledTemplates.get(templatePath)!;
    }

    // Load template file
    const templateContent = await fs.readFile(templatePath, 'utf-8');

    // Compile template
    const compiled = Handlebars.compile(templateContent);

    // Cache compiled template
    this.compiledTemplates.set(templatePath, compiled);

    return compiled;
  }

  /**
   * Generate PDF from HTML using Puppeteer
   */
  async generatePDF(html: string, options: ExportOptions = {}): Promise<Buffer> {
    // Launch headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    try {
      const page = await browser.newPage();

      // Set content
      await page.setContent(html, {
        waitUntil: 'networkidle0',
      });

      // Generate PDF
      const pdf = await page.pdf({
        format: options.format || 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
      });

      return pdf;
    } finally {
      await browser.close();
    }
  }

  /**
   * Generate export filename
   */
  generateFilename(toolSlug: string, username: string, format: 'json' | 'pdf'): string {
    // Sanitize username (remove special characters)
    const sanitizedUsername = username
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

    // Format date as YYYY-MM-DD
    const date = new Date().toISOString().split('T')[0];

    return `${toolSlug}_${sanitizedUsername}_${date}.${format}`;
  }

  /**
   * Export submission as PDF
   */
  async exportPDF(
    userId: string,
    toolSlug: string,
    options: ExportOptions = {}
  ): Promise<Buffer> {
    // Get JSON export data
    const exportData = await this.exportJSON(userId, toolSlug);

    // Render template
    const html = await this.renderTemplate(
      toolSlug,
      exportData.submission as Record<string, unknown>,
      exportData.dependencies as Record<string, unknown>
    );

    // Generate PDF
    return this.generatePDF(html, options);
  }

  /**
   * Clear template cache
   */
  clearTemplateCache(): void {
    this.compiledTemplates.clear();
  }
}

// Export singleton instance
export const exportService = new ExportService();
