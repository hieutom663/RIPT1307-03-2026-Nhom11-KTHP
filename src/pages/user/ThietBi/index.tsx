import { Row, Col, Card, Space } from 'antd';
import { useState } from 'react';
import ChiTietThietBi from './component/ChiTietThietBi';

const { Meta } = Card;

const ThietBi = () => {
    const [visible, setVisible] = useState(false);
    const [thietBiChon, setThietBiChon] = useState(null as any);

    const moChiTiet = (ten: string, moTa: string, soLuongTong: number, soLuongConLai: number, img: string) => {
        setThietBiChon({ ten, moTa, soLuongTong, soLuongConLai, img });
        setVisible(true);
    };

    const dongChiTiet = () => {
        setVisible(false);
        setThietBiChon(null);
    };

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
            <div style={{ padding: '16px 36px' }}>
                <h3>Thiết bị điện tử</h3>
                <Space size={16} wrap>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Laptop', 'Laptop Dell Inspiron 15, phục vụ học tập và làm việc', 10, 6, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Laptop"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Laptop" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Máy chiếu', 'Máy chiếu Epson EB-X51, độ sáng 3800 lumens', 5, 3, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Máy chiếu"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Máy chiếu" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Máy in', 'Máy in HP LaserJet Pro, in đen trắng tốc độ cao', 4, 2, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Máy in"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Máy in" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Màn hình', 'Màn hình LCD 24 inch Full HD, cổng HDMI/VGA', 8, 5, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Màn hình"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Màn hình" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Máy tính bảng', 'iPad Air Gen 5, màn hình 10.9 inch', 6, 4, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Máy tính bảng"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Máy tính bảng" />
                    </Card>
                </Space>
            </div>
            <div style={{ padding: '16px 36px' }}>
                <h3>Thiết bị học tập</h3>
                <Space size={16} wrap>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Bảng trắng', 'Bảng trắng di động 120x80cm, có chân đế bánh xe', 6, 3, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Bảng trắng"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Bảng trắng" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Bút trình chiếu', 'Bút laser trình chiếu Logitech R400, kết nối USB', 12, 8, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Bút trình chiếu"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Bút trình chiếu" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Micro không dây', 'Micro không dây Shure SV100, tầm thu 30m', 8, 5, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Micro không dây"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Micro không dây" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Tai nghe', 'Tai nghe Sony WH-1000XM4, chống ồn chủ động', 15, 10, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Tai nghe"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Tai nghe" />
                    </Card>
                </Space>
            </div>
            <div style={{ padding: '16px 36px' }}>
                <h3>Thiết bị cơ sở vật chất</h3>
                <Space size={16} wrap>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Bàn gấp', 'Bàn gấp đa năng 120x60cm, chịu lực 50kg', 20, 12, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Bàn gấp"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Bàn gấp" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Ghế xếp', 'Ghế xếp inox có tựa lưng, gấp gọn tiện lợi', 30, 18, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Ghế xếp"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Ghế xếp" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Kệ trưng bày', 'Kệ trưng bày 3 tầng bằng gỗ, dùng cho triển lãm', 10, 7, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Kệ trưng bày"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Kệ trưng bày" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Tủ đựng đồ', 'Tủ locker 6 ngăn có khóa, chất liệu thép sơn tĩnh điện', 5, 2, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Tủ đựng đồ"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Tủ đựng đồ" />
                    </Card>
                </Space>
            </div>
            <div style={{ padding: '16px 36px' }}>
                <h3>Thiết bị tiện ích</h3>
                <Space size={16} wrap>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Quạt tích điện', 'Quạt sạc tích điện mini, hoạt động 8 tiếng', 10, 6, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Quạt tích điện"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Quạt tích điện" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Ổ cắm di động', 'Ổ cắm điện di động 6 lỗ có công tắc, dây dài 3m', 15, 9, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Ổ cắm di động"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Ổ cắm di động" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Đèn bàn', 'Đèn bàn LED chống cận, 3 chế độ sáng', 12, 7, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Đèn bàn"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Đèn bàn" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Sạc dự phòng', 'Sạc dự phòng Anker 10000mAh, sạc nhanh 18W', 20, 14, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Sạc dự phòng"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Sạc dự phòng" />
                    </Card>
                </Space>
            </div>
            <div style={{ padding: '16px 36px' }}>
                <h3>Thiết bị sự kiện và truyền thông</h3>
                <Space size={16} wrap>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Loa bluetooth', 'Loa JBL Charge 5, chống nước IPX7, pin 20 tiếng', 8, 4, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Loa bluetooth"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Loa bluetooth" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Máy ảnh', 'Máy ảnh Canon EOS 200D, lens kit 18-55mm', 3, 1, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Máy ảnh"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Máy ảnh" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Tripod', 'Chân máy tripod nhôm cao 1.7m, đầu xoay 360 độ', 6, 3, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Tripod"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Tripod" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 160 }}
                        onClick={() => moChiTiet('Đèn ring light', 'Đèn ring light 26cm có chân đế, 3 chế độ ánh sáng', 7, 5, 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png')}
                        cover={
                            <img
                                draggable={false}
                                alt="Đèn ring light"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                            />
                        }
                    >
                        <Meta title="Đèn ring light" />
                    </Card>
                </Space>
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
