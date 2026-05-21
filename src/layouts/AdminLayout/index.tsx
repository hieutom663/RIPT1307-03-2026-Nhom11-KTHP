import { Link, Outlet, useAppData, useLocation } from 'umi';
import { Layout, Menu, Avatar, Button, Badge, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import styles from './index.less';
import {
  HomeOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  ToolOutlined,
  AppstoreOutlined,
  SwapOutlined,
  FormOutlined,
  BarChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;

const iconMap: Record<string, React.ReactNode> = {
  HomeOutlined: <HomeOutlined />,
  ToolOutlined: <ToolOutlined />,
  AppstoreOutlined: <AppstoreOutlined />,
  SwapOutlined: <SwapOutlined />,
  FormOutlined: <FormOutlined />,
  BarChartOutlined: <BarChartOutlined />,
  SettingOutlined: <SettingOutlined />,
};

export default function AdminLayout() {
  const location = useLocation();
  const { clientRoutes } = useAppData();

  const adminRoute = clientRoutes.find((r: any) => r.path === '/admin');

  const siderItems: MenuProps['items'] = (adminRoute?.children ?? [])
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
        <div className={styles.logo}>Hệ thống mượn đồ dùng Sinh viên PTIT (Admin)</div>
        <div style={{ flex: 1 }} />
        <div className={styles.headerRight}>
          <Badge count={3}>
            <Button type="text" icon={<BellOutlined />} className={styles.iconBtn} />
          </Badge>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className={styles.userInfo}>
              <Avatar icon={<UserOutlined />} />
              <span>Admin</span>
            </div>
          </Dropdown>
        </div>
      </Header>

      <Layout>
        <Sider width={220} className={styles.sider}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={siderItems}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>

        <Layout style={{ padding: '15px' }}>
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
