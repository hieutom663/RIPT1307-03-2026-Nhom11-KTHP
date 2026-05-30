import React, { useEffect, useMemo } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { useModel } from 'umi';

interface ModalThemSuaProps {
    visible: boolean;
    thietBi: any;
    maMoi: string;
    onCancel: () => void;
    onSave: (values: any) => Promise<void>;
    loading: boolean;
}

const ThemSuaThietBi = ({ visible, thietBi, maMoi, onCancel, onSave, loading }: ModalThemSuaProps) => {
    const [form] = Form.useForm();
    const { danhSachDanhMuc } = useModel('danhMuc');

    const danhMucOptions = useMemo(() => {
        return danhSachDanhMuc.map((dm: any) => ({
            value: dm.ma_danh_muc,
            label: dm.ten_danh_muc,
        }));
    }, [danhSachDanhMuc]);

    useEffect(() => {
        if (visible) {
            if (thietBi) {
                form.setFieldsValue({
                    ma_thiet_bi: thietBi.ma_thiet_bi,
                    ten_thiet_bi: thietBi.ten_thiet_bi,
                    mo_ta: thietBi.mo_ta || thietBi.moTa,
                    ma_danh_muc: thietBi.ma_danh_muc,
                    tong_so_luong: thietBi.tong_so_luong || thietBi.soLuongTong,
                    so_luong_con_lai: thietBi.so_luong_con_lai || thietBi.soLuongConLai,
                    img: thietBi.img,
                });
            } else {
                form.resetFields();
                form.setFieldsValue({
                    ma_thiet_bi: maMoi
                });
            }
        }
    }, [visible, thietBi, maMoi, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            onSave(values);
        }).catch((info) => {
            console.log('Validate Failed:', info);
        });
    };

    return (
        <Modal
            open={visible}
            title={thietBi ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}
            okText={thietBi ? 'Cập nhật' : 'Thêm mới'}
            cancelText="Hủy"
            onCancel={onCancel}
            onOk={handleOk}
            confirmLoading={loading}
            width={600}
        >
            <Form form={form} layout="vertical" name="form_thiet_bi">
                <Form.Item 
                    name="ma_thiet_bi" 
                    label="Mã thiết bị" 
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item 
                    name="ten_thiet_bi" 
                    label="Tên thiết bị" 
                    rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị!' }]}
                >
                    <Input placeholder="Nhập tên thiết bị" />
                </Form.Item>

                <Form.Item 
                    name="ma_danh_muc" 
                    label="Danh mục" 
                    rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                >
                    <Select 
                        placeholder="Chọn danh mục thiết bị"
                        options={danhMucOptions}
                    />
                </Form.Item>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <Form.Item 
                        name="tong_so_luong" 
                        label="Số lượng tổng" 
                        rules={[{ required: true, message: 'Nhập số lượng!' }]}
                        style={{ flex: 1 }}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item 
                        name="so_luong_con_lai" 
                        label="Số lượng còn lại" 
                        style={{ flex: 1 }}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} disabled={!thietBi} placeholder="..." />
                    </Form.Item>
                </div>

                <Form.Item name="mo_ta" label="Mô tả">
                    <Input.TextArea rows={3} placeholder="Mô tả chi tiết đồ dùng..." />
                </Form.Item>

                <Form.Item name="img" label="Link Hình Ảnh (URL)" rules={[{ required: true, message: 'Vui lòng nhập link ảnh!' }]}>
                    <Input placeholder="https://..." />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ThemSuaThietBi;