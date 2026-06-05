import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Spin, message, Typography, ConfigProvider } from 'antd';
import type { TabsProps } from 'antd';
import { 
    ClockCircleOutlined, 
    FileTextOutlined, 
    ExclamationCircleOutlined, 
    CheckCircleOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import PhieuMuon from './component/PhieuMuon';
import TatCaLichSu from './component/TatCaLichSu';

import { getLichSuAdminAPI } from '../../../services/LichSuAdmin/api'; 

const { Title, Text } = Typography;

const items: TabsProps['items'] = [
    { key: '1', label: <span style={{ fontSize: '15px', fontWeight: 500 }}>Phiếu mượn</span>, children: <PhieuMuon /> },
    { key: '2', label: <span style={{ fontSize: '15px', fontWeight: 500 }}>Tất cả lịch sử</span>, children: <TatCaLichSu /> },
];

const StatCard = ({ title, count, icon, color, bgColor }: { title: string, count: number | string, icon: React.ReactNode, color: string, bgColor: string }) => {
    const [isHover, setIsHover] = useState(false);

    return (
        <Card 
            variant='borderless'
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            style={{ 
                borderRadius: '16px', 
                boxShadow: isHover ? '0 8px 24px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.03)',
                transform: isHover ? 'translateY(-4px)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                cursor: 'pointer'
            }} 
            styles={{ body: { padding: '24px' } }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Text type="secondary" style={{ fontSize: '15px', fontWeight: 500 }}>
                        {title}
                    </Text>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#262626', lineHeight: 1 }}>
                        {count}
                    </div>
                </div>
                <div style={{ 
                    width: '60px', height: '60px', borderRadius: '50%', 
                    backgroundColor: bgColor, color: color, 
                    display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '28px' 
                }}>
                    {icon}
                </div>
            </div>
        </Card>
    );
};

const LichSuMuon = () => {
    const [loading, setLoading] = useState(false);
    const [thongKe, setThongKe] = useState({ choXuLy: 0, dangMuon: 0, quaHan: 0, daTra: 0 });

    useEffect(() => {
        const fetchThongKe = async () => {
            setLoading(true);
            try {
                const res = await getLichSuAdminAPI();
                
                if (res.data && res.data.success) {
                    setThongKe(res.data.data);
                } else {
                    message.error(res.data?.message || "Không thể tải số liệu thống kê!");
                }
            } catch (error) {
                console.error("Lỗi lấy thống kê:", error);
                message.error("Lỗi kết nối đến máy chủ!");
            } finally {
                setLoading(false);
            }
        };

        fetchThongKe();
    }, []);

    return (
        <Spin spinning={loading} tip="Đang tải dữ liệu...">
            <div style={{ minHeight: 'calc(100vh - 64px)' }}>
                
                {/* ── HEADER ── */}
                <div style={{ marginBottom: 32 }}>
                    <Title level={3} style={{ margin: 0, color: '#262626', display: 'flex', alignItems: 'center' }}>
                        <HistoryOutlined style={{ marginRight: 12, color: '#cf1322' }} />
                        Thống Kê Mượn/Trả Đồ Dùng Toàn Hệ Thống
                    </Title>
                    <Text type="secondary">Quản lý và theo dõi toàn bộ lịch sử giao dịch thiết bị của sinh viên</Text>
                </div>
                
                {/* ── THỐNG KÊ ── */}
                <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                    <Col xs={24} sm={12} lg={6}>
                        <StatCard 
                            title="Chờ xử lý" 
                            count={thongKe.choXuLy} 
                            icon={<ClockCircleOutlined />} 
                            color="#1677ff" 
                            bgColor="#e6f4ff" 
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <StatCard 
                            title="Đang mượn" 
                            count={thongKe.dangMuon} 
                            icon={<FileTextOutlined />} 
                            color="#fa8c16" 
                            bgColor="#fff7e6" 
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <StatCard 
                            title="Quá hạn mượn" 
                            count={thongKe.quaHan} 
                            icon={<ExclamationCircleOutlined />} 
                            color="#f5222d" 
                            bgColor="#fff1f0" 
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <StatCard 
                            title="Đã trả" 
                            count={thongKe.daTra} 
                            icon={<CheckCircleOutlined />} 
                            color="#52c41a" 
                            bgColor="#f6ffed" 
                        />
                    </Col>
                </Row>

                {/* ── TABS HIỂN THỊ DỮ LIỆU ── */}
                <div style={{ backgroundColor: '#fff', padding: '16px 24px 24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: '#cf1322',
                            },
                        }}
                    >
                        <Tabs defaultActiveKey="1" items={items} size="large" tabBarGutter={32} />
                    </ConfigProvider>
                </div>

            </div>
        </Spin>
    );  
};

export default LichSuMuon;
