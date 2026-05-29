import { Row, Col, Card, Divider, Table } from 'antd';
import { LaptopOutlined, BookOutlined, ClockCircleOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalEquipments: 0,
        borrowedEquipments: 0,
        pendingRequests: 0,
        overdueRequests: 0
    });
    const [pendingList, setPendingList] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminHome = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/admin/trang-chu');
                
                if (response.data.success) {
                    setStats(response.data.data.stats);
                    setPendingList(response.data.data.pendingList);
                    setRecentActivities(response.data.data.recentActivities);
                }
            } catch (error) {
                console.error("Lỗi lấy dữ liệu Dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminHome();
    }, []);

    const columnsYC = [
        { title: 'Tên sinh viên', dataIndex: 'tenSinhVien', key: 'tensinhvien' },
        { title: 'Đồ mượn', dataIndex: 'doMuon', key: 'domuon' },
        { title: 'Ngày', dataIndex: 'ngay', key: 'ngay' },
        { title: 'Thao tác', key: 'thaotac', render: () => <a style={{color: '#1890ff', cursor: 'pointer'}}>Xem</a> }
    ];

    const columnsHD = [
        { title: 'Tên sinh viên', dataIndex: 'tenSinhVien', key: 'tensinhvien' },
        { title: 'Đồ mượn', dataIndex: 'doMuon', key: 'domuon' },
        { title: 'Ngày', dataIndex: 'ngay', key: 'ngay' },
        { title: 'Trạng thái', dataIndex: 'trang_thai', key: 'trangthai' }
    ];

    return (
        <div>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={6}>
                    <Card hoverable loading={loading} style={{ backgroundColor: '#f0f5ff', borderRadius: '8px' }} styles={{ body: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ color: '#2f54eb', fontSize: '18px' }}><LaptopOutlined /></div>
                            <span style={{ fontWeight: 500, fontSize: '14px' }}>Tổng đồ dùng</span>
                        </div>
                        <div style={{ color: '#2f54eb', fontSize: '28px', fontWeight: 'bold' }}>
                            {stats.totalEquipments}
                        </div>
                    </Card>
                </Col>
                
                <Col span={6}>
                    <Card hoverable loading={loading} style={{ backgroundColor: '#fff7e6', borderRadius: '8px' }} styles={{ body: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ color: '#fa8c16', fontSize: '18px' }}><BookOutlined /></div>
                            <span style={{ fontWeight: 500, fontSize: '14px' }}>Đang cho mượn</span>
                        </div>
                        <div style={{ color: '#fa8c16', fontSize: '28px', fontWeight: 'bold' }}>
                            {stats.borrowedEquipments}
                        </div>
                    </Card>
                </Col>
                
                <Col span={6}>
                    <Card hoverable loading={loading} style={{ backgroundColor: '#f6ffed', borderRadius: '8px' }} styles={{ body: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }}>   
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ color: '#52c41a', fontSize: '18px' }}><UsergroupAddOutlined /></div>
                            <span style={{ fontWeight: 500, fontSize: '14px' }}>Yêu cầu mới</span>
                        </div>
                        <div style={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}>
                            {stats.pendingRequests}
                        </div>
                    </Card>
                </Col>
                
                <Col span={6}>
                    <Card hoverable loading={loading} style={{ backgroundColor: '#fff1f0', borderRadius: '8px' }} styles={{ body: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ color: '#f5222d', fontSize: '18px' }}><ClockCircleOutlined /></div>
                            <span style={{ fontWeight: 500, fontSize: '14px' }}>Quá hạn</span>
                         </div>
                        <div style={{ color: '#f5222d', fontSize: '28px', fontWeight: 'bold' }}>
                            {stats.overdueRequests}
                        </div>
                    </Card>
                </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={12}>
                    <span style={{ fontWeight: 500, fontSize: '16px', display: 'block', marginBottom: '16px' }}>
                        Yêu cầu Mượn đồ đang chờ xử lý
                    </span>
                    <Table 
                        columns={columnsYC} 
                        dataSource={pendingList} 
                        loading={loading}
                        rowKey="id" 
                        pagination={false} 
                    />
                </Col>
                <Col span={12}>
                    <span style={{ fontWeight: 500, fontSize: '16px', display: 'block', marginBottom: '16px' }}>
                        Hoạt động gần đây
                    </span>
                    <Table 
                        columns={columnsHD} 
                        dataSource={recentActivities} 
                        loading={loading}
                        rowKey="id" 
                        pagination={false} 
                    />
                </Col>
            </Row>
        </div>
    );
}

export default AdminDashboard;