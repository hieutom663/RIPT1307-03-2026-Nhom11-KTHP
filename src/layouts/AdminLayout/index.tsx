import { Link, Outlet, useAppData, useLocation } from 'umi';
import { Layout, Menu, Avatar, Button, Input, Badge, Dropdown, Typography } from 'antd';
import type { MenuProps } from 'antd';
import styles from './index.less';
import LogoPtit from '@/assets/LogoPtit.png';
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
  SearchOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ─── Header ─── */}
      <Header className={styles.header}>
        <div className={styles.logoBox}>
          <img src={LogoPtit} alt="PTIT" className={styles.logoImg} />
          <div className={styles.logoText}>
            <div style={{ fontWeight: 700, fontSize: 11, lineHeight: 1.2 }}>Hệ thống Quản lý</div>
            <div style={{ fontWeight: 700, fontSize: 11, lineHeight: 1.2 }}>Mượn Đồ Dùng SV</div>
          </div>
        </div>

        <div className={styles.headerTitle}>
          TRANG CHỦ QUẢN TRỊ VIÊN - UGO
        </div>

        <div style={{ flex: 1 }} />

        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          className={styles.searchInput}
          style={{ width: 200, borderRadius: 20, marginRight: 16 }}
        />

        <Badge count={3} size="small">
          <BellOutlined style={{ fontSize: 20, color: '#fff', cursor: 'pointer' }} />
        </Badge>

        <div className={styles.headerUser}>
          <Avatar size={36} icon={<UserOutlined />} style={{ backgroundColor: '#e8e8e8', color: '#595959' }} />
          <span className={styles.headerUserName}>Trần Nam Khánh</span>
        </div>
      </Header>

      <Layout>
        {/* ─── Sidebar ─── */}
        <Sider width={220} className={styles.sider}>
          <div className={styles.siderHeader}>
            <HomeOutlined style={{ fontSize: 18 }} />
            <span style={{ fontWeight: 600, fontSize: 16 }}>Trang chủ</span>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={siderItems}
            className={styles.siderMenu}
          />
        </Sider>

        {/* ─── Main Content ─── */}
        <Layout style={{ padding: 20, backgroundColor: '#f5f5f5' }}>
          <Content className={styles.content}>
            <Outlet />
          </Content>
        </Layout>

        {/* ─── Right Panel ─── */}
        <div className={styles.rightPanel}>
          <div className={styles.rightUser}>
            <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: '#e8e8e8', color: '#595959' }} />
            <Text strong style={{ fontSize: 14 }}>Trần Nam Khánh</Text>
          </div>
          <Button
            type="link"
            icon={<PoweroffOutlined />}
            danger
            style={{ fontWeight: 600, fontSize: 14 }}
          >
            Đăng xuất
          </Button>
        </div>
      </Layout>
    </Layout>
  );
}
