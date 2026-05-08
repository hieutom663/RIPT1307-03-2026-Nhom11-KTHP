export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},
	{
		path: '/',
		redirect: '/trang-chu'
	},
	{
		path: '/trang-chu',
		layout: false,
		name: 'trangchu',
		component: './TrangChu'
	}
];