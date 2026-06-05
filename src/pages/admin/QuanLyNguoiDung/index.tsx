import { Row, Col, Card, Table, Button, Input, Tag, message, Popconfirm, Space, Tooltip, Typography } from 'antd';
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, TeamOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState, useEffect, useCallback } from 'react';
import ChiTietNguoiDung from './component/ChiTietNguoiDung';
import ThemSuaNguoiDung from './component/ThemSuaNguoiDung';
import { getDanhSachNguoiDungAPI, themNguoiDungAPI, suaNguoiDungAPI, xoaNguoiDungAPI } from '../../../services/QuanLyNguoiDung/api';

const { Search } = Input;
const { Title, Text } = Typography;

const QuanLyNguoiDung = () => {
    const [danhSach, setDanhSach] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [modalThemSua, setModalThemSua] = useState(false);
    const [modalChiTiet, setModalChiTiet] = useState(false);
    const [dangSua, setDangSua] = useState<any>(null);
    const [nguoiDungChiTiet, setNguoiDungChiTiet] = useState<any>(null);
    const [searchText, setSearchText] = useState('');

    // Lấy danh sách từ API
    const fetchDanhSach = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getDanhSachNguoiDungAPI();
            if (response.data.success) {
                setDanhSach(response.data.data);
            } else {
                message.error('Không thể lấy danh sách người dùng');
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách:", error);
            message.error('Lỗi kết nối máy chủ!');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDanhSach();
    }, [fetchDanhSach]);

    // Lọc theo tìm kiếm (client-side)
    const danhSachLoc = danhSach.filter(nd =>
        nd.ma_sv.toLowerCase().includes(searchText.toLowerCase()) ||
        nd.ho_ten.toLowerCase().includes(searchText.toLowerCase()) ||
        nd.email.toLowerCase().includes(searchText.toLowerCase())
    );

    // Xem chi tiết
    const xemChiTiet = (nguoiDung: any) => {
        setNguoiDungChiTiet(nguoiDung);
        setModalChiTiet(true);
    };

    // Mở modal thêm
    const moModalThem = () => {
        setDangSua(null);
        setModalThemSua(true);
    };

    // Mở modal sửa
    const moModalSua = (nguoiDung: any) => {
        setDangSua(nguoiDung);
        setModalThemSua(true);
    };

    // Lưu (thêm hoặc sửa) - gọi API
    const luuNguoiDung = async (duLieu: any) => {
        setActionLoading(true);
        try {
            if (dangSua) {
                // Sửa
                const response = await suaNguoiDungAPI(dangSua.ma_sv, {
                    ho_ten: duLieu.ho_ten,
                    email: duLieu.email,
                    so_phone: duLieu.so_phone,
                    vai_tro: duLieu.vai_tro,
                });
                if (response.data.success) {
                    message.success('Cập nhật người dùng thành công!');
                } else {
                    message.error(response.data.message || 'Cập nhật thất bại');
                    return;
                }
            } else {
                // Thêm mới
                const response = await themNguoiDungAPI({
                    ma_sv: duLieu.ma_sv,
                    ho_ten: duLieu.ho_ten,
                    email: duLieu.email,
                    so_phone: duLieu.so_phone,
                    mat_khau: duLieu.mat_khau,
                    vai_tro: duLieu.vai_tro,
                });
                if (response.data.success) {
                    message.success('Thêm người dùng mới thành công!');
                } else {
                    message.error(response.data.message || 'Thêm thất bại');
                    return;
                }
            }
            setModalThemSua(false);
            setDangSua(null);
            fetchDanhSach(); // Refresh danh sách từ server
        } catch (error: any) {
            const msg = error?.response?.data?.message || 'Lỗi khi lưu người dùng!';
            message.error(msg);
        } finally {
            setActionLoading(false);
        }
    };

    // Xóa - gọi API
    const xoaNguoiDung = async (maSV: string) => {
        try {
            const response = await xoaNguoiDungAPI(maSV);
            if (response.data.success) {
                message.success('Đã xóa người dùng!');
                fetchDanhSach(); // Refresh danh sách
            } else {
                message.error(response.data.message || 'Xóa thất bại');
            }
        } catch (error: any) {
            const msg = error?.response?.data?.message || 'Lỗi khi xóa người dùng!';
            message.error(msg);
        }
    };

    const cotBang = [
        {
            title: 'STT',
            key: 'stt',
            render: (_: any, __: any, index: number) => <Text type="secondary">{index + 1}</Text>,
            width: 60,
            align: 'center' as const,
        },
        {
            title: 'Mã SV',
            dataIndex: 'ma_sv',
            width: 140,
            sorter: (a: any, b: any) => a.ma_sv.localeCompare(b.ma_sv),
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: 'Họ tên',
            dataIndex: 'ho_ten',
            sorter: (a: any, b: any) => a.ho_ten.localeCompare(b.ho_ten),
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (text: string) => <Text type="secondary">{text}</Text>,
        },
        {
            title: 'SĐT',
            dataIndex: 'so_phone',
            width: 130,
            render: (text: string) => text || <Text type="secondary" italic>Chưa cập nhật</Text>,
        },
        {
            title: 'Vai trò',
            dataIndex: 'vai_tro',
            width: 100,
            align: 'center' as const,
            render: (text: string) => (
                <Tag color={text === 'admin' ? 'red' : 'green'}>
                    {text === 'admin' ? 'Admin' : 'User'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            align: 'center' as const,
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Tooltip title="Xem chi tiết">
                        <Button type="text" style={{ color: '#52c41a', padding: 4 }} icon={<EyeOutlined style={{ fontSize: '16px' }} />} onClick={() => xemChiTiet(record)} />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <Button type="text" style={{ color: '#1677ff', padding: 4 }} icon={<EditOutlined style={{ fontSize: '16px' }} />} onClick={() => moModalSua(record)} />
                    </Tooltip>
                    <Popconfirm title="Xóa người dùng" description="Bạn có chắc chắn muốn xóa người dùng này?" onConfirm={() => xoaNguoiDung(record.ma_sv)} okButtonProps={{ danger: true }}>
                        <Tooltip title="Xóa">
                            <Button type="text" danger style={{ padding: 4 }} icon={<DeleteOutlined style={{ fontSize: '16px' }} />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 8 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <Title level={3} style={{ margin: 0, marginBottom: 8, color: '#262626', display: 'flex', alignItems: 'center' }}>
                        <TeamOutlined style={{ color: '#2f54eb', marginRight: 12 }} />
                        Quản lý Người dùng
                    </Title>
                    <Text type="secondary">Quản lý thông tin tài khoản sinh viên trong hệ thống</Text>
                </div>
                <Button type="primary" size="large" icon={<PlusOutlined />} onClick={moModalThem} style={{ borderRadius: '8px', fontWeight: 500 }}>
                    Thêm người dùng
                </Button>
            </div>

            {/* Card thống kê */}
            <div style={{ marginBottom: 24 }}>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={8}>
                        <Card hoverable style={{ backgroundColor: '#f0f5ff', borderRadius: '8px' }} styles={{ body: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ color: '#2f54eb', fontSize: '18px' }}><UserOutlined /></div>
                                <span style={{ fontWeight: 500, fontSize: '14px' }}>Tổng người dùng</span>
                            </div>
                            <div style={{ color: '#2f54eb', fontSize: '28px', fontWeight: 'bold' }}>{danhSach.length}</div>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Thanh tìm kiếm */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: 24 }}>
                <Search
                    placeholder="Tìm mã SV, họ tên hoặc email..."
                    allowClear
                    enterButton={<Button type="primary" icon={<SearchOutlined />}>Tìm kiếm</Button>}
                    onSearch={(value) => setSearchText(value)}
                    onChange={(e) => { if (!e.target.value) setSearchText(''); }}
                    size="large"
                    style={{ maxWidth: 400 }}
                />
                <Tooltip title="Tải lại dữ liệu">
                    <Button size="large" icon={<ReloadOutlined />} onClick={fetchDanhSach} loading={loading} />
                </Tooltip>
            </div>

            {/* Bảng danh sách */}
            <Table
                columns={cotBang}
                dataSource={danhSachLoc}
                rowKey="ma_sv"
                loading={loading}
                bordered
                pagination={{ showSizeChanger: true }}
            />

            <ChiTietNguoiDung
                visible={modalChiTiet}
                nguoiDung={nguoiDungChiTiet}
                onCancel={() => setModalChiTiet(false)}
            />

            <ThemSuaNguoiDung
                visible={modalThemSua}
                dangSua={dangSua}
                onSave={luuNguoiDung}
                onCancel={() => { setModalThemSua(false); setDangSua(null); }}
                loading={actionLoading}
            />
        </div>
    );
};

export default QuanLyNguoiDung;
