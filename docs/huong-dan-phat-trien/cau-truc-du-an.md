# Cấu Trúc Dự Án

## Tổng Quan

Dự án Thư Viện Tài Liệu được xây dựng trên kiến trúc Electron với React, TypeScript và SQLite. Cấu trúc được tổ chức theo mô hình monorepo với sự phân tách rõ ràng giữa main process và renderer process.

## Cấu Trúc Thư Mục Chính

```
thuvien-documents/
├── src/                    # Source code chính
├── public/                 # Static assets
├── dist/                   # Build output
├── data/                   # Database và data files
├── logs/                   # Application logs
├── docs/                   # Documentation
├── tests/                  # Test files
├── scripts/                # Build và utility scripts
├── .vscode/                # VS Code configuration
├── node_modules/           # Dependencies
└── config/                 # Configuration files
```

## Chi Tiết Thư Mục /src

### /src/main - Electron Main Process

Main process xử lý logic backend, quản lý cửa sổ, và giao tiếp với hệ điều hành.

```
src/main/
├── index.ts                # Entry point của main process
├── window/                 # Window management
│   ├── mainWindow.ts       # Main window configuration
│   ├── windowManager.ts    # Window lifecycle management
│   └── windowState.ts      # Window state persistence
├── menu/                   # Application menu
│   ├── menuBuilder.ts      # Menu construction
│   └── menuTemplates.ts    # Menu templates
├── services/               # Business logic services
│   ├── documentService.ts  # Document operations
│   ├── categoryService.ts  # Category management
│   ├── searchService.ts    # Search functionality
│   ├── exportService.ts    # Export operations
│   └── backupService.ts    # Backup/restore
├── utils/                  # Utility functions
│   ├── fileSystem.ts       # File operations
│   ├── logger.ts           # Logging utility
│   └── security.ts         # Security helpers
└── config/                 # Main process configuration
    ├── constants.ts        # Constants
    └── paths.ts            # Path definitions
```

**Naming Convention**:
- Files: camelCase (e.g., `documentService.ts`)
- Classes: PascalCase (e.g., `DocumentService`)
- Functions: camelCase (e.g., `createDocument`)

### /src/renderer - React Application

Renderer process chứa UI được xây dựng bằng React.

```
src/renderer/
├── index.tsx               # Entry point
├── App.tsx                 # Root component
├── components/             # React components
│   ├── common/             # Shared components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Table/
│   ├── layout/             # Layout components
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── Footer/
│   └── features/           # Feature-specific components
│       ├── documents/
│       │   ├── DocumentList/
│       │   ├── DocumentForm/
│       │   ├── DocumentDetail/
│       │   └── DocumentSearch/
│       ├── categories/
│       └── statistics/
├── pages/                  # Page components
│   ├── HomePage.tsx
│   ├── DocumentsPage.tsx
│   ├── CategoriesPage.tsx
│   └── SettingsPage.tsx
├── hooks/                  # Custom React hooks
│   ├── useDocuments.ts
│   ├── useCategories.ts
│   ├── useSearch.ts
│   └── useIpc.ts
├── store/                  # State management (Zustand/Redux)
│   ├── index.ts
│   ├── documentStore.ts
│   ├── categoryStore.ts
│   └── uiStore.ts
├── services/               # API/IPC services
│   ├── api.ts              # IPC communication wrapper
│   └── storage.ts          # LocalStorage wrapper
├── utils/                  # Utility functions
│   ├── formatters.ts       # Data formatting
│   ├── validators.ts       # Input validation
│   └── helpers.ts          # General helpers
├── styles/                 # Global styles
│   ├── global.css
│   ├── variables.css
│   └── themes.css
└── assets/                 # Images, icons, fonts
    ├── images/
    ├── icons/
    └── fonts/
```

**Component Structure**:
```typescript
// Button/Button.tsx
import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  onClick, 
  children 
}) => {
  return (
    <button 
      className={styles[variant]} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

### /src/shared - Shared Code

Code được chia sẻ giữa main và renderer process.

```
src/shared/
├── types/                  # TypeScript types & interfaces
│   ├── document.ts
│   ├── category.ts
│   ├── user.ts
│   └── index.ts
├── constants/              # Shared constants
│   ├── ipcChannels.ts      # IPC channel names
│   ├── routes.ts           # Route constants
│   └── config.ts           # App configuration
├── utils/                  # Shared utilities
│   ├── dateUtils.ts
│   ├── stringUtils.ts
│   └── validationUtils.ts
└── enums/                  # Enumerations
    ├── documentStatus.ts
    └── userRole.ts
```

**Type Definitions Example**:
```typescript
// types/document.ts
export interface Document {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  status: DocumentStatus;
}

export interface CreateDocumentDto {
  title: string;
  description?: string;
  categoryId: string;
  filePath: string;
  tags?: string[];
}

export interface UpdateDocumentDto extends Partial<CreateDocumentDto> {
  id: string;
}
```

### /src/database - Database Layer

Quản lý SQLite database, schemas và migrations.

```
src/database/
├── index.ts                # Database initialization
├── connection.ts           # Database connection
├── schemas/                # Table schemas
│   ├── documents.ts
│   ├── categories.ts
│   ├── tags.ts
│   └── settings.ts
├── migrations/             # Database migrations
│   ├── 001_initial.ts
│   ├── 002_add_tags.ts
│   └── 003_add_indexes.ts
├── repositories/           # Data access layer
│   ├── documentRepository.ts
│   ├── categoryRepository.ts
│   └── tagRepository.ts
└── seeders/                # Seed data
    └── initialData.ts
```

**Repository Pattern Example**:
```typescript
// repositories/documentRepository.ts
import { Database } from 'better-sqlite3';
import { Document, CreateDocumentDto } from '@shared/types';

export class DocumentRepository {
  constructor(private db: Database) {}

  findAll(): Document[] {
    const stmt = this.db.prepare('SELECT * FROM documents');
    return stmt.all() as Document[];
  }

  findById(id: string): Document | undefined {
    const stmt = this.db.prepare('SELECT * FROM documents WHERE id = ?');
    return stmt.get(id) as Document | undefined;
  }

  create(data: CreateDocumentDto): Document {
    const stmt = this.db.prepare(`
      INSERT INTO documents (title, description, categoryId, filePath)
      VALUES (@title, @description, @categoryId, @filePath)
    `);
    const result = stmt.run(data);
    return this.findById(result.lastInsertRowid.toString())!;
  }

  // ... other methods
}
```

### /src/ipc - IPC Communication

Xử lý giao tiếp giữa main và renderer process.

```
src/ipc/
├── index.ts                # IPC setup
├── channels.ts             # Channel definitions
├── handlers/               # IPC handlers
│   ├── documentHandlers.ts
│   ├── categoryHandlers.ts
│   ├── fileHandlers.ts
│   └── systemHandlers.ts
└── types.ts                # IPC-specific types
```

**IPC Handler Example**:
```typescript
// handlers/documentHandlers.ts
import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '@shared/constants';
import { DocumentService } from '@main/services';

export function registerDocumentHandlers(documentService: DocumentService) {
  ipcMain.handle(IPC_CHANNELS.DOCUMENT_GET_ALL, async () => {
    return await documentService.getAllDocuments();
  });

  ipcMain.handle(IPC_CHANNELS.DOCUMENT_CREATE, async (_, data) => {
    return await documentService.createDocument(data);
  });

  ipcMain.handle(IPC_CHANNELS.DOCUMENT_UPDATE, async (_, id, data) => {
    return await documentService.updateDocument(id, data);
  });

  ipcMain.handle(IPC_CHANNELS.DOCUMENT_DELETE, async (_, id) => {
    return await documentService.deleteDocument(id);
  });
}
```

## Naming Conventions

### Files và Folders

- **Components**: PascalCase (e.g., `DocumentList.tsx`)
- **Utilities**: camelCase (e.g., `dateUtils.ts`)
- **Constants**: camelCase (e.g., `ipcChannels.ts`)
- **Types**: camelCase (e.g., `document.ts`)
- **Folders**: camelCase (e.g., `components/`, `utils/`)

### Code

- **Variables**: camelCase (e.g., `documentList`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **Functions**: camelCase (e.g., `getDocumentById`)
- **Classes**: PascalCase (e.g., `DocumentService`)
- **Interfaces**: PascalCase (e.g., `IDocumentService`)
- **Types**: PascalCase (e.g., `DocumentStatus`)
- **Enums**: PascalCase (e.g., `UserRole`)

## Module Organization

### Import Order

```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal modules (absolute imports)
import { Document } from '@shared/types';
import { IPC_CHANNELS } from '@shared/constants';
import { useDocuments } from '@renderer/hooks';

// 3. Relative imports
import { Button } from '../common/Button';
import styles from './DocumentList.module.css';

// 4. Assets
import logo from '@assets/images/logo.png';
```

### Export Patterns

```typescript
// Named exports (preferred)
export const DocumentList = () => { /* ... */ };
export const DocumentItem = () => { /* ... */ };

// Default export (for pages/main components)
export default DocumentsPage;

// Re-exports (index files)
export { DocumentList } from './DocumentList';
export { DocumentItem } from './DocumentItem';
export * from './types';
```

## Import Paths

### Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@main/*": ["src/main/*"],
      "@renderer/*": ["src/renderer/*"],
      "@shared/*": ["src/shared/*"],
      "@database/*": ["src/database/*"],
      "@ipc/*": ["src/ipc/*"],
      "@assets/*": ["src/renderer/assets/*"]
    }
  }
}
```

### Usage Examples

```typescript
// ❌ Bad - relative paths
import { Document } from '../../../shared/types/document';

// ✅ Good - path aliases
import { Document } from '@shared/types';

// ❌ Bad - mixing styles
import { Button } from '../common/Button';
import { Modal } from '@renderer/components/common/Modal';

// ✅ Good - consistent style
import { Button } from '@renderer/components/common/Button';
import { Modal } from '@renderer/components/common/Modal';
```

## Best Practices

1. **Single Responsibility**: Mỗi file/module chỉ làm một việc
2. **DRY (Don't Repeat Yourself)**: Tránh code trùng lặp
3. **Separation of Concerns**: Tách biệt UI, logic và data
4. **Consistent Structure**: Giữ cấu trúc nhất quán trong toàn bộ project
5. **Index Files**: Sử dụng index.ts để export public API của module

## Tài Liệu Liên Quan

- [Cài Đặt Môi Trường](./cai-dat-moi-truong.md)
- [Quy Tắc Code](./quy-tac-code.md)
- [Testing](./testing.md)
