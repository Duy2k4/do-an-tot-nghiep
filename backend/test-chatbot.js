const API_BASE = 'http://localhost:3000/api/chatbot';

// Các ca kiểm thử với 10 câu hỏi thực tế
const testCases = [
  {
    id: 1,
    question: "Xin chào, bạn có thể giới thiệu về website này không?",
    category: "Giới thiệu"
  },
  {
    id: 2,
    question: "Tôi muốn tìm địa điểm du lịch biển đẹp ở miền Trung, bạn có gợi ý gì không?",
    category: "Tìm kiếm địa điểm"
  },
  {
    id: 3,
    question: "Chi phí du lịch Sa Pa vào mùa đông khoảng bao nhiêu?",
    category: "Chi phí"
  },
  {
    id: 4,
    question: "Tôi đi cùng gia đình có 2 con nhỏ, nên chọn tour nào phù hợp?",
    category: "Tư vấn tour"
  },
  {
    id: 5,
    question: "Website có hỗ trợ đặt tour trực tuyến không?",
    category: "Hỏi về dịch vụ"
  },
  {
    id: 6,
    question: "Địa điểm nào phù hợp để du lịch một mình an toàn?",
    category: "An toàn"
  },
  {
    id: 7,
    question: "Thời gian tốt nhất để đi Hội An là khi nào?",
    category: "Thời gian"
  },
  {
    id: 8,
    question: "Tôi thích ẩm thực, nên đi đâu để trải nghiệm ẩm thực Việt Nam?",
    category: "Ẩm thực"
  },
  {
    id: 9,
    question: "Có tour nào khám phá vịnh Hạ Long với giá hợp lý không?",
    category: "Tour giá rẻ"
  },
  {
    id: 10,
    question: "Làm thế nào để liên hệ với bộ phận hỗ trợ khách hàng?",
    category: "Hỗ trợ"
  }
];

async function callChatbot(message) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });
  return await response.json();
}

async function testChatbot() {
  console.log('='.repeat(80));
  console.log('CHATBOT TEST - 10 CÂU HỎI THỰC TẾ');
  console.log('='.repeat(80));
  console.log('');

  const results = [];

  for (const test of testCases) {
    console.log(`\n[${test.id}/10] ${test.category.toUpperCase()}`);
    console.log(`Q: ${test.question}`);
    console.log('-'.repeat(60));

    try {
      const startTime = Date.now();
      const data = await callChatbot(test.question);
      const endTime = Date.now();
      const duration = endTime - startTime;

      const answer = data.reply;
      console.log(`A: ${answer}`);
      console.log(`[Time: ${duration}ms]`);

      // Kiểm tra chất lượng cơ bản
      const checks = {
        hasAnswer: answer && answer.length > 10,
        isVietnamese: /[àáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/i.test(answer) || answer.includes('Tôi') || answer.includes('bạn'),
        notEmpty: answer && answer.trim().length > 0
      };

      results.push({
        id: test.id,
        category: test.category,
        question: test.question,
        answer: answer,
        duration: duration,
        status: checks.hasAnswer && checks.isVietnamese && checks.notEmpty ? 'PASS' : 'FAIL',
        checks: checks
      });

    } catch (error) {
      console.log(`ERROR: ${error.message}`);

      results.push({
        id: test.id,
        category: test.category,
        question: test.question,
        answer: null,
        error: error.message,
        status: 'ERROR',
        duration: 0
      });
    }
  }

  // In tóm tắt kết quả
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const errors = results.filter(r => r.status === 'ERROR').length;
  const avgTime = results.filter(r => r.duration > 0).reduce((sum, r) => sum + r.duration, 0) / results.filter(r => r.duration > 0).length;

  console.log(`\nTotal: ${results.length}`);
  console.log(`Passed: ${passed} `);
  console.log(`Failed: ${failed} `);
  console.log(`Errors: ${errors} `);
  console.log(`Average Response Time: ${Math.round(avgTime)}ms`);

  console.log('\n--- DETAILED RESULTS ---');
  results.forEach(r => {
    const icon = r.status === 'PASS' ? '' : r.status === 'ERROR' ? '' : '';
    console.log(`\n${icon} Test #${r.id} [${r.category}] - ${r.status}`);
    console.log(`   Q: ${r.question}`);
    if (r.answer) {
      console.log(`   A: ${r.answer.substring(0, 150)}${r.answer.length > 150 ? '...' : ''}`);
    } else if (r.error) {
      console.log(`   Error: ${r.error}`);
    }
    if (r.duration > 0) {
      console.log(`   Time: ${r.duration}ms`);
    }
  });

  // Đánh giá chất lượng
  console.log('\n' + '='.repeat(80));
  console.log('QUALITY EVALUATION');
  console.log('='.repeat(80));

  const validResults = results.filter(r => r.status === 'PASS');

  // Kiểm tra các chỉ số chất lượng
  const helpfulAnswers = validResults.filter(r =>
    r.answer.includes('bạn') ||
    r.answer.includes('tôi') ||
    r.answer.includes('gợi ý') ||
    r.answer.includes('đề xuất') ||
    r.answer.includes('nên')
  ).length;

  const specificAnswers = validResults.filter(r =>
    r.answer.length > 50
  ).length;

  const hasContact = validResults.filter(r =>
    r.answer.includes('liên hệ') ||
    r.answer.includes('contact') ||
    r.answer.includes('email') ||
    r.answer.includes('hotline')
  ).length;

  console.log(`\nChi so:`);
  console.log(`   - Answers with helpful suggestions: ${helpfulAnswers}/${validResults.length} (${Math.round(helpfulAnswers/validResults.length*100)}%)`);
  console.log(`   - Detailed answers (>50 chars): ${specificAnswers}/${validResults.length} (${Math.round(specificAnswers/validResults.length*100)}%)`);
  console.log(`   - Answers mentioning contact info: ${hasContact}/${validResults.length}`);

  console.log('\n Overall Assessment:');
  const passRate = (passed / results.length) * 100;
  if (passRate >= 80) {
    console.log('    EXCELLENT: Chatbot hoạt động tốt với hơn 80% câu hỏi.');
  } else if (passRate >= 60) {
    console.log('    GOOD: Chatbot hoạt động khá tốt, cần cải thiện một số trường hợp.');
  } else if (passRate >= 40) {
    console.log('    MODERATE: Chatbot cần được cải thiện đáng kể.');
  } else {
    console.log('    POOR: Chatbot gặp nhiều vấn đề, cần kiểm tra lại hệ thống.');
  }

  console.log('\n' + '='.repeat(80));
}

testChatbot().catch(console.error);
