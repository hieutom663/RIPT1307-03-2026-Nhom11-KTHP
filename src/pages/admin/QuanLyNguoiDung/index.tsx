import { Row, Col, Card, Table, Button, Input, Tag, message, Popconfirm } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useMemo } from 'react';
import ChiTietNguoiDung from './component/ChiTietNguoiDung';
import ThemSuaNguoiDung from './component/ThemSuaNguoiDung';

const danhSachBanDau = [
    { key: 'SV001', ma_sv: 'SV001', ten: 'Nguyễn Văn An', email: 'an@gmail.com', so_phone: '0901234567', ngay_sinh: '2003-05-10', mat_khau: '123456' },
    { key: 'SV002', ma_sv: 'SV002', ten: 'Trần Thị Bình', email: 'binh@gmail.com', so_phone: '0912345678', ngay_sinh: '2003-08-22', mat_khau: '123456' },
    { key: 'SV003', ma_sv: 'SV003', ten: 'Lê Văn Cường', email: 'cuong@gmail.com', so_phone: '0923456789', ngay_sinh: '2002-12-01', mat_khau: '123456' },
    { key: 'SV004', ma_sv: 'SV004', ten: 'Phạm Thị Dung', email: 'dung@gmail.com', so_phone: '0934567890', ngay_sinh: '2003-03-15', mat_khau: '123456' },
    { key: 'SV005', ma_sv: 'SV005', ten: 'Hoàng Văn Em', email: 'em@gmail.com', so_phone: '0945678901', ngay_sinh: '2002-07-30', mat_khau: '123456' },
];

const QuanLyNguoiDung = () => {
    const [danhSach, setDanhSach] = useState(danhSachBanDau);
    const [modalThemSua, setModalThemSua] = useState(false);
    const [modalChiTiet, setModalChiTiet] = useState(false);
    const [dangSua, setDangSua] = useState(null);
    const [nguoiDungChiTiet, setNguoiDungChiTiet] = useState(null);
    const [searchText, setSearchText] = useState('');

    // State form thêm/sửa
    const [maSV, setMaSV] = useState('');
    const [ten, setTen] = useState('');
    const [email, setEmail] = useState('');
    const [soPhone, setSoPhone] = useState('');
    const [ngaySinh, setNgaySinh] = useState('');
    const [matKhau, setMatKhau] = useState('');

    // Lọc theo tìm kiếm
    const danhSachLoc = useMemo(() => {
        return danhSach.filter(nd =>
            nd.ma_sv.toLowerCase().includes(searchText.toLowerCase()) ||
            nd.ten.toLowerCase().includes(searchText.toLowerCase()) ||
            nd.email.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [danhSach, searchText]);

    // Xem chi tiết
    const xemChiTiet = (nguoiDung: any) => {
        setNguoiDungChiTiet(nguoiDung);
        setModalChiTiet(true);
    };

    // Mở modal thêm
    const moModalThem = () => {
        setDangSua(null);
        setMaSV('');
        setTen('');
        setEmail('');
        setSoPhone('');
        setNgaySinh('');
        setMatKhau('');
        setModalThemSua(true);
    };

    // Mở modal sửa
    const moModalSua = (nguoiDung: any) => {
        setDangSua(nguoiDung);
        setMaSV(nguoiDung.ma_sv);
        setTen(nguoiDung.ten);
        setEmail(nguoiDung.email);
        setSoPhone(nguoiDung.so_phone || '');
        setNgaySinh(nguoiDung.ngay_sinh || '');
        setMatKhau('');
        setModalThemSua(true);
    };

    // Lưu (thêm hoặc sửa)
    const luuNguoiDung = (duLieu: any) => {
        if (!duLieu.ten || !duLieu.email) {
            message.error('Vui lòng nhập đầy đủ họ tên và email');
            return;
        }
        if (dangSua) {
            const danhSachMoi = danhSach.map((nd: any) => {
                if (nd.ma_sv === (dangSua as any).ma_sv) {
                    return { ...nd, ten: duLieu.ten, email: duLieu.email, so_phone: duLieu.so_phone, ngay_sinh: duLieu.ngay_sinh };
                }
                return nd;
            });
            setDanhSach(danhSachMoi);
            message.success('Đã cập nhật người dùng');
        } else {
            if (!duLieu.ma_sv || !duLieu.mat_khau) {
                message.error('Vui lòng nhập mã SV và mật khẩu');
                return;
            }
            const nguoiMoi = {
                key: duLieu.ma_sv,
                ma_sv: duLieu.ma_sv,
                ten: duLieu.ten,
                email: duLieu.email,
                so_phone: duLieu.so_phone,
                ngay_sinh: duLieu.ngay_sinh,
                mat_khau: duLieu.mat_khau,
            };
            setDanhSach([...danhSach, nguoiMoi]);
            message.success('Đã thêm người dùng mới');
        }
        setModalThemSua(false);
    };

    // Xóa
    const xoaNguoiDung = (maSV: any) => {
        const danhSachMoi = danhSach.filter((nd: any) => nd.ma_sv !== maSV);
        setDanhSach(danhSachMoi);
        message.success('Đã xóa người dùng');
    };

    const cotBang = [
        {
            title: 'STT',
            render: (_: any, __: any, index: any) => index + 1,
            width: 60,
            align: 'center' as const,
        },
        {
            title: 'Mã SV',
            dataIndex: 'ma_sv',
            width: 120,
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        { title: 'Họ tên', dataIndex: 'ten' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'SĐT', dataIndex: 'so_phone', width: 130 },
        {
            title: 'Hành động',
            width: 280,
            render: (_: any, record: any) => (
                <div>
                    <Button size="small" onClick={() => xemChiTiet(record)} style={{ marginRight: 8 }}>
                        Xem chi tiết
                    </Button>
                    <Button type="primary" size="small" onClick={() => moModalSua(record)} style={{ marginRight: 8 }}>
                        Sửa
                    </Button>
                    <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => xoaNguoiDung(record.ma_sv)}>
                        <Button danger size="small">Xóa</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div style={{ padding: 8 }}>
            <h3 style={{ marginBottom: 16 }}>Quản lý người dùng</h3>

            {/* Card thống kê */}
            <div className="thongKe">
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

            {/* Thanh tìm kiếm + nút thêm */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 16px' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={moModalThem}>
                    Thêm người dùng
                </Button>
                <Input.Search
                    placeholder="Tìm mã SV, họ tên hoặc email..."
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>

            {/* Bảng danh sách */}
            <Table
                columns={cotBang}
                dataSource={danhSachLoc}
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
                maSV={maSV}
                ten={ten}
                email={email}
                soPhone={soPhone}
                ngaySinh={ngaySinh}
                matKhau={matKhau}
                onChangeMaSV={(v: any) => setMaSV(v)}
                onChangeTen={(v: any) => setTen(v)}
                onChangeEmail={(v: any) => setEmail(v)}
                onChangeSoPhone={(v: any) => setSoPhone(v)}
                onChangeNgaySinh={(v: any) => setNgaySinh(v)}
                onChangeMatKhau={(v: any) => setMatKhau(v)}
                onSave={luuNguoiDung}
                onCancel={() => setModalThemSua(false)}
            />
        </div>
    );
};

export default QuanLyNguoiDung;
