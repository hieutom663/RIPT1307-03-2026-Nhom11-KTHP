import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Avatar, Row, Col, Button, Modal, Form, Input, message, Space } from 'antd';
import { UserOutlined, EditOutlined, KeyOutlined } from '@ant-design/icons';
import request from 'umi-request';

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
            const res = await request.post('/api/user/trang-ca-nhan', {
                data: { ma_sv: info.ma_sv }
            });
            
            if (res.success) {
                setUserData(res.data);
            }
        } catch (err) {
            message.error('Không kết nối được server');
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    const handleSaveInfo = async (values: any) => {
        const info = JSON.parse(localStorage.getItem('userInfo') || '{}');
        try {
            await request.post('/api/user/update', {
                data: { ...values, ma_sv: info.ma_sv }
            });
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
            const res = await request.post('/api/user/change-password', {
                data: { 
                    ma_sv: info.ma_sv,
                    matKhauCu: values.matKhauCu,
                    matKhauMoi: values.matKhauMoi
                }
            });

            if (res.success) {
                message.success('Đổi mật khẩu thành công!');
                setIsPasswordModalOpen(false);
                passwordForm.resetFields();
            } else {
                message.error(res.message || 'Mật khẩu cũ không đúng!');
            }
        } catch (error) {
            message.error('Lỗi khi đổi mật khẩu');
        }
    };

    if (!userData) return <div>Đang tải...</div>;

    return (
        <div style={{ padding: '24px' }}>
            <Card 
                title="Hồ sơ sinh viên" 
                extra={
                    <Space>
                        <Button 
                            icon={<KeyOutlined />} 
                            onClick={() => setIsPasswordModalOpen(true)}
                        >
                            Đổi mật khẩu
                        </Button>
                        <Button 
                            type="primary"
                            icon={<EditOutlined/>} 
                            onClick={() => {editForm.setFieldsValue(userData); setIsEditModalOpen(true);}}
                        >
                            Sửa
                        </Button>
                    </Space>
                }
            >
                <Row align="middle" gutter={24}>
                    <Col><Avatar size={80} icon={<UserOutlined />} /></Col>
                    <Col>
                        <h2>{userData.ho_ten}</h2>
                        <Tag color="blue">Sinh viên</Tag>
                    </Col>
                </Row>
                <Descriptions bordered column={1} style={{ marginTop: 20 }}>
                    <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{userData.soPhone}</Descriptions.Item>
                    <Descriptions.Item label="Mã sinh viên">{userData.maSV}</Descriptions.Item>
                </Descriptions>
            </Card>

            <Modal title="Sửa thông tin" open={isEditModalOpen} onOk={editForm.submit} onCancel={() => setIsEditModalOpen(false)}>
                <Form form={editForm} onFinish={handleSaveInfo} layout="vertical">
                    <Form.Item name="ten" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="soPhone" label="Số điện thoại">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal title="Đổi mật khẩu" open={isPasswordModalOpen} onOk={passwordForm.submit} onCancel={() => setIsPasswordModalOpen(false)}>
                <Form form={passwordForm} onFinish={handleChangePassword} layout="vertical">
                    <Form.Item 
                        name="matKhauCu" 
                        label="Mật khẩu cũ" 
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    
                    <Form.Item 
                        name="matKhauMoi" 
                        label="Mật khẩu mới" 
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                    >
                        <Input.Password />
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
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TrangCaNhan;