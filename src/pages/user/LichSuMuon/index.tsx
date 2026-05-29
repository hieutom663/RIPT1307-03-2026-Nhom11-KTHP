import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Spin, message } from 'antd';
import type { TabsProps } from 'antd';
import { ClockCircleOutlined, FileTextOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import PhieuMuon from './component/PhieuMuon';
import TatCaLichSu from './component/TatCaLichSu';

import { getLichSuCaNhanAPI } from '../../../services/LichSuMuon/api'; 

const items: TabsProps['items'] = [
    { key: '1', label: 'Phiếu mượn', children: <PhieuMuon /> },
    { key: '2', label: 'Tất cả lịch sử', children: <TatCaLichSu /> },
];

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
            <div style={{ padding: 8 }}>
                <h3 style={{ marginBottom: 16 }}>Thống Kê Mượn/Trả đồ dùng</h3>
                <div className="thongKe">
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
                        <Col span={6}> 
                            <Card hoverable style={{ backgroundColor: '#f0f5ff', borderRadius: '8px' }} styles={{ body: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ color: '#2f54eb', fontSize: '18px' }}><ClockCircleOutlined /></div>
                                    <span style={{ fontWeight: 500, fontSize: '14px' }}>Chờ xử lý</span>
                                </div>
                                <div style={{ color: '#2f54eb', fontSize: '28px', fontWeight: 'bold' }}>{thongKe.choXuLy}</div>
                            </Card>
                        </Col>
                        <Col span={6}> 
                            <Card hoverable style={{ backgroundColor: '#fff7e6', borderRadius: '8px' }} styles={{ body: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ color: '#fa8c16', fontSize: '18px' }}><FileTextOutlined /></div>
                                    <span style={{ fontWeight: 500, fontSize: '14px' }}>Đang mượn</span>
                                </div>
                                <div style={{ color: '#fa8c16', fontSize: '28px', fontWeight: 'bold' }}>{thongKe.dangMuon}</div>
                            </Card>
                        </Col>
                        <Col span={6}> 
                            <Card hoverable style={{ backgroundColor: '#fff1f0', borderRadius: '8px' }} styles={{ body: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ color: '#f5222d', fontSize: '18px' }}><ExclamationCircleOutlined /></div>
                                    <span style={{ fontWeight: 500, fontSize: '14px' }}>Quá hạn mượn</span>
                                </div>
                                <div style={{ color: '#f5222d', fontSize: '28px', fontWeight: 'bold' }}>{thongKe.quaHan}</div>
                            </Card>
                        </Col>
                        <Col span={6}> 
                            <Card hoverable style={{ backgroundColor: '#f6ffed', borderRadius: '8px' }} styles={{ body: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ color: '#52c41a', fontSize: '18px' }}><CheckCircleOutlined /></div>
                                    <span style={{ fontWeight: 500, fontSize: '14px' }}>Đã trả</span>
                                </div>
                                <div style={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}>{thongKe.daTra}</div>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <Tabs defaultActiveKey="1" items={items} style={{ marginTop: 24 }} />
            </div>
        </Spin>
    );  
}

export default LichSuMuon;