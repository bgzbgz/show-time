// =============================================================================
// Common Types
// =============================================================================

export type Role = 'user' | 'admin' | 'guru';

export type ToolStatus = 'locked' | 'unlocked' | 'in_progress' | 'completed';

export type SubmissionStatus = 'draft' | 'in_progress' | 'submitted' | 'completed';

// =============================================================================
// User Types
// =============================================================================

export interface User {
  id: string;
  lms_user_id: string;
  email: string;
  full_name: string;
  organization_id: string | null;
  role: Role;
  created_at: Date;
  updated_at: Date;
  last_login: Date | null;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: Role;
  organization_id: string | null;
  iat: number;
  exp: number;
}

// =============================================================================
// Tool Types
// =============================================================================

export interface Tool {
  slug: string;
  sprint_number: number;
  name: string;
  description: string;
  schema_name: string;
  module: number;
  module_name: string;
  file: string;
  dependencies: string[];
  is_optional: boolean;
  status: string;
}

export interface ToolMetadata extends Tool {
  user_status?: ToolStatus;
  user_progress?: number;
  unlocked?: boolean;
  missing_dependencies?: string[];
}

// =============================================================================
// Submission Types
// =============================================================================

export interface Submission {
  id: string;
  user_id: string;
  organization_id: string | null;
  data: Record<string, unknown>;
  status: SubmissionStatus;
  version: number;
  created_at: Date;
  updated_at: Date;
  submitted_at: Date | null;
  completed_at: Date | null;
}

export interface FieldOutput {
  id: string;
  submission_id: string;
  field_id: string;
  field_value: unknown;
  created_at: Date;
}

// =============================================================================
// Progress Types
// =============================================================================

export interface UserProgress {
  id: string;
  user_id: string;
  tool_slug: string;
  status: ToolStatus;
  progress_percentage: number;
  unlocked_at: Date | null;
  started_at: Date | null;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProgressSummary {
  total_tools: number;
  completed_tools: number;
  in_progress_tools: number;
  unlocked_tools: number;
  locked_tools: number;
  overall_completion_percentage: number;
  current_tool: string | null;
  progress: UserProgress[];
}

// =============================================================================
// Dependency Types
// =============================================================================

export interface DependencyField {
  field_id: string;
  source_tool: string;
  value: unknown;
  available: boolean;
}

export interface DependencyCheck {
  tool_slug: string;
  unlocked: boolean;
  missing_dependencies: string[];
  required_fields: DependencyField[];
}

// =============================================================================
// Export Types
// =============================================================================

export interface ExportOptions {
  format: 'json' | 'pdf';
  include_dependencies?: boolean;
}

export interface ExportJob {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  download_url?: string;
  error?: string;
  created_at: Date;
  completed_at?: Date;
}

// =============================================================================
// AI Integration Types
// =============================================================================

export interface AIHelpRequest {
  tool_slug: string;
  question: string;
  context?: Record<string, unknown>;
}

export interface AIHelpResponse {
  answer: string;
  suggestions?: string[];
  confidence_score?: number;
}

// =============================================================================
// Request Extension Types
// =============================================================================

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      tool?: Tool;
    }
  }
}
