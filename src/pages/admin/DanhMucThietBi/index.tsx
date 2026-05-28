import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Tag, Popconfirm, Form, message, Spin, Alert, Typography, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, AppstoreOutlined } from '@ant-design/icons';
import BoLocDanhMuc from './component/BoLocDanhMuc';
import ThemSuaDanhMuc from './component/ThemSuaDanhMuc';
import {
    getDanhSachDanhMucAPI,
    themDanhMucAPI,
    capNhatDanhMucAPI,
    xoaDanhMucAPI,
    DanhMuc,
} from '@/services/DanhMuc/api';

const { Title, Text } = Typography;

const DanhMucThietBiAdmin: React.FC = () => {
    const [danhSachDanhMuc, setDanhSachDanhMuc] = useState<DanhMuc[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDanhMuc, setEditingDanhMuc] = useState<DanhMuc | null>(null);
    const [form] = Form.useForm();
    const [boLoc, setBoLoc] = useState('tat-ca');

    // ── Tải dữ liệu từ API ──
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getDanhSachDanhMucAPI(boLoc);
            setDanhSachDanhMuc(res.data.data || []);
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Không thể tải danh sách danh mục. Kiểm tra server!';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [boLoc]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ── Handlers ──
    const handleAdd = () => {
        setEditingDanhMuc(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: DanhMuc) => {
        setEditingDanhMuc(record);
        form.setFieldsValue({
            tenDanhMuc: record.ten_danh_muc,
            moTa: record.mo_ta,
            trangThai: record.trang_thai,
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await xoaDanhMucAPI(id);
            if (res.data.success) {
                message.success('Xóa danh mục thành công');
                fetchData();
            } else {
                message.error(res.data.message || 'Xóa thất bại');
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Lỗi khi xóa danh mục';
            message.error(msg);
        }
    };

    const handleSave = async (values: any) => {
        setSaving(true);
        const payload = {
            ten_danh_muc: values.tenDanhMuc,
            mo_ta: values.moTa,
            trang_thai: values.trangThai || 'hoat-dong',
        };
        try {
            let res;
            if (editingDanhMuc) {
                res = await capNhatDanhMucAPI(editingDanhMuc.ma_danh_muc, payload);
            } else {
                res = await themDanhMucAPI(payload);
            }

            if (res.data.success) {
                message.success(editingDanhMuc ? 'Cập nhật thành công' : 'Thêm mới thành công');
                setIsModalVisible(false);
                form.resetFields();
                fetchData();
            } else {
                message.error(res.data.message || 'Thao tác thất bại');
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Lỗi khi lưu danh mục';
            message.error(msg);
        } finally {
            setSaving(false);
        }
    };

    // ── Columns ──
    const columns = [
        {
            title: 'Mã DM',
            dataIndex: 'ma_danh_muc',
            key: 'ma_danh_muc',
            width: 100,
            render: (val: string) => (
                <Text strong style={{ color: '#1677ff', fontFamily: 'monospace' }}>{val}</Text>
            ),
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'ten_danh_muc',
            key: 'ten_danh_muc',
        },
        {
            title: 'Mô tả',
            dataIndex: 'mo_ta',
            key: 'mo_ta',
            render: (val: string) => <Text type="secondary">{val || '—'}</Text>,
        },
        {
            title: 'Số thiết bị',
            dataIndex: 'so_luong_thiet_bi',
            key: 'so_luong_thiet_bi',
            width: 110,
            align: 'center' as const,
            render: (val: number) => (
                <Tag color={val > 0 ? 'blue' : 'default'}>{val ?? 0} thiết bị</Tag>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'trang_thai',
            width: 150,
            align: 'center' as const,
            render: (val: string) => (
                <Tag color={val === 'hoat-dong' ? 'success' : 'error'}>
                    {val === 'hoat-dong' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 110,
            align: 'center' as const,
            render: (_: any, record: DanhMuc) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        style={{ color: '#1677ff' }}
                        title="Chỉnh sửa"
                    />
                    <Popconfirm
                        title="Xác nhận xóa?"
                        description={
                            record.so_luong_thiet_bi && record.so_luong_thiet_bi > 0
                                ? `Danh mục này đang có ${record.so_luong_thiet_bi} thiết bị, không thể xóa!`
                                : 'Bạn có chắc muốn xóa danh mục này?'
                        }
                        onConfirm={() =>
                            record.so_luong_thiet_bi && record.so_luong_thiet_bi > 0
                                ? message.warning('Không thể xóa danh mục đang có thiết bị!')
                                : handleDelete(record.ma_danh_muc)
                        }
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            title="Xóa"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AppstoreOutlined style={{ fontSize: 22, color: '#1677ff' }} />
                    <div>
                        <Title level={4} style={{ margin: 0 }}>Quản Lý Danh Mục Thiết Bị</Title>
                        <Text type="secondary">Quản lý danh mục thiết bị và dụng cụ hỗ trợ học tập</Text>
                    </div>
                </div>
                <Space>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchData}
                        loading={loading}
                        title="Tải lại"
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Thêm danh mục
                    </Button>
                </Space>
            </div>

            {/* Bộ lọc */}
            <div style={{ marginBottom: 16 }}>
                <BoLocDanhMuc boLoc={boLoc} onChangeLoc={(giaTri: any) => setBoLoc(giaTri)} />
            </div>

            {/* Lỗi */}
            {error && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    closable
                    style={{ marginBottom: 16 }}
                    onClose={() => setError(null)}
                />
            )}

            {/* Bảng dữ liệu */}
            <Spin spinning={loading}>
                <Table
                    dataSource={danhSachDanhMuc}
                    columns={columns}
                    rowKey="ma_danh_muc"
                    pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} danh mục` }}
                    style={{ borderRadius: 12, overflow: 'hidden' }}
                    locale={{ emptyText: 'Chưa có danh mục nào' }}
                />
            </Spin>

            {/* Modal Thêm / Sửa */}
            <ThemSuaDanhMuc
                visible={isModalVisible}
                danhMuc={editingDanhMuc}
                form={form}
                onSave={handleSave}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                saving={saving}
            />
        </div>
    );
};

export default DanhMucThietBiAdmin;
