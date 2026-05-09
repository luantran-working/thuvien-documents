# Testing

## Tổng Quan

Project sử dụng chiến lược testing đa tầng để đảm bảo chất lượng code:

- **Unit Testing**: Jest + React Testing Library
- **Integration Testing**: Jest với mock IPC
- **E2E Testing**: Playwright
- **Coverage Target**: >80% cho tất cả modules

## Cài Đặt Testing Tools

```bash
# Cài đặt dependencies (đã có trong package.json)
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev @testing-library/user-event playwright
npm install --save-dev @types/jest ts-jest
```

## Unit Testing

### Jest Configuration

File `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '^@main/(.*)$': '<rootDir>/src/main/$1',
    '^@renderer/(.*)$': '<rootDir>/src/renderer/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@database/(.*)$': '<rootDir>/src/database/$1',
    '^@ipc/(.*)$': '<rootDir>/src/ipc/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/main/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Setup File

File `tests/setup.ts`:

```typescript
import '@testing-library/jest-dom';

// Mock window.api (IPC)
global.window.api = {
  getDocuments: jest.fn(),
  createDocument: jest.fn(),
  updateDocument: jest.fn(),
  deleteDocument: jest.fn(),
  getCategories: jest.fn(),
  // ... other IPC methods
};

// Mock Electron
jest.mock('electron', () => ({
  ipcRenderer: {
    invoke: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
  },
  app: {
    getPath: jest.fn(() => '/mock/path'),
  },
}));
```

### Testing React Components

```typescript
// DocumentList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DocumentList } from './DocumentList';
import { Document } from '@shared/types';

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Test Document 1',
    description: 'Description 1',
    categoryId: 'cat1',
    filePath: '/path/to/file1.pdf',
    fileSize: 1024,
    fileType: 'pdf',
    tags: ['tag1'],
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    status: 'published',
  },
  {
    id: '2',
    title: 'Test Document 2',
    description: 'Description 2',
    categoryId: 'cat1',
    filePath: '/path/to/file2.pdf',
    fileSize: 2048,
    fileType: 'pdf',
    tags: ['tag2'],
    createdAt: new Date('2026-01-02'),
    updatedAt: new Date('2026-01-02'),
    status: 'published',
  },
];

describe('DocumentList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<DocumentList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders documents after loading', async () => {
    (window.api.getDocuments as jest.Mock).mockResolvedValue(mockDocuments);

    render(<DocumentList />);

    await waitFor(() => {
      expect(screen.getByText('Test Document 1')).toBeInTheDocument();
      expect(screen.getByText('Test Document 2')).toBeInTheDocument();
    });
  });

  it('handles document selection', async () => {
    const onSelect = jest.fn();
    (window.api.getDocuments as jest.Mock).mockResolvedValue(mockDocuments);

    render(<DocumentList onDocumentSelect={onSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Test Document 1')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Test Document 1'));
    expect(onSelect).toHaveBeenCalledWith(mockDocuments[0]);
  });

  it('displays error message on failure', async () => {
    const errorMessage = 'Failed to load documents';
    (window.api.getDocuments as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    render(<DocumentList />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('filters documents by category', async () => {
    (window.api.getDocuments as jest.Mock).mockResolvedValue(mockDocuments);

    const { rerender } = render(<DocumentList categoryId="cat1" />);

    await waitFor(() => {
      expect(window.api.getDocuments).toHaveBeenCalledWith('cat1');
    });

    rerender(<DocumentList categoryId="cat2" />);

    await waitFor(() => {
      expect(window.api.getDocuments).toHaveBeenCalledWith('cat2');
    });
  });
});
```

### Testing Custom Hooks

```typescript
// useDocuments.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useDocuments } from './useDocuments';

describe('useDocuments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads documents on mount', async () => {
    const mockDocs = [{ id: '1', title: 'Test' }];
    (window.api.getDocuments as jest.Mock).mockResolvedValue(mockDocs);

    const { result } = renderHook(() => useDocuments());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.documents).toEqual(mockDocs);
      expect(result.current.error).toBeNull();
    });
  });

  it('handles errors', async () => {
    const errorMessage = 'Network error';
    (window.api.getDocuments as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useDocuments());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.documents).toEqual([]);
    });
  });

  it('refreshes documents', async () => {
    const mockDocs = [{ id: '1', title: 'Test' }];
    (window.api.getDocuments as jest.Mock).mockResolvedValue(mockDocs);

    const { result } = renderHook(() => useDocuments());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    (window.api.getDocuments as jest.Mock).mockClear();
    await result.current.refresh();

    expect(window.api.getDocuments).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Services (Main Process)

```typescript
// documentService.test.ts
import { DocumentService } from '@main/services/documentService';
import { DocumentRepository } from '@database/repositories';
import { Document } from '@shared/types';

jest.mock('@database/repositories');

describe('DocumentService', () => {
  let service: DocumentService;
  let mockRepository: jest.Mocked<DocumentRepository>;

  beforeEach(() => {
    mockRepository = new DocumentRepository(null as any) as jest.Mocked<DocumentRepository>;
    service = new DocumentService(mockRepository);
  });

  describe('getAllDocuments', () => {
    it('returns all documents', async () => {
      const mockDocs: Document[] = [
        { id: '1', title: 'Doc 1' } as Document,
        { id: '2', title: 'Doc 2' } as Document,
      ];
      mockRepository.findAll.mockReturnValue(mockDocs);

      const result = await service.getAllDocuments();

      expect(result).toEqual(mockDocs);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('createDocument', () => {
    it('creates a new document', async () => {
      const createDto = {
        title: 'New Document',
        categoryId: 'cat1',
        filePath: '/path/to/file.pdf',
      };
      const createdDoc = { id: '1', ...createDto } as Document;
      mockRepository.create.mockReturnValue(createdDoc);

      const result = await service.createDocument(createDto);

      expect(result).toEqual(createdDoc);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
    });

    it('throws error for invalid data', async () => {
      const invalidDto = { title: '' } as any;

      await expect(service.createDocument(invalidDto)).rejects.toThrow(
        'Title is required'
      );
    });
  });

  describe('deleteDocument', () => {
    it('deletes a document', async () => {
      const docId = '1';
      mockRepository.delete.mockReturnValue(true);

      await service.deleteDocument(docId);

      expect(mockRepository.delete).toHaveBeenCalledWith(docId);
    });

    it('throws error if document not found', async () => {
      const docId = 'nonexistent';
      mockRepository.delete.mockReturnValue(false);

      await expect(service.deleteDocument(docId)).rejects.toThrow(
        'Document not found'
      );
    });
  });
});
```

## Integration Testing

### Testing IPC Communication

```typescript
// ipc.integration.test.ts
import { ipcMain, ipcRenderer } from 'electron';
import { registerDocumentHandlers } from '@ipc/handlers/documentHandlers';
import { DocumentService } from '@main/services';

describe('Document IPC Integration', () => {
  let documentService: DocumentService;

  beforeEach(() => {
    documentService = new DocumentService(mockRepository);
    registerDocumentHandlers(documentService);
  });

  afterEach(() => {
    ipcMain.removeAllListeners();
  });

  it('handles DOCUMENT_GET_ALL request', async () => {
    const mockDocs = [{ id: '1', title: 'Test' }];
    jest.spyOn(documentService, 'getAllDocuments').mockResolvedValue(mockDocs);

    const result = await ipcRenderer.invoke('document:getAll');

    expect(result).toEqual(mockDocs);
    expect(documentService.getAllDocuments).toHaveBeenCalled();
  });

  it('handles DOCUMENT_CREATE request', async () => {
    const createDto = { title: 'New Doc', categoryId: 'cat1' };
    const createdDoc = { id: '1', ...createDto };
    jest.spyOn(documentService, 'createDocument').mockResolvedValue(createdDoc);

    const result = await ipcRenderer.invoke('document:create', createDto);

    expect(result).toEqual(createdDoc);
    expect(documentService.createDocument).toHaveBeenCalledWith(createDto);
  });
});
```

### Mocking Database

```typescript
// database.mock.ts
import Database from 'better-sqlite3';

export function createMockDatabase(): Database.Database {
  const db = new Database(':memory:');

  // Create tables
  db.exec(`
    CREATE TABLE documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      categoryId TEXT,
      filePath TEXT NOT NULL,
      fileSize INTEGER,
      fileType TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );

    CREATE TABLE categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT
    );
  `);

  return db;
}

// Usage in tests
describe('DocumentRepository', () => {
  let db: Database.Database;
  let repository: DocumentRepository;

  beforeEach(() => {
    db = createMockDatabase();
    repository = new DocumentRepository(db);
  });

  afterEach(() => {
    db.close();
  });

  it('creates a document', () => {
    const doc = repository.create({
      title: 'Test',
      categoryId: 'cat1',
      filePath: '/test.pdf',
    });

    expect(doc.id).toBeDefined();
    expect(doc.title).toBe('Test');
  });
});
```

## E2E Testing

### Playwright Configuration

File `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'electron',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### E2E Test Example

```typescript
// document-management.e2e.test.ts
import { test, expect, _electron as electron } from '@playwright/test';
import { ElectronApplication, Page } from 'playwright';

let electronApp: ElectronApplication;
let page: Page;

test.beforeAll(async () => {
  electronApp = await electron.launch({
    args: ['./dist/main/index.js'],
    env: {
      NODE_ENV: 'test',
    },
  });
  page = await electronApp.firstWindow();
});

test.afterAll(async () => {
  await electronApp.close();
});

test.describe('Document Management', () => {
  test('should create a new document', async () => {
    // Navigate to documents page
    await page.click('text=Documents');

    // Click create button
    await page.click('button:has-text("Create Document")');

    // Fill form
    await page.fill('input[name="title"]', 'Test Document');
    await page.fill('textarea[name="description"]', 'Test Description');
    await page.selectOption('select[name="categoryId"]', 'cat1');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify document appears in list
    await expect(page.locator('text=Test Document')).toBeVisible();
  });

  test('should search documents', async () => {
    // Enter search query
    await page.fill('input[placeholder="Search documents"]', 'Test');

    // Wait for results
    await page.waitForTimeout(500);

    // Verify filtered results
    const results = await page.locator('[data-testid="document-item"]').count();
    expect(results).toBeGreaterThan(0);
  });

  test('should edit a document', async () => {
    // Click on document
    await page.click('text=Test Document');

    // Click edit button
    await page.click('button:has-text("Edit")');

    // Update title
    await page.fill('input[name="title"]', 'Updated Document');

    // Save changes
    await page.click('button:has-text("Save")');

    // Verify update
    await expect(page.locator('text=Updated Document')).toBeVisible();
  });

  test('should delete a document', async () => {
    // Click on document
    await page.click('text=Updated Document');

    // Click delete button
    await page.click('button:has-text("Delete")');

    // Confirm deletion
    await page.click('button:has-text("Confirm")');

    // Verify document is removed
    await expect(page.locator('text=Updated Document')).not.toBeVisible();
  });
});
```

## Test Coverage

### Running Coverage

```bash
# Run tests with coverage
npm run test:coverage

# View coverage report
npm run coverage:report

# Open HTML coverage report
open coverage/lcov-report/index.html
```

### Coverage Requirements

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
  './src/main/services/': {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90,
  },
  './src/database/repositories/': {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90,
  },
}
```

## Test Commands

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- DocumentList.test.tsx

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests in headed mode
npm run test:e2e:headed

# Run all tests (unit + integration + e2e)
npm run test:all
```

## CI/CD Pipeline

### GitHub Actions Configuration

File `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

      - name: Run unit tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload E2E artifacts
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Best Practices

### Test Organization

```
tests/
├── unit/
│   ├── components/
│   │   └── DocumentList.test.tsx
│   ├── hooks/
│   │   └── useDocuments.test.ts
│   └── services/
│       └── documentService.test.ts
├── integration/
│   ├── ipc/
│   │   └── documentHandlers.test.ts
│   └── database/
│       └── documentRepository.test.ts
├── e2e/
│   ├── document-management.test.ts
│   └── search.test.ts
├── fixtures/
│   └── mockData.ts
└── setup.ts
```

### Test Naming

```typescript
// ✅ Good - Descriptive test names
describe('DocumentService', () => {
  describe('createDocument', () => {
    it('should create a document with valid data', () => {});
    it('should throw error when title is empty', () => {});
    it('should generate unique ID for new document', () => {});
  });
});

// ❌ Bad - Vague test names
describe('DocumentService', () => {
  it('test1', () => {});
  it('works', () => {});
  it('should work correctly', () => {});
});
```

### AAA Pattern (Arrange-Act-Assert)

```typescript
it('should filter documents by category', async () => {
  // Arrange
  const mockDocs = [
    { id: '1', categoryId: 'cat1', title: 'Doc 1' },
    { id: '2', categoryId: 'cat2', title: 'Doc 2' },
  ];
  (window.api.getDocuments as jest.Mock).mockResolvedValue(mockDocs);

  // Act
  render(<DocumentList categoryId="cat1" />);
  await waitFor(() => screen.getByText('Doc 1'));

  // Assert
  expect(screen.getByText('Doc 1')).toBeInTheDocument();
  expect(screen.queryByText('Doc 2')).not.toBeInTheDocument();
});
```

## Tài Liệu Liên Quan

- [Cài Đặt Môi Trường](./cai-dat-moi-truong.md)
- [Cấu Trúc Dự Án](./cau-truc-du-an.md)
- [Quy Tắc Code](./quy-tac-code.md)
