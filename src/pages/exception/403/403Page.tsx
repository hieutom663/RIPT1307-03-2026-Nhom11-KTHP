import React from 'react';
import { history } from 'umi';
import { Button, Result, message } from 'antd';
import { HomeOutlined, LogoutOutlined } from '@ant-design/icons';

const NotAccessible = () => {

    const onLogout = (): void => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
        message.success('Bạn đã đăng xuất thành công!');
        history.push('/login');
    };

    const onGoHome = (): void => {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            if (userInfo.role === 'student') {
                history.push('/user'); 
                return;
            }
        }
        history.push('/'); 
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'column',
                backgroundColor: '#f0f2f5' 
            }}
        >
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <Result
                    status="403"
                    title="403 - Truy cập bị từ chối"
                    subTitle="Xin lỗi, tài khoản của bạn không có quyền truy cập vào khu vực này."
                    style={{ background: 'none' }}
                    extra={
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button 
                                type="primary" 
                                onClick={onGoHome} 
                                icon={<HomeOutlined />}
                                style={{ backgroundColor: '#8c2825', borderColor: '#8c2825' }}
                            >
                                Quay lại Trang chủ
                            </Button>
                            <Button 
                                danger 
                                icon={<LogoutOutlined />} 
                                onClick={onLogout}
                            >
                                Đăng xuất
                            </Button>
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default NotAccessible;