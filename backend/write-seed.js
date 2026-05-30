const fs = require('fs');
const path = require('path');

const seedContent = `const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  console.log('Creating roles...');
  const adminRole = await prisma.role.upsert({ where: { name: 'admin' }, update: {}, create: { name: 'admin' } });
  const userRole = await prisma.role.upsert({ where: { name: 'user' }, update: {}, create: { name: 'user' } });

  console.log('Creating provinces...');
  const provinces = await Promise.all([
    prisma.province.upsert({ where: { slug: 'ha-noi' }, update: {}, create: { name: 'Ha Noi', slug: 'ha-noi', region: 'NORTH' } }),
    prisma.province.upsert({ where: { slug: 'hai-phong' }, update: {}, create: { name: 'Hai Phong', slug: 'hai-phong', region: 'NORTH' } }),
    prisma.province.upsert({ where: { slug: 'sa-pa' }, update: {}, create: { name: 'Lao Cai', slug: 'sa-pa', region: 'NORTH' } }),
    prisma.province.upsert({ where: { slug: 'quang-ninh' }, update: {}, create: { name: 'Quang Ninh', slug: 'quang-ninh', region: 'NORTH' } }),
    prisma.province.upsert({ where: { slug: 'ninh-binh' }, update: {}, create: { name: 'Ninh Binh', slug: 'ninh-binh', region: 'NORTH' } }),
    prisma.province.upsert({ where: { slug: 'thanh-hoa' }, update: {}, create: { name: 'Thanh Hoa', slug: 'thanh-hoa', region: 'NORTH' } }),
    prisma.province.upsert({ where: { slug: 'nghe-an' }, update: {}, create: { name: 'Nghe An', slug: 'nghe-an', region: 'NORTH' } }),
    prisma.province.upsert({ where: { slug: 'hue' }, update: {}, create: { name: 'Thua Thien Hue', slug: 'hue', region: 'CENTRAL' } }),
    prisma.province.upsert({ where: { slug: 'da-nang' }, update: {}, create: { name: 'Da Nang', slug: 'da-nang', region: 'CENTRAL' } }),
    prisma.province.upsert({ where: { slug: 'hoi-an' }, update: {}, create: { name: 'Quang Nam', slug: 'hoi-an', region: 'CENTRAL' } }),
    prisma.province.upsert({ where: { slug: 'khanh-hoa' }, update: {}, create: { name: 'Khanh Hoa', slug: 'khanh-hoa', region: 'CENTRAL' } }),
    prisma.province.upsert({ where: { slug: 'lam-dong' }, update: {}, create: { name: 'Lam Dong', slug: 'lam-dong', region: 'CENTRAL' } }),
    prisma.province.upsert({ where: { slug: 'binh-thuan' }, update: {}, create: { name: 'Binh Thuan', slug: 'binh-thuan', region: 'CENTRAL' } }),
    prisma.province.upsert({ where: { slug: 'ho-chi-minh' }, update: {}, create: { name: 'Ho Chi Minh', slug: 'ho-chi-minh', region: 'SOUTH' } }),
    prisma.province.upsert({ where: { slug: 'phu-quoc' }, update: {}, create: { name: 'Kien Giang', slug: 'phu-quoc', region: 'SOUTH' } }),
    prisma.province.upsert({ where: { slug: 'can-tho' }, update: {}, create: { name: 'Can Tho', slug: 'can-tho', region: 'SOUTH' } }),
    prisma.province.upsert({ where: { slug: 'vung-tau' }, update: {}, create: { name: 'Ba Ria Vung Tau', slug: 'vung-tau', region: 'SOUTH' } }),
    prisma.province.upsert({ where: { slug: 'dong-nai' }, update: {}, create: { name: 'Dong Nai', slug: 'dong-nai', region: 'SOUTH' } }),
    prisma.province.upsert({ where: { slug: 'ca-mau' }, update: {}, create: { name: 'Ca Mau', slug: 'ca-mau', region: 'SOUTH' } }),
  ]);

  console.log('Creating destination categories...');
  const destCategories = await Promise.all([
    prisma.destinationCategory.upsert({ where: { slug: 'bien' }, update: {}, create: { name: 'Bien & Dao', slug: 'bien', icon: 'waves', description: 'Cac bai bien dep, dao nhiem doi' } }),
    prisma.destinationCategory.upsert({ where: { slug: 'nui-rung' }, update: {}, create: { name: 'Nui & Rung', slug: 'nui-rung', icon: 'terrain', description: 'Nui non, rung nguyen sinh' } }),
    prisma.destinationCategory.upsert({ where: { slug: 'di-tich' }, update: {}, create: { name: 'Di tich & Lich su', slug: 'di-tich', icon: 'account-balance', description: 'Cac di tich lich su, van hoa' } }),
    prisma.destinationCategory.upsert({ where: { slug: 'thien-nhien' }, update: {}, create: { name: 'Thien nhien', slug: 'thien-nhien', icon: 'park', description: 'Canh quan thien nhien' } }),
    prisma.destinationCategory.upsert({ where: { slug: 'lang-nghe' }, update: {}, create: { name: 'Lang nghe', slug: 'lang-nghe', icon: 'palette', description: 'Lang nghe truyen thong' } }),
    prisma.destinationCategory.upsert({ where: { slug: 'cong-trinh' }, update: {}, create: { name: 'Cong trinh kien truc', slug: 'cong-trinh', icon: 'architecture', description: 'Cong trinh kien truc noi bat' } }),
  ]);

  console.log('Creating article categories...');
  const articleCategories = await Promise.all([
    prisma.articleCategory.upsert({ where: { slug: 'kinh-nghiem' }, update: {}, create: { name: 'Kinh nghiem', slug: 'kinh-nghiem' } }),
    prisma.articleCategory.upsert({ where: { slug: 'an-uong' }, update: {}, create: { name: 'Am thuc', slug: 'an-uong' } }),
    prisma.articleCategory.upsert({ where: { slug: 'lich-trinh' }, update: {}, create: { name: 'Lich trinh', slug: 'lich-trinh' } }),
    prisma.articleCategory.upsert({ where: { slug: 'me-tiet-kiem' }, update: {}, create: { name: 'Me tiet kiem', slug: 'me-tiet-kiem' } }),
    prisma.articleCategory.upsert({ where: { slug: 'review' }, update: {}, create: { name: 'Review', slug: 'review' } }),
  ]);

  console.log('Creating tags...');
  await Promise.all([
    prisma.tag.upsert({ where: { slug: 'an-toan' }, update: {}, create: { name: 'An toan', slug: 'an-toan' } }),
    prisma.tag.upsert({ where: { slug: 'gia-dinh' }, update: {}, create: { name: 'Gia dinh', slug: 'gia-dinh' } }),
    prisma.tag.upsert({ where: { slug: 'couple' }, update: {}, create: { name: 'Cap doi', slug: 'couple' } }),
    prisma.tag.upsert({ where: { slug: 'tre-em' }, update: {}, create: { name: 'Tre em', slug: 'tre-em' } }),
    prisma.tag.upsert({ where: { slug: 'nhom-ban' }, update: {}, create: { name: 'Nhom ban', slug: 'nhom-ban' } }),
    prisma.tag.upsert({ where: { slug: 'solo' }, update: {}, create: { name: 'Solo', slug: 'solo' } }),
    prisma.tag.upsert({ where: { slug: 'chup-anh' }, update: {}, create: { name: 'Chup anh', slug: 'chup-anh' } }),
    prisma.tag.upsert({ where: { slug: 'trekking' }, update: {}, create: { name: 'Trekking', slug: 'trekking' } }),
  ]);

  console.log('Creating users...');
  const hashedAdmin = await bcrypt.hash('admin123', 12);
  const hashedUser = await bcrypt.hash('user123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@webquangbadulich.com' },
    update: {},
    create: {
      email: 'admin@webquangbadulich.com',
      password: hashedAdmin,
      fullName: 'Nguyen Van Admin',
      phone: '0901234567',
      roleId: adminRole.id,
    },
  });

  await Promise.all([
    prisma.user.upsert({ where: { email: 'user@webquangbadulich.com' }, update: {}, create: { email: 'user@webquangbadulich.com', password: hashedUser, fullName: 'Tran Thi User', phone: '0902345678', roleId: userRole.id } }),
    prisma.user.upsert({ where: { email: 'minh.traveler@email.com' }, update: {}, create: { email: 'minh.traveler@email.com', password: hashedUser, fullName: 'Le Hoang Minh', phone: '0912345678', roleId: userRole.id } }),
    prisma.user.upsert({ where: { email: 'lan.anh88@email.com' }, update: {}, create: { email: 'lan.anh88@email.com', password: hashedUser, fullName: 'Pham Lan Anh', phone: '0923456789', roleId: userRole.id } }),
    prisma.user.upsert({ where: { email: 'khoi.nguyen@email.com' }, update: {}, create: { email: 'khoi.nguyen@email.com', password: hashedUser, fullName: 'Nguyen Khoi', phone: '0934567890', roleId: userRole.id } }),
    prisma.user.upsert({ where: { email: 'thu.hue@email.com' }, update: {}, create: { email: 'thu.hue@email.com', password: hashedUser, fullName: 'Hoang Thu Ha', phone: '0945678901', roleId: userRole.id } }),
  ]);

  for (let i = 1; i <= 15; i++) {
    await prisma.user.upsert({
      where: { email: 'user' + i + '@example.com' },
      update: {},
      create: {
        email: 'user' + i + '@example.com',
        password: hashedUser,
        fullName: 'Nguoi dung ' + i,
        phone: '09' + String(10000000 + i).slice(1),
        roleId: userRole.id,
      },
    });
  }

  const provinceMap = {};
  provinces.forEach(p => { provinceMap[p.slug] = p.id; });
  const catMap = {};
  destCategories.forEach(c => { catMap[c.slug] = c.id; });
  const artCatMap = {};
  articleCategories.forEach(c => { artCatMap[c.slug] = c.id; });

  console.log('Creating destinations...');
  const destData = [
    { name: 'Vinh Ha Long', slug: 'vinh-ha-long', provinceSlug: 'quang-ninh', catSlug: 'bien', shortDesc: 'Ky quan thien nhien the gioi voi 1.600 hon dao da voi', address: 'Vinh Ha Long, Quang Ninh', bestTime: 'Thang 3 - Thang 5', estimatedCost: '1.500.000 - 3.000.000 VND', rating: 4.8, reviewCount: 245, viewCount: 12500, isFeatured: true, highlights: JSON.stringify(['Tham hang Sung Sot', 'Kayak trong vinh', 'Ngam hoang hon', 'Thuyen buom']) },
    { name: 'Sapa', slug: 'sa-pa', provinceSlug: 'sa-pa', catSlug: 'nui-rung', shortDesc: 'Thi tran tren cao nguyen voi ruong bac thang va nui non hung vi', address: 'Thi tran Sapa, Lao Cai', bestTime: 'Thang 9 - Thang 11', estimatedCost: '2.000.000 - 5.000.000 VND', rating: 4.7, reviewCount: 198, viewCount: 9800, isFeatured: true, highlights: JSON.stringify(['Ruong bac thang Muong Hoa', 'Dinh Fansipan', 'Ban Cat Cat', 'Nui Ham Rong']) },
    { name: 'Co do Hue', slug: 'co-do-hue', provinceSlug: 'hue', catSlug: 'di-tich', shortDesc: 'Kinh do trieu Nguyen voi Hoang thanh va lang tam nga ngay', address: 'Thanh pho Hue, Thua Thien Hue', bestTime: 'Thang 1 - Thang 4', estimatedCost: '800.000 - 2.000.000 VND', rating: 4.6, reviewCount: 167, viewCount: 8200, isFeatured: true, highlights: JSON.stringify(['Hoang thanh', 'Lang Minh Mang', 'Chua Thien Mu', 'Dai Noi']) },
    { name: 'Phong Nha - Ke Bang', slug: 'phong-nha-ke-bang', provinceSlug: 'nghe-an', catSlug: 'thien-nhien', shortDesc: 'He thong hang dong lon nhat the gioi voi hang Son Doong', address: 'Bo Trach, Quang Binh', bestTime: 'Thang 2 - Thang 8', estimatedCost: '1.000.000 - 3.500.000 VND', rating: 4.9, reviewCount: 156, viewCount: 7600, isFeatured: true, highlights: JSON.stringify(['Dong Phong Nha', 'Hang Son Doong', 'Song ngam', 'Bai Da']) },
    { name: 'Trang An', slug: 'trang-an', provinceSlug: 'ninh-binh', catSlug: 'thien-nhien', shortDesc: 'Di san the gioi UNESCO voi thuyen qua hang dong giua nui non', address: 'Hoa Lu, Ninh Binh', bestTime: 'Thang 5 - Thang 9', estimatedCost: '500.000 - 1.500.000 VND', rating: 4.7, reviewCount: 189, viewCount: 9100, isFeatured: true, highlights: JSON.stringify(['Thuyen qua hang', 'Chua Bai Dinh', 'Hang Sung Sot', 'Co do Hoa Lu']) },
    { name: 'Ha Noi', slug: 'ha-noi', provinceSlug: 'ha-noi', catSlug: 'di-tich', shortDesc: 'Thu do ngan nam van hien voi pho co va am thuc duong pho', address: 'Quan Hoan Kiem, Ha Noi', bestTime: 'Thang 9 - Thang 11', estimatedCost: '500.000 - 2.000.000 VND', rating: 4.5, reviewCount: 223, viewCount: 15000, isFeatured: true, highlights: JSON.stringify(['Ho Hoan Kiem', 'Pho co Ha Noi', 'Van Mieu', 'Cho Dong Xuan']) },
    { name: 'Mu Cang Chai', slug: 'mu-cang-chai', provinceSlug: 'sa-pa', catSlug: 'nui-rung', shortDesc: 'Ruong bac thang vang ruc giua nui Tay Bac', address: 'Mu Cang Chai, Yen Bai', bestTime: 'Thang 9 - Thang 10', estimatedCost: '1.500.000 - 3.000.000 VND', rating: 4.8, reviewCount: 134, viewCount: 6800, isFeatured: true, highlights: JSON.stringify(['Ruong bac thang', 'Deo Khau Phe', 'Ban Pung Luong', 'Cho Mu Cang Chai']) },
    { name: 'Cao Bang - Thac Ban Gioc', slug: 'cao-bang-ban-gioc', provinceSlug: 'quang-ninh', catSlug: 'thien-nhien', shortDesc: 'Thac nuoc tu nhien lon nhat Viet Nam va vuong dat lich su', address: 'Cao Bang', bestTime: 'Thang 5 - Thang 9', estimatedCost: '1.200.000 - 2.500.000 VND', rating: 4.6, reviewCount: 98, viewCount: 4500, isFeatured: false, highlights: JSON.stringify(['Thac Ban Gioc', 'Dong Ngu NgGa', 'Pac Bo', 'Ho Ban Gioc']) },
    { name: 'Da Nang', slug: 'da-nang', provinceSlug: 'da-nang', catSlug: 'bien', shortDesc: 'Thanh pho bien xinh dep voi cau Rong va Ba Na Hills', address: 'Thanh pho Da Nang', bestTime: 'Thang 2 - Thang 4', estimatedCost: '1.000.000 - 3.000.000 VND', rating: 4.7, reviewCount: 287, viewCount: 14000, isFeatured: true, highlights: JSON.stringify(['Cau Rong', 'Ba Na Hills', 'Bai bien My Khe', 'Ngu Hanh Son']) },
    { name: 'Hoi An', slug: 'hoi-an', provinceSlug: 'hoi-an', catSlug: 'di-tich', shortDesc: 'Pho co UNESCO voi kien truc den long va am thuc doc dao', address: 'Thanh pho Hoi An, Quang Nam', bestTime: 'Thang 2 - Thang 4', estimatedCost: '800.000 - 2.500.000 VND', rating: 4.8, reviewCount: 312, viewCount: 16500, isFeatured: true, highlights: JSON.stringify(['Pho co Hoi An', 'Cau Nhat Ban', 'Hoi quan Phuc Kien', 'Bai bien Cua Dai']) },
    { name: 'Nha Trang', slug: 'nha-trang', provinceSlug: 'khanh-hoa', catSlug: 'bien', shortDesc: 'Thanh pho bien resort voi nuoc trong xanh quanh nam', address: 'Thanh pho Nha Trang, Khanh Hoa', bestTime: 'Thang 1 - Thang 9', estimatedCost: '1.500.000 - 5.000.000 VND', rating: 4.6, reviewCount: 256, viewCount: 13000, isFeatured: true, highlights: JSON.stringify(['Bai bien Tran Phu', 'Vinpearl Land', 'Vien Hai duong hoc', 'Dao Hon Tam']) },
    { name: 'Mui Ne', slug: 'mui-ne', provinceSlug: 'binh-thuan', catSlug: 'bien', shortDesc: 'Khu nghi mat bien voi dun cat vang va kitesurfing', address: 'Phan Thiet, Binh Thuan', bestTime: 'Thang 1 - Thang 8', estimatedCost: '800.000 - 3.000.000 VND', rating: 4.4, reviewCount: 178, viewCount: 8500, isFeatured: true, highlights: JSON.stringify(['Dun cat Mui Ne', 'Bai da Duyen My', 'Kitesurfing', 'Lang chai Mui Ne']) },
    { name: 'Da Lat', slug: 'da-lat', provinceSlug: 'lam-dong', catSlug: 'nui-rung', shortDesc: 'Thanh pho mong mo voi hoa, ho va khi hau mat me', address: 'Thanh pho Da Lat, Lam Dong', bestTime: 'Thang 10 - Thang 3', estimatedCost: '1.000.000 - 3.000.000 VND', rating: 4.7, reviewCount: 234, viewCount: 11200, isFeatured: true, highlights: JSON.stringify(['Ho Tuyen Lam', 'Vuon hoa thanh pho', 'Thung lung Tinh Yeu', 'Ho Than Tho']) },
    { name: 'Phu Quoc', slug: 'phu-quoc', provinceSlug: 'phu-quoc', catSlug: 'bien', shortDesc: 'Dao Ngoc voi bai bien dep va resort cao cap', address: 'Phu Quoc, Kien Giang', bestTime: 'Thang 11 - Thang 3', estimatedCost: '2.000.000 - 10.000.000 VND', rating: 4.8, reviewCount: 298, viewCount: 15500, isFeatured: true, highlights: JSON.stringify(['Bai Sao', 'Vinpearl Safari', 'Grand World', 'Cap treo Hon Thom']) },
    { name: 'TP. Ho Chi Minh', slug: 'ho-chi-minh-city', provinceSlug: 'ho-chi-minh', catSlug: 'cong-trinh', shortDesc: 'Thanh pho lon nhat voi kien truc Phap va am thuc duong pho', address: 'Quan 1, TP. Ho Chi Minh', bestTime: 'Thang 12 - Thang 3', estimatedCost: '500.000 - 3.000.000 VND', rating: 4.5, reviewCount: 345, viewCount: 18000, isFeatured: true, highlights: JSON.stringify(['Nha tho Duc Ba', 'Dinh Doc Lap', 'Ben Thanh', 'Pho di bo Nguyen Hue']) },
    { name: 'Can Tho', slug: 'can-tho', provinceSlug: 'can-tho', catSlug: 'thien-nhien', shortDesc: 'Vung dong bang song Cuu Long voi cho noi va vuon trai cay', address: 'Thanh pho Can Tho', bestTime: 'Thang 12 - Thang 4', estimatedCost: '600.000 - 1.500.000 VND', rating: 4.5, reviewCount: 156, viewCount: 7200, isFeatured: true, highlights: JSON.stringify(['Cho noi Cai Rang', 'Ben Ninh Kieu', 'Vuon cay an trai', 'Nha co Binh Thuy']) },
    { name: 'Vung Tau', slug: 'vung-tau', provinceSlug: 'vung-tau', catSlug: 'bien', shortDesc: 'Thanh pho bien gan Sai Gon voi tuong Chua Kit o va am thuc', address: 'Thanh pho Vung Tau, Ba Ria Vung Tau', bestTime: 'Thang 1 - Thang 9', estimatedCost: '500.000 - 2.000.000 VND', rating: 4.4, reviewCount: 189, viewCount: 8900, isFeatured: false, highlights: JSON.stringify(['Tuong Chua Kit o', 'Bai Sau', 'Mui Nghinh Phong', 'Ben cang Song Hau']) },
    { name: 'Con Dao', slug: 'con-dao', provinceSlug: 'vung-tau', catSlug: 'bien', shortDesc: 'Quan dao hoang so voi bai bien dep va lich su tu dao', address: 'Con Dao, Ba Ria Vung Tau', bestTime: 'Thang 3 - Thang 9', estimatedCost: '3.000.000 - 8.000.000 VND', rating: 4.9, reviewCount: 87, viewCount: 5100, isFeatured: false, highlights: JSON.stringify(['Bai Dam', 'Nghia trang Hang Duong', 'Hon Bay Canh', 'Lan ngam san ho']) },
    { name: 'Bac Lieu', slug: 'bac-lieu', provinceSlug: 'can-tho', catSlug: 'thien-nhien', shortDesc: 'Canh dong gio voi coi xay va nha Cong tu Bac Lieu', address: 'Thanh pho Bac Lieu', bestTime: 'Thang 12 - Thang 4', estimatedCost: '400.000 - 1.200.000 VND', rating: 4.3, reviewCount: 65, viewCount: 3200, isFeatured: false, highlights: JSON.stringify(['Canh dong gio', 'Nha Cong tu', 'Khu du lich Nha Mat', 'Chua Doi']) },
    { name: 'Ban Cat Cat', slug: 'ban-cat-cat', provinceSlug: 'sa-pa', catSlug: 'lang-nghe', shortDesc: 'Ban lang H_Mong co voi thac nuoc va ruong bac thang', address: 'Sapa, Lao Cai', bestTime: 'Thang 9 - Thang 11', estimatedCost: '500.000 - 1.500.000 VND', rating: 4.5, reviewCount: 112, viewCount: 5400, isFeatured: false, highlights: JSON.stringify(['Thac Cat Cat', 'Cay may', 'Nha trinh tuong', 'Det vai truyen thong']) },
    { name: 'Dao Ly Son', slug: 'dao-ly-son', provinceSlug: 'khanh-hoa', catSlug: 'bien', shortDesc: 'Hon dao hoang so voi san ho va hai san tuoi ngon', address: 'Ly Son, Quang Ngai', bestTime: 'Thang 4 - Thang 8', estimatedCost: '1.000.000 - 2.500.000 VND', rating: 4.6, reviewCount: 78, viewCount: 4100, isFeatured: false, highlights: JSON.stringify(['Bai Binh', 'Hon Mu Cu', 'Mieu An Vinh', 'Hon Be']) },
    { name: 'Can Gio', slug: 'can-gio', provinceSlug: 'ho-chi-minh', catSlug: 'thien-nhien', shortDesc: 'Khu du tru sinh quyen UNESCO voi rung ngap man va ca sau', address: 'Huyen Can Gio, TP.HCM', bestTime: 'Thang 6 - Thang 12', estimatedCost: '300.000 - 1.000.000 VND', rating: 4.4, reviewCount: 92, viewCount: 4300, isFeatured: false, highlights: JSON.stringify(['Rung ngap man', 'Khu du lich Binh Chanh', 'Ca sau hoa ca', 'Cau Sang']) },
    { name: 'Yen Tu', slug: 'yen-tu', provinceSlug: 'quang-ninh', catSlug: 'nui-rung', shortDesc: 'Nui linh thien voi chua Hoa Yen va cap treo len dinh', address: 'Uong Bi, Quang Ninh', bestTime: 'Thang 3 - Thang 5', estimatedCost: '500.000 - 1.500.000 VND', rating: 4.6, reviewCount: 134, viewCount: 6200, isFeatured: false, highlights: JSON.stringify(['Chua Hoa Yen', 'Am Thanh Van', 'Cap treo Yen Tu', 'Dinh Yen Tu']) },
    { name: 'Quy Nhon', slug: 'quy-nhon', provinceSlug: 'khanh-hoa', catSlug: 'bien', shortDesc: 'Thanh pho bien yen binh voi dao Hon Kho va am thuc', address: 'Thanh pho Quy Nhon, Binh Dinh', bestTime: 'Thang 3 - Thang 8', estimatedCost: '800.000 - 2.000.000 VND', rating: 4.5, reviewCount: 123, viewCount: 5600, isFeatured: false, highlights: JSON.stringify(['Bai bien Quy Nhon', 'Dao Hon Kho', 'Eo Gio', 'Chua Ong Nun']) },
    { name: 'Chau Doc - Nui Cam', slug: 'nui-cam-chau-doc', provinceSlug: 'can-tho', catSlug: 'nui-rung', shortDesc: 'Nui Cam voi tuong Phat Ba Quan Am lon nhat Dong Nam A', address: 'Thi xa Chau Doc, An Giang', bestTime: 'Thang 11 - Thang 4', estimatedCost: '600.000 - 1.500.000 VND', rating: 4.5, reviewCount: 98, viewCount: 4800, isFeatured: false, highlights: JSON.stringify(['Nui Cam', 'Chua Van Linh', 'Mieu Ba Chua Xu', 'Cho Chau Doc']) },
    { name: 'Pu Luong', slug: 'pu-luong', provinceSlug: 'thanh-hoa', catSlug: 'nui-rung', shortDesc: 'Khu bao ton thien nhien voi ruong bac thang va lang dan toc', address: 'Quan Hoa, Thanh Hoa', bestTime: 'Thang 5 - Thang 10', estimatedCost: '800.000 - 2.000.000 VND', rating: 4.7, reviewCount: 76, viewCount: 3900, isFeatured: false, highlights: JSON.stringify(['Ruong bac thang', 'Lang Pu Luong', 'Thac Hieu', 'Deo Dai Linh']) },
    { name: 'Moc Chau', slug: 'moc-chau', provinceSlug: 'thanh-hoa', catSlug: 'nui-rung', shortDesc: 'Cao nguyen voi doi che xanh va hoa ban noi trang', address: 'Moc Chau, Son La', bestTime: 'Thang 3 - Thang 5', estimatedCost: '800.000 - 2.500.000 VND', rating: 4.6, reviewCount: 145, viewCount: 7000, isFeatured: false, highlights: JSON.stringify(['Doi che Tan Lap', 'Thung lung hoa', 'Vuon dau tay', 'Dinh Pha Den']) },
    { name: 'Ba Na Hills', slug: 'ba-na-hills', provinceSlug: 'da-nang', catSlug: 'cong-trinh', shortDesc: 'Quan the du lich voi Cau Vang noi tieng the gioi', address: 'Hoa Nhac, Da Nang', bestTime: 'Quanh nam', estimatedCost: '1.500.000 - 3.500.000 VND', rating: 4.7, reviewCount: 267, viewCount: 14000, isFeatured: false, highlights: JSON.stringify(['Cau Vang', 'Cap treo Ba Na', 'French Village', 'Lau dai']) },
    { name: 'Bach Ma', slug: 'bach-ma', provinceSlug: 'hue', catSlug: 'nui-rung', shortDesc: 'Vuon quoc gia voi rung nguyen sinh va thac nuoc', address: 'Phu Loc, Thua Thien Hue', bestTime: 'Thang 2 - Thang 8', estimatedCost: '500.000 - 1.500.000 VND', rating: 4.6, reviewCount: 89, viewCount: 4200, isFeatured: false, highlights: JSON.stringify(['Thac Ngoc Tu', 'Dinh Bach Ma', 'Duong ham trong rung', 'Thac Huong']) },
    { name: 'Thien Vien Truc Lam', slug: 'thien-vien-truc-lam', provinceSlug: 'lam-dong', catSlug: 'di-tich', shortDesc: 'Thien vien lon voi tuong Phat dong va ho Tuyen Lam', address: 'Ho Tuyen Lam, Da Lat', bestTime: 'Thang 10 - Thang 3', estimatedCost: 'Mien phi', rating: 4.5, reviewCount: 167, viewCount: 7800, isFeatured: false, highlights: JSON.stringify(['Tuong Phat Thich Ca', 'Ho Tuyen Lam', 'Thap Phat', 'Vuon hoa Anh Dao']) },
    { name: 'Vinh Hy - Ca Na', slug: 'vinh-hy-ca-na', provinceSlug: 'khanh-hoa', catSlug: 'bien', shortDesc: 'Vinh hoang so voi kayak, lan san ho va hai san', address: 'Ninh Hai, Ninh Thuan', bestTime: 'Thang 3 - Thang 9', estimatedCost: '800.000 - 2.000.000 VND', rating: 4.7, reviewCount: 94, viewCount: 4600, isFeatured: false, highlights: JSON.stringify(['Vinh Vinh Hy', 'Lan ngam san ho', 'Ruong muoi', 'Diem cau ca']) },
    { name: 'Ninh Hoa', slug: 'ninh-hoa-khanh-hoa', provinceSlug: 'khanh-hoa', catSlug: 'lang-nghe', shortDesc: 'Vung dat nuoc mam noi tieng voi dong que yen binh', address: 'Ninh Hoa, Khanh Hoa', bestTime: 'Thang 2 - Thang 8', estimatedCost: '400.000 - 1.200.000 VND', rating: 4.3, reviewCount: 58, viewCount: 2800, isFeatured: false, highlights: JSON.stringify(['Nuoc mam Ninh Hoa', 'Dao Yen', 'Bun ca sua', 'Lang chai Doc Let']) },
  ];

  const destDesc = {
    'vinh-ha-long': 'Vinh Ha Long la mot trong nhung ky quan thien nhien the gioi voi hon 1.600 hon dao da voi. Du khach co the kham pha hang dong ky bi, tam bien tren bai cat trang, va trai nghiem cuoc song lang chai doc dao. Vinh duoc UNESCO cong nhan la Di san Thien nhien The gioi hai lan vao nam 1994 va 2000.',
    'sa-pa': 'Sapa la diem den noi tieng nhat vung Tay Bac Viet Nam, nam o do cao 1.500m so voi muc nuoc bien. Thi tran duoc bao quanh boi nhung ruong bac thang ky vi, nhung dinh nui cao chot vot va nhung thung lung mui suong. Day la noi sinh song cua nhieu dan toc thieu so nhu H_Mong, Dao, Tay voi cuoc song va van hoa dac sac.',
    'co-do-hue': 'Co do Hue la di san van hoa phi vat the cua nhan loai, tung la kinh do cua trieu Nguyen trong gan 150 nam. Khu phuc hop bao gom Hoang thanh Thang Long voi kien truc doc dao, cac lang tam cac vua Nguyen, chua Thien Mu linh theng, va vo so cong trinh kien truc dep mat mang dam dau van hoa Phap va A Dong.',
    'phong-nha-ke-bang': 'Vuon quoc gia Phong Nha - Ke Bang noi tieng voi he thong hang dong lon nhat the gioi. Dong Phong Nha duoc menh danh la Vuong quoc hang dong voi Song Ngam 14km va hang Son Doong la hang dong lon nhat the gioi. Du khach se bi choang ngo boi ve dep ky vi cua nhung nhu da muon hinh muon ve ben trong long nui.',
    'trang-an': 'Quan the danh thang Trang An duoc UNESCO cong nhan la Di san Thien nhien The gioi, noi tieng voi he thong nui da voi, thung lung ngap nuoc va hang dong huyen bi. Du khach ngoi thuyen small qua cac hang dong de kham pha canh quan thien nhien hoang so ket hop voi cac di tich lich su, den chua co kinh.',
    'ha-noi': 'Ha Noi - thu do ngan nam van hien cua Viet Nam, la su ket hop hai hoa giua truyen thong va hien dai. Pho co Ha Noi voi 36 pho phuong, Ho Hoan Kiem voi thap Rua huyen thoai, Van Mieu - Quoc Tu Giam la bieu tuong cua nen van hoa Nho giao. Thu do con noi tieng voi am thuc duong pho phong phu va nhung quan ca phe sang tao.',
    'mu-cang-chai': 'Mu Cang Chai la diem den noi tieng voi nhung thua ruong bac thang trung diep tuong chung von tan, dac biet vao mua lua chin tu thang 9 den thang 10 khi dong lua chuyen sang mau vang ruc ro. Day la noi sinh song cua nguoi H_Mong va Dao do voi nhung nep nha dac trung giua nui rung Tay Bac hung vi.',
    'cao-bang-ban-gioc': 'Cao Bang la tinh mien nui phia Dong Bac voi phong canh thien nhien hoang so, hung vi. Diem noi bat nhat la Thac Ban Gioc - mot trong nhung thac nuoc tu nhien lon nhat Viet Nam, voi dong nuoc do tu do cao 53m xuong ho nuoc xanh ngat. Khu vuc con co Dong Ngu NgGa, Pac Bo voi di tich Chu tich Ho Chi Minh tung sinh song.',
    'da-nang': 'Da Nang la thanh pho bien xinh dep nam o mien Trung Viet Nam, duoc menh danh la Thanh pho dang so nhat Viet Nam. Voi bo bien dai, nhung cay cau doc dao nhu Cau Rong, Cau Vang, Ba Na Hills voi the gioi thu nho, va am thuc hap dan, Da Nang la diem den ly tuong cho moi loai du khach.',
    'hoi-an': 'Hoi An la mot thuong cam co noi tieng duoc UNESCO cong nhan la Di san Van hoa The gioi. Pho co Hoi An voi nhung ngoi nha co kien truc dac trung, den long do lung linh ve dem, cac con pho nho xinh, nha co, hoi quan, chua cau Chac Lain. Day con la thien duong mua sam voi nhung cua hang thoi trang, do luu niem, va am thuc duong pho hap dan.',
    'nha-trang': 'Nha Trang la thanh pho bien noi tieng nhat mien Trung Viet Nam voi bo bien dai 6km, nuoc bien trong xanh quanh nam, va he thong resort sang trong. Thanh pho con co Vien Hai duong hoc lon nhat Dong Nam A, Thap Champa, Dao Hon Tam voi khu nghi duong cao cap, va Vinpearl Land voi cac tro choi giai tri da dang.',
    'mui-ne': 'Mui Ne la khu nghi mat bien noi tieng o Binh Thuan voi nhung dun cat vang trai dai ben bo bien xanh ngat. Diem dac biet la Canh dong cat Mui Ne voi nhung dun cat lon, noi du khach co the trai nghiem sandboarding, va Bai da Duyen My voi nhung tang da du hinh dang. Day cung la noi co Resort cao cap va kitesurfing noi tieng.',
    'da-lat': 'Da Lat - Thanh pho ngan hoa, thanh pho mong mo nam tren cao nguyen Lam Vien o do cao 1.500m. Khi hau mat me quanh nam, nhung doi thong xanh ngat, ho Tuyen Lam, ho Than Tho tho mong, vuon hoa du sac mau, va nhung bien thu Phap co mang dam dau thuoc dia. Da Lat la diem den ly tuong cho nhung ai yeu thich su lang man va thien nhien.',
    'phu-quoc': 'Phu Quoc - Dao Ngoc cua Viet Nam, la hon dao lon nhat Viet Nam nam trong vihn Thai Lan. Voi bai bien cat trang min, nuoc bien trong xanh, ran san ho phong phu, va he thong resort cao cap, Phu Quoc la diem den nghi duong ly tuong. Dao con noi tieng voi nhung dac san nhu bach tuoc kho, nuoc mam, va tieu.',
    'ho-chi-minh-city': 'TP. Ho Chi Minh - Sai Gon hoa le, la thanh pho lon nhat Viet Nam voi nhip song soi dong. Thanh pho co nhung cong trinh kien truc doc dao nhu Nha tho Duc Ba, Buu dien Trung tam, Dinh Doc Lap, Ben Thanh. Ngoai ra, Sai Gon con noi tieng voi am thuc duong pho phong phu, cac khu cho sam uat va doi song ve dem nhon nhip.',
    'can-tho': 'Can Tho la trung tam van hoa, kinh te cua vung dong bang song Cuu Long, noi tieng voi cho noi Cai Rang, he thong song ngoi chang chit, va vuon cay an trai xanh tot. Du khach co the ngoi xuong ba la kham pha cho noi, tham cac nha vuon, thuong thuc trai cay tuoi ngon va dac san mien Tay nhu ca loc nuong trui, bun mam.',
    'vung-tau': 'Vung Tau la thanh pho bien gan TP.HCM nhat, la diem nghi mu cuoi tuan pho bien. Thanh pho co bai bien dai, tuong Chua Kit o cao 32m tren nui Nho voi tam view toan canh thanh pho va bien xa, cung voi cac cong trinh kien truc Phap co. Am thuc Vung Tau noi tieng voi banh khot, hai san tuoi song va bap rang bo.',
    'con-dao': 'Con Dao la quan dao xa xoi trong vihn Thai Lan, tung la nha tu cua che do thuc dan Phap va che do Sai Gon. Ngay nay, Con Dao noi tieng voi ve dep hoang so, bai bien tuyet dep nhu Bai Dam, Bai Lo Voi, va noi hanh trinh ve nguon tuong nho cac anh hung liet si. Hon dao con la noi sinh song cua rua bien va san ho quy hiem.',
    'bac-lieu': 'Bac Lieu la tinh duyen hai Nam Bo noi tieng voi nha Cong tu Bac Lieu, canh dong gio voi hang tram coi xay gio ben bo bien, va van hoa nguoi Hoa. Noi day con co khu di tich nha Cong tu Bac Lieu voi kien truc Phap doc dao, nha hat bach duong, va cac cong trinh lich su gan lien voi cuoc doi Luu Vu Dung.',
    'ban-cat-cat': 'Ban Cat Cat la ban lang cua nguoi H_Mong nam cach trung tam thi tran Sapa khoang 3km. Day la ban lang co voi he thong thac nuoc dep, ruong bac thang xung quanh, va cac gian nha truyen thong. Du khach co the di tour trekking de kham pha ban lang, tim hieu van hoa, trai nghiem det vai, va thuong thuc am thuc dia phuong.',
    'dao-ly-son': 'Dao Ly Son la hon dao nho xinh nam cach bo bien Quang Ngai khoang 30km, duoc menh danh la Quan dai Hang Cua voi ve dep hoang so. Dao co bai bien xanh trong, san ho du sac mau, hai san tuoi song, va dac biet la Mieu An Vinh - noi thoi Hai duc Thanh. Day la diem den ly tuong cho du lich sinh thai va kham pha bien dao.',
    'can-gio': 'Can Gio la huyen ngoai thanh TP.HCM voi he sinh thai rung ngap man dac trung, duoc UNESCO cong nhan la Khu du tru sinh quyen the gioi. Du khach co the kham pha rung ngap man bang xuong, ngam ca sau, dong song Duyen, va thuong thuc hai san Can Gio noi tieng nhu tom hung, cua gach, ca bong.',
    'yen-tu': 'Nui Yen Tu la ngon nui linh thien noi tieng voi su gan lien voi Pho hoang Tran Nhan Tong - vua sang lap dong thien Truc Lam. Tren nui co chua Hoa Yen, am Thanh Van, va he thong cap treo hien dai dua du khach len dinh. Noi day khong chi la diem hanh hau ma con la diem trekking, ngam canh dep nui rung phia Bac.',
    'quy-nhon': 'Quy Nhon la thanh pho bien yen binh o Binh Dinh, khong nao nhiet nhu Nha Trang nhung co ve dep hoang so rieng. Thanh pho co bai bien dep, dao Hon Kho voi nhung rang san ho, va dac biet la Khu di tich Dong Dinh - noi hanh trinh tu tap cua thien su Nguyen Thieu. Am thuc Quy Nhon noi tieng voi banh hoi, bun ca, va bun thit nuong.',
    'nui-cam-chau-doc': 'Chau Doc la thi xa bien gioi o An Giang, la cua ngoi ve mien Tay Nam Bo. Noi bat nhat la nui Cam voi chua Van Linh, tuong Phat Ba Quan Am cao nhat Dong Nam A, va tam view toan canh dong bang song Cuu Long. Khu vuc con co Mieu Ba Chua Xu noi tieng linh theng, va cho bien gioi sam uat voi Campuchia.',
    'pu-luong': 'Pu Luong la khu bao ton thien nhien nam o huyen Quan Hoa, Thanh Hoa, noi tieng voi nhung thua ruong bac thang dep nhu tranh ve, lang dan toc Muong va Thai voi nhung ngoi nha san truyen thong. Day la diem trekking ly tuong cho nhung ai yeu thien nhien hoang so va muon trai nghiem cuoc song cua dong bao vung cao.',
    'moc-chau': 'Moc Chau la cao nguyen noi tieng o Son La voi khi hau on hoa, doi che xanh muot bat tap, va nhung doi hoa ban noa trang vao mua xuan. Thung lung hoa Moc Chau, Vuon dau tay, Doi che Tan Lap la nhung diem check-in noi tieng. Day la diem den ly tuong cho gia dinh va nhung ai yeu thien nhien, khong khi trong lanh.',
    'ba-na-hills': 'Ba Na Hills la quan the du lich nghi duong va giai tri cao cap nam o do cao 1.487m tren nui Chua, Da Nang. Noi bat nhat la Cau Vang - cay cau vang noi tieng the gioi voi hai ban tay khong lo nang giua may troi. Ngoai ra con co French Village voi kien truc Chau Au, vuon hoa, khu vui choi giai tri, va cap treo dai nhat the gioi.',
    'bach-ma': 'Vuon quoc gia Bach Ma nam o ranh gioi Thua Thien Hue va Da Nang, la ngon nui cao 1.450m voi he sinh thai phong phu, thac nuoc dep, va khi hau mat me quanh nam. Day la diem trekking ly tuong voi nhung con duong mon xuyen rung, ngam canh dep tu dinh nui, va gap goi dong vat hoang da. Vuon quoc gia con co khu nghi duong view dep.',
    'thien-vien-truc-lam': 'Thien Vien Truc Lam Da Lat la mot trong nhung thien vien lon nhat Viet Nam, nam tren doi o ho Tuyen Lam, voi kien truc tong hop Phat giao, Hindu giao va cac quoc gia Chau A. Thien vien co tuong Phat Thich Ca bang dong lon, thap Phat, vuon canh, va tam view ho nuoc tuyet dep. Day la noi hanh thien, tinh tam ly tuong.',
    'vinh-hy-ca-na': 'Vinh Hy la vich nho nam o huyen Ninh Hai, Ninh Thuan, voi ve dep hoang so, bai bien trong xanh, va nui non bao quanh. Du khach co the di thuyen kayak, lan ngam san ho, va thuong thuc hai san tuoi song ngay tai lang chai. Noi day con noi tieng voi nhung ruong muoi trang xoa va nha rong - hinh anh dac trung cua vung Ninh Thuan nang gio.',
    'ninh-hoa': 'Ninh Hoa la vung dat noi tieng voi nuoc mam Ninh Hoa trum danh, nam cach Nha Trang khoang 50km. Vung dat nay co phong canh dong que yen binh, lang chai nho xinh, va am thuc dac sac rieng biet. Dac biet, khu du lich Yen Island voi to yen tu nhien la diem den hap dan. Ninh Hoa con noi tieng voi bun ca sua, banh xeo, va cac mon ngon tu nuoc mam.',
  };

  for (const dData of destData) {
    const provinceId = provinceMap[dData.provinceSlug];
    const categoryId = catMap[dData.catSlug];

    if (!provinceId || !categoryId) {
      console.log('Skipping ' + dData.name + ': missing province or category');
      continue;
    }

    const dest = await prisma.destination.upsert({
      where: { slug: dData.slug },
      update: {},
      create: {
        name: dData.name,
        slug: dData.slug,
        description: destDesc[dData.slug] || dData.shortDesc,
        shortDescription: dData.shortDesc,
        address: dData.address,
        provinceId,
        categoryId,
        bestTime: dData.bestTime,
        estimatedCost: dData.estimatedCost,
        rating: dData.rating,
        reviewCount: dData.reviewCount,
        viewCount: dData.viewCount,
        isFeatured: dData.isFeatured || false,
        isActive: true,
        highlights: dData.highlights,
        tips: 'Nen dat khach san truoc, mang theo kem chong nang, chuan bi du nuoc uong.',
      },
    });

    await prisma.destinationImage.upsert({
      where: { id: dest.id + '-primary' },
      update: {},
      create: {
        id: dest.id + '-primary',
        destinationId: dest.id,
        url: 'https://picsum.photos/seed/' + dData.slug + '/800/600',
        caption: dData.name,
        isPrimary: true,
        sortOrder: 0,
      },
    });

    for (let i = 1; i <= 2; i++) {
      await prisma.destinationImage.upsert({
        where: { id: dest.id + '-img' + i },
        update: {},
        create: {
          id: dest.id + '-img' + i,
          destinationId: dest.id,
          url: 'https://picsum.photos/seed/' + dData.slug + i + '/800/600',
          caption: dData.name + ' - Hinh ' + (i + 1),
          isPrimary: false,
          sortOrder: i,
        },
      });
    }
  }

  console.log('Creating tours...');
  const tourData = [
    { name: 'Ha Noi - Sapa - Fansipan 3N2D', slug: 'ha-noi-sapa-fansipan-3n2d', duration: '3 ngay 2 dem', maxPeople: 15, price: 3500000, discountPrice: 2990000, description: 'Kham pha thi tran Sapa huyen thoai voi ruong bac thang, ban lang dan toc, va chinh phuc dinh Fansipan - noc nha Dong Duong. Tour bao gom xe limousine, khach san 4 sao, huong dan vien chuyen nghiep.', includes: JSON.stringify(['Xe Limousine dieu hoa', 'Khach san 4 sao', 'Bua an theo chuong trinh', 'Huong dan vien', 'Ve cap treo Fansipan']), isFeatured: true, destinationSlug: 'sa-pa' },
    { name: 'Ha Long - Yen Tu 4N3D', slug: 'ha-long-yen-tu-4n3d', duration: '4 ngay 3 dem', maxPeople: 20, price: 5200000, discountPrice: 4590000, description: 'Tour ket hop kham pha vinh Ha Long - ky quan thien nhien the gioi va nui linh Yen Tu. Trai nghiem du thuyen 5 sao, phong VIP view bien, tham hang dong ky vi, va hanh hau mong an tren nui Yen Tu.', includes: JSON.stringify(['Du thuyen 5 sao', 'Phong VIP', 'Bua hai san tuoi song', 'Ve tham quan', 'Cap treo Yen Tu']), isFeatured: true, destinationSlug: 'vinh-ha-long' },
    { name: 'Hue - Da Nang - Hoi An 4N3D', slug: 'hue-da-nang-hoi-an-4n3d', duration: '4 ngay 3 dem', maxPeople: 25, price: 4500000, discountPrice: 3990000, description: 'Hanh trinh kham pha mien Trung voi co do Hue linh theng, thanh pho Da Nang hien dai, va pho co Hoi An lung linh. Tour tron goi, lich trinh hop ly, huong dan vien nhiet tinh.', includes: JSON.stringify(['Xe dua don', 'Khach san 4 sao', 'Bua sang', 'Ve tham quan', 'Huong dan vien']), isFeatured: true, destinationSlug: 'da-nang' },
    { name: 'Nha Trang - Dao 3N2D', slug: 'nha-trang-dao-3n2d', duration: '3 ngay 2 dem', maxPeople: 20, price: 3800000, discountPrice: 3290000, description: 'Tan huong ky nghi bien tai Nha Trang voi cac hoat dong: tam bien, lan ngam san ho, tham quan dao Hon Tam, Vinpearl Land. Resort 5 sao view bien, am thuc hai san tuoi ngon.', includes: JSON.stringify(['Resort 5 sao', 'An sang buffet', 'Ve Vinpearl Land', 'Tour dao', 'Lan san ho']), isFeatured: true, destinationSlug: 'nha-trang' },
    { name: 'Phu Quoc 4N3D', slug: 'phu-quoc-4n3d', duration: '4 ngay 3 dem', maxPeople: 15, price: 6500000, discountPrice: 5990000, description: 'Kham pha Dao Ngoc Phu Quoc voi chuong trinh tron goi: Grand World, Vinpearl Safari, cap treo Hon Thom, bai Sao tuyet dep. Resort cao cap, am thuc da dang.', includes: JSON.stringify(['Resort 5 sao', 'Grand World', 'Safari', 'Cap treo', 'An sang']), isFeatured: true, destinationSlug: 'phu-quoc' },
    { name: 'Da Lat Mong Mo 3N2D', slug: 'da-lat-mong-mo-3n2d', duration: '3 ngay 2 dem', maxPeople: 20, price: 2800000, discountPrice: 2490000, description: 'Trai nghiem thanh pho mong mo Da Lat voi ho Tuyen Lam, thung lung tinh yeu, vuon hoa, doi che, thac Datanla. Khach san view ho, xe dua don, am thuc Da Lat dac trung.', includes: JSON.stringify(['Khach san view ho', 'Xe dua don', 'Bua sang', 'Thac Datanla']), isFeatured: true, destinationSlug: 'da-lat' },
    { name: 'Can Tho - Bac Lieu - Ca Mau 5N4D', slug: 'can-tho-bac-lieu-ca-mau-5n4d', duration: '5 ngay 4 dem', maxPeople: 25, price: 4800000, discountPrice: 4290000, description: 'Hanh trinh kham pha mien Tay Nam Bo: cho noi Cai Rang, nha Cong tu Bac Lieu, Canh dong gio Bac Lieu, va mui Ca Mau - dat mui To quoc. Du thuyen tren song, am thuc mien Tay dac trung.', includes: JSON.stringify(['Du thuyen', 'Khach san', 'Bua an theo CT', 'Huong dan vien', 'Ve tham quan']), isFeatured: false, destinationSlug: 'can-tho' },
    { name: 'Ha Noi - Ninh Binh - Trang An 2N1D', slug: 'ha-noi-ninh-binh-trang-an-2n1d', duration: '2 ngay 1 dem', maxPeople: 30, price: 1800000, discountPrice: 1590000, description: 'Tour ngan ngay kham pha Trang An - di san the gioi UNESCO, voi thuyen qua hang dong, chua Bai Dinh, va Co do Hoa Lu. Phu hop cuoi tuan, lich trinh nhe nhang.', includes: JSON.stringify(['Xe dua don', 'Khach san', 'Bua sang', 'Ve thuyen Trang An', 'Huong dan vien']), isFeatured: false, destinationSlug: 'trang-an' },
    { name: 'Sai Gon - Vung Tau 2N1D', slug: 'sai-gon-vung-tau-2n1d', duration: '2 ngay 1 dem', maxPeople: 30, price: 1200000, discountPrice: 999000, description: 'Cuoi tuan nghi mat bien Vung Tau gan Sai Gon. Tham quan tuong Chua Kit o, bai bien, thuong thuc hai san va banh khot noi tieng. Khach san 4 sao, xe dieu hoa.', includes: JSON.stringify(['Xe dua don', 'Khach san 4 sao', 'An sang', 'Huong dan vien']), isFeatured: false, destinationSlug: 'vung-tau' },
    { name: 'Quy Nhon - Eo Gio - Ky Co 3N2D', slug: 'quy-nhon-eo-gio-ky-co-3n2d', duration: '3 ngay 2 dem', maxPeople: 15, price: 3200000, discountPrice: 2890000, description: 'Kham pha Quy Nhon yeu binh voi Eo Gio, bai Ky Co hoang so, dao Hon Kho. Tour nho nhom, linh hoat, trai nghiem local va am thuc Binh Dinh noi tieng.', includes: JSON.stringify(['Xe rieng', 'Khach san view bien', 'An sang', 'Huong dan vien', 'Ve Ky Co']), isFeatured: false, destinationSlug: 'quy-nhon' },
    { name: 'Mien Tay - Can Gio 1N', slug: 'mien-tay-can-gio-1n', duration: '1 ngay', maxPeople: 25, price: 650000, discountPrice: null, description: 'Tour mot ngay kham pha rung ngap man Can Gio - Khu du tru sinh quyen UNESCO. Di xuong trong rung ngap man, ngam ca sau, thuong thuc hai san Can Gio tuoi ngon.', includes: JSON.stringify(['Xe dua don', 'Xuong rung', 'Bua trua hai san', 'Huong dan vien']), isFeatured: false, destinationSlug: 'can-gio' },
    { name: 'Moc Chau - Doi che 2N1D', slug: 'moc-chau-doi-che-2n1d', duration: '2 ngay 1 dem', maxPeople: 20, price: 1900000, discountPrice: 1690000, description: 'Cuoi tuan relax tai Moc Chau voi doi che xanh muot, thung lung hoa ruc ro, Vuon dau tay. Khong khi mat me, phong canh dep nhu tranh, ideal cho gia dinh.', includes: JSON.stringify(['Xe dua don', 'Homestay', 'An sang', 'Huong dan vien', 'Tham quan']), isFeatured: false, destinationSlug: 'moc-chau' },
    { name: 'Phong Nha - Quang Binh 3N2D', slug: 'phong-nha-quang-binh-3n2d', duration: '3 ngay 2 dem', maxPeople: 12, price: 4200000, discountPrice: 3790000, description: 'Kham pha he thong hang dong lon nhat the gioi tai Phong Nha - Ke Bang. Dong Phong Nha, song ngam, va trai nghiem trekking chinh phuc thien nhien hoang so. Phu hop nguoi thich kham pha va thu thach.', includes: JSON.stringify(['Xe rieng', 'Khach san', 'Bua an', 'Huong dan vien chuyen nghiep', 'Ve tham quan']), isFeatured: false, destinationSlug: 'phong-nha-ke-bang' },
    { name: 'Da Nang - Ba Na Hills 3N2D', slug: 'da-nang-ba-na-hills-3n2d', duration: '3 ngay 2 dem', maxPeople: 25, price: 3800000, discountPrice: 3290000, description: 'Tour Da Nang tron goi voi Ba Na Hills tham Cau Vang noi tieng, Ngu Hanh Son, bien My Khe, va am thuc Da Nang. Resort 4 sao, lich trinh day dac trai nghiem.', includes: JSON.stringify(['Resort 4 sao', 'Xe dua don', 'Ve Ba Na', 'Bua sang', 'Huong dan vien']), isFeatured: false, destinationSlug: 'da-nang' },
    { name: 'Nui Cam - Chau Doc 2N1D', slug: 'nui-cam-chau-doc-2n1d', duration: '2 ngay 1 dem', maxPeople: 20, price: 1500000, discountPrice: 1290000, description: 'Hanh trinh ve mien Tay Nam Bo, leo nui Cam - noi co tuong Phat Ba lon nhat Dong Nam A, vieng mieu Ba Chua Xu linh theng, kham pha cho bien gioi Viet - Campuchia.', includes: JSON.stringify(['Xe dua don', 'Khach san', 'An sang', 'Huong dan vien']), isFeatured: false, destinationSlug: 'nui-cam-chau-doc' },
  ];

  for (const t of tourData) {
    const dest = await prisma.destination.findUnique({ where: { slug: t.destinationSlug } });
    await prisma.tour.upsert({
      where: { slug: t.slug },
      update: {},
      create: {
        name: t.name,
        slug: t.slug,
        description: t.description,
        shortDescription: t.description.substring(0, 200) + '...',
        duration: t.duration,
        maxPeople: t.maxPeople,
        price: t.price,
        discountPrice: t.discountPrice,
        destinationId: dest ? dest.id : null,
        imageUrl: 'https://picsum.photos/seed/' + t.slug + '/800/600',
        includes: t.includes,
        isFeatured: t.isFeatured,
        isActive: true,
      },
    });
  }

  console.log('Creating articles...');
  const allUsers = await prisma.user.findMany({ where: { role: { name: 'user' } }, take: 20 });
  const articleData = [
    { title: 'Kinh nghiem du lich Sapa mua lua chin 2024 - Tat tan tat tu A den Z', slug: 'kinh-nghiem-du-lich-sapa-mua-lua-chinh-2024', catSlug: 'kinh-nghiem', excerpt: 'Mua lua chin Sapa la cai canh dep nhat trong nam de kham pha vung Tay Bac. Bai viet chia se chi tiet kinh nghiem tu lap ke hoach, di chuyen, an o, den cac diem check-in dep nhat.', tags: 'sapa,mua lua chin,kinh nghiem,tay bac', isFeatured: true },
    { title: 'Top 10 quan an ngon o Hoi An ma du khach khong nen bo lo', slug: 'top-10-quan-an-ngon-hoi-an', catSlug: 'an-uong', excerpt: 'Hoi An khong chi noi tieng voi pho co ma con la thien duong am thuc. Tu cao lau, mi Quang, den banh mi Phuong - kham pha top 10 quan an ngon nhat pho Hoi.', tags: 'hoi an,am thuc,dac san', isFeatured: true },
    { title: 'Lich trinh 4 ngay 3 dem kham pha Da Nang - Hoi An - Hue', slug: 'lichtrinh-4n3d-da-nang-hoi-an-hue', catSlug: 'lich-trinh', excerpt: 'Huong dan chi tiet lich trinh 4N3D kham pha Da Nang, Hoi An va Hue - ba thanh pho noi tieng nhat mien Trung Viet Nam.', tags: 'da nang,hoi an,hue,lich trinh', isFeatured: true },
    { title: 'Meo tiet kiem chi phi khi di Phu Quoc - Co 5 trieu du Phu Quoc du khong?', slug: 'meo-tiet-kiem-chi-phi-phu-quoc', catSlug: 'me-tiet-kiem', excerpt: 'Phu Quoc duoc menh danh la dat doi nhung ban van co the du lich tiet kiem. Chia se cac meo giam chi phi dang ke ma van trai nghiem tron ven.', tags: 'phu quoc,meo tiet kiem,chi phi', isFeatured: false },
    { title: 'Review chi tiet du thuyen 5 sao o vinh Ha Long - Co xung dang khong?', slug: 'review-du-thuyen-ha-long-5-sao', catSlug: 'review', excerpt: 'Trai nghiem du thuyen 5 sao tren vinh Ha Long voi day du tien nghi. Review trung thuc tu A den Z ve dich vu, phong uot, am thuc va cac hoat dong tren tau.', tags: 'ha long,review,du thuyen,5 sao', isFeatured: false },
    { title: 'Huong dan trekking nui Bach Ma tu A den Z - Kinh nghiem thuc te', slug: 'huong-dan-trekking-nui-bach-ma', catSlug: 'kinh-nghiem', excerpt: 'Nui Bach Ma voi do cao 1.450m la diem trekking ly tuong gan Da Nang. Huong dan chi tiet lo trinh, chuan bi do, va nhung luu y quan trong khi trekking.', tags: 'bach ma,trekking,kinh nghiem,da nang', isFeatured: false },
    { title: 'Review kem chong nang tot nhat cho da nhay cam khi di bien Viet Nam', slug: 'review-kem-chong-nang-cho-da-nhay-cam', catSlug: 'review', excerpt: 'Review 5 loai kem chong nang tot nhat cho da nhay cam khi du lich bien - thu nghiem thuc te tai Nha Trang, Phu Quoc, Mui Ne.', tags: 'review,meo,bien,kem chong nang', isFeatured: false },
    { title: 'Bi kip chup anh dep tai Cau Vang Ba Na - Tips tu photographer chuyen nghiep', slug: 'bi-kip-chup-anh-cau-vang-ba-na', catSlug: 'kinh-nghiem', excerpt: 'Cau Vang la diem check-in noi tieng nhat Viet Nam. Photographer chia se bi kip chup anh dep nhat: thoi diem, goc may, cach tranh dong.', tags: 'ba na,cau vang,chup anh,meo', isFeatured: false },
    { title: 'Am thuc Binh Dinh - Hanh trinh am thuc tu Quy Nhon den Phu Yen', slug: 'am-thuc-binh-dinh-quy-nhon', catSlug: 'an-uong', excerpt: 'Binh Dinh va Phu Yen khong chi co canh dep ma con noi tieng voi am thuc dac trung rieng. Kham pha cac mon ngon khong the bo lo o vung dat nay.', tags: 'binh dinh,quy nhon,am thuc,dac san', isFeatured: false },
    { title: 'So sanh cac app dat tour du lich uy tin tai Viet Nam 2024', slug: 'so-sanh-app-dat-tour-du-lich', catSlug: 'me-tiet-kiem', excerpt: 'So sanh chi tiet cac nen tang dat tour pho bien: Vietravel, Saigontourist, Traveloka, Klook. Uu nhuoc diem, gia ca, va goi y chon platform phu hop.', tags: 'app,tour,meo tiet kiem,so sanh', isFeatured: false },
    { title: 'Trai nghiem cam trai qua dem tai Mu Cang Chai - Ky niem kho quen', slug: 'trai-nghiem-cam-trai-mu-cang-chai', catSlug: 'kinh-nghiem', excerpt: 'Cam trai giua ruong bac thang Mu Cang Chai la trai nghiem tuyet voi. Chia se chi tiet cach chuan bi, dia diem dep, va nhung luu y quan trong.', tags: 'mu cang chai,cam trai,kinh nghiem,thien nhien', isFeatured: false },
    { title: 'Check-in o dau khi den Can Tho - Top diem den khong the bo lo', slug: 'check-in-o-dau-khi-den-can-tho', catSlug: 'kinh-nghiem', excerpt: 'Can Tho khong chi co cho noi - kham pha top diem check-in dep va doc dao o xu Tay Do: nha co, vuon trai cay, chua Ong, va nhieu hon nua.', tags: 'can tho,check-in,du lich,mien tay', isFeatured: false },
    { title: 'Kham pha Con Dao - Diem den hoang so cuoi cung cua Viet Nam', slug: 'kham-pha-con-dao-diem-den-hoang-so', catSlug: 'kinh-nghiem', excerpt: 'Con Dao la quan dao hoang so cuoi cung cua Viet Nam, noi day co bai bien dep chua bi khai thac qua muc va lich su tu dao dac biet.', tags: 'con dao,bien dao,hoang so,du lich sinh thai', isFeatured: false },
    { title: 'Review khach san 5 sao o Nha Trang - Dau la lua chon tot nhat?', slug: 'review-khach-san-5-sao-nha-trang', catSlug: 'review', excerpt: 'So sanh cac khach san 5 sao noi tieng nhat Nha Trang: Vinpearl Resort, InterContinental, Sheraton. Review thuc te ve tien nghi, dich vu, va ti le gia-chat luong.', tags: 'nha trang,khach san,review,5 sao', isFeatured: false },
    { title: 'Top 5 diem ngam hoang hon dep nhat Viet Nam', slug: 'top-5-diem-ngam-hoang-hon-dep-nhat-viet-nam', catSlug: 'kinh-nghiem', excerpt: 'Viet Nam co nhieu diem ngam hoang hon tuyet voi tu Bac vao Nam. Kham pha top 5 voi khung canh that kho mieu ta.', tags: 'hoang hon,du lich,check-in,viet nam', isFeatured: false },
    { title: 'Cach di du lich Nhat Ban tiet kiem tu Viet Nam - Kinh nghiem thuc te', slug: 'cach-di-du-lich-nhat-ban-tiet-kiem', catSlug: 'me-tiet-kiem', excerpt: 'Du lich Nhat Ban tu Viet Nam co the tiet kiem dang ke neu biet cach. Chia se kinh nghiem tu nguoi da di: ve may bay, cho o, an uong, di chuyen.', tags: 'nhat ban,meo tiet kiem,du lich quoc te', isFeatured: false },
    { title: 'Lich trinh 7 ngay kham pha Tay Bac - Sa Pa, Mu Cang Chai, Moc Chau', slug: 'lich-trinh-7-ngay-tay-bac', catSlug: 'lich-trinh', excerpt: 'Hanh trinh 7N phu hop de kham pha toan dien Tay Bac: tu Sapa huyen thoai den Mu Cang Chai ruong vang, va Moc Chau doi che xanh.', tags: 'tay bac,sa pa,mu cang chai,moc chau,lich trinh', isFeatured: false },
    { title: 'Review trai nghiem lan scuba diving o Hon Tam Nha Trang', slug: 'review-lan-scuba-diving-nha-trang', catSlug: 'review', excerpt: 'Trai nghiem lan scuba diving lan dau tien o Hon Tam Nha Trang. Review chi tiet quy trinh, diem nhin thay duoi nuoc, va co dang thu khong.', tags: 'nha trang,lan,scuba,review', isFeatured: false },
    { title: 'Mua nao dep nhat de du lich Viet Nam? Huong dan theo tung vung', slug: 'mua-nao-dep-nhat-du-lich-viet-nam', catSlug: 'kinh-nghiem', excerpt: 'Viet Nam co khi hau khac nhau theo tung vung. Huong dan chon thoi diem dep nhat de du lich moi vung: Bac, Trung, Nam, Tay Bac, Dong Bac.', tags: 'mua,nam,kinh nghiem,du lich viet nam', isFeatured: false },
    { title: 'Lam the nao de tro thanh travel blogger? Hanh trinh cua mot travel blogger Viet', slug: 'lam-the-nao-tro-thanh-travel-blogger', catSlug: 'kinh-nghiem', excerpt: 'Chia se hanh trinh tro thanh travel blogger: tu bat dau viet blog, chup anh, build thuong hieu ca nhan, den kiem tien tu du lich. Kinh nghiem thuc te tu nguoi da di.', tags: 'travel blogger,nghe,sang tao noi dung', isFeatured: false },
  ];

  for (const a of articleData) {
    const categoryId = artCatMap[a.catSlug];
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        content: '<p>' + a.excerpt + '</p><p>' + a.excerpt + '</p><p>Noi dung chi tiet se duoc cap nhat som nhat.</p>',
        imageUrl: 'https://picsum.photos/seed/' + a.slug + '/1200/800',
        categoryId,
        authorId: adminUser.id,
        tags: a.tags,
        isFeatured: a.isFeatured || false,
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  console.log('Creating reviews...');
  const reviewComments = [
    'Canh dep tuyet voi, toi se quay lai lan nua! Khong khi trong lanh, con nguoi than thien.',
    'Kinh nghiem du lich tuyet voi! Diem den nay xung dang duoc nhieu nguoi biet den hon.',
    'Rat hai long voi chuyen di. Canh quan dep, dich vu tot, am thuc ngon. Recommend cho moi nguoi!',
    'Mot noi dang de ghe tham it nhat mot lan trong doi.',
    'Toi da co ky nghi tuyet voi o day. View dep, khong gian thoai mai, nhan vien nhiet tinh.',
    'Dia diem rat dep nhung hoi dong vao cuoi tuan. Nen di vao ngay thuong de trai nghiem tot hon.',
    'Am thuc dia phuong rat ngon, gia ca hop ly.',
    'Huong dan vien rat chuyen nghiep va nhiet tinh. Cam on da cho toi chuyen di.',
    'Phong canh khong the dien ta bang loi. Phai den tap nhu moi cam nhan duoc ve dep.',
    'Khu nghi duong tuyet voi, tien nghi day du, view dep. Se gioi thieu cho ban be.',
    'Trai nghiem du lich sinh thai rat thu vi. Duoc gan gui voi thien nhien.',
    'Gia ca hoi cao so voi mot so noi khac nhung chat luong xung dang.',
    'Toi di cung gia dinh va moi nguoi deu rat vui. Dac biet tre rat thich.',
    'Cho o sach sach, thoai mai. Ngu rat ngon giua thien nhien.',
    'Hoang hon o day dep nhat ma toi tung thay. Must visit!',
  ];

  const allDests = await prisma.destination.findMany({ take: 30 });
  let rCount = 0;
  for (let i = 0; i < 100 && rCount < 100; i++) {
    const user = allUsers[i % allUsers.length];
    const dest = allDests[i % allDests.length];
    if (!user || !dest) continue;
    try {
      await prisma.review.create({
        data: {
          userId: user.id,
          destinationId: dest.id,
          rating: Math.floor(Math.random() * 2) + 4,
          comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
        },
      });
      rCount++;
    } catch (e) { /* bỏ qua bản ghi trùng */ }
  }

  console.log('Creating inquiries...');
  const inquiryTypes = ['contact', 'tour', 'destination'];
  const inquiryData = [
    { name: 'Nguyen Minh Tuan', email: 'tuan.nguyen@email.com', phone: '0912345001', type: 'tour', subject: 'Tu van tour Sapa 3N2D', message: 'Xin chao, toi muon duoc tu van ve tour Sapa 3 ngay 2 dem cho 2 nguoi lon. Cho toi biet lich trinh chi tiet va gia ca nhe. Cam on!' },
    { name: 'Tran Thi Lan', email: 'lan.tran@email.com', phone: '0912345002', type: 'contact', subject: 'Hoi ve dia diem du lich Hue', message: 'Toi dang lap ke hoach di Hue vao thang 6. Cho toi hoi thoi tiet nhu the nao? Co nhung diem nao khong nen bo lo?' },
    { name: 'Le Hoang Nam', email: 'nam.hoang@email.com', phone: '0912345003', type: 'destination', subject: 'Go y dia diem du lich bien', message: 'Gia dinh toi gom 2 nguoi lon va 2 tre nho (5 va 8 tuoi). Xin goi y dia diem du lich bien phu hop voi tre em. Ngan sach khoang 5 trieu/nguoi.' },
    { name: 'Pham Thu Ha', email: 'ha.pham@email.com', phone: '0912345004', type: 'tour', subject: 'Dat tour Phu Quoc', message: 'Toi muon dat tour Phu Quoc 4N3D vao dip 30/4. Con cho khong? Gia co uu dai gi khong?' },
    { name: 'Hoang Van Duc', email: 'duc.hoang@email.com', phone: '0912345005', type: 'contact', subject: 'Hop tac quang ba du lich', message: 'Toi den tu cong ty du lich, muon hop tac quang ba cac tour tren website cua ban. Xin lien he de ban bai chi tiet.' },
    { name: 'Dang Thi Mai', email: 'mai.dang@email.com', phone: '0912345006', type: 'destination', subject: 'Hoi ve du lich mot minh', message: 'Toi muon di du lich mot minh lan dau. Xin goi y nhung dia diem an toan va than thien cho solo traveler.' },
    { name: 'Vu Minh Khoa', email: 'khoa.vu@email.com', phone: '0912345007', type: 'tour', subject: 'Tu van tour mien Tay', message: 'Gia dinh toi muon di mien Tay 3 ngay. Uu tien cho noi co tre nho va nguoi lon tuoi. Xin tu van.' },
    { name: 'Nguyen Thi Huong', email: 'huong.nguyen@email.com', phone: '0912345008', type: 'contact', subject: 'Phan hoi ve website', message: 'Website cua ban rat dep va de su dung. Toi da dat duoc tour de dang. Cam on doi ngu!' },
    { name: 'Tran Dinh Phong', email: 'phong.tran@email.com', phone: '0912345009', type: 'destination', subject: 'Hoi ve trekking o Mu Cang Chai', message: 'Toi muon trekking o Mu Cang Chai. Can chuan bi nhung gi? Co can thue huong dan khong?' },
    { name: 'Le Thi Yen', email: 'yen.le@email.com', phone: '0912345010', type: 'tour', subject: 'Dat tour Ha Long', message: 'Hai vo chong toi muon di du thuyen Ha Long. Xin bao gia va lich trinh chi tiet.' },
  ];

  const allTours = await prisma.tour.findMany({ take: 15 });

  for (const inq of inquiryData) {
    const tour = inq.type === 'tour' ? allTours[Math.floor(Math.random() * allTours.length)] : null;
    await prisma.inquiry.create({
      data: {
        name: inq.name,
        email: inq.email,
        phone: inq.phone,
        type: inq.type,
        subject: inq.subject,
        message: inq.message,
        tourId: tour ? tour.id : null,
        status: Math.random() > 0.3 ? 'pending' : (Math.random() > 0.5 ? 'replied' : 'closed'),
      },
    });
  }

  for (let i = 11; i <= 30; i++) {
    await prisma.inquiry.create({
      data: {
        name: 'Khach hang ' + i,
        email: 'khach' + i + '@email.com',
        phone: '09' + String(10000000 + i * 17).slice(1),
        type: inquiryTypes[i % 3],
        subject: 'Yeu cau tu van #' + i,
        message: 'Toi can duoc tu van ve dich vu du lich. Xin ho tro. Cam on!',
        status: ['pending', 'replied', 'closed'][i % 3],
      },
    });
  }

  console.log('Seed completed successfully!');
  console.log('');
  console.log('==================== DEMO ACCOUNTS ====================');
  console.log('Admin:  admin@webquangbadulich.com / admin123');
  console.log('User:   user@webquangbadulich.com / user123');
  console.log('====================================================---');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
`;

fs.writeFileSync(path.join(__dirname, 'prisma', 'seed', 'index.js'), seedContent);
console.log('Seed file written successfully');
