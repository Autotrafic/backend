interface DSubmissionDone {
  id: number;
  source: string;
  submitters_order: string;
  slug: string;
  audit_log_url: string;
  combined_document_url: string | null;
  completed_at: string;
  expire_at: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
  submitters: DSubmissionDoneSubmitter[];
  template: DTemplate;
  created_by_user: DSubmissionDoneUser;
  submission_events: DSubmissionEvent[];
  documents: DsubmissionDoneDocument[];
  status: string;
}

interface DocusealTemplate {
  id: number;
  slug: string;
  name: string;
  schema: Schema[];
  fields: Field[];
  submitters: Submitter[];
  author_id: number;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  source: string;
  folder_id: number;
  folder_name: string;
  external_id: string;
  author: Author;
  documents: Document[];
}

interface DocusealSubmission {
  id: number;
  submission_id: number;
  uuid: string;
  email: string;
  slug: string;
  sent_at: string;
  opened_at: string | null;
  completed_at: string | null;
  declined_at: string | null;
  created_at: string;
  updated_at: string;
  name: string;
  phone: string;
  external_id: string;
  metadata: Metadata;
  status: string;
  values: Value[];
  preferences: Preferences;
  role: string;
  embed_src: string;
}

interface DocumentArea {
  page: number;
  attachment_uuid: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Field {
  name: string;
  type: string;
  required: boolean;
  uuid: string;
  submitter_uuid: string;
  areas: DocumentArea[];
}

interface Submitter {
  name: string;
  uuid: string;
}

interface Document {
  id: number;
  uuid: string;
  url: string;
}

interface Author {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Schema {
  name: string;
  attachment_uuid: string;
}

interface Metadata {
  customData: string;
}

interface Value {
  field: string;
  value: string;
}

interface Preferences {
  send_email: boolean;
  send_sms: boolean;
}

interface CreateTemplateFromPdf {
  pdfBase64: string;
  userFullName: string;
}

interface CreateSubmission {
  templateId: number;
  userFullName: string;
  userPhone: string;
  userRole?: string;
}

interface DSubmissionEvent {
  id: number;
  submitter_id: number;
  event_type: string;
  event_timestamp: string;
}

interface DsubmissionDoneDocument {
  name: string;
  url: string;
}

interface DSubmissionDoneSubmitter {
  id: number;
  submission_id: number;
  uuid: string;
  email: string;
  slug: string;
  sent_at: string;
  opened_at: string | null;
  completed_at: string | null;
  declined_at: string | null;
  created_at: string;
  updated_at: string;
  name: string;
  phone: string;
  external_id: string | null;
  status: string;
  metadata: Record<string, unknown>;
  values: Array<{ field: string; value: string }>;
  documents: Document[];
  role: string;
}

interface DTemplate {
  id: number;
  name: string;
  external_id: string;
  folder_name: string;
  created_at: string;
  updated_at: string;
}

interface DSubmissionDoneUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}


