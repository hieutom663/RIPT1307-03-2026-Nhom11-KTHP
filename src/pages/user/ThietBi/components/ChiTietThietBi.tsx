import { Modal, Button, Typography, Row, Col, Divider } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

const ChiTietThietBi = (props: any) => {
    if (!props.thietBi) {
        return null;
    }

    const moTa = props.thietBi.moTa || props.thietBi.mo_ta || 'Chưa có mô tả chi tiết cho thiết bị này.';
    const soLuongTong = props.thietBi.soLuongTong || props.thietBi.tong_so_luong || 0;
    const soLuongConLai = props.thietBi.soLuongConLai !== undefined ? props.thietBi.soLuongConLai : (props.thietBi.so_luong_con_lai || 0);
    const hetHang = soLuongConLai === 0;

    return (
        <Modal
            title={<span style={{ fontSize: '18px' }}>{props.thietBi.ten_thiet_bi}</span>}
            open={props.visible}
            onCancel={props.onClose}
            footer={null}
            width={500}
            centered 
            styles={{ body: { paddingBottom: 0 } }}
        >
            <div style={{ 
                backgroundColor: '#f5f5f5', 
                borderRadius: '8px', 
                padding: '16px', 
                textAlign: 'center', 
                marginBottom: '20px' 
            }}>
                <img
                    src={props.thietBi.img}
                    alt={props.thietBi.ten_thiet_bi}
                    style={{ 
                        maxWidth: '100%', 
                        height: '200px', 
                        borderRadius: '6px', 
                        objectFit: 'contain'
                    }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <Title level={5} style={{ marginTop: 0, marginBottom: '8px' }}>Mô tả sản phẩm</Title>
                <Paragraph type="secondary" style={{ textAlign: 'justify' }}>
                    {moTa}
                </Paragraph>
            </div>

            <div style={{ 
                backgroundColor: '#fafafa', 
                padding: '16px', 
                borderRadius: '8px', 
                marginBottom: '24px',
                border: '1px solid #f0f0f0'
            }}>
                <Row gutter={16}>
                    <Col span={12} style={{ textAlign: 'center', borderRight: '1px solid #e8e8e8' }}>
                        <Text type="secondary" style={{ fontSize: '13px' }}>Tổng số lượng</Text>
                        <br />
                        <Text strong style={{ fontSize: '18px', color: '#262626' }}>{soLuongTong}</Text>
                    </Col>
                    <Col span={12} style={{ textAlign: 'center' }}>
                        <Text type="secondary" style={{ fontSize: '13px' }}>Số lượng còn lại</Text>
                        <br />
                        <Text strong style={{ fontSize: '18px', color: hetHang ? '#f5222d' : '#52c41a' }}>
                            {soLuongConLai}
                        </Text>
                    </Col>
                </Row>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingBottom: '16px' }}>
                <Button size="large" onClick={props.onClose}>
                    Đóng
                </Button>
                <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    disabled={hetHang}
                    onClick={props.onMuonNgay}
                    style={{ backgroundColor: hetHang ? undefined : '#1677ff' }}
                >
                    {hetHang ? 'Đã hết hàng' : 'Đăng ký mượn'}
                </Button>
            </div>
        </Modal>
    );
};

export default ChiTietThietBi;