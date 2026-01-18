// types/blocks.ts - Block types for Notion-like document editor

export type BlockType =
  | "paragraph"
  | "heading"
  | "bulletListItem"
  | "numberedListItem"
  | "checkListItem"
  | "codeBlock"
  | "table"
  | "image"
  | "video"
  | "file"
  | "callout"
  | "quote"
  | "divider"
  | "toggle"
  | "embed"
  | "bookmark"
  | "equation"
  | "tableOfContents"
  | "column"
  | "audio"
  | "pdf";

export interface HeadingProps {
  level: 1 | 2 | 3;
}

export interface CheckListItemProps {
  checked: boolean;
}

export interface CodeBlockProps {
  language: string;
}

export interface ImageProps {
  url: string;
  caption?: string;
  width?: number;
  alignment?: "left" | "center" | "right";
}

export interface VideoProps {
  url: string;
  caption?: string;
}

export interface FileProps {
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

export interface CalloutProps {
  type: "info" | "warning" | "error" | "success" | "note";
  icon?: string;
}

export interface EmbedProps {
  url: string;
  type: "youtube" | "vimeo" | "figma" | "loom" | "codepen" | "codesandbox" | "twitter" | "generic";
  width?: number;
  height?: number;
}

export interface BookmarkProps {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
}

export interface EquationProps {
  latex: string;
}

export interface ColumnProps {
  columns: 2 | 3 | 4;
}

export interface TableContent {
  rows: TableRow[];
}

export interface TableRow {
  cells: TableCell[];
}

export interface TableCell {
  content: InlineContent[];
  backgroundColor?: string;
}

// Inline Content
export interface TextContent {
  type: "text";
  text: string;
  styles?: TextStyles;
}

export interface LinkContent {
  type: "link";
  href: string;
  content: TextContent[];
}

export interface MentionContent {
  type: "mention";
  mentionType: "user" | "page" | "date";
  id: string;
  text: string;
}

export type InlineContent = TextContent | LinkContent | MentionContent;

export interface TextStyles {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  textColor?: string;
  backgroundColor?: string;
}

// Block
export interface Block<T = Record<string, unknown>> {
  id: string;
  type: BlockType;
  props: T;
  content: InlineContent[];
  children: Block[];
}

// Page
export interface DocsPage {
  id: string;
  workspaceId: string;
  parentId: string | null;
  title: string;
  icon: string | null;
  coverUrl: string | null;
  content: Block[];
  slug: string;
  path: string;
  depth: number;
  position: number;
  isTemplate: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  isPublic: boolean;
  createdBy: string;
  lastEditedBy: string;
  createdAt: string;
  updatedAt: string;
}

// Workspace
export interface DocsWorkspace {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  icon: string | null;
  coverUrl: string | null;
  settings: WorkspaceSettings;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceSettings {
  defaultPageIcon: string;
  defaultPageCover: string | null;
  allowPublicPages: boolean;
  enableComments: boolean;
  enableAi: boolean;
}

// Template
export interface DocsTemplate {
  id: string;
  workspaceId: string | null;
  organizationId: string;
  name: string;
  description: string | null;
  icon: string | null;
  coverUrl: string | null;
  content: Block[];
  category: string | null;
  isGlobal: boolean;
  usageCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Comment
export interface PageComment {
  id: string;
  pageId: string;
  parentId: string | null;
  blockId: string | null;
  content: string;
  isResolved: boolean;
  resolvedBy: string | null;
  resolvedAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
  replies?: PageComment[];
}

// Share
export interface PageShare {
  id: string;
  pageId: string;
  sharedWithUserId: string | null;
  sharedWithEmail: string | null;
  permission: "view" | "comment" | "edit" | "full";
  shareToken: string | null;
  expiresAt: string | null;
  createdBy: string;
  createdAt: string;
}

// Version
export interface PageVersion {
  id: string;
  pageId: string;
  versionNumber: number;
  title: string;
  content: Block[];
  createdBy: string;
  createdAt: string;
}

// Attachment
export interface PageAttachment {
  id: string;
  pageId: string;
  blockId: string | null;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
  storageUrl: string;
  createdBy: string;
  createdAt: string;
}

// Tree item for sidebar
export interface PageTreeItem {
  id: string;
  title: string;
  icon: string | null;
  parentId: string | null;
  depth: number;
  position: number;
  isFavorite: boolean;
  isArchived: boolean;
  childPages?: PageTreeItem[];
}
