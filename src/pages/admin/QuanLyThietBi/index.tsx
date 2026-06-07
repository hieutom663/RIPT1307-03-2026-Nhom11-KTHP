import { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Button, Input, Select, Space, Popconfirm, message, Tooltip, Image, Typography, ConfigProvider, Tag, Skeleton } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

import { getDanhSachThietBiAdminAPI, themThietBiAPI, suaThietBiAPI, xoaThietBiAPI } from '../../../services/QuanLyThietBi/api'; 
import ThemSuaThietBi from './components/ThemSuaThietBi';

const { Search } = Input;
const { Title, Text } = Typography;

const QuanLyThietBiAdmin = () => {
    const { danhSachDanhMuc } = useModel('danhMuc'); 

    const [danhSachThietBi, setDanhSachThietBi] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    
    const [tongSoLuong, setTongSoLuong] = useState(0);
    const [trangHienTai, setTrangHienTai] = useState(1);
    const [boLoc, setBoLoc] = useState('tat-ca');
    const [tuKhoa, setTuKhoa] = useState('');
    const soThietBiMoiTrang = 10;

    const [modalVisible, setModalVisible] = useState(false);
    const [thietBiDangChon, setThietBiDangChon] = useState<any>(null);
    const [maMoiTiepTheo, setMaMoiTiepTheo] = useState<string>('');

    const fetchDanhSachThietBi = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getDanhSachThietBiAdminAPI({
                danhMuc: boLoc === 'tat-ca' ? '' : boLoc, 
                tuKhoa: tuKhoa, 
                page: trangHienTai,
                limit: soThietBiMoiTrang
            });
            
            if (response.data.success) {
                setDanhSachThietBi(response.data.data);
                setTongSoLuong(response.data.total);
                if (response.data.nextId) setMaMoiTiepTheo(response.data.nextId);
            } else {
                message.error('Không thể lấy danh sách thiết bị');
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách:", error);
            message.error('Lỗi kết nối máy chủ!');
        } finally {
            setLoading(false);
        }
    }, [boLoc, tuKhoa, trangHienTai]);

    useEffect(() => {
        fetchDanhSachThietBi();
    }, [fetchDanhSachThietBi]);

    const moModalThemMoi = () => {
        setThietBiDangChon(null);
        setModalVisible(true);
    };

    const moModalSua = (record: any) => {
        setThietBiDangChon(record);
        setModalVisible(true);
    };

    const dongModal = () => {
        setModalVisible(false);
        setThietBiDangChon(null);
    };

    const xuLyLuuThietBi = async (values: any) => {
        setActionLoading(true);
        try {
            if (!thietBiDangChon) {
                values.so_luong_con_lai = values.tong_so_luong;
            }

            if (thietBiDangChon) {
                await suaThietBiAPI(thietBiDangChon.ma_thiet_bi, values);
                message.success('Cập nhật thiết bị thành công!');
            } else {
                await themThietBiAPI(values);
                message.success('Thêm thiết bị mới thành công!');
            }
            dongModal();
            fetchDanhSachThietBi(); 
        } catch (error) {
            message.error('Lỗi khi lưu thiết bị!');
        } finally {
            setActionLoading(false);
        }
    };

    const xuLyXoa = async (maThietBi: string) => {
        try {
            await xoaThietBiAPI(maThietBi);
            message.success('Đã xóa thiết bị!');
            fetchDanhSachThietBi();
        } catch (error) {
            message.error('Lỗi khi xóa thiết bị!');
        }
    };

    const columns = [
        {
            title: 'STT',
            key: 'stt',
            width: 60,
            align: 'center' as const,
            responsive: ['md'] as any,
            render: (_: any, __: any, index: number) => <Text type="secondary">{(trangHienTai - 1) * soThietBiMoiTrang + index + 1}</Text>,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'img',
            width: 90,
            align: 'center' as const,
            render: (img: string) => (
                <div style={{ padding: '4px', border: '1px solid #f0f0f0', borderRadius: '8px', display: 'inline-block', backgroundColor: '#fff' }}>
                    <Image src={img} style={{ width: 44, height: 44, objectFit: 'contain' }} fallback="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" />
                </div>
            ),
        },
        {
            title: 'Mã TB',
            dataIndex: 'ma_thiet_bi',
            width: 100,
            sorter: (a: any, b: any) => a.ma_thiet_bi.localeCompare(b.ma_thiet_bi),
            render: (text: string) => <Text strong style={{ color: '#cf1322' }}>{text}</Text>
        },
        {
            title: 'Tên thiết bị',
            dataIndex: 'ten_thiet_bi',
            sorter: (a: any, b: any) => a.ten_thiet_bi.localeCompare(b.ten_thiet_bi),
            render: (text: string) => <Text strong style={{ fontSize: '14px' }}>{text}</Text>
        },
        {
            title: 'Danh mục',
            dataIndex: 'ma_danh_muc',
            width: 180,
            responsive: ['md'] as any, 
            render: (ma_danh_muc: string) => {
                const dm = danhSachDanhMuc?.find((d: any) => d.ma_danh_muc === ma_danh_muc);
                return <Tag color="blue" style={{ borderRadius: '4px' }}>{dm ? dm.ten_danh_muc : ma_danh_muc}</Tag>;
            },
        },
        {
            title: 'Mô tả',
            dataIndex: 'mo_ta',
            ellipsis: true,
            responsive: ['lg'] as any,
            render: (text: string) => <Text type="secondary">{text}</Text>
        },
        {
            title: 'Tổng',
            dataIndex: 'tong_so_luong',
            width: 80,
            align: 'center' as const,
            responsive: ['sm'] as any, 
            sorter: (a: any, b: any) => a.tong_so_luong - b.tong_so_luong,
            render: (val: number) => <Text strong>{val}</Text>
        },
        {
            title: 'Còn lại',
            dataIndex: 'so_luong_con_lai',
            width: 90,
            align: 'center' as const,
            sorter: (a: any, b: any) => a.so_luong_con_lai - b.so_luong_con_lai,
            render: (val: number) => <Text strong style={{ color: val > 0 ? '#52c41a' : '#f5222d' }}>{val}</Text>
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 100,
            align: 'center' as const,
            fixed: 'right' as const, 
            render: (_: any, record: any) => (
                <Space size="small">
                    <Tooltip title="Sửa thiết bị">
                        <Button type="text" style={{ color: '#1677ff', padding: 4 }} icon={<EditOutlined style={{ fontSize: '16px' }}/>} onClick={() => moModalSua(record)} />
                    </Tooltip>
                    <Popconfirm title="Xác nhận" description="Xóa thiết bị này?" onConfirm={() => xuLyXoa(record.ma_thiet_bi)} okButtonProps={{ danger: true }}>
                        <Tooltip title="Xóa">
                            <Button type="text" danger style={{ padding: 4 }} icon={<DeleteOutlined style={{ fontSize: '16px' }}/>} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const danhMucOptions = useMemo(() => {
        const options = danhSachDanhMuc ? danhSachDanhMuc.map((dm: any) => ({
            value: dm.ma_danh_muc,
            label: dm.ten_danh_muc
        })) : [];

        return [
            { value: 'tat-ca', label: 'Tất cả danh mục' },
            ...options
        ];
    }, [danhSachDanhMuc]);

    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#cf1322' } }}>
            <div style={{ minHeight: 'calc(100vh - 64px)', padding: '0 8px' }}>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <DatabaseOutlined style={{ fontSize: 24, color: '#cf1322', marginRight: 12, marginTop: 4 }} />
                        <div>
                            <Title level={3} style={{ margin: 0, marginBottom: 4, color: '#262626' }}>Kho Thiết Bị</Title>
                            <Text type="secondary" style={{ fontSize: '13px' }}>Quản lý số lượng và danh sách thiết bị</Text>
                        </div>
                    </div>
                    <Button type="primary" size="large" icon={<PlusOutlined />} onClick={moModalThemMoi} style={{ borderRadius: '8px', fontWeight: 500 }}>
                        Thêm mới
                    </Button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: 24 }}>
                    <Search
                        placeholder="Tìm tên hoặc mã thiết bị..."
                        allowClear
                        enterButton={<Button type="primary" icon={<SearchOutlined />} disabled={loading}>Tìm</Button>}
                        onSearch={(value) => { setTuKhoa(value); setTrangHienTai(1); }}
                        size="large"
                        disabled={loading} 
                        style={{ flex: '1 1 250px', maxWidth: 400 }} 
                    />
                    <Select
                        value={boLoc}
                        onChange={(giaTri) => { setBoLoc(giaTri); setTrangHienTai(1); }}
                        style={{ flex: '1 1 200px', maxWidth: 250 }}
                        size="large"
                        disabled={loading || !danhSachDanhMuc || danhSachDanhMuc.length === 0}
                        options={danhMucOptions}
                    />
                </div>

                {loading && danhSachThietBi.length === 0 ? (
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px' }}>
                        <Title level={5} type="secondary" style={{ marginBottom: 24 }}>Đang tải danh sách thiết bị...</Title>
                        <Skeleton active paragraph={{ rows: 8 }} />
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={danhSachThietBi}
                        rowKey="ma_thiet_bi"
                        loading={loading}
                        scroll={{ x: 'max-content' }}
                        pagination={{
                            current: trangHienTai,
                            pageSize: soThietBiMoiTrang,
                            total: tongSoLuong,
                            showSizeChanger: false,
                            onChange: (page) => setTrangHienTai(page),
                            style: { marginTop: '24px' }
                        }}
                    />
                )}

                <ThemSuaThietBi
                    visible={modalVisible}
                    thietBi={thietBiDangChon}
                    maMoi={maMoiTiepTheo}
                    onCancel={dongModal}
                    onSave={xuLyLuuThietBi}
                    loading={actionLoading}
                />
            </div>
        </ConfigProvider>
    );
};

export default QuanLyThietBiAdmin;