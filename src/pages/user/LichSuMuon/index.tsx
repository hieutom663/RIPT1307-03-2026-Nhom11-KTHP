import { Row, Col, Card, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { ClockCircleOutlined, FileTextOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import PhieuMuon from './component/PhieuMuon';
import TatCaLichSu from './component/TatCaLichSu';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Phiếu mượn',
    children: <PhieuMuon />,
  },
  {
    key: '2',
    label: 'Tất cả lịch sử',
    children: <TatCaLichSu />,
  },
];

const LichSuMuon = () => {
    return(
        <div style={{padding: 8}}>
            <h3>Thống Kê Mượn/Trả đồ dùng</h3>
            <div className="thongKe">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} >
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
                                    <ClockCircleOutlined />
                                </div>
                                <span style={{ fontWeight: 500, fontSize: '14px' }}>
                                    Chờ xử lý
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
                                    <FileTextOutlined />
                                </div>
                                <span style={{ fontWeight: 500, fontSize: '14px' }}>
                                    Đang mượn
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
                                    <ExclamationCircleOutlined />
                                </div>
                                <span style={{ fontWeight: 500, fontSize: '14px' }}>
                                    Quá hạn mượn
                                </span>
                                </div>
                            <div style={{ color: '#f5222d', fontSize: '28px', fontWeight: 'bold' }}>
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
                                    <CheckCircleOutlined />
                                </div>
                                <span style={{ fontWeight: 500, fontSize: '14px' }}>
                                    Chờ xử lý
                                </span>
                                </div>
                            <div style={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}>
                            0
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
            <Tabs defaultActiveKey="1" items={items} style={{marginTop: 8}}  />
        </div>
    );  
    
}
export default LichSuMuon;