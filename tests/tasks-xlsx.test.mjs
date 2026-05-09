import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import xlsx from 'xlsx';

const { readFile } = xlsx;

const root = process.cwd();
const filePath = path.join(root, 'tasks.xlsx');

const expectedHeaders = [
  'Số thứ tự',
  'Modules',
  'Tên task',
  'Vai trò',
  'Route/page',
  'Phụ trách',
  'Milestones',
  'Tình trạng',
  'Độ ưu tiên',
  'Độ khó',
  'Thời gian dự kiến (giờ)',
];

const expectedOwners = ['Backend', 'Frontend', 'DevOps'];

const requiredModules = [
  'Platform Core',
  'Frontend Shell',
  'Identity & Access',
  'Tenant Administration',
  'Master Data',
  'Product Catalog',
  'Procurement & Inbound',
  'Inventory',
  'Sales & Fulfillment',
  'Partner & Customer',
  'AR/AP',
  'General Ledger',
  'Tax & E-Invoice',
  'Reporting & Analytics',
  'Workflow & Notification',
  'CI/CD',
  'Observability',
  'Security',
];

function loadRows() {
  assert.equal(fs.existsSync(filePath), true, 'tasks.xlsx must exist');

  const workbook = readFile(filePath);
  const sheet = workbook.Sheets.Tasks;

  assert.ok(sheet, 'Workbook must contain a Tasks sheet');

  const rows = [];
  let rowIndex = 2;

  while (sheet[`A${rowIndex}`]) {
    rows.push({
      so_thu_tu: sheet[`A${rowIndex}`]?.v,
      module: sheet[`B${rowIndex}`]?.v,
      ten_task: sheet[`C${rowIndex}`]?.v,
      vai_tro: sheet[`D${rowIndex}`]?.v,
      route_page: sheet[`E${rowIndex}`]?.v,
      phu_trach: sheet[`F${rowIndex}`]?.v,
      milestone: sheet[`G${rowIndex}`]?.v,
      tinh_trang: sheet[`H${rowIndex}`]?.v,
      do_uu_tien: sheet[`I${rowIndex}`]?.v,
      do_kho: sheet[`J${rowIndex}`]?.v,
      thoi_gian_du_kien_gio: sheet[`K${rowIndex}`]?.v,
    });
    rowIndex += 1;
  }

  return { workbook, sheet, rows };
}

function headersFromSheet(sheet) {
  return expectedHeaders.map((_, index) => {
    const cell = String.fromCharCode('A'.charCodeAt(0) + index);
    return sheet[`${cell}1`]?.v;
  });
}

test('tasks.xlsx exists, uses the approved headers, and has more than 200 tasks', () => {
  const { sheet, rows } = loadRows();

  assert.deepEqual(headersFromSheet(sheet), expectedHeaders);
  assert.ok(rows.length > 200, 'Workbook must contain more than 200 tasks');
});

test('tasks.xlsx uses the approved vocabularies and workbook-only backlog source', () => {
  const { rows } = loadRows();

  assert.equal(fs.existsSync(path.join(root, 'tasks.json')), false, 'tasks.json must be removed');

  for (const [index, row] of rows.entries()) {
    assert.equal(typeof row.so_thu_tu, 'number', `row ${index + 2} must have numeric so_thu_tu`);
    assert.equal(typeof row.module, 'string');
    assert.equal(typeof row.ten_task, 'string');
    assert.equal(typeof row.vai_tro, 'string');
    assert.equal(typeof row.route_page, 'string');
    assert.equal(typeof row.phu_trach, 'string');
    assert.equal(typeof row.milestone, 'string');
    assert.equal(typeof row.tinh_trang, 'string');
    assert.equal(typeof row.do_uu_tien, 'string');
    assert.equal(typeof row.do_kho, 'number');
    assert.equal(typeof row.thoi_gian_du_kien_gio, 'number');
    assert.equal(expectedOwners.includes(row.phu_trach), true, `row ${index + 2} has unsupported owner`);
    assert.equal(row.tinh_trang === 'Chưa bắt đầu' || row.tinh_trang.trim() !== '', true);
    assert.equal(Number.isInteger(row.do_kho), true, `row ${index + 2} must use integer difficulty`);
    assert.equal(row.do_kho >= 1 && row.do_kho <= 10, true, `row ${index + 2} difficulty must be within 1..10`);
    assert.equal(row.thoi_gian_du_kien_gio > 0, true, `row ${index + 2} estimate must be positive`);
  }
});

test('tasks.xlsx preserves milestone coverage and core module coverage', () => {
  const { rows } = loadRows();

  const milestoneOwners = new Map();
  const modules = new Map();

  for (const row of rows) {
    if (!milestoneOwners.has(row.milestone)) {
      milestoneOwners.set(row.milestone, new Set());
    }

    if (!modules.has(row.module)) {
      modules.set(row.module, new Set());
    }

    milestoneOwners.get(row.milestone).add(row.phu_trach);
    modules.get(row.module).add(row.phu_trach);
  }

  for (const [milestone, owners] of milestoneOwners.entries()) {
    assert.deepEqual(
      Array.from(owners).sort(),
      [...expectedOwners].sort(),
      `${milestone} must include Backend, Frontend, and DevOps tasks`,
    );
  }

  for (const module of requiredModules) {
    assert.equal(modules.has(module), true, `${module} must exist in tasks.xlsx`);
    assert.equal(modules.get(module).size >= 1, true, `${module} must have at least one task`);
  }
});
