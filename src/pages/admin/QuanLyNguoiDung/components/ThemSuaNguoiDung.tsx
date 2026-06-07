import { Modal, Input, Form, Select } from 'antd';
import { useEffect } from 'react';

const ThemSuaNguoiDung = (props: any) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (props.visible) {
            if (props.dangSua) {
                form.setFieldsValue({
                    ma_sv: props.dangSua.ma_sv,
                    ho_ten: props.dangSua.ho_ten,
                    email: props.dangSua.email,
                    so_phone: props.dangSua.so_phone || '',
                    vai_tro: props.dangSua.vai_tro || 'user',
                });
            } else {
                form.resetFields();
            }
        }
    }, [props.visible, props.dangSua, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            props.onSave(values);
        }).catch(() => {
            // validation failed
        });
    };

    return (
        <Modal
            title={props.dangSua ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
            open={props.visible}
            onOk={handleOk}
            onCancel={props.onCancel}
            okText="Lưu"
            cancelText="Hủy"
            confirmLoading={props.loading}
            destroyOnHidden
        >
            <Form form={form} layout="vertical" style={{ marginTop: 16 }} initialValues={{ vai_tro: 'user' }}>
                <Form.Item
                    name="ma_sv"
                    label="Mã sinh viên"
                    rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
                >
                    <Input
                        placeholder="Ví dụ: B24DCCN001"
                        disabled={!!props.dangSua}
                    />
                </Form.Item>

                <Form.Item
                    name="ho_ten"
                    label="Họ tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                    <Input placeholder="Nhập họ tên đầy đủ" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' },
                    ]}
                >
                    <Input placeholder="Nhập địa chỉ email" />
                </Form.Item>

                <Form.Item
                    name="so_phone"
                    label="Số điện thoại"
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item
                    name="vai_tro"
                    label="Vai trò"
                    rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                >
                    <Select
                        options={[
                            { value: 'user', label: 'User (Sinh viên)' },
                            { value: 'admin', label: 'Admin (Quản trị)' },
                        ]}
                    />
                </Form.Item>

                {!props.dangSua && (
                    <Form.Item
                        name="mat_khau"
                        label="Mật khẩu"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu' },
                            { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)" />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default ThemSuaNguoiDung;
