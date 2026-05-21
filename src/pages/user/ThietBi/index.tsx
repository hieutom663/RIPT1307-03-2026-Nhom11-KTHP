import { Row, Col, Card, Space, Pagination, Select } from 'antd';
import { useState } from 'react';
import ChiTietThietBi from './component/ChiTietThietBi';

const { Meta } = Card;

const danhSachThietBi = [
    { ten: 'Laptop', moTa: 'Laptop Dell Inspiron 15, phục vụ học tập và làm việc', soLuongTong: 10, soLuongConLai: 6, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Máy chiếu', moTa: 'Máy chiếu Epson EB-X51, độ sáng 3800 lumens', soLuongTong: 5, soLuongConLai: 3, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Máy in', moTa: 'Máy in HP LaserJet Pro, in đen trắng tốc độ cao', soLuongTong: 4, soLuongConLai: 2, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Màn hình', moTa: 'Màn hình LCD 24 inch Full HD, cổng HDMI/VGA', soLuongTong: 8, soLuongConLai: 5, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Máy tính bảng', moTa: 'iPad Air Gen 5, màn hình 10.9 inch', soLuongTong: 6, soLuongConLai: 4, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Chuột không dây', moTa: 'Chuột không dây Logitech M331, kết nối USB receiver', soLuongTong: 20, soLuongConLai: 15, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Bàn phím', moTa: 'Bàn phím cơ Rapoo V500, switch Blue, LED RGB', soLuongTong: 10, soLuongConLai: 7, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'USB Hub', moTa: 'USB Hub 4 cổng USB 3.0, tốc độ truyền 5Gbps', soLuongTong: 15, soLuongConLai: 11, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Webcam', moTa: 'Webcam Logitech C920 Full HD 1080p, tự động lấy nét', soLuongTong: 8, soLuongConLai: 5, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Ổ cứng di động', moTa: 'Ổ cứng di động WD 1TB, cổng USB 3.0', soLuongTong: 6, soLuongConLai: 3, loai: 'dien-tu', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Bảng trắng', moTa: 'Bảng trắng di động 120x80cm, có chân đế bánh xe', soLuongTong: 6, soLuongConLai: 3, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Bút trình chiếu', moTa: 'Bút laser trình chiếu Logitech R400, kết nối USB', soLuongTong: 12, soLuongConLai: 8, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Micro không dây', moTa: 'Micro không dây Shure SV100, tầm thu 30m', soLuongTong: 8, soLuongConLai: 5, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Tai nghe', moTa: 'Tai nghe Sony WH-1000XM4, chống ồn chủ động', soLuongTong: 15, soLuongConLai: 10, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Cáp HDMI', moTa: 'Cáp HDMI 2.0 dài 3m, hỗ trợ 4K 60Hz', soLuongTong: 25, soLuongConLai: 20, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Tripod', moTa: 'Chân máy tripod nhôm cao 1.7m, đầu xoay 360 độ', soLuongTong: 6, soLuongConLai: 3, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Máy ảnh', moTa: 'Máy ảnh Canon EOS 200D, lens kit 18-55mm', soLuongTong: 3, soLuongConLai: 1, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Đèn ring light', moTa: 'Đèn ring light 26cm có chân đế, 3 chế độ ánh sáng', soLuongTong: 7, soLuongConLai: 5, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Máy quay phim', moTa: 'Máy quay Sony Handycam HDR-CX405, zoom quang 30x', soLuongTong: 3, soLuongConLai: 1, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Micro cài áo', moTa: 'Micro cài áo không dây Boya BY-WM4, tầm thu 50m', soLuongTong: 10, soLuongConLai: 6, loai: 'hoc-tap', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Bàn gấp', moTa: 'Bàn gấp đa năng 120x60cm, chịu lực 50kg', soLuongTong: 20, soLuongConLai: 12, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Ghế xếp', moTa: 'Ghế xếp inox có tựa lưng, gấp gọn tiện lợi', soLuongTong: 30, soLuongConLai: 18, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Kệ trưng bày', moTa: 'Kệ trưng bày 3 tầng bằng gỗ, dùng cho triển lãm', soLuongTong: 10, soLuongConLai: 7, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Tủ đựng đồ', moTa: 'Tủ locker 6 ngăn có khóa, chất liệu thép sơn tĩnh điện', soLuongTong: 5, soLuongConLai: 2, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Quạt tích điện', moTa: 'Quạt sạc tích điện mini, hoạt động 8 tiếng', soLuongTong: 10, soLuongConLai: 6, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Ổ cắm di động', moTa: 'Ổ cắm điện di động 6 lỗ có công tắc, dây dài 3m', soLuongTong: 15, soLuongConLai: 9, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Đèn bàn', moTa: 'Đèn bàn LED chống cận, 3 chế độ sáng', soLuongTong: 12, soLuongConLai: 7, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Sạc dự phòng', moTa: 'Sạc dự phòng Anker 10000mAh, sạc nhanh 18W', soLuongTong: 20, soLuongConLai: 14, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Loa bluetooth', moTa: 'Loa JBL Charge 5, chống nước IPX7, pin 20 tiếng', soLuongTong: 8, soLuongConLai: 4, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { ten: 'Bộ phát WiFi', moTa: 'Bộ phát WiFi di động TP-Link M7200, pin 2000mAh', soLuongTong: 4, soLuongConLai: 2, loai: 'tien-ich', img: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
];

const ThietBi = () => {
    const [visible, setVisible] = useState(false);
    const [thietBiChon, setThietBiChon] = useState(null);
    const [trangHienTai, setTrangHienTai] = useState(1);
    const [boLoc, setBoLoc] = useState('tat-ca');

    const moChiTiet = (thietBi: any) => {
        setThietBiChon(thietBi);
        setVisible(true);
    };

    const dongChiTiet = () => {
        setVisible(false);
        setThietBiChon(null);
    };

    const danhSachLoc = boLoc === 'tat-ca'
        ? danhSachThietBi
        : danhSachThietBi.filter((tb) => tb.loai === boLoc);

    const soThietBiMoiTrang = 10;
    const batDau = (trangHienTai - 1) * soThietBiMoiTrang;
    const ketThuc = batDau + soThietBiMoiTrang;
    const danhSachHienThi = danhSachLoc.slice(batDau, ketThuc);

    return (
        <div>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={24}>
                    <div style={{ padding: '24px 68px' }}>
                        <div style={{ fontSize: 20, marginBottom: 16 }}>
                            <strong>
                                Danh sách thiết bị
                            </strong>
                        </div>
                    </div>
                </Col>
            </Row>

            <div style={{ padding: '0 36px' }}>
                <Select
                    value={boLoc}
                    onChange={(giaTri) => { setBoLoc(giaTri); setTrangHienTai(1); }}
                    style={{ width: 200 }}
                    options={[
                        { value: 'tat-ca', label: 'Tất cả' },
                        { value: 'dien-tu', label: 'Điện tử' },
                        { value: 'hoc-tap', label: 'Học tập' },
                        { value: 'tien-ich', label: 'Tiện ích' },
                    ]}
                />
            </div>

            <div style={{ padding: '16px 36px' }}>
                <Space size={16} wrap>
                    {danhSachHienThi.map((thietBi, index) => (
                        <Card
                            key={index}
                            hoverable
                            style={{ width: 160 }}
                            onClick={() => moChiTiet(thietBi)}
                            cover={
                                <img
                                    draggable={false}
                                    alt={thietBi.ten}
                                    src={thietBi.img}
                                />
                            }
                        >
                            <Meta title={thietBi.ten} />
                        </Card>
                    ))}
                </Space>
            </div>

            <div style={{ padding: '16px 36px', textAlign: 'center' }}>
                <Pagination
                    current={trangHienTai}
                    total={danhSachLoc.length}
                    pageSize={soThietBiMoiTrang}
                    onChange={(trang) => setTrangHienTai(trang)}
                />
            </div>

            <ChiTietThietBi
                visible={visible}
                thietBi={thietBiChon}
                onClose={dongChiTiet}
            />
        </div>
    );
}
export default ThietBi;
