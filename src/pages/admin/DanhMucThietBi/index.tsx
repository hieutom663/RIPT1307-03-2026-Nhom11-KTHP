import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Tag, Popconfirm, Form, message, Alert, Typography, Space, ConfigProvider } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, AppstoreOutlined } from '@ant-design/icons';
import BoLocDanhMuc from './components/BoLocDanhMuc';
import ThemSuaDanhMuc from './components/ThemSuaDanhMuc';
import {
    getDanhSachDanhMucAPI,
    themDanhMucAPI,
    capNhatDanhMucAPI,
    xoaDanhMucAPI,
    DanhMuc,
} from '@/services/DanhMuc/api';

const { Title, Text } = Typography;

const DanhMucThietBiAdmin = () => {
    const [danhSachDanhMuc, setDanhSachDanhMuc] = useState<DanhMuc[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDanhMuc, setEditingDanhMuc] = useState<DanhMuc | null>(null);
    const [form] = Form.useForm();
    const [boLoc, setBoLoc] = useState('tat-ca');

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

    const columns = [
        {
            title: 'Mã DM',
            dataIndex: 'ma_danh_muc',
            key: 'ma_danh_muc',
            width: 100,
            render: (val: string) => (
                <Text strong style={{ color: '#cf1322', fontFamily: 'monospace' }}>{val}</Text>
            ),
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'ten_danh_muc',
            key: 'ten_danh_muc',
            render: (text: string) => <Text strong style={{ fontSize: '14px' }}>{text}</Text>
        },
        {
            title: 'Mô tả',
            dataIndex: 'mo_ta',
            key: 'mo_ta',
            responsive: ['md'] as any, 
            render: (val: string) => <Text type="secondary">{val || '—'}</Text>,
        },
        {
            title: 'Số thiết bị',
            dataIndex: 'so_luong_thiet_bi',
            key: 'so_luong_thiet_bi',
            width: 120,
            align: 'center' as const,
            responsive: ['sm'] as any,
            render: (val: number) => (
                <Tag color={val > 0 ? 'processing' : 'default'} style={{ borderRadius: '4px' }}>
                    {val ?? 0} thiết bị
                </Tag>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trang_thai',
            key: 'trang_thai',
            width: 140,
            align: 'center' as const,
            render: (val: string) => (
                <Tag color={val === 'hoat-dong' ? 'success' : 'error'} style={{ borderRadius: '4px', padding: '2px 8px' }}>
                    {val === 'hoat-dong' ? 'Hoạt động' : 'Đã ngừng'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            align: 'center' as const,
            fixed: 'right' as const,
            render: (_: any, record: DanhMuc) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EditOutlined style={{ fontSize: '16px' }} />}
                        onClick={() => handleEdit(record)}
                        style={{ color: '#cf1322', padding: 4 }}
                        title="Chỉnh sửa"
                    />
                    <Popconfirm
                        title="Xác nhận xóa?"
                        description={
                            record.so_luong_thiet_bi && record.so_luong_thiet_bi > 0
                                ? `Đang có ${record.so_luong_thiet_bi} thiết bị, không thể xóa!`
                                : 'Xóa danh mục này?'
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
                            icon={<DeleteOutlined style={{ fontSize: '16px' }} />}
                            style={{ padding: 4 }}
                            title="Xóa"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#cf1322' } }}>
            <div style={{ minHeight: 'calc(100vh - 64px)', padding: '0 8px' }}>
                
                <div style={{ 
                    marginBottom: 24, 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '16px', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <AppstoreOutlined style={{ fontSize: 24, color: '#cf1322', marginRight: 12, marginTop: 4 }} />
                        <div>
                            <Title level={3} style={{ margin: 0, marginBottom: 4, color: '#262626' }}>Danh Mục Thiết Bị</Title>
                            <Text type="secondary" style={{ fontSize: '13px' }}>Quản lý danh mục dụng cụ học tập</Text>
                        </div>
                    </div>
                    <Button 
                        type="primary" 
                        size="large" 
                        icon={<PlusOutlined />} 
                        onClick={handleAdd} 
                        style={{ borderRadius: '8px', fontWeight: 500 }}
                    >
                        Thêm mới
                    </Button>
                </div>

                <div style={{ marginBottom: 24 }}>
                    <BoLocDanhMuc boLoc={boLoc} onChangeLoc={(giaTri: any) => setBoLoc(giaTri)} />
                </div>

                {error && (
                    <Alert
                        title={error}
                        type="error"
                        showIcon
                        closable
                        style={{ marginBottom: 24, borderRadius: '8px' }}
                        onClose={() => setError(null)}
                    />
                )}

                <Table
                    dataSource={danhSachDanhMuc}
                    columns={columns}
                    rowKey="ma_danh_muc"
                    loading={loading}
                    scroll={{ x: 'max-content' }}
                    pagination={{ 
                        pageSize: 10, 
                        showTotal: (total) => `Tổng ${total} mục`,
                        showSizeChanger: false,
                        style: { marginTop: '24px' }
                    }}
                    locale={{ emptyText: 'Chưa có danh mục nào' }}
                />

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
        </ConfigProvider>
    );
};

export default DanhMucThietBiAdmin;