const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  console.log('Dang khoi tao du lieu seed...\n');

  // ==================== VAI TRÒ ====================
  console.log('Creating roles...');
  const adminRole = await prisma.role.create({
    data: { id: uuidv4(), name: 'admin' }
  });
  const userRole = await prisma.role.create({
    data: { id: uuidv4(), name: 'user' }
  });
  console.log(' Roles created\n');

  // ==================== NGƯỜI DÙNG ====================
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const hashedUserPassword = await bcrypt.hash('user123', 10);

  const adminUser = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'admin@webquangbadulich.com',
      password: hashedPassword,
      fullName: 'Quản Trị Viên',
      phone: '0912345678',
      roleId: adminRole.id,
      isActive: true
    }
  });

  const testUser = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'user@webquangbadulich.com',
      password: hashedUserPassword,
      fullName: 'Nguyễn Văn A',
      phone: '0987654321',
      roleId: userRole.id,
      isActive: true
    }
  });

  const secondUser = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'user2@webquangbadulich.com',
      password: hashedUserPassword,
      fullName: 'Trần Thị B',
      phone: '0978123456',
      roleId: userRole.id,
      isActive: true
    }
  });
  console.log(' Users created\n');

  // ==================== TỈNH THÀNH ====================
  console.log('Creating provinces...');
  const provinces = await Promise.all([
    prisma.province.create({ data: { id: uuidv4(), name: 'Hà Nội', slug: 'ha-noi', region: 'NORTH' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Hải Phòng', slug: 'hai-phong', region: 'NORTH' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Quảng Ninh', slug: 'quang-ninh', region: 'NORTH' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Lai Châu', slug: 'lai-chau', region: 'NORTH' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Lào Cai', slug: 'lao-cai', region: 'NORTH' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Yên Bái', slug: 'yen-bai', region: 'NORTH' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Thanh Hóa', slug: 'thanh-hoa', region: 'CENTRAL' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Nghệ An', slug: 'nghe-an', region: 'CENTRAL' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Hà Tĩnh', slug: 'ha-tinh', region: 'CENTRAL' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Thừa Thiên Huế', slug: 'thua-thien-hue', region: 'CENTRAL' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Đà Nẵng', slug: 'da-nang', region: 'CENTRAL' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Quảng Nam', slug: 'quang-nam', region: 'CENTRAL' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Quảng Ngãi', slug: 'quang-ngai', region: 'CENTRAL' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Bình Định', slug: 'binh-dinh', region: 'CENTRAL' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Phú Yên', slug: 'phu-yen', region: 'CENTRAL' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Khánh Hòa', slug: 'khanh-hoa', region: 'CENTRAL' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Lâm Đồng', slug: 'lam-dong', region: 'CENTRAL' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Bình Thuận', slug: 'binh-thuan', region: 'CENTRAL' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Hồ Chí Minh', slug: 'ho-chi-minh', region: 'SOUTH' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Đồng Nai', slug: 'dong-nai', region: 'SOUTH' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Bà Rịa Vũng Tàu', slug: 'ba-ria-vung-tau', region: 'SOUTH' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Cần Thơ', slug: 'can-tho', region: 'SOUTH' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Kiên Giang', slug: 'kien-giang', region: 'SOUTH' } }),
    prisma.province.create({ data: { id: uuidv4(), name: 'Cà Mau', slug: 'ca-mau', region: 'SOUTH' } }),
  ]);
  console.log(` ${provinces.length} provinces created\n`);

  // ==================== DANH MỤC ĐIỂM ĐẾN ====================
  console.log('Creating destination categories...');
  const categories = await Promise.all([
    prisma.destinationCategory.create({
      data: { id: uuidv4(), name: 'Biển & Đảo', slug: 'bien-dao', icon: '', description: 'Các địa điểm biển đẹp và đảo nhiệt đới' }
    }),
    prisma.destinationCategory.create({
      data: { id: uuidv4(), name: 'Núi & Rừng', slug: 'nui-rung', icon: '', description: 'Các điểm du lịch núi non, rừng nguyên sinh' }
    }),
    prisma.destinationCategory.create({
      data: { id: uuidv4(), name: 'Di Sản', slug: 'di-san', icon: '', description: 'Các di sản văn hóa, lịch sử nổi tiếng' }
    }),
    prisma.destinationCategory.create({
      data: { id: uuidv4(), name: 'Lễ Hội', slug: 'le-hoi', icon: '', description: 'Các lễ hội văn hóa đặc sắc' }
    }),
    prisma.destinationCategory.create({
      data: { id: uuidv4(), name: 'Thiên Nhiên', slug: 'thien-nhien', icon: '', description: 'Các khu vực thiên nhiên hoang sơ' }
    }),
    prisma.destinationCategory.create({
      data: { id: uuidv4(), name: 'Thành Phố', slug: 'thanh-pho', icon: '', description: 'Các thành phố lớn với nhiều điểm tham quan' }
    }),
  ]);
  console.log(` ${categories.length} categories created\n`);

  // ==================== ĐIỂM ĐẾN ====================
  console.log('Creating destinations...');
  const destinations = [
    {
      id: uuidv4(),
      name: 'Vịnh Hạ Long',
      slug: 'vinh-ha-long',
      description: 'Vịnh Hạ Long là một vịnh nhỏ thuộc phần bờ tây vịnh Bắc Bộ tại miền Bắc Việt Nam, bao gồm vùng biển ven đảo thuộc địa phận thành phố Hạ Long, thành phố Cẩm Phả và một phần huyện đảo Vân Đồn. Với hàng ngàn đảo đá vôi và làn nước trong xanh, đây là một trong những điểm đến du lịch nổi tiếng nhất Việt Nam.',
      shortDescription: 'Di sản thiên nhiên thế giới UNESCO với hàng ngàn đảo đá vôi',
      address: 'Thành phố Hạ Long, Quảng Ninh',
      provinceId: provinces[2].id,
      categoryId: categories[4].id,
      latitude: 20.9101,
      longitude: 107.1839,
      bestTime: 'Tháng 3 - Tháng 5',
      estimatedCost: '1.500.000 - 3.000.000',
      rating: 4.8,
      reviewCount: 1250,
      viewCount: 15000,
      tips: 'Nên đặt tour du thuyền để trải nghiệm trọn vẹn vẻ đẹp vịnh. Mang theo kem chống nắng và áo phao.',
      highlights: JSON.stringify(['Hang Sửng Sốt', 'Đảo Titop', 'Làng chài Vung Vieng', 'Hang Luồn']),
      isFeatured: true,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Sapa',
      slug: 'sapa',
      description: 'Sapa là một thị trấn vùng cao thuộc tỉnh Lào Cai, nằm cách Hà Nội khoảng 350km về phía tây bắc. Đây là điểm đến du lịch nổi tiếng với cảnh quan núi non hùng vĩ, ruộng bậc thang đẹp mê li và văn hóa các dân tộc thiểu số đặc sắc.',
      shortDescription: 'Thị trấn vùng cao với ruộng bậc thang và văn hóa dân tộc thiểu số',
      address: 'Thị trấn Sapa, Lào Cai',
      provinceId: provinces[4].id,
      categoryId: categories[1].id,
      latitude: 22.3362,
      longitude: 103.8438,
      bestTime: 'Tháng 9 - Tháng 11',
      estimatedCost: '2.000.000 - 5.000.000',
      rating: 4.7,
      reviewCount: 980,
      viewCount: 12000,
      tips: 'Nên đi vào mùa lúa chín (tháng 9-11) để ngắm ruộng bậc thang đẹp nhất. Mang giày leo núi và áo ấm.',
      highlights: JSON.stringify(['Fansipan', 'Thung lũng Mường Hoa', 'Bản Cát Cát', 'Núi Hàm Rồng']),
      isFeatured: true,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Phú Quốc',
      slug: 'phu-quoc',
      description: 'Phú Quốc là hòn đảo lớn nhất Việt Nam, thuộc tỉnh Kiên Giang. Với những bãi biển cát trắng, nước biển trong xanh và hệ sinh thái phong phú, Phú Quốc được mệnh danh là "Đảo Ngọc" của Việt Nam.',
      shortDescription: 'Đảo Ngọc với bãi biển đẹp và hệ sinh thái đa dạng',
      address: 'Thành phố Phú Quốc, Kiên Giang',
      provinceId: provinces[22].id,
      categoryId: categories[0].id,
      latitude: 10.2895,
      longitude: 103.9844,
      bestTime: 'Tháng 11 - Tháng 3',
      estimatedCost: '3.000.000 - 8.000.000',
      rating: 4.6,
      reviewCount: 890,
      viewCount: 11000,
      tips: 'Thuê xe máy để di chuyển quanh đảo. Đừng bỏ lỡ Vinpearl Land và Grand World.',
      highlights: JSON.stringify(['Bãi Sao', 'Vinpearl Land', 'Dinh Cậu', 'Grand World']),
      isFeatured: true,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Huế',
      slug: 'hue',
      description: 'Huế từng là kinh đô của triều Nguyễn từ năm 1802 đến 1945. Thành phố nổi tiếng với các di sản kiến trúc hoàng gia như Hoàng thành, Đại Nội, các lăng tẩm và chùa chiền, mang đậm dấu ấn lịch sử và văn hóa Việt Nam.',
      shortDescription: 'Cố đô với các di tích hoàng gia và văn hóa cung đình',
      address: 'Thành phố Huế, Thừa Thiên Huế',
      provinceId: provinces[9].id,
      categoryId: categories[2].id,
      latitude: 16.4637,
      longitude: 107.5909,
      bestTime: 'Tháng 1 - Tháng 4',
      estimatedCost: '1.500.000 - 4.000.000',
      rating: 4.7,
      reviewCount: 750,
      viewCount: 9500,
      tips: 'Nên đi xe đạp để khám phá thành phố. Đừng bỏ lỡ chợ Đông Ba để thưởng thức ẩm thực Huế.',
      highlights: JSON.stringify(['Kinh thành Huế', 'Lăng Minh Mạng', 'Lăng Khải Định', 'Chùa Thiên Mụ']),
      isFeatured: true,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Hội An',
      slug: 'hoi-an',
      description: 'Hội An là một thành phố du lịch thuộc tỉnh Quảng Nam, nổi tiếng với phố cổ được UNESCO công nhận là Di sản Văn hóa Thế giới. Thành phố giữ nguyên vẻ đẹp kiến trúc cổ với những ngôi nhà phố xá, đình chùa hàng trăm năm tuổi.',
      shortDescription: 'Phố cổ UNESCO với kiến trúc và văn hóa đặc sắc',
      address: 'Thành phố Hội An, Quảng Nam',
      provinceId: provinces[11].id,
      categoryId: categories[2].id,
      latitude: 15.8801,
      longitude: 108.3380,
      bestTime: 'Tháng 2 - Tháng 4',
      estimatedCost: '2.000.000 - 5.000.000',
      rating: 4.9,
      reviewCount: 1100,
      viewCount: 14000,
      tips: 'Đi dạo phố cổ vào buổi tối khi đèn lồng được thắp sáng. Thử làm đèn lồng và thưởng thức cao lầu.',
      highlights: JSON.stringify(['Phố cổ Hội An', 'Chùa Cầu', 'Nhà cổ Tan Ky', 'Hội quán Phước Kiếu']),
      isFeatured: true,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Nha Trang',
      slug: 'nha-trang',
      description: 'Nha Trang là thành phố du lịch biển nổi tiếng nhất miền Trung Việt Nam. Với bờ biển dài 6km, nước biển trong xanh và nhiều đảo đẹp, Nha Trang là điểm đến lý tưởng cho du lịch biển và nghỉ dưỡng.',
      shortDescription: 'Thành phố biển với bãi tắm đẹp và nhiều đảo du lịch',
      address: 'Thành phố Nha Trang, Khánh Hòa',
      provinceId: provinces[15].id,
      categoryId: categories[0].id,
      latitude: 12.2388,
      longitude: 109.1967,
      bestTime: 'Tháng 1 - Tháng 9',
      estimatedCost: '2.500.000 - 6.000.000',
      rating: 4.5,
      reviewCount: 920,
      viewCount: 10500,
      tips: 'Đặt tour 4 đảo để khám phá vịnh Nha Trang. Đừng bỏ lỡ Vinpearl Land trên đảo Hòn Tre.',
      highlights: JSON.stringify(['Vinpearl Land', 'Tháp Bà Ponagar', 'Chùa Long Sơn', 'Đảo Hòn Mun']),
      isFeatured: true,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Đà Lạt',
      slug: 'da-lat',
      description: 'Đà Lạt là thành phố thuộc tỉnh Lâm Đồng, nằm trên cao nguyên Lâm Viên với độ cao khoảng 1500m so với mực nước biển. Thành phố nổi tiếng với khí hậu mát mẻ quanh năm, cảnh quan thiên nhiên tươi đẹp và các công trình kiến trúc Pháp.',
      shortDescription: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm',
      address: 'Thành phố Đà Lạt, Lâm Đồng',
      provinceId: provinces[16].id,
      categoryId: categories[5].id,
      latitude: 11.9274,
      longitude: 108.4399,
      bestTime: 'Tháng 10 - Tháng 3',
      estimatedCost: '1.800.000 - 4.500.000',
      rating: 4.7,
      reviewCount: 880,
      viewCount: 11500,
      tips: 'Thuê xe máy để khám phá các điểm đẹp xung quanh. Đừng bỏ lỡ chợ đêm Đà Lạt.',
      highlights: JSON.stringify(['Hồ Tuyền Lâm', 'Thung lũng Tình Yêu', 'Chợ Đà Lạt', 'Cao nguyên Cát Tiên']),
      isFeatured: true,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Mù Cang Chải',
      slug: 'mu-cang-chai',
      description: 'Mù Cang Chải là huyện vùng cao thuộc tỉnh Yên Bái, nổi tiếng với những ruộng bậc thang trải dài trên sườn núi. Đây là một trong những điểm ngắm lúa chín đẹp nhất Việt Nam, thu hút du khách từ khắp nơi.',
      shortDescription: 'Điểm ngắm ruộng bậc thang đẹp nhất Việt Nam',
      address: 'Huyện Mù Cang Chải, Yên Bái',
      provinceId: provinces[5].id,
      categoryId: categories[1].id,
      latitude: 21.8167,
      longitude: 104.4167,
      bestTime: 'Tháng 9 - Tháng 10',
      estimatedCost: '1.500.000 - 3.500.000',
      rating: 4.6,
      reviewCount: 520,
      viewCount: 7800,
      tips: 'Đến vào mùa lúa chín (tháng 9-10) để có cảnh đẹp nhất. Điểm ngắm lúa đẹp nhất là từ đèo Khau Phạ.',
      highlights: JSON.stringify(['Đèo Khau Phạ', 'Bản Hồ Thắng', 'La Pán Tẩn', 'Chế Tín']),
      isFeatured: true,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Vũng Tàu',
      slug: 'vung-tau',
      description: 'Vũng Tàu là thành phố biển thuộc tỉnh Bà Rịa - Vũng Tàu, cách TP.HCM khoảng 125km. Thành phố nổi tiếng với các bãi biển đẹp, ngọn hải đăng cổ và là trung tâm công nghiệp dầu khí của Việt Nam.',
      shortDescription: 'Thành phố biển gần Sài Gòn với bãi tắm và ngọn hải đăng',
      address: 'Thành phố Vũng Tàu, Bà Rịa Vũng Tàu',
      provinceId: provinces[20].id,
      categoryId: categories[0].id,
      latitude: 10.4059,
      longitude: 107.1313,
      bestTime: 'Quanh năm',
      estimatedCost: '1.000.000 - 3.000.000',
      rating: 4.4,
      reviewCount: 680,
      viewCount: 8500,
      tips: 'Đi xe máy từ TP.HCM qua cầu Cổ Chiên để trải nghiệm đẹp. Leo lên tượng Chúa Kitô để ngắm toàn cảnh.',
      highlights: JSON.stringify(['Tượng Chúa Kitế', 'Ngọn Hải Đăng', 'Bãi Sau', 'Bến nhỏ']),
      isFeatured: false,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Cần Thơ',
      slug: 'can-tho',
      description: 'Cần Thơ là thành phố lớn nhất vùng đồng bằng sông Cửu Long, nổi tiếng với chợ nổi trên sông Hậu và văn hóa miệt vườn Nam Bộ. Đây là điểm đến lý tưởng để khám phá cuộc sống sông nước miền Tây.',
      shortDescription: 'Thành phố miệt vườn với chợ nổi đặc sắc',
      address: 'Thành phố Cần Thơ',
      provinceId: provinces[21].id,
      categoryId: categories[5].id,
      latitude: 10.0452,
      longitude: 105.7469,
      bestTime: 'Tháng 9 - Tháng 12',
      estimatedCost: '1.200.000 - 3.000.000',
      rating: 4.5,
      reviewCount: 620,
      viewCount: 7200,
      tips: 'Dậy sớm để tham quan chợ nổi Cái Răng. Thưởng thức các món ăn miền Tây đặc sắc.',
      highlights: JSON.stringify(['Chợ Nổi Cái Răng', 'Bến Ninh Kiểu', 'Vườn Cò Bằng Lăng', 'Chùa Ông']),
      isFeatured: false,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Mũi Né',
      slug: 'mui-ne',
      description: 'Mũi Né là một thị trấn du lịch biển thuộc thành phố Phan Thiết, tỉnh Bình Thuận. Nơi đây nổi tiếng với các đồi cát vàng trải dài, bãi biển đẹp và là địa điểm lý tưởng cho các môn thể thao biển.',
      shortDescription: 'Thị trấn biển với đồi cát vàng và bãi tắm đẹp',
      address: 'Thị trấn Mũi Né, Phan Thiết, Bình Thuận',
      provinceId: provinces[17].id,
      categoryId: categories[0].id,
      latitude: 10.9341,
      longitude: 108.2705,
      bestTime: 'Tháng 1 - Tháng 9',
      estimatedCost: '1.500.000 - 4.000.000',
      rating: 4.5,
      reviewCount: 590,
      viewCount: 6800,
      tips: 'Thử trải nghiệm môn lướt ván cát (sandboarding). Đừng bỏ lỡ làng chài Mũi Né.',
      highlights: JSON.stringify(['Đồi Cát Vàng', 'Bãi Rạng', 'Làng Chài Mũi Né', 'Suối Tiên']),
      isFeatured: false,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Tam Đảo',
      slug: 'tam-dao',
      description: 'Tam Đảo là thị trấn nghỉ dưỡng vùng núi thuộc tỉnh Vĩnh Phúc, nằm ở độ cao khoảng 900m so với mực nước biển. Thị trấn nổi tiếng với khí hậu mát mẻ, cảnh quan thiên nhiên đẹp và các công trình kiến trúc Pháp cổ.',
      shortDescription: 'Điểm nghỉ dưỡng vùng núi với kiến trúc Pháp cổ',
      address: 'Thị trấn Tam Đảo, Vĩnh Phúc',
      provinceId: provinces[5].id,
      categoryId: categories[1].id,
      latitude: 21.4447,
      longitude: 105.6428,
      bestTime: 'Tháng 4 - Tháng 10',
      estimatedCost: '800.000 - 2.500.000',
      rating: 4.4,
      reviewCount: 450,
      viewCount: 5600,
      tips: 'Mang theo áo khoác vì trời se lạnh vào buổi tối. Đừng bỏ lỡ đỉnh núi Phượng Hoàng.',
      highlights: JSON.stringify(['Đỉnh Phượng Hoàng', 'Thác Bạc', 'Nhà thờ Tam Đảo', 'Cau Vầu']),
      isFeatured: false,
      isActive: true
    }
  ];

  for (const dest of destinations) {
    await prisma.destination.create({ data: dest });
  }
  console.log(` ${destinations.length} destinations created\n`);

  // ==================== ẢNH ĐIỂM ĐẾN ====================
  console.log('Creating destination images...');
  const destImages = [
    { id: uuidv4(), destinationId: destinations[0].id, url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800', caption: 'Vịnh Hạ Long', isPrimary: true },
    { id: uuidv4(), destinationId: destinations[0].id, url: 'https://images.unsplash.com/photo-1573270689103-d7a4e42b609a?w=800', caption: 'Du thuyền trên vịnh', isPrimary: false },
    { id: uuidv4(), destinationId: destinations[1].id, url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800', caption: 'Sapa', isPrimary: true },
    { id: uuidv4(), destinationId: destinations[1].id, url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', caption: 'Ruộng bậc thang', isPrimary: false },
    { id: uuidv4(), destinationId: destinations[2].id, url: 'https://images.unsplash.com/photo-1559599238-308793637427?w=800', caption: 'Phú Quốc', isPrimary: true },
    { id: uuidv4(), destinationId: destinations[2].id, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', caption: 'Bãi biển', isPrimary: false },
    { id: uuidv4(), destinationId: destinations[3].id, url: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800', caption: 'Cố đô Huế', isPrimary: true },
    { id: uuidv4(), destinationId: destinations[4].id, url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800', caption: 'Phố cổ Hội An', isPrimary: true },
    { id: uuidv4(), destinationId: destinations[5].id, url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800', caption: 'Nha Trang', isPrimary: true },
    { id: uuidv4(), destinationId: destinations[6].id, url: 'https://images.unsplash.com/photo-1597932578892-416ec6f15a1c?w=800', caption: 'Đà Lạt', isPrimary: true },
    { id: uuidv4(), destinationId: destinations[7].id, url: 'https://images.unsplash.com/photo-1583163090260-8e62b645f7f5?w=800', caption: 'Mù Cang Chải', isPrimary: true },
    { id: uuidv4(), destinationId: destinations[8].id, url: 'https://images.unsplash.com/photo-1559005817-281c4209e82c?w=800', caption: 'Vũng Tàu', isPrimary: true },
    { id: uuidv4(), destinationId: destinations[9].id, url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800', caption: 'Cần Thơ', isPrimary: true },
    { id: uuidv4(), destinationId: destinations[10].id, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', caption: 'Mũi Né', isPrimary: true },
    { id: uuidv4(), destinationId: destinations[11].id, url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800', caption: 'Tam Đảo', isPrimary: true },
  ];

  for (const img of destImages) {
    await prisma.destinationImage.create({ data: img });
  }
  console.log(` ${destImages.length} destination images created\n`);

  // ==================== THẺ ====================
  console.log('Creating tags...');
  const tags = await Promise.all([
    prisma.tag.create({ data: { id: uuidv4(), name: 'Biển', slug: 'bien' } }),
    prisma.tag.create({ data: { id: uuidv4(), name: 'Núi', slug: 'nui' } }),
    prisma.tag.create({ data: { id: uuidv4(), name: 'Lịch sử', slug: 'lich-su' } }),
    prisma.tag.create({ data: { id: uuidv4(), name: 'Văn hóa', slug: 'van-hoa' } }),
    prisma.tag.create({ data: { id: uuidv4(), name: 'Ẩm thực', slug: 'am-thuc' } }),
    prisma.tag.create({ data: { id: uuidv4(), name: 'Nghỉ dưỡng', slug: 'nghi-duong' } }),
    prisma.tag.create({ data: { id: uuidv4(), name: 'Phiêu lưu', slug: 'phieu-luu' } }),
    prisma.tag.create({ data: { id: uuidv4(), name: 'Thiên nhiên', slug: 'thien-nhien' } }),
    prisma.tag.create({ data: { id: uuidv4(), name: 'Du lịch gia đình', slug: 'du-lich-gia-dinh' } }),
    prisma.tag.create({ data: { id: uuidv4(), name: 'Honeymoon', slug: 'honeymoon' } }),
  ]);
  console.log(` ${tags.length} tags created\n`);

  // ==================== TOUR ====================
  console.log('Creating tours...');
  const tours = [
    {
      id: uuidv4(),
      name: 'Tour Hạ Long 2 ngày 1 đêm',
      slug: 'tour-ha-long-2-ngay-1-dem',
      description: 'Tour khám phá Vịnh Hạ Long với 2 ngày 1 đêm trên du thuyền, bao gồm thăm hang Sửng Sốt, đảo Titop và làng chài Vung Vieng.',
      shortDescription: 'Khám phá vịnh Hạ Long trên du thuyền 5 sao',
      destinationId: destinations[0].id,
      duration: '2 ngày 1 đêm',
      maxPeople: 30,
      price: 2500000,
      discountPrice: 2290000,
      includes: JSON.stringify(['Xe du lịch đưa đón', 'Vé du thuyền', 'Ăn trưa và tối', 'Hướng dẫn viên', ' Vé tham quan']),
      excludes: JSON.stringify(['Đồ uống cá nhân', 'Chi phí cá nhân', 'Tip cho hướng dẫn']),
      imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
      isFeatured: true,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Tour Sapa - Mù Cang Chải 4 ngày 3 đêm',
      slug: 'tour-sapa-mu-cang-chai-4-ngay-3-dem',
      description: 'Tour khám phá Sapa và Mù Cang Chải, ngắm ruộng bậc thang, chinh phục đỉnh Fansipan và trải nghiệm văn hóa dân tộc thiểu số.',
      shortDescription: 'Trải nghiệm vùng cao Tây Bắc với ruộng bậc thang',
      destinationId: destinations[1].id,
      duration: '4 ngày 3 đêm',
      maxPeople: 20,
      price: 4500000,
      discountPrice: 3990000,
      includes: JSON.stringify(['Xe giường nằm', 'Khách sạn 3 sao', 'Ăn sáng hàng ngày', 'Hướng dẫn viên', 'Vé cáp treo Fansipan']),
      excludes: JSON.stringify(['Đồ uống', 'Chi phí cá nhân', 'Ăn trưa và tối']),
      imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
      isFeatured: true,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Tour Phú Quốc 3 ngày 2 đêm',
      slug: 'tour-phu-quoc-3-ngay-2-dem',
      description: 'Tour du lịch Phú Quốc với các điểm đến nổi tiếng như Vinpearl Land, Grand World, bãi Sao và tham quan nhà tù Phú Quốc.',
      shortDescription: 'Khám phá Đảo Ngọc Phú Quốc',
      destinationId: destinations[2].id,
      duration: '3 ngày 2 đêm',
      maxPeople: 25,
      price: 3800000,
      discountPrice: 3490000,
      includes: JSON.stringify(['Máy bay khứ hồi', 'Khách sạn 4 sao', 'Ăn sáng', 'Xe đưa đón', 'Vé Vinpearl Land']),
      excludes: JSON.stringify(['Đồ uống', 'Chi phí cá nhân', 'Ăn trưa và tối']),
      imageUrl: 'https://images.unsplash.com/photo-1559599238-308793637427?w=800',
      isFeatured: true,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Tour Huế - Hội An 3 ngày 2 đêm',
      slug: 'tour-hue-hoi-an-3-ngay-2-dem',
      description: 'Tour khám phá hai di sản UNESCO Huế và Hội An, bao gồm Kinh thành Huế, lăng tẩm, phố cổ Hội An và các làng nghề truyền thống.',
      shortDescription: 'Khám phá hai di sản văn hóa thế giới',
      destinationId: destinations[3].id,
      duration: '3 ngày 2 đêm',
      maxPeople: 30,
      price: 3200000,
      discountPrice: 2890000,
      includes: JSON.stringify(['Xe du lịch', 'Khách sạn 3 sao', 'Ăn sáng', 'Hướng dẫn viên', 'Vé tham quan']),
      excludes: JSON.stringify(['Đồ uống', 'Chi phí cá nhân', 'Ăn trưa và tối']),
      imageUrl: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800',
      isFeatured: true,
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Tour Nha Trang - Đà Lạt 5 ngày 4 đêm',
      slug: 'tour-nha-trang-da-lat-5-ngay-4-dem',
      description: 'Tour kết hợp biển và núi, khám phá Nha Trang với Vinpearl Land và Đà Lạt thơ mộng với Hồ Tuyền Lâm, thung lũng Tình Yêu.',
      shortDescription: 'Kết hợp du lịch biển và núi',
      destinationId: destinations[5].id,
      duration: '5 ngày 4 đêm',
      maxPeople: 25,
      price: 5800000,
      discountPrice: 5290000,
      includes: JSON.stringify(['Xe du lịch', 'Khách sạn 4 sao', 'Ăn sáng', 'Hướng dẫn viên', 'Vé tham quan']),
      excludes: JSON.stringify(['Đồ uống', 'Chi phí cá nhân', 'Ăn trưa và tối']),
      imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
      isFeatured: false,
      isActive: true
    }
  ];

  for (const tour of tours) {
    await prisma.tour.create({ data: tour });
  }
  console.log(` ${tours.length} tours created\n`);

  // ==================== LỊCH TRÌNH TOUR ====================
  console.log('Creating tour schedules...');
  const schedules = [
    // Chuyến tham quan Hạ Long
    { id: uuidv4(), tourId: tours[0].id, day: 1, time: 'Sáng', title: 'Khởi hành từ Hà Nội', description: 'Xe đón quý khách tại điểm hẹn, khởi hành đi Hạ Long. Trên đường đi ngắm cảnh đồng bằng Bắc Bộ.', location: 'Hà Nội - Hạ Long' },
    { id: uuidv4(), tourId: tours[0].id, day: 1, time: 'Trưa', title: 'Đến Hạ Long, lên du thuyền', description: 'Đến cảng tàu Hạ Long, lên du thuyền, nhận phòng. Thưởng thức đồ uống chào mừng.', location: 'Cảng Hạ Long' },
    { id: uuidv4(), tourId: tours[0].id, day: 1, time: 'Chiều', title: 'Thăm hang Sửng Sốt', description: 'Thăm hang Sửng Sốt - một trong những hang động đẹp nhất vịnh Hạ Long với các nhũ đá lấp lánh.', location: 'Hang Sửng Sốt' },
    { id: uuidv4(), tourId: tours[0].id, day: 1, time: 'Tối', title: 'Nghỉ trên du thuyền', description: 'Thưởng thức bữa tối trên du thuyền, ngắm hoàng hôn vịnh Hạ Long. Tự do tham gia các hoạt động trên tàu.', location: 'Du thuyền' },
    { id: uuidv4(), tourId: tours[0].id, day: 2, time: 'Sáng', title: 'Thăm đảo Titop', description: 'Leo núi lên đảo Titop ngắm toàn cảnh vịnh Hạ Long, tắm biển tại bãi tắm trên đảo.', location: 'Đảo Titop' },
    { id: uuidv4(), tourId: tours[0].id, day: 2, time: 'Trưa', title: 'Làng chài Vung Vieng', description: 'Thăm làng chài Vung Vieng bằng thuyền nan, tìm hiểu cuộc sống ngư dân vịnh Hạ Long.', location: 'Làng Vung Vieng' },
    { id: uuidv4(), tourId: tours[0].id, day: 2, time: 'Chiều', title: 'Về Hà Nội', description: 'Trả phòng, ăn trưa trên du thuyền. Xuống tàu, xe đưa quý khách về Hà Nội. Kết thúc tour.', location: 'Hạ Long - Hà Nội' },
  ];

  for (const schedule of schedules) {
    await prisma.tourSchedule.create({ data: schedule });
  }
  console.log(` ${schedules.length} tour schedules created\n`);

  // ==================== DANH MỤC BÀI VIẾT ====================
  console.log('Creating article categories...');
  const articleCategories = await Promise.all([
    prisma.articleCategory.create({ data: { id: uuidv4(), name: 'Du Lịch Việt Nam', slug: 'du-lich-viet-nam', icon: '🇻🇳' } }),
    prisma.articleCategory.create({ data: { id: uuidv4(), name: 'Mẹo Du Lịch', slug: 'meo-du-lich', icon: '' } }),
    prisma.articleCategory.create({ data: { id: uuidv4(), name: 'Ẩm Thực', slug: 'am-thuc', icon: '' } }),
    prisma.articleCategory.create({ data: { id: uuidv4(), name: 'Khám Phá', slug: 'kham-pha', icon: '' } }),
    prisma.articleCategory.create({ data: { id: uuidv4(), name: 'Cẩm Nang', slug: 'cam-nang', icon: '' } }),
  ]);
  console.log(` ${articleCategories.length} article categories created\n`);

  // ==================== BÀI VIẾT ====================
  console.log('Creating articles...');
  const articles = [
    {
      id: uuidv4(),
      title: 'Top 10 điểm du lịch hấp dẫn nhất Việt Nam năm 2026',
      slug: 'top-10-diem-du-lich-hap-dan-nhat-viet-nam-2026',
      content: 'Việt Nam là một trong những điểm đến du lịch hấp dẫn nhất Đông Nam Á với vô số cảnh quan thiên nhiên tuyệt đẹp, văn hóa đa dạng và ẩm thực phong phú. Trong bài viết này, chúng tôi sẽ giới thiệu top 10 điểm du lịch hấp dẫn nhất Việt Nam mà bạn không nên bỏ lỡ.\n\n**1. Vịnh Hạ Long**\nVịnh Hạ Long với hơn 1.900 đảo đá vôi là một trong những kỳ quan thiên nhiên thế giới được UNESCO công nhận. Du thuyền qua các đảo, thăm hang động kỳ vĩ và tận hưởng bình minh trên vịnh là trải nghiệm không thể quên.\n\n**2. Sapa**\nThị trấn vùng cao Sapa với ruộng bậc thang xanh mướt, khí hậu mát mẻ và văn hóa dân tộc H\'Mông, Dao đặc sắc. Đỉnh Fansipan - nóc nhà Đông Dương là điểm đến mơ ước của nhiều du khách.\n\n**3. Hội An**\nPhố cổ Hội An là di sản văn hóa thế giới với kiến trúc cổ hàng trăm năm tuổi, đèn lồng rực rỡ và ẩm thực độc đáo. Đây là nơi lý tưởng để khám phá văn hóa Việt Nam cổ đại.\n\n**4. Phú Quốc**\nĐảo Ngọc Phú Quốc với bãi biển cát trắng, nước trong xanh và hệ sinh thái phong phú là thiên đường nghỉ dưỡng. Vinpearl Land, Grand World là những điểm đến không thể bỏ qua.\n\n**5. Huế**\nCố đô Huế với Kinh thành ngàn năm tuổi, các lăng tẩm hoàng gia và ẩm thực cung đình đặc sắc, là điểm đến lý tưởng cho những ai yêu thích lịch sử và văn hóa.\n\n**6. Nha Trang**\nThành phố biển Nha Trang với bờ biển dài 6km, nhiều đảo đẹp và Vinpearl Land trên đảo Hòn Tre, là điểm đến lý tưởng cho du lịch biển và giải trí.\n\n**7. Đà Lạt**\nThành phố ngàn hoa Đà Lạt với khí hậu mát mẻ quanh năm, cảnh quan lãng mạn và các công trình kiến trúc Pháp cổ, là điểm đến lý tưởng cho các cặp đôi.\n\n**8. Mù Cang Chải**\nHuyện vùng cao Mù Cang Chải với ruộng bậc thang trải dài trên sườn núi, đặc biệt đẹp vào mùa lúa chín (tháng 9-10), là thiên đường cho photographer.\n\n**9. Cần Thơ**\nThành phố miệt vườn Cần Thơ với chợ nổi Cái Răng, các vườn trái cây xum xuê và ẩm thực miền Tây đặc sắc, là điểm đến lý tưởng để khám phá cuộc sống sông nước.\n\n**10. Mũi Né**\nThị trấn biển Mũi Né với đồi cát vàng trải dài, bãi tắm đẹp và các môn thể thao biển hấp dẫn, là điểm đến lý tưởng cho những ai yêu thích phiêu lưu.',
      excerpt: 'Khám phá top 10 điểm du lịch hấp dẫn nhất Việt Nam với cảnh quan tuyệt đẹp và văn hóa đa dạng.',
      imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
      categoryId: articleCategories[0].id,
      authorId: adminUser.id,
      tags: 'du lịch, việt nam, vịnh hạ long, sapa, hội an',
      viewCount: 2500,
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date()
    },
    {
      id: uuidv4(),
      title: 'Cẩm nang du lịch Hội An: Tất tần tật những gì bạn cần biết',
      slug: 'cam-nang-du-lich-hoi-an',
      content: 'Hội An là một trong những điểm đến du lịch được yêu thích nhất Việt Nam. Thành phố cổ được UNESCO công nhận là Di sản Văn hóa Thế giới với kiến trúc độc đáo, ẩm thực phong phú và văn hóa đa dạng.\n\n**Thời điểm đẹp nhất để đến Hội An**\n\nHội An đẹp quanh năm, nhưng thời điểm lý tưởng nhất là từ tháng 2 đến tháng 4. Trong khoảng thời gian này, thời tiết dễ chịu, ít mưa và không quá nóng.\n\n**Các điểm tham quan không thể bỏ lỡ**\n\n1. Phố cổ Hội An: Khu vực trung tâm với hơn 800 di tích kiến trúc cổ, bao gồm nhà cổ, chùa, đình, hội quán.\n\n2. Chùa Cầu: Biểu tượng của Hội An, cây cầu Nhật Bản có từ thế kỷ 17.\n\n3. Nhà cổ Tan Ky: Ngôi nhà có hơn 200 năm tuổi với kiến trúc độc đáo.\n\n4. Hội quán Phước Kiếu: Hội quán của người Quảng Đông với kiến trúc tinh xảo.\n\n5. Làng nghề gốm Thanh Hà: Làng gốm truyền thống cách trung tâm 5km.\n\n**Ẩm thực Hội An**\n\nHội An nổi tiếng với ẩm thực đa dạng. Các món không thể bỏ qua:\n- Cao lầu: Món mì đặc sản của Hội An\n- Mì Quảng: Món mì với nước dùng vàng ươm\n- Bánh mì Phượng: Bánh mì nổi tiếng nhất Việt Nam\n- Hoành thánh: Sủi cảo chiên giòn\n- Vạn Lý: Chè đặc sản với nhiều topping\n\n**Lưu trú**\n\nHội An có nhiều loại hình lưu trú từ homestay giá rẻ đến khách sạn 5 sao. Khu vực phố cổ có nhiều homestay đẹp với giá cả phải chăng.\n\n**Di chuyển**\n\nHội An có thể di chuyển bằng xe đạp, xe máy hoặc taxi. Thuê xe đạp là cách tốt nhất để khám phá phố cổ và các làng xung quanh.',
      excerpt: 'Tất tần tật thông tin bạn cần biết khi du lịch Hội An: điểm tham quan, ẩm thực, lưu trú và mẹo hữu ích.',
      imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
      categoryId: articleCategories[4].id,
      authorId: adminUser.id,
      tags: 'hội an, cẩm nang, du lịch, ẩm thực',
      viewCount: 1800,
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date()
    },
    {
      id: uuidv4(),
      title: '10 mẹo tiết kiệm chi phí khi du lịch Việt Nam',
      slug: '10-meo-tiet-kiem-chi-phi-du-lich-viet-nam',
      content: 'Du lịch Việt Nam ngày càng phát triển nhưng vẫn là điểm đến với chi phí hợp lý. Dưới đây là 10 mẹo giúp bạn tiết kiệm chi phí khi khám phá Việt Nam.\n\n**1. Đặt vé máy bay vào thời điểm vàng**\nVé máy bay thường rẻ nhất vào thứ 3 và thứ 4. Tránh đặt vé vào cuối tuần và các dịp lễ lớn.\n\n**2. Sử dụng phương tiện công cộng**\nThay vì taxi, hãy sử dụng xe buýt, xe máy hoặc Grab. Đây là cách tiết kiệm và trải nghiệm địa phương tốt hơn.\n\n**3. Ăn uống như người địa phương**\nCác quán ăn địa phương có giá rẻ hơn nhiều so với nhà hàng du lịch. Hãy thử các quán bình dân vỉa hè để trải nghiệm ẩm thực đích thực.\n\n**4. Tránh khu du lịch đông đúc**\nCác điểm du lịch nổi tiếng thường đắt đỏ. Hãy khám phá các địa điểm ít người biết để tiết kiệm và trải nghiệm độc đáo hơn.\n\n**5. Đặt khách sạn sớm**\nĐặt phòng trước 2-3 tháng để có giá tốt nhất. Các trang web như Booking.com, Agoda thường có nhiều ưu đãi.\n\n**6. Mua sắm thông minh**\nThương lượng là điều bình thường ở các chợ. Hãy mặc cả nhưng với thái độ thân thiện.\n\n**7. Sử dụng SIM du lịch**\nMua SIM du lịch Việt Nam thay vì roaming quốc tế để tiết kiệm chi phí data.\n\n**8. Tránh các tour du lịch đắt đỏ**\nTự lên kế hoạch và khám phá bằng xe máy là cách tiết kiệm và linh hoạt hơn.\n\n**9. Uống nước đóng chai thay vì nước đóng hộp**\nNước đóng chai nhỏ rẻ hơn nhiều so với nước đóng hộp tại các nhà hàng.\n\n**10. Du lịch mùa thấp điểm**\nTháng 5-9 thường là mùa thấp điểm với giá phòng và tour rẻ hơn nhiều.',
      excerpt: 'Những mẹo hữu ích giúp bạn tiết kiệm chi phí khi du lịch Việt Nam mà vẫn có trải nghiệm tuyệt vời.',
      imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
      categoryId: articleCategories[1].id,
      authorId: adminUser.id,
      tags: 'mẹo du lịch, tiết kiệm, việt nam',
      viewCount: 2100,
      isFeatured: true,
      isPublished: true,
      publishedAt: new Date()
    },
    {
      id: uuidv4(),
      title: 'Khám phá ẩm thực đường phố Hà Nội',
      slug: 'kham-pha-am-thuc-duong-pho-ha-noi',
      content: 'Hà Nội không chỉ nổi tiếng với lịch sử ngàn năm văn hiến mà còn là thiên đường ẩm thực đường phố. Cùng khám phá những món ngon không thể bỏ lỡ khi đến Thủ đô.\n\n**Phở**\n\nPhở là món ăn biểu tượng của Hà Nội. Quán phở nổi tiếng nhất là Phở Gia Truyền (Bát Đàn), Phở Thìn (Lò Đúc). Tô phở với nước dùng trong vắt, bò tái, gầu và các gia vị tạo nên hương vị đậm đà khó quên.\n\n**Bún chả**\n\nBún chả Hà Nội được Tổng thống Obama thưởng thức năm 2016 đã trở nên nổi tiếng thế giới. Quán bún chả Hương Liên ( Ô Quan Chưởng) là địa chỉ được nhiều du khách tìm đến.\n\n**Bún thang**\n\nBún thang là món ăn cầu kỳ với nhiều nguyên liệu: thịt gà, trứng, giò lụa, nấm, rau thơm. Quán bún thang Cốn Xào trên phố Lê Gia Định là quán ngon nổi tiếng.\n\n**Chả cá Lã Vọng**\n\nChả cá Lã Vọng là món ăn đặc sản với cá lóc nướng vàng, dùng với bún, thì là, đậu phộng và nước mắm chua ngọt.\n\n**Xôi xéo**\n\nXôi xéo là món ăn sáng phổ biến với xôi nếp dẻo, topping đỗ xanh, dầu hào và thịt xá xíu. Quán xôi xéo Nhạc Hiển là địa chỉ được nhiều người yêu thích.\n\n**Bánh mì**\n\nBánh mì Hà Nội khác với bánh mì Sài Gòn, giòn hơn với nhiều loại nhân từ pate, thịt, rau thơm.\n\n**Cà phê trứng**\n\nCà phê trứng là đồ uống đặc trưng của Hà Nội. Cà phê được pha với lòng đỏ trứng gà và sữa đặc tạo nên hương vị béo ngậy không lẫn với bất kỳ nơi nào khác.',
      excerpt: 'Khám phá thiên đường ẩm thực đường phố Hà Nội với những món ngon trứ danh từ phở, bún chả đến cà phê trứng.',
      imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800',
      categoryId: articleCategories[2].id,
      authorId: adminUser.id,
      tags: 'hà nội, ẩm thực, phở, bún chả',
      viewCount: 1500,
      isFeatured: false,
      isPublished: true,
      publishedAt: new Date()
    },
    {
      id: uuidv4(),
      title: 'Đà Lạt mùa hoa dã quỳ nở vàng',
      slug: 'da-lat-mua-hoa-da-quy-no-vang',
      content: 'Tháng 11 hàng năm, đồi chè Cầu Đất và các vùng ngoại ô Đà Lạt khoác lên mình tấm áo vàng rực rỡ của hoa dã quỳ. Đây là thời điểm đẹp nhất để ghé thăm thành phố ngàn hoa.\n\n**Hoa dã quỳ - Nữ hoàng mùa thu Đà Lạt**\n\nHoa dã quỳ (Tithonia diversifolia) có nguồn gốc từ Mexico nhưng đã trở thành biểu tượng của mùa thu Đà Lạt. Những cánh đồng hoa vàng trải dài trên sườn đồi tạo nên cảnh quan tuyệt đẹp.\n\n**Đồi chè Cầu Đất**\n\nĐồi chè Cầu Đất cách trung tâm Đà Lạt khoảng 25km là điểm ngắm hoa dã quỳ đẹp nhất. Hàng nghìn cây hoa dã quỳ nở rộ trên nền xanh của đồi chè tạo nên bức tranh thiên nhiên tuyệt đẹp.\n\n**Thác Datanla**\n\nThác Datanla không chỉ nổi tiếng với thác nước hùng vĩ mà còn là nơi có những cánh rừng hoa dã quỳ đẹp mê lòng người.\n\n**Mẹo chụp ảnh**\n\n- Nên đến sớm vào buổi sáng để tránh đông và có ánh sáng đẹp nhất.\n- Mặc trang phục tương phản với màu vàng của hoa.\n- Sử dụng lens góc rộng để chụp toàn cảnh đồi hoa.\n\n**Lưu ý khi đến Đà Lạt mùa hoa**\n\n- Đặt phòng khách sạn trước vì đây là mùa cao điểm.\n- Mang theo áo ấm vì trời se lạnh vào buổi sáng và tối.\n- Chuẩn bị kem chống nắng và kính râm.',
      excerpt: 'Mùa hoa dã quỳ nở vàng rực tại Đà Lạt - thời điểm đẹp nhất để khám phá thành phố ngàn hoa.',
      imageUrl: 'https://images.unsplash.com/photo-1597932578892-416ec6f15a1c?w=800',
      categoryId: articleCategories[3].id,
      authorId: adminUser.id,
      tags: 'đà lạt, hoa dã quỳ, mùa thu, phong cảnh',
      viewCount: 1200,
      isFeatured: false,
      isPublished: true,
      publishedAt: new Date()
    }
  ];

  for (const article of articles) {
    await prisma.article.create({ data: article });
  }
  console.log(` ${articles.length} articles created\n`);

  // ==================== ẢNH BÀI VIẾT ====================
  console.log('Creating article images...');
  const articleImages = [
    { id: uuidv4(), articleId: articles[0].id, url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800', caption: 'Vịnh Hạ Long', isPrimary: true, sortOrder: 0 },
    { id: uuidv4(), articleId: articles[0].id, url: 'https://images.unsplash.com/photo-1573270689103-d7a4e42b609a?w=800', caption: 'Du thuyền trên vịnh', isPrimary: false, sortOrder: 1 },
    { id: uuidv4(), articleId: articles[0].id, url: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800', caption: 'Hang động Hạ Long', isPrimary: false, sortOrder: 2 },
    { id: uuidv4(), articleId: articles[1].id, url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800', caption: 'Phố cổ Hội An', isPrimary: true, sortOrder: 0 },
    { id: uuidv4(), articleId: articles[1].id, url: 'https://images.unsplash.com/photo-1597932578892-416ec6f15a1c?w=800', caption: 'Đèn lồng Hội An', isPrimary: false, sortOrder: 1 },
    { id: uuidv4(), articleId: articles[1].id, url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', caption: 'Cao lầu Hội An', isPrimary: false, sortOrder: 2 },
    { id: uuidv4(), articleId: articles[2].id, url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800', caption: 'Du lịch Việt Nam', isPrimary: true, sortOrder: 0 },
    { id: uuidv4(), articleId: articles[2].id, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', caption: 'Bãi biển Việt Nam', isPrimary: false, sortOrder: 1 },
    { id: uuidv4(), articleId: articles[3].id, url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800', caption: 'Phở Hà Nội', isPrimary: true, sortOrder: 0 },
    { id: uuidv4(), articleId: articles[3].id, url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800', caption: 'Bún chả Hà Nội', isPrimary: false, sortOrder: 1 },
    { id: uuidv4(), articleId: articles[4].id, url: 'https://images.unsplash.com/photo-1597932578892-416ec6f15a1c?w=800', caption: 'Đà Lạt', isPrimary: true, sortOrder: 0 },
  ];

  for (const img of articleImages) {
    await prisma.articleImage.create({ data: img });
  }
  console.log(` ${articleImages.length} article images created\n`);

  // ==================== ĐÁNH GIÁ ====================
  console.log('Creating reviews...');
  const reviews = [
    { id: uuidv4(), userId: testUser.id, rating: 5, comment: 'Vịnh Hạ Long thật sự tuyệt vời! Cảnh quan đẹp như tranh vẽ, du thuyền sang trọng, nhân viên nhiệt tình. Đây là chuyến đi đáng nhớ nhất cuộc đời tôi.', destinationId: destinations[0].id, tourId: null },
    { id: uuidv4(), userId: secondUser.id, rating: 4, comment: 'Sapa đẹp nhưng hơi đông vào mùa cao điểm. Ruộng bậc thang Mù Cang Chải thì phải nói là ngoài sức tưởng tượng. Cần cải thiện về điều kiện đường sá.', destinationId: destinations[1].id, tourId: null },
    { id: uuidv4(), userId: testUser.id, rating: 5, comment: 'Phú Quốc xứng đáng với danh hiệu Đảo Ngọc! Bãi Sao đẹp mê li, nước biển trong xanh, Vinpearl Land vui không chán. Sẽ quay lại lần nữa.', destinationId: destinations[2].id, tourId: null },
    { id: uuidv4(), userId: secondUser.id, rating: 5, comment: 'Hội An là nơi tôi muốn sống khi về hưu. Phố cở đẹp, yên bình, ẩm thực ngon, người dân thân thiện. Đêm đi phố cổ ngắm đèn lồng là trải nghiệm không thể quên.', destinationId: destinations[4].id, tourId: null },
    { id: uuidv4(), userId: testUser.id, rating: 4, comment: 'Tour Hạ Long rất tốt! Du thuyền đẹp, thức ăn ngon, hướng dẫn viên nhiệt tình. Điểm trừ là thời tiết hơi âm u vào mùa đông.', tourId: tours[0].id, destinationId: null },
    { id: uuidv4(), userId: secondUser.id, rating: 5, comment: 'Đà Lạt mùa hoa dã quỳ đẹp không tả xiết! Không khí trong lành, cảnh quan thơ mộng, ẩm thực đặc sắc. Đây là điểm đến lý tưởng cho những ai muốn trốn khỏi thành phố.', destinationId: destinations[6].id, tourId: null },
    { id: uuidv4(), userId: testUser.id, rating: 4, comment: 'Huế có nhiều di tích lịch sử thú vị. Kinh thành rộng lớn, lăng tẩm đẹp, ẩm thực cung đình đặc sắc. Nên đi vào mùa khô để tránh mưa.', destinationId: destinations[3].id, tourId: null },
    { id: uuidv4(), userId: secondUser.id, rating: 5, comment: 'Tour Sapa - Mù Cang Chải rất đáng đi! Ruộng bậc thang đẹp nhất vào mùa lúa chín, người dân tộc thiểu số thân thiện, phong cảnh hùng vĩ.', tourId: tours[1].id, destinationId: null },
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }
  console.log(` ${reviews.length} reviews created\n`);

  // ==================== YÊU CẦU TƯ VẤN ====================
  console.log('Creating inquiries...');
  const inquiries = [
    {
      id: uuidv4(),
      name: 'Nguyễn Minh Tuấn',
      email: 'tuannm@email.com',
      phone: '0901234567',
      type: 'tour',
      subject: 'Tư vấn tour Hạ Long',
      message: 'Xin chào, tôi muốn được tư vấn về tour Hạ Long 2 ngày 1 đêm cho gia đình 4 người. Xin cho biết lịch khởi hành, giá cả chi tiết.',
      status: 'replied',
      userId: testUser.id,
      reply: 'Cảm ơn bạn đã quan tâm. Tour Hạ Long 2 ngày 1 đêm khởi hành vào thứ 7 hàng tuần, giá 2.290.000đ/người (đã giảm từ 2.500.000đ). Tour bao gồm xe đưa đón, vé du thuyền, ăn trưa và tối, hướng dẫn viên.',
      repliedAt: new Date()
    },
    {
      id: uuidv4(),
      name: 'Trần Thị Lan',
      email: 'lantt@email.com',
      phone: '0912345678',
      type: 'contact',
      subject: 'Hợp tác kinh doanh',
      message: 'Tôi là đại diện công ty du lịch, muốn hợp tác với quý công ty về việc đặt tour. Xin vui lòng liên hệ lại.',
      status: 'pending',
      userId: null,
      reply: null,
      repliedAt: null
    },
    {
      id: uuidv4(),
      name: 'Lê Hoàng Nam',
      email: 'namlh@email.com',
      phone: '0987654321',
      type: 'destination',
      subject: 'Hỏi về điểm du lịch Mù Cang Chải',
      message: 'Cho tôi hỏi thời điểm nào đẹp nhất để đi Mù Cang Chải? Và có tour trọn gói không?',
      status: 'replied',
      userId: secondUser.id,
      reply: 'Mù Cang Chải đẹp nhất vào mùa lúa chín, từ tháng 9 đến tháng 10 hàng năm. Chúng tôi có tour Mù Cang Chải 3 ngày 2 đêm với giá 3.500.000đ/người.',
      repliedAt: new Date()
    }
  ];

  for (const inquiry of inquiries) {
    await prisma.inquiry.create({ data: inquiry });
  }
  console.log(` ${inquiries.length} inquiries created\n`);

  // ==================== CÀI ĐẶT TRANG ====================
  console.log('Creating site settings...');
  const settings = [
    // Chung
    { id: uuidv4(), key: 'site_name', value: 'Du Lịch Quảng Bá', group: 'general', label: 'Tên website', type: 'text', isPublic: true },
    { id: uuidv4(), key: 'site_description', value: 'Website giới thiệu và quảng bá du lịch Việt Nam - Du Lịch Quảng Bá', group: 'general', label: 'Mô tả website', type: 'textarea', isPublic: true },
    { id: uuidv4(), key: 'site_logo', value: '/assets/images/logo.png', group: 'general', label: 'Logo website', type: 'text', isPublic: true },
    { id: uuidv4(), key: 'site_favicon', value: '/assets/images/favicon.ico', group: 'general', label: 'Favicon', type: 'text', isPublic: true },
    
    // Thông tin công ty
    { id: uuidv4(), key: 'company_name', value: 'Công Ty TNHH Du Lịch Quảng Bá', group: 'contact', label: 'Tên công ty', type: 'text', isPublic: true },
    { id: uuidv4(), key: 'company_address', value: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', group: 'contact', label: 'Địa chỉ công ty', type: 'textarea', isPublic: true },
    { id: uuidv4(), key: 'company_phone', value: '1900 1234', group: 'contact', label: 'Số điện thoại', type: 'text', isPublic: true },
    { id: uuidv4(), key: 'company_email', value: 'contact@dulichquangba.vn', group: 'contact', label: 'Email liên hệ', type: 'text', isPublic: true },
    { id: uuidv4(), key: 'company_hotline', value: '0901 234 567', group: 'contact', label: 'Hotline', type: 'text', isPublic: true },
    { id: uuidv4(), key: 'company_tax_id', value: '0123456789', group: 'contact', label: 'Mã số thuế', type: 'text', isPublic: true },
    
    // Mạng xã hội
    { id: uuidv4(), key: 'social_facebook', value: 'https://facebook.com/dulichquangba', group: 'social', label: 'Facebook', type: 'text', isPublic: true },
    { id: uuidv4(), key: 'social_zalo', value: '0901234567', group: 'social', label: 'Zalo', type: 'text', isPublic: true },
    { id: uuidv4(), key: 'social_youtube', value: 'https://youtube.com/@dulichquangba', group: 'social', label: 'YouTube', type: 'text', isPublic: true },
    { id: uuidv4(), key: 'social_instagram', value: 'https://instagram.com/dulichquangba', group: 'social', label: 'Instagram', type: 'text', isPublic: true },
    
    // SEO
    { id: uuidv4(), key: 'seo_title', value: 'Du Lịch Quảng Bá - Khám Phá Việt Nam', group: 'seo', label: 'SEO Title', type: 'text', isPublic: true },
    { id: uuidv4(), key: 'seo_description', value: 'Website du lịch hàng đầu Việt Nam - Tìm kiếm điểm đến, đặt tour, đọc cẩm nang và nhận gợi ý AI', group: 'seo', label: 'SEO Description', type: 'textarea', isPublic: true },
    { id: uuidv4(), key: 'seo_keywords', value: 'du lịch, việt nam, tour, điểm đến, khách sạn, vé máy bay', group: 'seo', label: 'SEO Keywords', type: 'text', isPublic: true },
    
    // Giờ làm việc
    { id: uuidv4(), key: 'business_hours', value: 'Thứ 2 - Thứ 6: 8:00 - 18:00', group: 'contact', label: 'Giờ làm việc', type: 'text', isPublic: true },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.create({ data: setting });
  }
  console.log(` ${settings.length} site settings created\n`);

  console.log(' Seed data completed successfully!');
  console.log('\nTom tat:');
  console.log(`   - ${3} users (1 admin, 2 users)`);
  console.log(`   - ${provinces.length} provinces`);
  console.log(`   - ${categories.length} destination categories`);
  console.log(`   - ${destinations.length} destinations`);
  console.log(`   - ${destImages.length} destination images`);
  console.log(`   - ${tags.length} tags`);
  console.log(`   - ${tours.length} tours`);
  console.log(`   - ${schedules.length} tour schedules`);
  console.log(`   - ${articleCategories.length} article categories`);
  console.log(`   - ${articles.length} articles`);
  console.log(`   - ${reviews.length} reviews`);
  console.log(`   - ${inquiries.length} inquiries`);
}

main()
  .catch((e) => {
    console.error(' Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
