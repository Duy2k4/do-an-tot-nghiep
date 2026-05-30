const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function seedSettings() {
  console.log('Dang seed cai dat trang...\n');

  const settings = [
    // Chung
    { key: 'site_name', value: 'Du Lịch Quảng Bá', group: 'general', label: 'Tên website', type: 'text', isPublic: true },
    { key: 'site_description', value: 'Website giới thiệu và quảng bá du lịch Việt Nam - Du Lịch Quảng Bá', group: 'general', label: 'Mô tả website', type: 'textarea', isPublic: true },
    { key: 'site_logo', value: '/assets/images/logo.png', group: 'general', label: 'Logo website', type: 'text', isPublic: true },
    { key: 'site_favicon', value: '/assets/images/favicon.ico', group: 'general', label: 'Favicon', type: 'text', isPublic: true },
    
    // Thông tin công ty
    { key: 'company_name', value: 'Công Ty TNHH Du Lịch Quảng Bá', group: 'contact', label: 'Tên công ty', type: 'text', isPublic: true },
    { key: 'company_address', value: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', group: 'contact', label: 'Địa chỉ công ty', type: 'textarea', isPublic: true },
    { key: 'company_phone', value: '1900 1234', group: 'contact', label: 'Số điện thoại', type: 'text', isPublic: true },
    { key: 'company_email', value: 'contact@dulichquangba.vn', group: 'contact', label: 'Email liên hệ', type: 'text', isPublic: true },
    { key: 'company_hotline', value: '0901 234 567', group: 'contact', label: 'Hotline', type: 'text', isPublic: true },
    { key: 'company_tax_id', value: '0123456789', group: 'contact', label: 'Mã số thuế', type: 'text', isPublic: true },
    { key: 'business_hours', value: 'Thứ 2 - Thứ 6: 8:00 - 18:00', group: 'contact', label: 'Giờ làm việc', type: 'text', isPublic: true },
    
    // Mạng xã hội
    { key: 'social_facebook', value: 'https://facebook.com/dulichquangba', group: 'social', label: 'Facebook', type: 'text', isPublic: true },
    { key: 'social_zalo', value: '0901234567', group: 'social', label: 'Zalo', type: 'text', isPublic: true },
    { key: 'social_youtube', value: 'https://youtube.com/@dulichquangba', group: 'social', label: 'YouTube', type: 'text', isPublic: true },
    { key: 'social_instagram', value: 'https://instagram.com/dulichquangba', group: 'social', label: 'Instagram', type: 'text', isPublic: true },
    
    // SEO
    { key: 'seo_title', value: 'Du Lịch Quảng Bá - Khám Phá Việt Nam', group: 'seo', label: 'SEO Title', type: 'text', isPublic: true },
    { key: 'seo_description', value: 'Website du lịch hàng đầu Việt Nam - Tìm kiếm điểm đến, đặt tour, đọc cẩm nang và nhận gợi ý AI', group: 'seo', label: 'SEO Description', type: 'textarea', isPublic: true },
    { key: 'seo_keywords', value: 'du lịch, việt nam, tour, điểm đến, khách sạn, vé máy bay', group: 'seo', label: 'SEO Keywords', type: 'text', isPublic: true },
  ];

  let created = 0;
  let updated = 0;

  for (const setting of settings) {
    try {
      const existing = await prisma.siteSetting.findUnique({
        where: { key: setting.key }
      });

      if (existing) {
        await prisma.siteSetting.update({
          where: { key: setting.key },
          data: {
            value: setting.value,
            group: setting.group,
            label: setting.label,
            type: setting.type,
            isPublic: setting.isPublic,
          }
        });
        updated++;
        console.log(`   Updated: ${setting.key}`);
      } else {
        await prisma.siteSetting.create({
          data: { id: uuidv4(), ...setting }
        });
        created++;
        console.log(`  + Created: ${setting.key}`);
      }
    } catch (error) {
          console.error(`Loi voi ${setting.key}:`, error.message);
    }
  }

  console.log(`\n Seed completed!`);
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}`);
}

seedSettings()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
