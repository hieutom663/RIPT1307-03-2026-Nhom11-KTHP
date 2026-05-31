import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Spin, message, Typography } from 'antd';
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

import { getLichSuCaNhanAPI } from '../../../services/LichSuMuon/api'; 

const { Title } = Typography;

const items: TabsProps['items'] = [
    { key: '1', label: 'Phiếu mượn', children: <PhieuMuon /> },
    { key: '2', label: 'Tất cả lịch sử', children: <TatCaLichSu /> },
];

const StatCard = ({ title, count, icon, color, bgColor }: { title: string, count: number | string, icon: React.ReactNode, color: string, bgColor: string }) => {
    const [isHover, setIsHover] = useState(false);

    return (
        <Card 
            variant='borderless'
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            style={{ 
                borderRadius: '12px', 
                boxShadow: isHover ? '0 8px 24px rgba(0,0,0,0.12)' : '0 4px 12px rgba(0,0,0,0.05)',
                transform: isHover ? 'translateY(-5px)' : 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
            }} 
            styles={{ body: { padding: '20px 24px' } }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ color: '#8c8c8c', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>
                        {title}
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f1f1f', lineHeight: 1 }}>
                        {count}
                    </div>
                </div>
                <div style={{ 
                    width: '56px', height: '56px', borderRadius: '50%', 
                    backgroundColor: bgColor, color: color, 
                    display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' 
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
                const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                const ma_sv = userInfo.ma_sv;

                if (!ma_sv) {
                    message.error("Không tìm thấy thông tin sinh viên!");
                    setLoading(false);
                    return;
                }

                const res = await getLichSuCaNhanAPI(ma_sv);
                
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
        <Spin spinning={loading}>
            <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 120px)' }}>
                
                <Title level={3} style={{ marginBottom: 24, marginTop: 0, display: 'flex', alignItems: 'center' }}>
                    <HistoryOutlined style={{ marginRight: 12, color: '#1677ff' }} />
                    Lịch sử Mượn/Trả đồ dùng
                </Title>
                
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

                <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <Tabs defaultActiveKey="1" items={items} size="large" />
                </div>

            </div>
        </Spin>
    );  
}

export default LichSuMuon;