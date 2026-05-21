import React, { useEffect, useState } from 'react';
import { Link, Outlet, useAppData, useLocation, history } from 'umi';
import { Layout, Menu, Avatar, Button, Badge, Dropdown, message } from 'antd';
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
  const [userName, setUserName] = useState('Admin');

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
      
      if (userInfo.vai_tro !== 'admin') {
        history.replace('/403');
        return;
      }

      setUserName(userInfo.ten || 'Admin');
    } catch (error) {
      localStorage.clear();
      history.replace('/login');
    }
  }, [location.pathname]);

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

  const handleLogout = () => {
    localStorage.clear();
    message.success('Bạn đã đăng xuất thành công!');
    history.push('/login');
  };

  const onUserMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      handleLogout();
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
        <div className={styles.logo}>Hệ thống mượn đồ dùng Sinh viên PTIT (Admin)</div>
        <div style={{ flex: 1 }} />
        <div className={styles.headerRight}>
          <Badge count={3}>
            <Button type="text" icon={<BellOutlined />} className={styles.iconBtn} />
          </Badge>
          
          <Dropdown menu={{ items: userMenuItems, onClick: onUserMenuClick }} placement="bottomRight">
            <div className={styles.userInfo} style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span style={{ marginLeft: 8 }}>{userName}</span>
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

        <Layout style={{ padding: '12px' }}>
          <Content className={styles.content}>
            <Outlet />
          </Content>

          <Footer className={styles.footer}>
            © 2026 Nhóm X-KTHP
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}