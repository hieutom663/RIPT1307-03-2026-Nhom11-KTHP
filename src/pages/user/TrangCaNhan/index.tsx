import { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Avatar, Row, Col, Button, Modal, Form, Input, message, Space, Typography } from 'antd';
import { UserOutlined, EditOutlined, KeyOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { getTrangCaNhanAPI, updateTrangCaNhanAPI, changePasswordAPI } from '@/services/TrangCaNhan/api';

const { Title, Text } = Typography;

const TrangCaNhan = () => {
    const [userData, setUserData] = useState<any>(null);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm] = Form.useForm();

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordForm] = Form.useForm();

    const fetchProfile = async () => {
        const info = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (!info.ma_sv) return;

        try {
            const res = await getTrangCaNhanAPI(info.ma_sv);          
            if (res.data && res.data.success) {
                setUserData(res.data.data);
            }
        } catch (err) {
            message.error('Không kết nối được server');
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    const handleSaveInfo = async (values: any) => {
        const info = JSON.parse(localStorage.getItem('userInfo') || '{}');
        try {
            await updateTrangCaNhanAPI({ ...values, ma_sv: info.ma_sv });
            
            message.success('Cập nhật thành công!');
            setIsEditModalOpen(false);
            fetchProfile();
        } catch (error) {
            message.error('Lỗi khi cập nhật thông tin');
        }
    };

    const handleChangePassword = async (values: any) => {
        const info = JSON.parse(localStorage.getItem('userInfo') || '{}');
        try {
            const payload = { 
                ma_sv: info.ma_sv,
                matKhauCu: values.matKhauCu,
                matKhauMoi: values.matKhauMoi
            };
            
            const res = await changePasswordAPI(payload);

            if (res.data && res.data.success) {
                message.success('Đổi mật khẩu thành công!');
                setIsPasswordModalOpen(false);
                passwordForm.resetFields();
            } else {
                message.error(res.data.message || 'Mật khẩu cũ không đúng!');
            }
        } catch (error: any) {
            // Bắt lỗi xịn hơn từ backend ném ra
            const msg = error.response?.data?.message || 'Lỗi khi đổi mật khẩu';
            message.error(msg);
        }
    };

    if (!userData) return <div style={{ padding: 24 }}>Đang tải thông tin...</div>;

    const tenHienThi = userData.ten || userData.ho_ten || 'Tên sinh viên';

    return (
        <div style={{ padding: '24px 32px', backgroundColor: '#f5f7fa', minHeight: 'calc(100vh - 64px)' }}>
            <Card 
                variant="borderless"
                style={{ 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}
                styles={{ header: { borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }, body: { padding: '32px 24px' } }}
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SafetyCertificateOutlined style={{ color: '#cf1322', fontSize: '20px' }} />
                        <span style={{ fontSize: '18px', fontWeight: 600 }}>Hồ sơ cá nhân</span>
                    </div>
                } 
                extra={
                    <Space>
                        <Button 
                            icon={<KeyOutlined />} 
                            onClick={() => setIsPasswordModalOpen(true)}
                            style={{ borderRadius: '8px' }}
                        >
                            Đổi mật khẩu
                        </Button>
                        <Button 
                            type="primary"
                            icon={<EditOutlined/>} 
                            style={{ backgroundColor: '#cf1322', borderColor: '#cf1322', borderRadius: '8px' }}
                            onClick={() => {

                                editForm.setFieldsValue({
                                    ...userData,
                                    ten: tenHienThi
                                });
                                setIsEditModalOpen(true);
                            }}
                        >
                            Sửa thông tin
                        </Button>
                    </Space>
                }
            >
                <Row align="middle" gutter={32} style={{ marginBottom: 32 }}>
                    <Col>
                        <Avatar 
                            size={100} 
                            icon={<UserOutlined />} 
                            style={{ backgroundColor: '#fff1f0', color: '#cf1322', border: '2px solid #ffccc7' }}
                        />
                    </Col>
                    <Col>
                        <Title level={3} style={{ margin: 0, marginBottom: 8, color: '#262626' }}>
                            {tenHienThi}
                        </Title>
                        <Tag color="volcano" style={{ padding: '2px 12px', borderRadius: '12px', fontWeight: 500 }}>
                            Sinh viên
                        </Tag>
                    </Col>
                </Row>
                
                <Descriptions 
                    bordered 
                    column={1} 
                    styles={{
                        label: { width: '200px', backgroundColor: '#fafafa', fontWeight: 500 },
                        content: { backgroundColor: '#ffffff' }
                    }}
                    style={{ borderRadius: '8px', overflow: 'hidden' }}
                >
                    <Descriptions.Item label="Email sinh viên">
                        <Text strong>{userData.email}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại liên hệ">
                        {userData.soPhone || <Text type="secondary">Chưa cập nhật</Text>}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mã sinh viên">
                        <Text style={{ color: '#cf1322', fontWeight: 600 }}>{userData.maSV || userData.ma_sv}</Text>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Modal 
                title={<span style={{ fontWeight: 600 }}>Sửa thông tin cá nhân</span>} 
                open={isEditModalOpen} 
                onOk={editForm.submit} 
                onCancel={() => setIsEditModalOpen(false)}
                okButtonProps={{ style: { backgroundColor: '#cf1322', borderColor: '#cf1322' } }}
                centered
            >
                <Form form={editForm} onFinish={handleSaveInfo} layout="vertical" style={{ marginTop: 20 }}>
                    <Form.Item name="ten" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                        <Input size="large" />
                    </Form.Item>
                    <Form.Item name="soPhone" label="Số điện thoại">
                        <Input size="large" />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal 
                title={<span style={{ fontWeight: 600 }}>Bảo mật tài khoản</span>} 
                open={isPasswordModalOpen} 
                onOk={passwordForm.submit} 
                onCancel={() => setIsPasswordModalOpen(false)}
                okButtonProps={{ style: { backgroundColor: '#cf1322', borderColor: '#cf1322' } }}
                okText="Xác nhận đổi"
                cancelText="Hủy"
                centered
            >
                <Form form={passwordForm} onFinish={handleChangePassword} layout="vertical" style={{ marginTop: 20 }}>
                    <Form.Item 
                        name="matKhauCu" 
                        label="Mật khẩu cũ" 
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>
                    
                    <Form.Item 
                        name="matKhauMoi" 
                        label="Mật khẩu mới" 
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>

                    <Form.Item 
                        name="xacNhanMatKhau" 
                        label="Xác nhận mật khẩu mới" 
                        dependencies={['matKhauMoi']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('matKhauMoi') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                }
                            })
                        ]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TrangCaNhan;