const http = require('http');

const BASE = 'http://localhost:3000';
let adminToken = '';
let testIds = {};

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const fullPath = path.startsWith('/') ? path : '/' + path;
    const options = {
      hostname: 'localhost',
      port: '3000',
      path: fullPath,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = 'Bearer ' + token;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(8000, function() { req.destroy(); reject(new Error('Timeout')); });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  const results = [];
  const pass = function(name, status, detail) {
    detail = detail || '';
    const ok = status >= 200 && status < 300;
    results.push({ name: name, status: status, ok: ok, detail: detail });
    console.log((ok ? 'PASS' : 'FAIL') + ' [' + status + '] ' + name + (detail ? ' - ' + detail : ''));
  };

  // 1. Kiểm tra trạng thái hệ thống
  try {
    const r = await request('GET', '/api/health');
    pass('GET /api/health', r.status);
  } catch (e) { pass('GET /api/health', 0, e.message); }

  // 2. Endpoint công khai
  try {
    const r = await request('GET', '/api/destinations');
    pass('GET /api/destinations', r.status);
  } catch (e) { pass('GET /api/destinations', 0, e.message); }

  try {
    const r = await request('GET', '/api/tours');
    pass('GET /api/tours', r.status);
    if (r.data && r.data.data && r.data.data[0]) testIds.tour = r.data.data[0].id;
  } catch (e) { pass('GET /api/tours', 0, e.message); }

  try {
    const r = await request('GET', '/api/articles');
    pass('GET /api/articles', r.status);
  } catch (e) { pass('GET /api/articles', 0, e.message); }

  try {
    const r = await request('GET', '/api/categories/destinations');
    pass('GET /api/categories/destinations', r.status);
    if (r.data && r.data[0]) testIds.category = r.data[0].id;
  } catch (e) { pass('GET /api/categories/destinations', 0, e.message); }

  try {
    const r = await request('GET', '/api/categories/articles');
    pass('GET /api/categories/articles', r.status);
    if (r.data && r.data[0]) testIds.articleCategory = r.data[0].id;
  } catch (e) { pass('GET /api/categories/articles', 0, e.message); }

  try {
    const r = await request('GET', '/api/categories/provinces');
    pass('GET /api/categories/provinces', r.status);
    if (r.data && r.data[0]) testIds.province = r.data[0].id;
  } catch (e) { pass('GET /api/categories/provinces', 0, e.message); }

  try {
    const r = await request('GET', '/api/recommendations/popular');
    pass('GET /api/recommendations/popular', r.status);
  } catch (e) { pass('GET /api/recommendations/popular', 0, e.message); }

  try {
    const r = await request('POST', '/api/chatbot', { message: 'xin chao' });
    pass('POST /api/chatbot', r.status);
  } catch (e) { pass('POST /api/chatbot', 0, e.message); }

  try {
    const r = await request('POST', '/api/recommendations', { preferences: {} });
    pass('POST /api/recommendations', r.status);
  } catch (e) { pass('POST /api/recommendations', 0, e.message); }

  // 3. Xác thực - Đăng nhập (cần tài khoản admin)
  try {
    const r = await request('POST', '/api/auth/login', { email: 'admin@webquangbadulich.com', password: 'admin123' });
    pass('POST /api/auth/login (admin)', r.status, r.data.error || '');
    if (r.data && r.data.token) {
      adminToken = r.data.token;
      console.log('  -> Admin token obtained');
    }
  } catch (e) { pass('POST /api/auth/login (admin)', 0, e.message); }

  if (!adminToken) {
    console.log('\nNo admin token - skipping protected routes');
    printSummary(results);
    return;
  }

  // 4. Endpoint được bảo vệ (admin)
  try {
    const r = await request('GET', '/api/dashboard', null, adminToken);
    pass('GET /api/dashboard', r.status);
  } catch (e) { pass('GET /api/dashboard', 0, e.message); }

  try {
    const r = await request('GET', '/api/users', null, adminToken);
    pass('GET /api/users', r.status);
  } catch (e) { pass('GET /api/users', 0, e.message); }

  try {
    const r = await request('GET', '/api/inquiries', null, adminToken);
    pass('GET /api/inquiries', r.status);
  } catch (e) { pass('GET /api/inquiries', 0, e.message); }

  try {
    const r = await request('GET', '/api/favorites', null, adminToken);
    pass('GET /api/favorites', r.status);
  } catch (e) { pass('GET /api/favorites', 0, e.message); }

  // 5. Tạo tour
  if (testIds.province && testIds.category) {
    try {
      const r = await request('POST', '/api/tours', {
        name: 'Tour Test Auto',
        slug: 'tour-test-auto-' + Date.now(),
        description: 'Test description',
        duration: '3 ngay 2 dem',
        maxPeople: 20,
        price: 1500000,
        destinationId: null,
      }, adminToken);
      pass('POST /api/tours (create)', r.status, (r.data && r.data.error) ? r.data.error : '');
      if (r.data && r.data.id) testIds.tourCreated = r.data.id;
    } catch (e) { pass('POST /api/tours (create)', 0, e.message); }
  } else {
    pass('POST /api/tours (create)', -1, 'Skipped - no province/category data');
  }

  // 6. Tạo bài viết
  if (testIds.articleCategory) {
    try {
      const r = await request('POST', '/api/articles', {
        title: 'Bai viet Test Auto ' + Date.now(),
        content: '<p>Noi dung test</p>',
        categoryId: testIds.articleCategory,
        isPublished: true,
        excerpt: 'Test excerpt',
      }, adminToken);
      pass('POST /api/articles (create)', r.status, (r.data && r.data.error) ? r.data.error : '');
      if (r.data && r.data.id) testIds.articleCreated = r.data.id;
    } catch (e) { pass('POST /api/articles (create)', 0, e.message); }
  } else {
    pass('POST /api/articles (create)', -1, 'Skipped - no article category');
  }

  // 7. Cập nhật tour
  if (testIds.tourCreated) {
    try {
      const r = await request('PUT', '/api/tours/' + testIds.tourCreated, {
        name: 'Tour Test Updated',
        description: 'Updated description',
        duration: '5 ngay 4 dem',
        maxPeople: 30,
        price: 2500000,
      }, adminToken);
      pass('PUT /api/tours/:id (update)', r.status, (r.data && r.data.error) ? r.data.error : '');
    } catch (e) { pass('PUT /api/tours/:id (update)', 0, e.message); }
  } else {
    pass('PUT /api/tours/:id (update)', -1, 'Skipped - no created tour');
  }

  // 8. Cập nhật bài viết
  if (testIds.articleCreated) {
    try {
      const r = await request('PUT', '/api/articles/' + testIds.articleCreated, {
        title: 'Bai viet Updated ' + Date.now(),
        content: '<p>Noi dung da cap nhat</p>',
        isPublished: true,
      }, adminToken);
      pass('PUT /api/articles/:id (update)', r.status, (r.data && r.data.error) ? r.data.error : '');
    } catch (e) { pass('PUT /api/articles/:id (update)', 0, e.message); }
  } else {
    pass('PUT /api/articles/:id (update)', -1, 'Skipped - no created article');
  }

  // 9. Inquiry public
  try {
    const r = await request('POST', '/api/inquiries', {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Inquiry',
      message: 'This is a test inquiry message for testing purposes.',
    });
    pass('POST /api/inquiries (public)', r.status, (r.data && r.data.error) ? r.data.error : '');
  } catch (e) { pass('POST /api/inquiries (public)', 0, e.message); }

  // 10. Đánh giá
  if (testIds.tour) {
    try {
      const r = await request('POST', '/api/reviews', {
        tourId: testIds.tour,
        rating: 5,
        comment: 'Tour rat tot!',
      }, adminToken);
      pass('POST /api/reviews (create)', r.status, (r.data && r.data.error) ? r.data.error : '');
    } catch (e) { pass('POST /api/reviews (create)', 0, e.message); }
  } else {
    pass('POST /api/reviews (create)', -1, 'Skipped - no tour data');
  }

  printSummary(results);
}

function printSummary(results) {
  var passed = 0, failed = 0, skipped = 0;
  results.forEach(function(r) {
    if (r.status === -1) skipped++;
    else if (r.ok) passed++;
    else failed++;
  });

  console.log('\n========== SUMMARY ==========');
  console.log('Total: ' + results.length + ' | Passed: ' + passed + ' | Failed: ' + failed + ' | Skipped: ' + skipped);

  var failures = results.filter(function(r) { return !r.ok && r.status !== -1; });
  if (failures.length > 0) {
    console.log('\nFailed endpoints:');
    failures.forEach(function(f) {
      console.log('  - ' + f.name + ' [' + f.status + '] ' + f.detail);
    });
  }
}

runTests().catch(function(e) { console.error(e); });
