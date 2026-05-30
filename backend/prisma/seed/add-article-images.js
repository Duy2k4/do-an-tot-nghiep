const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  console.log('Dang them anh bai viet...\n');
  
  // Lấy các bài viết hiện có
  const articles = await prisma.article.findMany({ take: 5 });
  
  if (articles.length === 0) {
    console.log('Khong tim thay bai viet. Hay chay seed truoc.');
    return;
  }
  
  // Định nghĩa ảnh bài viết cho 5 bài đầu tiên
  const articleImages = [
    // Bài viết 1 - Top 10 điểm đến
    { articleId: articles[0].id, url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800', caption: 'Vịnh Hạ Long - Kỳ quan thiên nhiên', isPrimary: true, sortOrder: 0 },
    { articleId: articles[0].id, url: 'https://images.unsplash.com/photo-1573270689103-d7a4e42b609a?w=800', caption: 'Du thuyền trên vịnh', isPrimary: false, sortOrder: 1 },
    { articleId: articles[0].id, url: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800', caption: 'Hang động Hạ Long', isPrimary: false, sortOrder: 2 },
    { articleId: articles[0].id, url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', caption: 'Phong cảnh Việt Nam', isPrimary: false, sortOrder: 3 },
    
    // Bài viết 2 - Hướng dẫn Hội An
    { articleId: articles[1].id, url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800', caption: 'Phố cổ Hội An', isPrimary: true, sortOrder: 0 },
    { articleId: articles[1].id, url: 'https://images.unsplash.com/photo-1597932578892-416ec6f15a1c?w=800', caption: 'Đèn lồng Hội An', isPrimary: false, sortOrder: 1 },
    { articleId: articles[1].id, url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', caption: 'Ẩm thực Hội An', isPrimary: false, sortOrder: 2 },
    
    // Bài viết 3 - Mẹo tiết kiệm
    { articleId: articles[2].id, url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800', caption: 'Du lịch Việt Nam', isPrimary: true, sortOrder: 0 },
    { articleId: articles[2].id, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', caption: 'Bãi biển đẹp', isPrimary: false, sortOrder: 1 },
    
    // Bài viết 4 - Ẩm thực Hà Nội
    { articleId: articles[3].id, url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800', caption: 'Phở Hà Nội', isPrimary: true, sortOrder: 0 },
    { articleId: articles[3].id, url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800', caption: 'Bún chả Hà Nội', isPrimary: false, sortOrder: 1 },
    { articleId: articles[3].id, url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800', caption: 'Cà phê trứng', isPrimary: false, sortOrder: 2 },
    
    // Bài viết 5 - Mùa hoa Đà Lạt
    { articleId: articles[4].id, url: 'https://images.unsplash.com/photo-1597932578892-416ec6f15a1c?w=800', caption: 'Đà Lạt mùa hoa', isPrimary: true, sortOrder: 0 },
    { articleId: articles[4].id, url: 'https://images.unsplash.com/photo-1583163090260-8e62b645f7f5?w=800', caption: 'Hoa dã quỳ', isPrimary: false, sortOrder: 1 },
  ];
  
  let addedCount = 0;
  
  for (const img of articleImages) {
    try {
      // Kiểm tra ảnh đã tồn tại chưa
      const existing = await prisma.articleImage.findFirst({
        where: { articleId: img.articleId, url: img.url }
      });
      
      if (!existing) {
        await prisma.articleImage.create({
          data: {
            id: uuidv4(),
            ...img
          }
        });
        addedCount++;
      }
    } catch (error) {
      // Bỏ qua bản ghi trùng
    }
  }
  
  console.log(`Da them ${addedCount} anh bai viet`);
  console.log('\nHoan tat!');
}

main()
  .catch((e) => {
    console.error('Loi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
