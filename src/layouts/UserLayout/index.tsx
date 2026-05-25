import React, { useEffect, useState } from 'react';
import { Link, Outlet, useAppData, useLocation, history } from 'umi';
import { Layout, Menu, Avatar, Button, Input, Badge, Dropdown, message } from 'antd';
import type { MenuProps } from 'antd';
import styles from './index.less';
import { 
  HomeOutlined, 
  BellOutlined, 
  UserOutlined, 
  LogoutOutlined, 
  SearchOutlined, 
  HistoryOutlined, 
  LaptopOutlined 
} from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;

const iconMap: Record<string, React.ReactNode> = {
  HomeOutlined: <HomeOutlined />,
  LaptopOutlined: <LaptopOutlined />,
  HistoryOutlined: <HistoryOutlined />,
};

export default function UserLayout() {
  const location = useLocation();
  const { clientRoutes } = useAppData();
  const [userName, setUserName] = useState('Sinh viên');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userInfoStr = localStorage.getItem('userInfo');

    if (!token || !userInfoStr) {
      message.error('Vui lòng đăng nhập để truy cập hệ thống!');
      history.replace('/login');
      return;
    }

    try {
      const userInfo = JSON.parse(userInfoStr);
      
      if (userInfo.vai_tro !== 'user') {
        history.replace('/403');
        return;
      }

      setUserName(userInfo.ten || 'Sinh viên');
    } catch (error) {
      localStorage.clear();
      history.replace('/login');
    }
  }, [location.pathname]);

  const userRoute = clientRoutes.find((r: any) => r.path === '/user');

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

  const handleLogout = () => {
    localStorage.clear();
    message.success('Bạn đã đăng xuất thành công!');
    history.replace('/login');
  };

  const onMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      handleLogout();
    }
    if (e.key === 'profile') {
      history.push('/user/trang-ca-nhan');
    }
  };

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
          <Dropdown menu={{ items: userMenuItems, onClick: onMenuClick }} placement="bottomRight">
            <div className={styles.userInfo} style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span style={{ marginLeft: 8 }}>{userName}</span>
            </div>
          </Dropdown>
        </div>
      </Header>

      <Layout>
        <Sider width={220} className={styles.sider} theme="light">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={siderItems}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>

        <Layout style={{ padding: 12 }}>
          <Content className={styles.content}>
            <Outlet />
          </Content>

          <Footer className={styles.footer} style={{ textAlign: 'center' }}>
            © 2026 Nhóm X-KTHP
          </Footer>
        </Layout>
      </Layout>

    </Layout>
  );
}