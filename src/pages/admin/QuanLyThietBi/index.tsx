import { Row, Col, Table, Button, message, Popconfirm } from 'antd';
import { useState } from 'react';
import BoLocThietBi from './component/BoLocThietBi';
import ThemSuaThietBi from './component/ThemSuaThietBi';

const danhSachBanDau = [
    { key: 1, ten: 'Laptop', moTa: 'Laptop Dell Inspiron 15, phục vụ học tập và làm việc', soLuongTong: 10, soLuongConLai: 6, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 2, ten: 'Máy chiếu', moTa: 'Máy chiếu Epson EB-X51, độ sáng 3800 lumens', soLuongTong: 5, soLuongConLai: 3, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 3, ten: 'Máy in', moTa: 'Máy in HP LaserJet Pro, in đen trắng tốc độ cao', soLuongTong: 4, soLuongConLai: 2, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 4, ten: 'Màn hình', moTa: 'Màn hình LCD 24 inch Full HD, cổng HDMI/VGA', soLuongTong: 8, soLuongConLai: 5, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 5, ten: 'Máy tính bảng', moTa: 'iPad Air Gen 5, màn hình 10.9 inch', soLuongTong: 6, soLuongConLai: 4, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 6, ten: 'Chuột không dây', moTa: 'Chuột không dây Logitech M331, kết nối USB receiver', soLuongTong: 20, soLuongConLai: 15, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 7, ten: 'Bàn phím', moTa: 'Bàn phím cơ Rapoo V500, switch Blue, LED RGB', soLuongTong: 10, soLuongConLai: 7, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 8, ten: 'USB Hub', moTa: 'USB Hub 4 cổng USB 3.0, tốc độ truyền 5Gbps', soLuongTong: 15, soLuongConLai: 11, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 9, ten: 'Webcam', moTa: 'Webcam Logitech C920 Full HD 1080p, tự động lấy nét', soLuongTong: 8, soLuongConLai: 5, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 10, ten: 'Ổ cứng di động', moTa: 'Ổ cứng di động WD 1TB, cổng USB 3.0', soLuongTong: 6, soLuongConLai: 3, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 11, ten: 'Bảng trắng', moTa: 'Bảng trắng di động 120x80cm, có chân đế bánh xe', soLuongTong: 6, soLuongConLai: 3, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 12, ten: 'Bút trình chiếu', moTa: 'Bút laser trình chiếu Logitech R400, kết nối USB', soLuongTong: 12, soLuongConLai: 8, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 13, ten: 'Micro không dây', moTa: 'Micro không dây Shure SV100, tầm thu 30m', soLuongTong: 8, soLuongConLai: 5, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 14, ten: 'Tai nghe', moTa: 'Tai nghe Sony WH-1000XM4, chống ồn chủ động', soLuongTong: 15, soLuongConLai: 10, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 15, ten: 'Cáp HDMI', moTa: 'Cáp HDMI 2.0 dài 3m, hỗ trợ 4K 60Hz', soLuongTong: 25, soLuongConLai: 20, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 16, ten: 'Tripod', moTa: 'Chân máy tripod nhôm cao 1.7m, đầu xoay 360 độ', soLuongTong: 6, soLuongConLai: 3, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 17, ten: 'Máy ảnh', moTa: 'Máy ảnh Canon EOS 200D, lens kit 18-55mm', soLuongTong: 3, soLuongConLai: 1, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 18, ten: 'Đèn ring light', moTa: 'Đèn ring light 26cm có chân đế, 3 chế độ ánh sáng', soLuongTong: 7, soLuongConLai: 5, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 19, ten: 'Máy quay phim', moTa: 'Máy quay Sony Handycam HDR-CX405, zoom quang 30x', soLuongTong: 3, soLuongConLai: 1, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 20, ten: 'Micro cài áo', moTa: 'Micro cài áo không dây Boya BY-WM4, tầm thu 50m', soLuongTong: 10, soLuongConLai: 6, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 21, ten: 'Bàn gấp', moTa: 'Bàn gấp đa năng 120x60cm, chịu lực 50kg', soLuongTong: 20, soLuongConLai: 12, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 22, ten: 'Ghế xếp', moTa: 'Ghế xếp inox có tựa lưng, gấp gọn tiện lợi', soLuongTong: 30, soLuongConLai: 18, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 23, ten: 'Kệ trưng bày', moTa: 'Kệ trưng bày 3 tầng bằng gỗ, dùng cho triển lãm', soLuongTong: 10, soLuongConLai: 7, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 24, ten: 'Tủ đựng đồ', moTa: 'Tủ locker 6 ngăn có khóa, chất liệu thép sơn tĩnh điện', soLuongTong: 5, soLuongConLai: 2, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 25, ten: 'Quạt tích điện', moTa: 'Quạt sạc tích điện mini, hoạt động 8 tiếng', soLuongTong: 10, soLuongConLai: 6, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 26, ten: 'Ổ cắm di động', moTa: 'Ổ cắm điện di động 6 lỗ có công tắc, dây dài 3m', soLuongTong: 15, soLuongConLai: 9, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 27, ten: 'Đèn bàn', moTa: 'Đèn bàn LED chống cận, 3 chế độ sáng', soLuongTong: 12, soLuongConLai: 7, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 28, ten: 'Sạc dự phòng', moTa: 'Sạc dự phòng Anker 10000mAh, sạc nhanh 18W', soLuongTong: 20, soLuongConLai: 14, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 29, ten: 'Loa bluetooth', moTa: 'Loa JBL Charge 5, chống nước IPX7, pin 20 tiếng', soLuongTong: 8, soLuongConLai: 4, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: 30, ten: 'Bộ phát WiFi', moTa: 'Bộ phát WiFi di động TP-Link M7200, pin 2000mAh', soLuongTong: 4, soLuongConLai: 2, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
];

const QuanLyThietBi = () => {
    const [danhSach, setDanhSach] = useState(danhSachBanDau);
    const [modalVisible, setModalVisible] = useState(false);
    const [dangSua, setDangSua] = useState(null);
    const [boLoc, setBoLoc] = useState('tat-ca');

    const [ten, setTen] = useState('');
    const [moTa, setMoTa] = useState('');
    const [soLuongTong, setSoLuongTong] = useState(0);
    const [soLuongConLai, setSoLuongConLai] = useState(0);
    const [loai, setLoai] = useState('dien-tu');
    const [img, setImg] = useState('https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png');

    const moModalThem = () => {
        setDangSua(null);
        setTen('');
        setMoTa('');
        setSoLuongTong(0);
        setSoLuongConLai(0);
        setLoai('dien-tu');
        setImg('https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png');
        setModalVisible(true);
    };

    const moModalSua = (thietBi: any) => {
        setDangSua(thietBi);
        setTen(thietBi.ten);
        setMoTa(thietBi.moTa);
        setSoLuongTong(thietBi.soLuongTong);
        setSoLuongConLai(thietBi.soLuongConLai);
        setLoai(thietBi.loai);
        setImg(thietBi.img);
        setModalVisible(true);
    };

    const luuThietBi = (duLieu: any) => {
        if (!duLieu.ten) {
            message.error('Vui lòng nhập tên thiết bị');
            return;
        }
        if (dangSua) {
            const danhSachMoi = danhSach.map((tb) => {
                if (tb.key === (dangSua as any).key) {
                    return { ...tb, ...duLieu };
                }
                return tb;
            });
            setDanhSach(danhSachMoi);
            message.success('Đã cập nhật thiết bị');
        } else {
            const keyMoi = danhSach.length > 0 ? danhSach[danhSach.length - 1].key + 1 : 1;
            setDanhSach([...danhSach, { key: keyMoi, ...duLieu }]);
            message.success('Đã thêm thiết bị mới');
        }
        setModalVisible(false);
    };

    const xoaThietBi = (key: any) => {
        const danhSachMoi = danhSach.filter((tb) => tb.key !== key);
        setDanhSach(danhSachMoi);
        message.success('Đã xóa thiết bị');
    };

    const danhSachLoc = boLoc === 'tat-ca'
        ? danhSach
        : danhSach.filter((tb) => tb.loai === boLoc);

    const cotBang = [
        {
            title: 'STT',
            render: (_: any, __: any, index: any) => index + 1,
            width: 60,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'img',
            width: 80,
            render: (img: any) => <img src={img} alt="img" style={{ width: 50, height: 50 }} />,
        },
        { title: 'Tên thiết bị', dataIndex: 'ten' },
        { title: 'Mô tả', dataIndex: 'moTa' },
        {
            title: 'Loại',
            dataIndex: 'loai',
            render: (loai: any) => {
                if (loai === 'dien-tu') return 'Điện tử';
                if (loai === 'hoc-tap') return 'Học tập';
                if (loai === 'tien-ich') return 'Tiện ích';
                return loai;
            },
        },
        { title: 'SL Tổng', dataIndex: 'soLuongTong', width: 90 },
        { title: 'SL Còn lại', dataIndex: 'soLuongConLai', width: 100 },
        {
            title: 'Hành động',
            width: 180,
            render: (_: any, record: any) => (
                <div>
                    <Button type="primary" size="small" onClick={() => moModalSua(record)} style={{ marginRight: 8 }}>
                        Sửa
                    </Button>
                    <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => xoaThietBi(record.key)}>
                        <Button danger size="small">Xóa</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={24}>
                    <div style={{ padding: '24px 68px' }}>
                        <div style={{ fontSize: 20, marginBottom: 16 }}>
                            <strong>Quản lý thiết bị</strong>
                        </div>
                    </div>
                </Col>
            </Row>

            <div style={{ padding: '0 36px', marginBottom: 16 }}>
                <BoLocThietBi boLoc={boLoc} onChangeLoc={(giaTri: any) => setBoLoc(giaTri)} />
                <Button type="primary" onClick={moModalThem} style={{ marginLeft: 16 }}>
                    + Thêm thiết bị
                </Button>
            </div>

            <div style={{ padding: '0 36px' }}>
                <Table
                    columns={cotBang}
                    dataSource={danhSachLoc}
                    pagination={{ pageSize: 10 }}
                />
            </div>

            <ThemSuaThietBi
                visible={modalVisible}
                thietBi={dangSua}
                ten={ten}
                moTa={moTa}
                soLuongTong={soLuongTong}
                soLuongConLai={soLuongConLai}
                loai={loai}
                img={img}
                onChangeTen={(giaTri: any) => setTen(giaTri)}
                onChangeMoTa={(giaTri: any) => setMoTa(giaTri)}
                onChangeSoLuongTong={(giaTri: any) => setSoLuongTong(giaTri)}
                onChangeSoLuongConLai={(giaTri: any) => setSoLuongConLai(giaTri)}
                onChangeLoai={(giaTri: any) => setLoai(giaTri)}
                onChangeImg={(giaTri: any) => setImg(giaTri)}
                onSave={luuThietBi}
                onCancel={() => setModalVisible(false)}
            />
        </div>
    );
}
export default QuanLyThietBi;
