import { Row, Col, Card, Typography, Table, Spin, Space, Tag } from 'antd';
import { LaptopOutlined, BookOutlined, ClockCircleOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'umi';

const { Title, Text } = Typography;

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
                console.error("Lỗi tải dữ liệu Dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminHome();
    }, []);

    const columnsYC = [
        { 
            title: 'Tên sinh viên', 
            dataIndex: 'tenSinhVien', 
            key: 'tensinhvien',
            render: (text: string) => <Text strong>{text}</Text>
        },
        { 
            title: 'Đồ mượn', 
            dataIndex: 'doMuon', 
            key: 'domuon',
            render: (text: string) => <Text type="secondary">{text}</Text>
        },
        { 
            title: 'Ngày', 
            dataIndex: 'ngay', 
            key: 'ngay',
            width: 100 
        },
        { 
            title: 'Thao tác', 
            key: 'thaotac', 
            width: 100,
            align: 'center' as const,
            render: () => (
                <Link to="/admin/yeu-cau-muon">
                    <span style={{ color: '#cf1322', fontWeight: 500, cursor: 'pointer' }}>Xử lý</span>
                </Link>
            ) 
        }
    ];

    const columnsHD = [
        { 
            title: 'Tên sinh viên', 
            dataIndex: 'tenSinhVien', 
            key: 'tensinhvien',
            render: (text: string) => <Text strong>{text}</Text>
        },
        { 
            title: 'Đồ mượn', 
            dataIndex: 'doMuon', 
            key: 'domuon',
            render: (text: string) => <Text type="secondary">{text}</Text>
        },
        { 
            title: 'Ngày', 
            dataIndex: 'ngay', 
            key: 'ngay',
            width: 100 
        },
        { 
            title: 'Trạng thái', 
            dataIndex: 'trang_thai', 
            key: 'trangthai',
            width: 120,
            render: (status: string) => {
                let color = 'default';
                if (status === 'Đang mượn') color = 'processing';
                if (status === 'Hoàn thành') color = 'success';
                if (status === 'Quá hạn') color = 'error';
                return <Tag color={color} style={{ borderRadius: 4 }}>{status}</Tag>;
            }
        }
    ];

    const StatCard = ({ title, count, icon, color, bgColor }: { title: string, count: number, icon: React.ReactNode, color: string, bgColor: string }) => (
        <Card 
            hoverable 
            variant="borderless"
            style={{ 
                borderRadius: '16px', 
                background: bgColor,
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'all 0.3s ease'
            }} 
            styles={{ body: { padding: '24px' } }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ color: color, fontSize: '24px' }}>{icon}</div>
                    <span style={{ fontWeight: 600, fontSize: '15px', color: '#595959' }}>{title}</span>
                </div>
                <div style={{ color: color, fontSize: '36px', fontWeight: 'bold', lineHeight: 1 }}>
                    {count}
                </div>
            </div>
        </Card>
    );

    return (
        <Spin spinning={loading} description="Đang tải dữ liệu hệ thống...">
            <div style={{ minHeight: 'calc(100vh - 64px)' }}>
                <div style={{ marginBottom: 32 }}>
                    <Title level={3} style={{ margin: 0, color: '#262626' }}>Tổng quan hệ thống</Title>
                    <Text type="secondary">Cập nhật trạng thái mượn trả thiết bị mới nhất</Text>
                </div>

                <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                    <Col xs={24} sm={12} lg={6}>
                        <StatCard 
                            title="Tổng đồ dùng" 
                            count={stats.totalEquipments} 
                            icon={<LaptopOutlined />} 
                            color="#cf1322" 
                            bgColor="linear-gradient(135deg, #fff1f0 0%, #ffffff 100%)" 
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <StatCard 
                            title="Đang cho mượn" 
                            count={stats.borrowedEquipments} 
                            icon={<BookOutlined />} 
                            color="#fa8c16" 
                            bgColor="linear-gradient(135deg, #fff7e6 0%, #ffffff 100%)" 
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <StatCard 
                            title="Yêu cầu chờ duyệt" 
                            count={stats.pendingRequests} 
                            icon={<UsergroupAddOutlined />} 
                            color="#52c41a" 
                            bgColor="linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)" 
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <StatCard 
                            title="Đơn quá hạn" 
                            count={stats.overdueRequests} 
                            icon={<ClockCircleOutlined />} 
                            color="#f5222d" 
                            bgColor="linear-gradient(135deg, #fff1f0 0%, #ffffff 100%)" 
                        />
                    </Col>
                </Row>
                
                <Row gutter={[24, 24]}>
                    <Col xs={24} xl={12}>
                        <Card 
                            variant="borderless"
                            title={<span style={{ fontSize: '18px', fontWeight: 600 }}>Yêu cầu chờ xử lý</span>}
                            extra={<Link to="/admin/yeu-cau-muon-tra" style={{ color: '#cf1322' }}>Xem tất cả</Link>}
                            style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
                        >
                            <Table 
                                columns={columnsYC} 
                                dataSource={pendingList} 
                                rowKey="id" 
                                pagination={false} 
                                size="middle"
                                locale={{ emptyText: 'Không có yêu cầu nào chờ duyệt' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} xl={12}>
                        <Card 
                            variant="borderless"
                            title={<span style={{ fontSize: '18px', fontWeight: 600 }}>Hoạt động gần đây</span>}
                            style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}
                        >
                            <Table 
                                columns={columnsHD} 
                                dataSource={recentActivities} 
                                rowKey="id" 
                                pagination={false} 
                                size="middle"
                                locale={{ emptyText: 'Chưa có hoạt động mượn trả nào' }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </Spin>
    );
}

export default AdminDashboard;