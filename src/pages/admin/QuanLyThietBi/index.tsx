import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Button, Input, Select, Space, Popconfirm, message, Tooltip, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

import { getDanhSachThietBiAdminAPI, themThietBiAPI, suaThietBiAPI, xoaThietBiAPI } from '../../../services/QuanLyThietBi/api'; 
import ThemSuaThietBi from './component/ThemSuaThietBi';

const { Search } = Input;

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
    const [maMoiTiepTheo, setMaMoiTiepTheo] = useState<string>(''); // STATE LƯU MÃ MỚI

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
                // Gán mã mới lấy từ Backend
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
            render: (_: any, __: any, index: number) => (trangHienTai - 1) * soThietBiMoiTrang + index + 1,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'img',
            width: 80,
            align: 'center' as const,
            render: (img: string) => (
                <Image src={img} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
            ),
        },
        {
            title: 'Mã TB',
            dataIndex: 'ma_thiet_bi',
            width: 100,
            sorter: (a: any, b: any) => a.ma_thiet_bi.localeCompare(b.ma_thiet_bi),
        },
        {
            title: 'Tên thiết bị',
            dataIndex: 'ten_thiet_bi',
            sorter: (a: any, b: any) => a.ten_thiet_bi.localeCompare(b.ten_thiet_bi),
        },
        {
            title: 'Danh mục',
            dataIndex: 'ma_danh_muc',
            width: 150,
            render: (ma_danh_muc: string) => {
                const dm = danhSachDanhMuc.find((d: any) => d.ma_danh_muc === ma_danh_muc);
                return dm ? dm.ten_danh_muc : ma_danh_muc;
            },
        },
        {
            title: 'Mô tả',
            dataIndex: 'mo_ta',
            ellipsis: true,
        },
        {
            title: 'SL Tổng',
            dataIndex: 'tong_so_luong',
            width: 100,
            align: 'center' as const,
            sorter: (a: any, b: any) => a.soLuongTong - b.soLuongTong,
        },
        {
            title: 'SL Còn lại',
            dataIndex: 'so_luong_con_lai',
            width: 100,
            align: 'center' as const,
            sorter: (a: any, b: any) => a.soLuongConLai - b.soLuongConLai,
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            align: 'center' as const,
            render: (_: any, record: any) => (
                <Space size="small">
                    <Tooltip title="Xem / Sửa">
                        <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => moModalSua(record)} />
                    </Tooltip>
                    <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => xuLyXoa(record.ma_thiet_bi)}>
                        <Tooltip title="Xóa">
                            <Button danger size="small" icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const danhMucOptions = useMemo(() => [
        { value: 'tat-ca', label: 'Tất cả danh mục' },
        ...danhSachDanhMuc.map((dm: any) => ({
            value: dm.ma_danh_muc,
            label: dm.ten_danh_muc
        }))
    ], [danhSachDanhMuc]);

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2>Quản lý Thiết bị (Admin)</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={moModalThemMoi}>
                    Thêm thiết bị mới
                </Button>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: 16 }}>
                <Search
                    placeholder="Tìm tên hoặc mã thiết bị..."
                    allowClear
                    enterButton="Tìm kiếm"
                    onSearch={(value) => { setTuKhoa(value); setTrangHienTai(1); }}
                    style={{ maxWidth: 400 }}
                />
                <Select
                    value={boLoc}
                    onChange={(giaTri) => { setBoLoc(giaTri); setTrangHienTai(1); }}
                    style={{ width: 250 }}
                    options={danhMucOptions}
                />
            </div>

            <Table
                columns={columns}
                dataSource={danhSachThietBi}
                rowKey="ma_thiet_bi"
                loading={loading}
                bordered
                pagination={{
                    current: trangHienTai,
                    pageSize: soThietBiMoiTrang,
                    total: tongSoLuong,
                    showSizeChanger: false,
                    onChange: (page) => setTrangHienTai(page),
                }}
            />

            <ThemSuaThietBi
                visible={modalVisible}
                thietBi={thietBiDangChon}
                maMoi={maMoiTiepTheo}
                onCancel={dongModal}
                onSave={xuLyLuuThietBi}
                loading={actionLoading}
            />
        </div>
    );
};

export default QuanLyThietBiAdmin;