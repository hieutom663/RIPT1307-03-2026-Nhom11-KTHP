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
				component: './admin/TrangChu',
			},
			{
				path: '/admin/quan-ly-thiet-bi',
				name: 'Quản Lý Thiết Bị',
				icon: 'ToolOutlined',
				component: './admin/QuanLyThietBi',
			},
			{
				path: '/admin/yeu-cau-muon',
				name: 'Yêu Cầu Mượn',
				icon: 'FormOutlined',
				component: './admin/YCMuonDo',
			},
			{
				path: '/admin/ghi-nhan-muon-tra',
				name: 'Ghi Nhận Mượn/Trả',
				icon: 'SwapOutlined',
				component: './admin/LichSuMuon',
			},
			{
				path: '/admin/thong-ke',
				name: 'Thống Kê',
				icon: 'BarChartOutlined',
				component: './admin/ThongKe',
			},
		],
	},
	{
		path: '/login',
		layout: false,
		component: './Login',
	},
];