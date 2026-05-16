import { Row, Col, Card, Divider, Table } from 'antd';
import { LaptopOutlined, BookOutlined, ClockCircleOutlined, UsergroupAddOutlined } from '@ant-design/icons';

const TrangChu = () => {
    const columnsYC = [
        {
            title: 'Tên sinh viên',
            dataIndex: 'tenSinhVien',
            key: 'tensinhvien'
        },
        {
            title: 'Đồ mượn',
            dataIndex: 'doMuon',
            key: 'domuon'
        },
        {
            title: 'Ngày',
            dataIndex: 'ngay',
            key: 'ngay'
        },
        {
            title: 'Thao tác',
            key: 'thaotac'
        }
    ];

    const columnsHD = [
        {
            title: 'Tên sinh viên',
            dataIndex: 'tenSinhVien',
            key: 'tensinhvien'
        },
        {
            title: 'Đồ mượn',
            dataIndex: 'doMuon',
            key: 'domuon'
        },
        {
            title: 'Ngày',
            dataIndex: 'ngay',
            key: 'ngay'
        },
        {
            title: 'Trạng thái',
            key: 'trangthai'
        }
    ];
    return (
        <div >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={6}>
                    <Card
                        hoverable
                        style={{ 
                            backgroundColor: '#f0f5ff', 
                            borderRadius: '8px' 
                        }}
                        styles={{ 
                            body: { 
                                padding: '16px', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center' 
                            } 
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ color: '#2f54eb', fontSize: '18px' }}>
                                <LaptopOutlined />
                            </div>
                            <span style={{ fontWeight: 500, fontSize: '14px' }}>
                                Tổng đồ dùng
                            </span>
                        </div>
                        <div style={{ color: '#2f54eb', fontSize: '28px', fontWeight: 'bold' }}>
                            0
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card
                        hoverable
                        style={{ 
                            backgroundColor: '#fff7e6', 
                            borderRadius: '8px' 
                        }}
                        styles={{ 
                            body: { 
                                padding: '16px', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center' 
                            } 
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ color: '#fa8c16', fontSize: '18px' }}>
                                <BookOutlined />
                            </div>
                            <span style={{ fontWeight: 500, fontSize: '14px' }}>
                                Đang cho mượn
                            </span>
                        </div>
                        <div style={{ color: '#fa8c16', fontSize: '28px', fontWeight: 'bold' }}>
                            0
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card
                        hoverable
                        style={{ 
                            backgroundColor: '#f6ffed', 
                            borderRadius: '8px' 
                        }}
                        styles={{ 
                            body: { 
                                padding: '16px', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center' 
                            } 
                        }}
                    >   
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ color: '#52c41a', fontSize: '18px' }}>
                                <UsergroupAddOutlined />
                            </div>
                            <span style={{ fontWeight: 500, fontSize: '14px' }}>
                                Yêu cầu mới
                            </span>
                        </div>
                        <div style={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}>
                            0
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card
                        hoverable
                        style={{ 
                            backgroundColor: '#fff1f0', 
                            borderRadius: '8px' 
                        }}
                        styles={{ 
                            body: { 
                                padding: '16px', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center' 
                            } 
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ color: '#f5222d', fontSize: '18px' }}>
                                <ClockCircleOutlined />
                            </div>
                            <span style={{ fontWeight: 500, fontSize: '14px' }}>
                                Quá hạn
                             </span>
                        </div>
                        <div style={{ color: '#f5222d', fontSize: '28px', fontWeight: 'bold' }}>
                            0
                        </div>
                    </Card>
                </Col>
            </Row>
            <Divider />
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={12}>
                        <span style={{ fontWeight: 500, fontSize: '16px' }}>
                            Yêu cầu Mượn đồ đang chờ xử lý
                        </span>
                        <Table columns={columnsYC} dataSource={[]} />
                </Col>
                <Col span={12}>
                        <span style={{ fontWeight: 500, fontSize: '16px' }}>
                            Hoạt động gần đây
                        </span>
                        <Table columns={columnsYC} dataSource={[]} />
                </Col>
            </Row>
        </div>
    );
}
export default  TrangChu;
