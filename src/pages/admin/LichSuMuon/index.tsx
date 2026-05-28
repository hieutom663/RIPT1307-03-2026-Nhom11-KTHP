import { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, message } from 'antd';
import type { TabsProps } from 'antd';
import { ClockCircleOutlined, FileTextOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ChoDuyet from './component/ChoDuyet';
import DangMuon from './component/DangMuon';
import { layDanhSachChoDuyetAPI, layDanhSachDangMuonAPI } from '../../../services/QuanLyLichSu/api';

const items: TabsProps['items'] = [
    { key: '1', label: 'Chờ duyệt', children: <ChoDuyet /> },
    { key: '2', label: 'Đang mượn', children: <DangMuon /> },
];

const GhiNhanMuonTra = () => {
    const [dangTai, setDangTai] = useState(false);
    const [thongKe, setThongKe] = useState({ choGiao: 0, dangMuon: 0, quaHan: 0 });

    useEffect(() => {
        const layThongKe = async () => {
            setDangTai(true);
            try {
                const resChoGiao = await layDanhSachChoDuyetAPI();
                const resDangMuon = await layDanhSachDangMuonAPI();

                let choGiao = 0;
                let dangMuon = 0;
                let quaHan = 0;

                if (resChoGiao.data.success) {
                    choGiao = resChoGiao.data.data.length;
                }
                if (resDangMuon.data.success) {
                    const ds = resDangMuon.data.data;
                    quaHan = ds.filter((r: any) => r.trangThai === 'qua_han').length;
                    dangMuon = ds.length - quaHan;
                }

                setThongKe({ choGiao, dangMuon, quaHan });
            } catch (error) {
                console.error('Lỗi lấy thống kê:', error);
                message.error('Không thể lấy dữ liệu từ server');
            }
            setDangTai(false);
        };

        layThongKe();
    }, []);

    return (
        <div style={{ padding: 8 }}>
            <h3 style={{ marginBottom: 16 }}>Ghi Nhận Mượn / Trả</h3>
            <div className="thongKe">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={8}>
                        <Card hoverable style={{ backgroundColor: '#f0f5ff', borderRadius: '8px' }} styles={{ body: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ color: '#2f54eb', fontSize: '18px' }}><ClockCircleOutlined /></div>
                                <span style={{ fontWeight: 500, fontSize: '14px' }}>Chờ duyệt</span>
                            </div>
                            <div style={{ color: '#2f54eb', fontSize: '28px', fontWeight: 'bold' }}>{thongKe.choGiao}</div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card hoverable style={{ backgroundColor: '#fff7e6', borderRadius: '8px' }} styles={{ body: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ color: '#fa8c16', fontSize: '18px' }}><FileTextOutlined /></div>
                                <span style={{ fontWeight: 500, fontSize: '14px' }}>Đang mượn</span>
                            </div>
                            <div style={{ color: '#fa8c16', fontSize: '28px', fontWeight: 'bold' }}>{thongKe.dangMuon}</div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card hoverable style={{ backgroundColor: '#fff1f0', borderRadius: '8px' }} styles={{ body: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ color: '#f5222d', fontSize: '18px' }}><ExclamationCircleOutlined /></div>
                                <span style={{ fontWeight: 500, fontSize: '14px' }}>Quá hạn</span>
                            </div>
                            <div style={{ color: '#f5222d', fontSize: '28px', fontWeight: 'bold' }}>{thongKe.quaHan}</div>
                        </Card>
                    </Col>
                </Row>
            </div>
            <Tabs defaultActiveKey="1" items={items} style={{ marginTop: 24 }} />
        </div>
    );
};

export default GhiNhanMuonTra;
