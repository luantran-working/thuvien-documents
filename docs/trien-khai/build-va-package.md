# Build và Package

Hướng dẫn build ứng dụng và tạo installer cho triển khai.

## Build Production

### Build ứng dụng

```bash
npm run build
```

Lệnh này sẽ:
- Compile TypeScript sang JavaScript
- Bundle các module với Webpack/Vite
- Minify và optimize code
- Tạo thư mục `dist/` chứa file build

### Kiểm tra build

```bash
npm run preview
```

Chạy ứng dụng từ bản build để kiểm tra trước khi package.

## Package với Electron Builder

### Cài đặt electron-builder

```bash
npm install --save-dev electron-builder
```

### Cấu hình electron-builder.json

Tạo file `electron-builder.json` trong thư mục gốc:

```json
{
  "appId": "com.thuvien.app",
  "productName": "Quản Lý Thư Viện",
  "directories": {
    "output": "release",
    "buildResources": "build"
  },
  "files": [
    "dist/**/*",
    "node_modules/**/*",
    "package.json"
  ],
  "extraResources": [
    {
      "from": "resources",
      "to": "resources",
      "filter": ["**/*"]
    }
  ],
  "win": {
    "target": [
      {
        "target": "nsis",
        "arch": ["x64", "ia32"]
      }
    ],
    "icon": "build/icon.ico",
    "artifactName": "${productName}-${version}-${arch}.${ext}"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true,
    "shortcutName": "Quản Lý Thư Viện",
    "installerIcon": "build/icon.ico",
    "uninstallerIcon": "build/icon.ico",
    "installerHeaderIcon": "build/icon.ico",
    "license": "LICENSE.txt"
  },
  "mac": {
    "target": ["dmg", "zip"],
    "icon": "build/icon.icns",
    "category": "public.app-category.education"
  },
  "linux": {
    "target": ["AppImage", "deb"],
    "icon": "build/icon.png",
    "category": "Education"
  },
  "publish": {
    "provider": "github",
    "owner": "your-org",
    "repo": "thuvien-app"
  }
}
```

### Thêm scripts vào package.json

```json
{
  "scripts": {
    "build": "vite build",
    "package": "electron-builder build --win --x64",
    "package:all": "electron-builder build --win --mac --linux",
    "package:win": "electron-builder build --win",
    "package:mac": "electron-builder build --mac",
    "package:linux": "electron-builder build --linux"
  }
}
```

## Tạo Installer Windows

### Build installer .exe

```bash
npm run package:win
```

Kết quả trong thư mục `release/`:
- `Quản Lý Thư Viện-1.0.0-x64.exe` - Installer 64-bit
- `Quản Lý Thư Viện-1.0.0-ia32.exe` - Installer 32-bit

### Cấu hình NSIS nâng cao

Tạo file `build/installer.nsh` cho custom installer:

```nsis
!macro customInstall
  ; Tạo thư mục dữ liệu
  CreateDirectory "$APPDATA\ThuVien\data"
  CreateDirectory "$APPDATA\ThuVien\logs"
  
  ; Copy database mẫu
  File /oname=$APPDATA\ThuVien\data\sample.db "${BUILD_RESOURCES_DIR}\sample.db"
!macroend

!macro customUnInstall
  ; Hỏi người dùng có muốn xóa dữ liệu không
  MessageBox MB_YESNO "Bạn có muốn xóa dữ liệu ứng dụng?" IDYES true IDNO false
  true:
    RMDir /r "$APPDATA\ThuVien"
  false:
!macroend
```

Thêm vào `electron-builder.json`:

```json
{
  "nsis": {
    "include": "build/installer.nsh"
  }
}
```

## Code Signing

### Chuẩn bị certificate

1. Mua code signing certificate từ CA (DigiCert, Sectigo, etc.)
2. Export certificate dạng `.pfx` hoặc `.p12`
3. Lưu password an toàn

### Cấu hình signing

Thêm vào `electron-builder.json`:

```json
{
  "win": {
    "certificateFile": "certs/certificate.pfx",
    "certificatePassword": "${env.CSC_KEY_PASSWORD}",
    "signingHashAlgorithms": ["sha256"],
    "signDlls": true
  }
}
```

### Build với signing

```bash
# Set password qua environment variable
set CSC_KEY_PASSWORD=your-password

# Build
npm run package:win
```

### Signing với Azure Key Vault (khuyến nghị)

```json
{
  "win": {
    "azureSignOptions": {
      "endpoint": "https://your-vault.vault.azure.net",
      "certificateName": "your-cert-name"
    }
  }
}
```

## Auto-Update Configuration

### Cài đặt electron-updater

```bash
npm install electron-updater
```

### Cấu hình trong main process

```typescript
// main.ts
import { autoUpdater } from 'electron-updater';

autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'your-org',
  repo: 'thuvien-app',
  private: false
});

// Kiểm tra update khi khởi động
app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});

// Kiểm tra update định kỳ (mỗi 4 giờ)
setInterval(() => {
  autoUpdater.checkForUpdatesAndNotify();
}, 4 * 60 * 60 * 1000);

// Events
autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info.version);
});

autoUpdater.on('update-downloaded', (info) => {
  // Thông báo người dùng
  dialog.showMessageBox({
    type: 'info',
    title: 'Cập nhật sẵn sàng',
    message: `Phiên bản ${info.version} đã được tải xuống. Khởi động lại để cập nhật?`,
    buttons: ['Khởi động lại', 'Để sau']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});
```

### Cấu hình publish

Thêm vào `electron-builder.json`:

```json
{
  "publish": [
    {
      "provider": "github",
      "owner": "your-org",
      "repo": "thuvien-app",
      "releaseType": "release"
    }
  ]
}
```

### Deploy update

```bash
# Build và publish lên GitHub Releases
npm run package:win -- --publish always

# Hoặc publish manual
npm run package:win
# Upload file .exe và latest.yml lên GitHub Releases
```

## Build cho Nhiều Platform

### Windows

```bash
npm run package:win
```

Tạo:
- `.exe` - NSIS installer
- `.appx` - Microsoft Store (nếu cấu hình)
- `.msi` - Windows Installer (nếu cấu hình)

### macOS

```bash
npm run package:mac
```

Yêu cầu:
- Chạy trên macOS
- Apple Developer account (cho code signing)
- Xcode Command Line Tools

Tạo:
- `.dmg` - Disk image
- `.zip` - Portable app
- `.pkg` - Installer package

### Linux

```bash
npm run package:linux
```

Tạo:
- `.AppImage` - Portable app
- `.deb` - Debian/Ubuntu package
- `.rpm` - RedHat/Fedora package
- `.snap` - Snap package

### Build tất cả platforms

```bash
npm run package:all
```

Lưu ý: Build macOS chỉ chạy trên macOS, build Windows tốt nhất trên Windows.

## Optimize Bundle Size

### Phân tích bundle

```bash
npm install --save-dev webpack-bundle-analyzer

# Thêm vào webpack config
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

### Loại bỏ dependencies không cần thiết

Trong `electron-builder.json`:

```json
{
  "files": [
    "dist/**/*",
    "!node_modules/**/{CHANGELOG.md,README.md,README,readme.md,readme}",
    "!node_modules/**/{test,__tests__,tests,powered-test,example,examples}",
    "!node_modules/**/*.d.ts",
    "!node_modules/**/*.map",
    "!node_modules/.bin"
  ]
}
```

### Sử dụng asar archive

```json
{
  "asar": true,
  "asarUnpack": [
    "node_modules/better-sqlite3/**/*",
    "resources/**/*"
  ]
}
```

### Tree shaking

Đảm bảo sử dụng ES6 imports:

```typescript
// Tốt - tree shaking
import { specific } from 'library';

// Không tốt - import toàn bộ
import * as library from 'library';
```

### Externalize native modules

```json
{
  "externals": [
    "better-sqlite3",
    "serialport",
    "node-printer"
  ]
}
```

### Compression

```json
{
  "compression": "maximum",
  "nsis": {
    "differentialPackage": true
  }
}
```

## Checklist Build Production

- [ ] Cập nhật version trong `package.json`
- [ ] Cập nhật CHANGELOG.md
- [ ] Chạy tests: `npm test`
- [ ] Chạy linter: `npm run lint`
- [ ] Build: `npm run build`
- [ ] Test build: `npm run preview`
- [ ] Package: `npm run package:win`
- [ ] Test installer trên máy sạch
- [ ] Kiểm tra auto-update
- [ ] Code signing (production)
- [ ] Upload lên GitHub Releases
- [ ] Cập nhật documentation
- [ ] Thông báo người dùng

## Troubleshooting

### Lỗi "Cannot find module"

Kiểm tra `files` trong `electron-builder.json` đã include đủ dependencies.

### Lỗi native modules

Rebuild native modules cho Electron:

```bash
npm install --save-dev electron-rebuild
npx electron-rebuild
```

### Installer không chạy

- Kiểm tra antivirus
- Chạy với quyền Administrator
- Kiểm tra Windows SmartScreen settings

### Bundle size quá lớn

- Phân tích với webpack-bundle-analyzer
- Loại bỏ dev dependencies
- Sử dụng dynamic imports
- Externalize heavy modules

### Auto-update không hoạt động

- Kiểm tra `latest.yml` được publish
- Kiểm tra URL trong `setFeedURL`
- Kiểm tra network/firewall
- Xem logs: `autoUpdater.logger`
