import { Modal, Input, Select, Form } from 'antd';

interface ThemSuaDanhMucProps {
    visible: boolean;
    danhMuc: any;
    form: any;
    onSave: (values: any) => void;
    onCancel: () => void;
    saving?: boolean;
}

const ThemSuaDanhMuc = (props: ThemSuaDanhMucProps) => {
    if (!props.visible) {
        return null;
    }

    return (
        <Modal
            title={props.danhMuc ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            open={props.visible}
            onOk={() => props.form.submit()}
            onCancel={props.onCancel}
            okText="Lưu"
            cancelText="Hủy"
            confirmLoading={props.saving}
            okButtonProps={{ disabled: props.saving }}
        >
            <Form form={props.form} layout="vertical" onFinish={props.onSave}>
                <Form.Item
                    name="tenDanhMuc"
                    label="Tên danh mục"
                    rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
                >
                    <Input placeholder="Ví dụ: Thiết Bị Điện Tử" />
                </Form.Item>
                <Form.Item
                    name="moTa"
                    label="Mô tả"
                >
                    <Input.TextArea rows={3} placeholder="Mô tả chi tiết về danh mục" />
                </Form.Item>
                <Form.Item name="trangThai" label="Trạng thái" initialValue="hoat-dong">
                    <Select>
                        <Select.Option value="hoat-dong">Đang hoạt động</Select.Option>
                        <Select.Option value="ngung-hoat-dong">Ngừng hoạt động</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ThemSuaDanhMuc;
