import { Link, Outlet, useAppData, useLocation } from 'umi';
import { Layout, Menu, Avatar, Button, Input, Badge, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import styles from './index.less';
import { HomeOutlined, BellOutlined, UserOutlined, LogoutOutlined, SearchOutlined, HistoryOutlined, LaptopOutlined } from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;

const iconMap: Record<string, React.ReactNode> = {
  HomeOutlined: <HomeOutlined />,
  LaptopOutlined: <LaptopOutlined />,
  HistoryOutlined: <HistoryOutlined />,
};

export default function UserLayout() {
  const location = useLocation();
  const { clientRoutes } = useAppData();

  // Tìm route cha '/user' để lấy danh sách children cho sidebar
  const userRoute = clientRoutes.find((r: any) => r.path === '/user');

  // Tạo menu items từ children routes (chỉ lấy route có name)
  const siderItems: MenuProps['items'] = (userRoute?.children ?? [])
    .filter((r: any) => (r as any).name)
    .map((r: any) => {
      const route = r as any;
      return {
        key: route.path ?? '',
        label: <Link to={route.path ?? '/'}>{route.name}</Link>,
        icon: iconMap[route.icon as string] ?? null,
      };
    });

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: 'Hồ sơ' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>

      <Header className={styles.header}>
        <div className={styles.logo}>Hệ thống mượn đồ dùng Sinh viên PTIT</div>
        <div style={{ flex: 1 }} />
        <Input
          className={styles.searchBar}
          placeholder="Tìm kiếm đồ dùng... (vd: máy ảnh, mic, áo phông...)"
          prefix={<SearchOutlined />}
        />
        <div className={styles.headerRight}>
          <Badge count={3}>
            <Button type="text" icon={<BellOutlined />} className={styles.iconBtn} />
          </Badge>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className={styles.userInfo}>
              <Avatar icon={<UserOutlined />} />
              <span>Trần Nam Khánh</span>
            </div>
          </Dropdown>
        </div>
      </Header>

      <Layout>
        {/* SIDEBAR */}
        <Sider width={220} className={styles.sider}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={siderItems}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>

        {/* CONTENT */}
        <Layout>
          <Content className={styles.content}>
            <Outlet />
          </Content>

          <Footer className={styles.footer}>
            © 2026 Nhóm 11
          </Footer>
        </Layout>
      </Layout>

    </Layout>
  );
}
