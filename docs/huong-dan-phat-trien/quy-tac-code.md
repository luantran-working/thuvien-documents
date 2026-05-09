# Quy Tắc Code

## TypeScript Configuration

### Strict Mode

Project sử dụng TypeScript strict mode để đảm bảo type safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### Type Annotations

```typescript
// ❌ Bad - implicit any
function processDocument(doc) {
  return doc.title;
}

// ✅ Good - explicit types
function processDocument(doc: Document): string {
  return doc.title;
}

// ❌ Bad - type assertion without reason
const element = document.getElementById('root') as HTMLElement;

// ✅ Good - proper null checking
const element = document.getElementById('root');
if (!element) throw new Error('Root element not found');
```

## ESLint Configuration

### Rules

File `.eslintrc.json`:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off"
  }
}
```

### Linting Commands

```bash
# Check linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Check specific file
npx eslint src/renderer/components/DocumentList.tsx
```

## Prettier Configuration

### Settings

File `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Format Commands

```bash
# Format all files
npm run format

# Check formatting
npm run format:check

# Format specific file
npx prettier --write src/renderer/App.tsx
```

## Naming Conventions

### Variables và Functions

```typescript
// ✅ Good - camelCase
const documentList = [];
const userId = '123';
let isLoading = false;

function getDocumentById(id: string): Document | null {
  // ...
}

const handleSubmit = () => {
  // ...
};

// ❌ Bad
const DocumentList = []; // Should be camelCase
const user_id = '123'; // No snake_case
let IsLoading = false; // Should be camelCase
```

### Constants

```typescript
// ✅ Good - UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_PAGE_SIZE = 20;

// ❌ Bad
const maxFileSize = 10485760; // Should be UPPER_SNAKE_CASE
const apiBaseUrl = 'https://api.example.com';
```

### Classes và Interfaces

```typescript
// ✅ Good - PascalCase
class DocumentService {
  // ...
}

interface DocumentProps {
  id: string;
  title: string;
}

type DocumentStatus = 'draft' | 'published' | 'archived';

// ❌ Bad
class documentService {} // Should be PascalCase
interface documentProps {} // Should be PascalCase
```

### React Components

```typescript
// ✅ Good - PascalCase, descriptive names
export const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  return <div>{/* ... */}</div>;
};

export const DocumentListItem: React.FC<DocumentItemProps> = ({ document }) => {
  return <div>{/* ... */}</div>;
};

// ❌ Bad
export const List = () => {}; // Too generic
export const documentList = () => {}; // Should be PascalCase
export const Doc_List = () => {}; // No underscores
```

### Files và Folders

```
✅ Good:
components/
  DocumentList/
    DocumentList.tsx
    DocumentList.module.css
    index.ts
  common/
    Button/
      Button.tsx

utils/
  dateUtils.ts
  stringUtils.ts

❌ Bad:
Components/              # Should be camelCase
  document-list/         # Should be PascalCase for components
    DocumentList.tsx
  Common/                # Should be camelCase
    button.tsx           # Should be PascalCase

Utils/                   # Should be camelCase
  date-utils.ts          # Should be camelCase
```

## Component Structure

### Functional Components

```typescript
// ✅ Good - Complete component structure
import React, { useState, useEffect } from 'react';
import { Document } from '@shared/types';
import { Button } from '@renderer/components/common';
import styles from './DocumentList.module.css';

interface DocumentListProps {
  categoryId?: string;
  onDocumentSelect?: (document: Document) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  categoryId,
  onDocumentSelect,
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, [categoryId]);

  const loadDocuments = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await window.api.getDocuments(categoryId);
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentClick = (document: Document): void => {
    onDocumentSelect?.(document);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      {documents.map((doc) => (
        <div key={doc.id} onClick={() => handleDocumentClick(doc)}>
          {doc.title}
        </div>
      ))}
    </div>
  );
};
```

### Custom Hooks

```typescript
// ✅ Good - Reusable hook
import { useState, useEffect } from 'react';
import { Document } from '@shared/types';

interface UseDocumentsResult {
  documents: Document[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useDocuments = (categoryId?: string): UseDocumentsResult => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await window.api.getDocuments(categoryId);
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [categoryId]);

  return {
    documents,
    loading,
    error,
    refresh: loadDocuments,
  };
};
```

## State Management Patterns

### Zustand Store

```typescript
// ✅ Good - Type-safe store
import create from 'zustand';
import { Document } from '@shared/types';

interface DocumentStore {
  documents: Document[];
  selectedDocument: Document | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setDocuments: (documents: Document[]) => void;
  selectDocument: (document: Document | null) => void;
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  selectedDocument: null,
  loading: false,
  error: null,

  setDocuments: (documents) => set({ documents }),
  
  selectDocument: (document) => set({ selectedDocument: document }),
  
  addDocument: (document) =>
    set((state) => ({ documents: [...state.documents, document] })),
  
  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc
      ),
    })),
  
  deleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
}));
```

## Error Handling

### Try-Catch Pattern

```typescript
// ✅ Good - Proper error handling
async function createDocument(data: CreateDocumentDto): Promise<Document> {
  try {
    const document = await window.api.createDocument(data);
    return document;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new Error(`Validation failed: ${error.message}`);
    }
    if (error instanceof NetworkError) {
      throw new Error('Network error. Please check your connection.');
    }
    // Log unexpected errors
    console.error('Unexpected error creating document:', error);
    throw new Error('Failed to create document');
  }
}

// ❌ Bad - Silent failures
async function createDocument(data: CreateDocumentDto) {
  try {
    return await window.api.createDocument(data);
  } catch (error) {
    console.log(error); // Don't just log
    return null; // Don't return null on error
  }
}
```

### Error Boundaries (React)

```typescript
// ✅ Good - Error boundary component
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div>
            <h2>Something went wrong</h2>
            <p>{this.state.error?.message}</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

## Comments và Documentation

### JSDoc Comments

```typescript
/**
 * Retrieves a document by its ID
 * @param id - The unique identifier of the document
 * @returns The document if found, null otherwise
 * @throws {NotFoundError} If document doesn't exist
 * @example
 * const doc = await getDocumentById('123');
 */
async function getDocumentById(id: string): Promise<Document | null> {
  // Implementation
}

/**
 * Props for the DocumentList component
 */
interface DocumentListProps {
  /** Optional category filter */
  categoryId?: string;
  /** Callback when a document is selected */
  onDocumentSelect?: (document: Document) => void;
  /** Maximum number of documents to display */
  maxItems?: number;
}
```

### Inline Comments

```typescript
// ✅ Good - Explain WHY, not WHAT
// Use debounce to avoid excessive API calls during typing
const debouncedSearch = debounce(searchDocuments, 300);

// Workaround for SQLite LIKE case-sensitivity on Windows
const query = `SELECT * FROM documents WHERE LOWER(title) LIKE LOWER(?)`;

// ❌ Bad - Obvious comments
// Set loading to true
setLoading(true);

// Loop through documents
documents.forEach((doc) => {
  // ...
});
```

### TODO Comments

```typescript
// TODO: Add pagination support
// TODO(username): Optimize this query for large datasets
// FIXME: This breaks when categoryId is null
// HACK: Temporary workaround until API is fixed
// NOTE: This must run before database initialization
```

## Git Commit Messages

### Conventional Commits

Format: `<type>(<scope>): <subject>`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
# ✅ Good
feat(documents): add search functionality
fix(database): resolve connection timeout issue
docs(readme): update installation instructions
refactor(components): extract DocumentCard component
test(documents): add unit tests for DocumentService
chore(deps): update electron to v28.0.0

# ❌ Bad
update stuff
fixed bug
changes
WIP
```

### Commit Message Body

```bash
feat(documents): add advanced search with filters

- Add search by title, description, and tags
- Implement date range filtering
- Add category filter dropdown
- Update search UI with new filter panel

Closes #123
```

## Code Review Checklist

### Before Submitting PR

- [ ] Code follows naming conventions
- [ ] All functions have proper type annotations
- [ ] No `any` types (unless absolutely necessary)
- [ ] Error handling is implemented
- [ ] Comments explain complex logic
- [ ] No console.log statements (use proper logging)
- [ ] Tests are written and passing
- [ ] ESLint shows no errors
- [ ] Prettier formatting applied
- [ ] No unused imports or variables
- [ ] Commit messages follow conventions

### Reviewer Checklist

- [ ] Code is readable and maintainable
- [ ] Logic is correct and efficient
- [ ] Edge cases are handled
- [ ] Security concerns addressed
- [ ] Performance implications considered
- [ ] Tests cover main scenarios
- [ ] Documentation is updated
- [ ] No breaking changes (or properly documented)

## Best Practices

### DRY (Don't Repeat Yourself)

```typescript
// ❌ Bad - Repetitive code
function formatDocumentTitle(doc: Document): string {
  return doc.title.trim().toLowerCase();
}

function formatCategoryName(cat: Category): string {
  return cat.name.trim().toLowerCase();
}

// ✅ Good - Reusable utility
function normalizeString(str: string): string {
  return str.trim().toLowerCase();
}

const title = normalizeString(doc.title);
const categoryName = normalizeString(cat.name);
```

### Single Responsibility

```typescript
// ❌ Bad - Multiple responsibilities
function processDocument(doc: Document) {
  // Validate
  if (!doc.title) throw new Error('Title required');
  
  // Transform
  doc.title = doc.title.trim();
  
  // Save to database
  db.insert('documents', doc);
  
  // Send notification
  notificationService.send('Document created');
}

// ✅ Good - Separated concerns
function validateDocument(doc: Document): void {
  if (!doc.title) throw new Error('Title required');
}

function normalizeDocument(doc: Document): Document {
  return { ...doc, title: doc.title.trim() };
}

async function saveDocument(doc: Document): Promise<void> {
  await db.insert('documents', doc);
}

function notifyDocumentCreated(): void {
  notificationService.send('Document created');
}
```

### Immutability

```typescript
// ❌ Bad - Mutating state
function addTag(document: Document, tag: string) {
  document.tags.push(tag);
  return document;
}

// ✅ Good - Immutable update
function addTag(document: Document, tag: string): Document {
  return {
    ...document,
    tags: [...document.tags, tag],
  };
}
```

## Tài Liệu Liên Quan

- [Cài Đặt Môi Trường](./cai-dat-moi-truong.md)
- [Cấu Trúc Dự Án](./cau-truc-du-an.md)
- [Testing](./testing.md)
