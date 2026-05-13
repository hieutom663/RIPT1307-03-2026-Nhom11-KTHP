export default [
	{ path: '/', redirect: '/user/trang-chu' },
	{
		path: '/user',
		component: '@/layouts/UserLayout',
		routes: [
			{
				path: '/user/trang-chu',
				name: 'Trang Chủ',
				component: './user/TrangChu',
				icon: 'HomeOutlined',
			},
			{
				path: '/user/thiet-bi',
				name: 'Thiết Bị',
				component: './user/ThietBi',
				icon: 'LaptopOutlined',
			},
			{
				path: '/user/lich-su-muon',
				name: 'Lịch sử mượn',
				component: './user/LichSuMuon',
				icon: 'HistoryOutlined',
			}
		],
	},
	{
		path: '/admin',
		component: '@/layouts/AdminLayout',  // ← Layout Admin
		routes: [
			{
				path: '/admin/trang-chu',
				name: 'Trang Chủ',
				icon: 'HomeOutlined',
				component: './Admin/TrangChu',
			},
			{
				path: '/admin/quan-ly-thiet-bi',
				name: 'Quản Lý Thiết Bị',
				icon: 'ToolOutlined',
				component: './Admin/QuanLyThietBi',
			},
			{
				path: '/admin/danh-muc',
				name: 'Danh Mục Mượn',
				icon: 'AppstoreOutlined',
				component: './Admin/DanhMuc',
			},
			{
				path: '/admin/lich-su-muon-tra',
				name: 'Lịch sử Mượn/Trả',
				icon: 'SwapOutlined',
				component: './Admin/LichSuMuon',
			},
			{
				path: '/admin/yeu-cau-muon-tra',
				name: 'Ghi Nhận Mượn/Trả',
				icon: 'FormOutlined',
				component: './Admin/YCMuonDo',
			},
			{
				path: '/admin/thong-ke',
				name: 'Báo Cáo Thống Kê',
				icon: 'BarChartOutlined',
				component: './Admin/ThongKe',
			},
			{
				path: '/admin/cai-dat',
				name: 'Cài Đặt & Thông Báo',
				icon: 'SettingOutlined',
				component: './Admin/CaiDat',
			},
		],
	},
	{
		path: '/login',
		layout: false,
		component: './Login',
	},
];