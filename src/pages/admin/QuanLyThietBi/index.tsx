import { Row, Col, Table, Button, message, Popconfirm } from 'antd';
import { useState, useEffect } from 'react';
import BoLocThietBi from './component/BoLocThietBi';
import ThemSuaThietBi from './component/ThemSuaThietBi';
import { layDanhSachThietBiAdmin, themThietBiAPI, suaThietBiAPI, xoaThietBiAPI } from '../../../services/QuanLyThietBi/api';

const QuanLyThietBi = () => {
    const [danhSach, setDanhSach] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [dangSua, setDangSua] = useState(null);
    const [boLoc, setBoLoc] = useState('tat-ca');
    const [dangTai, setDangTai] = useState(false);

    const [ten, setTen] = useState('');
    const [moTa, setMoTa] = useState('');
    const [soLuongTong, setSoLuongTong] = useState(0);
    const [soLuongConLai, setSoLuongConLai] = useState(0);
    const [loai, setLoai] = useState('dien-tu');
    const [img, setImg] = useState('https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png');

    const layDuLieu = async () => {
        setDangTai(true);
        try {
            const response = await layDanhSachThietBiAdmin(1, 100);
            if (response.data.success) {
                const duLieu = response.data.data.map((tb: any) => ({
                    key: tb.ma_thiet_bi,
                    ten: tb.ten_thiet_bi,
                    moTa: tb.moTa,
                    soLuongTong: tb.soLuongTong,
                    soLuongConLai: tb.soLuongConLai,
                    loai: tb.id_danhmuc,
                    img: tb.img,
                }));
                setDanhSach(duLieu);
            }
        } catch (error) {
            console.error('Lỗi lấy dữ liệu:', error);
            message.error('Không thể lấy dữ liệu từ server');
        }
        setDangTai(false);
    };

    useEffect(() => {
        layDuLieu();
    }, []);

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

    const luuThietBi = async (duLieu: any) => {
        if (!duLieu.ten) {
            message.error('Vui lòng nhập tên thiết bị');
            return;
        }
        try {
            if (dangSua) {
                // Sửa thiết bị
                await suaThietBiAPI((dangSua as any).key, {
                    ten_thiet_bi: duLieu.ten,
                    mo_ta: duLieu.moTa,
                    tong_so_luong: duLieu.soLuongTong,
                    so_luong_con_lai: duLieu.soLuongConLai,
                    id_danhmuc: duLieu.loai,
                    hinh_anh: duLieu.img,
                });
                message.success('Đã cập nhật thiết bị');
            } else {
                // Thêm thiết bị mới
                await themThietBiAPI({
                    ten_thiet_bi: duLieu.ten,
                    mo_ta: duLieu.moTa,
                    tong_so_luong: duLieu.soLuongTong,
                    so_luong_con_lai: duLieu.soLuongConLai,
                    id_danhmuc: duLieu.loai,
                    hinh_anh: duLieu.img,
                });
                message.success('Đã thêm thiết bị mới');
            }
            setModalVisible(false);
            layDuLieu(); // Tải lại danh sách
        } catch (error) {
            console.error('Lỗi lưu:', error);
            message.error('Lỗi khi lưu thiết bị');
        }
    };

    const xoaThietBi = async (key: any) => {
        try {
            await xoaThietBiAPI(key);
            message.success('Đã xóa thiết bị');
            layDuLieu(); // Tải lại danh sách
        } catch (error) {
            console.error('Lỗi xóa:', error);
            message.error('Lỗi khi xóa thiết bị');
        }
    };

    const danhSachLoc = boLoc === 'tat-ca'
        ? danhSach
        : danhSach.filter((tb: any) => tb.loai === boLoc);

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
                    loading={dangTai}
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
