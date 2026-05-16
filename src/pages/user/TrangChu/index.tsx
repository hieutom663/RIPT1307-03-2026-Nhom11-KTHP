import { Row, Col, Image, Button, Card, Space } from 'antd';
import banner from '../../../assets/banner.jpg';
const TrangChu = () => {
    const ten = 'Giáp Văn Hiếu';
    return(
        <div>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{border:'1px solid black'}}>
                <Col span={12}>
                    <div className="banner" style={{padding: '24px 68px'}}> 
                        <div style={{fontSize:20, marginBottom: 16}}>
                            <strong>
                                Chào mừng {ten} đến với
                            </strong><br />
                            <strong> PTIT Borrow! </strong>
                        </div>
                        <div>Hệ thống mượn đồ dùng nhanh chóng, dễ dàng cho các hoạt động của bạn.</div>
                        <Button style={{borderRadius: 8, marginTop: 16}}>Xem Danh mục Đồ dùng</Button>
                    </div>
                </Col >
                <Col span={12}>
                    <Image
                        src= {banner}
                    ></Image>
                </Col>
            </Row>
            <div style={{padding: '16px 36px'}}>
                <h3>Danh mục phổ biến</h3>
                <Space>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        cover={
                        <img
                            draggable={false}
                            alt="example"
                            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                        />
                        }
                    >
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        cover={
                        <img
                            draggable={false}
                            alt="example"
                            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                        />
                        }
                    >
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        cover={
                        <img
                            draggable={false}
                            alt="example"
                            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                        />
                        }
                    >
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        cover={
                        <img
                            draggable={false}
                            alt="example"
                            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                        />
                        }
                    >
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        cover={
                        <img
                            draggable={false}
                            alt="example"
                            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                        />
                        }
                    >
                    </Card>
                </Space>
            </div>
            <div style={{padding: '16px 36px'}}>
                <h3 >Đồ dùng sẵn</h3>
                <Space>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        cover={
                        <img
                            draggable={false}
                            alt="example"
                            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                        />
                        }
                    >
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        cover={
                        <img
                            draggable={false}
                            alt="example"
                            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                        />
                        }
                    >
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        cover={
                        <img
                            draggable={false}
                            alt="example"
                            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                        />
                        }
                    >
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        cover={
                        <img
                            draggable={false}
                            alt="example"
                            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                        />
                        }
                    >
                    </Card>
                    <Card title="Hoạt động của tôi" variant="borderless" style={{ width: 300 }}>
                        <p>Card content</p>
                        <p>Card content</p>
                        <p>Card content</p>
                    </Card>
                </Space>
            </div>
        </div>
        );
}
export default TrangChu;