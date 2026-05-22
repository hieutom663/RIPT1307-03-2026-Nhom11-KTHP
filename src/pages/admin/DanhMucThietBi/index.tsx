import React, { useState } from 'react';
import { Button, Table, Tag, Popconfirm, Form, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import BoLocDanhMuc from './component/BoLocDanhMuc';
import ThemSuaDanhMuc from './component/ThemSuaDanhMuc';

interface Category {
    id: number;
    tenDanhMuc: string;
    moTa: string;
    trangThai: string;
}

const DanhMucThietBiAdmin: React.FC = () => {
    const [danhSachDanhMuc, setDanhSachDanhMuc] = useState<Category[]>([
        { id: 1, tenDanhMuc: 'Thiết Bị Điện Tử', moTa: 'Máy tính, laptop, màn hình và thiết bị điện tử khác', trangThai: 'hoat-dong' },
        { id: 2, tenDanhMuc: 'Dụng Cụ Văn Phòng', moTa: 'Giấy, bút, kẹp tài liệu và vật tư văn phòng phẩm', trangThai: 'hoat-dong' },
        { id: 3, tenDanhMuc: 'Thiết Bị Y Tế', moTa: 'Băng gạc, thuốc men, dụng cụ sơ cứu', trangThai: 'ngung-hoat-dong' },
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDanhMuc, setEditingDanhMuc] = useState<Category | null>(null);
    const [form] = Form.useForm();
    const [boLoc, setBoLoc] = useState('tat-ca');

    const handleAdd = () => {
        setEditingDanhMuc(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: Category) => {
        setEditingDanhMuc(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = (id: number) => {
        setDanhSachDanhMuc(danhSachDanhMuc.filter(d => d.id !== id));
        message.success('Xóa danh mục thành công');
    };

    const handleSave = (values: any) => {
        if (editingDanhMuc) {
            setDanhSachDanhMuc(danhSachDanhMuc.map(d => d.id === editingDanhMuc.id ? { ...d, ...values } : d));
        } else {
            const newId = Math.max(...danhSachDanhMuc.map(d => d.id), 0) + 1;
            setDanhSachDanhMuc([...danhSachDanhMuc, { ...values, id: newId }]);
        }
        setIsModalVisible(false);
        form.resetFields();
        message.success(editingDanhMuc ? 'Cập nhật thành công' : 'Thêm mới thành công');
    };

    const columns = [
        { title: '#', dataIndex: 'id', key: 'id' },
        { title: 'Tên danh mục', dataIndex: 'tenDanhMuc', key: 'tenDanhMuc' },
        { title: 'Mô tả', dataIndex: 'moTa', key: 'moTa' },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            render: (text: string) => <Tag color={text === 'hoat-dong' ? 'green' : 'red'}>{text === 'hoat-dong' ? 'Đang hoạt động' : 'Ngừng hoạt động'}</Tag>
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: Category) => (
                <>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.id)}><Button type="link" danger icon={<DeleteOutlined />} /></Popconfirm>
                </>
            )
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, fontWeight: 'bold' }}>Quản Lý Danh Mục Thiết Bị</h2>
                    <p style={{ margin: 0, color: '#666' }}>Quản lý danh mục thiết bị và dụng cụ hỗ trợ học tập</p>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Thêm danh mục
                </Button>
            </div>

            <div style={{ marginBottom: 16 }}>
                <BoLocDanhMuc boLoc={boLoc} onChangeLoc={(giaTri: any) => setBoLoc(giaTri)} />
            </div>

            <Table
                dataSource={boLoc === 'tat-ca' ? danhSachDanhMuc : danhSachDanhMuc.filter(dm => dm.trangThai === boLoc)}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            <ThemSuaDanhMuc
                visible={isModalVisible}
                danhMuc={editingDanhMuc}
                form={form}
                onSave={handleSave}
                onCancel={() => setIsModalVisible(false)}
            />
        </div>
    );
};

export default DanhMucThietBiAdmin;
