import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

test('site branding is rewritten for the IIT accounting platform', () => {
  const config = read('docusaurus.config.ts');
  const readme = read('README.md');

  assert.match(config, /Phần mềm kế toán doanh nghiệp IIT/u);
  assert.match(readme, /Phần mềm kế toán doanh nghiệp IIT/u);
  assert.doesNotMatch(config, /IIT IT Handbook/u);
  assert.match(readme, /TT 99\/2025\/TT-BTC/u);
});

test('landing page exposes the four documentation hubs', () => {
  const indexPage = read('src/pages/index.tsx');

  assert.match(indexPage, /Kiến trúc nền tảng/u);
  assert.match(indexPage, /Nghiệp vụ cốt lõi/u);
  assert.match(indexPage, /Hướng dẫn theo vai trò/u);
  assert.match(indexPage, /Báo cáo & vận hành/u);
  assert.match(indexPage, /TT 99\/2025\/TT-BTC/u);
});

test('sidebar is rebuilt around the new information architecture', () => {
  const sidebars = read('sidebars.ts');

  assert.match(sidebars, /Kiến trúc & nền tảng kỹ thuật/u);
  assert.match(sidebars, /Domain & microservice/u);
  assert.match(sidebars, /Nghiệp vụ & bút toán/u);
  assert.match(sidebars, /Hướng dẫn theo vai trò/u);
  assert.match(sidebars, /Báo cáo & vận hành/u);
  assert.doesNotMatch(sidebars, /Quy chuẩn vận hành/u);
  assert.match(sidebars, /tong-quan\/chuyen-doi-tt99/u);
});

test('core accounting documentation files exist', () => {
  const expectedDocs = [
    'docs/intro.md',
    'docs/tong-quan/chuyen-doi-tt99.md',
    'docs/tong-quan/tam-nhin-va-pham-vi.md',
    'docs/tong-quan/mo-hinh-tenant-va-to-chuc.md',
    'docs/kien-truc/tong-quan-kien-truc.md',
    'docs/domain/inventory.md',
    'docs/nghiep-vu/nhap-kho-va-mua-hang.md',
    'docs/nghiep-vu/xuat-kho-va-ban-hang.md',
    'docs/nghiep-vu/dieu-chinh-va-kiem-ke.md',
    'docs/vai-tro/thu-kho.md',
    'docs/bao-cao-va-van-hanh/bao-cao-ke-toan.md',
  ];

  for (const file of expectedDocs) {
    assert.equal(exists(file), true, `${file} should exist`);
  }
});

test('TT99 is the default accounting reference and TT200 only appears in transition notes', () => {
  const files = [
    'README.md',
    'src/pages/index.tsx',
    'docs/intro.md',
    'docs/tong-quan/chuyen-doi-tt99.md',
    'docs/tong-quan/mo-hinh-tenant-va-to-chuc.md',
    'docs/tong-quan/glossary-ke-toan.md',
    'docs/domain/general-ledger.md',
    'docs/nghiep-vu/nhap-kho-va-mua-hang.md',
    'docs/nghiep-vu/xuat-kho-va-ban-hang.md',
    'docs/bao-cao-va-van-hanh/bao-cao-ke-toan.md',
  ].map(read);

  assert.match(files.join('\n'), /TT 99\/2025\/TT-BTC/u);

  const nonTransitionContent = [
    read('README.md'),
    read('src/pages/index.tsx'),
    read('docs/intro.md'),
    read('docs/tong-quan/mo-hinh-tenant-va-to-chuc.md'),
    read('docs/domain/general-ledger.md'),
    read('docs/nghiep-vu/nhap-kho-va-mua-hang.md'),
    read('docs/nghiep-vu/xuat-kho-va-ban-hang.md'),
  ].join('\n');

  assert.doesNotMatch(nonTransitionContent, /TT200|TT 200|200\/2014\/TT-BTC|Thông tư 200/u);
  assert.match(read('docs/tong-quan/chuyen-doi-tt99.md'), /200\/2014\/TT-BTC/u);
});
