import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Row, Col, Card, Space, Pagination, Select, Spin, message, Input } from 'antd'; 
import { useModel } from 'umi';
import ChiTietThietBi from './component/ChiTietThietBi';
import GuiYeuCauMuon from './component/GuiYeuCauMuon';
import { getDanhSachThietBi } from '../../../services/ThietBi/api'; 

const { Meta } = Card;
const { Search } = Input; 

const ThietBiCard = React.memo(({ thietBi, onClick }: { thietBi: any, onClick: (tb: any) => void }) => {
    return (
        <Card
            hoverable
            style={{ width: 160, transform: 'translateZ(0)', willChange: 'transform, box-shadow' }}
            onClick={() => onClick(thietBi)}
            cover={
                <img
                    draggable={false}
                    alt={thietBi.ten_thiet_bi}
                    src={thietBi.img} 
                    loading="lazy" 
                    style={{ height: 140, objectFit: 'cover', backgroundColor: '#f0f0f0' }}
                />
            }
        >
            <Meta title={thietBi.ten_thiet_bi} />
        </Card>
    );
});

const ThietBi = () => {
    const { danhSachDanhMuc } = useModel('danhMuc');

    const [danhSachThietBi, setDanhSachThietBi] = useState<any[]>([]);
    const [tongSoLuong, setTongSoLuong] = useState(0); 
    const [loading, setLoading] = useState(false);

    const [visible, setVisible] = useState(false);
    const [thietBiChon, setThietBiChon] = useState(null);
    const [trangHienTai, setTrangHienTai] = useState(1);
    const [boLoc, setBoLoc] = useState('tat-ca');
    const [tuKhoa, setTuKhoa] = useState(''); 
    const soThietBiMoiTrang = 10;

    const [muonVisible, setMuonVisible] = useState(false);
    const [soLuongMuon, setSoLuongMuon] = useState(1);
    const [ngayMuon, setNgayMuon] = useState(null);
    const [ngayTra, setNgayTra] = useState(null);
    const [lyDo, setLyDo] = useState('');

    const fetchDanhSachThietBi = useCallback(async () => {
        setLoading(true);
        try {

            const response = await getDanhSachThietBi({
                danhMuc: boLoc, 
                tuKhoa: tuKhoa, 
                page: trangHienTai,
                limit: soThietBiMoiTrang
            });
            
            if (response.data.success) {
                setDanhSachThietBi(response.data.data); 
                setTongSoLuong(response.data.total);  
            } else {
                message.error('Không thể lấy dữ liệu thiết bị từ hệ thống');
            }
        } catch (error) {
            console.error("Lỗi gọi API ThietBi:", error);
            message.error('Lỗi kết nối đến máy chủ Backend!');
        } finally {
            setLoading(false);
        }
    }, [boLoc, tuKhoa, trangHienTai]);

    useEffect(() => {
        fetchDanhSachThietBi();
    }, [fetchDanhSachThietBi]);

    const danhMucOptions = useMemo(() => {
        return [
            { value: 'tat-ca', label: 'Tất cả thiết bị' },
            ...danhSachDanhMuc.map((dm: any) => ({
                value: dm.ma_danh_muc, 
                label: dm.ten_danh_muc
            }))
        ];
    }, [danhSachDanhMuc]);

    const moChiTiet = useCallback((thietBi: any) => {
        setThietBiChon(thietBi);
        setVisible(true);
    }, []);

    const dongChiTiet = useCallback(() => {
        setVisible(false);
        setThietBiChon(null);
    }, []);

    const moFormMuon = useCallback(() => {
        setVisible(false);
        setSoLuongMuon(1);
        setNgayMuon(null);
        setNgayTra(null);
        setLyDo('');
        setMuonVisible(true);
    }, []);

    const dongFormMuon = useCallback(() => {
        setMuonVisible(false);
    }, []);

    const handleChangeSoLuongMuon = useCallback((giaTri: any) => setSoLuongMuon(giaTri), []);
    const handleChangeNgayMuon = useCallback((ngay: any) => setNgayMuon(ngay), []);
    const handleChangeNgayTra = useCallback((ngay: any) => setNgayTra(ngay), []);
    const handleChangeLyDo = useCallback((giaTri: any) => setLyDo(giaTri), []);

    const onSearch = (value: string) => {
        setTuKhoa(value);
        setTrangHienTai(1); 
    };

    return (
        <Spin spinning={loading} description="Đang tải danh sách thiết bị...">
            <div>
                <div style={{ padding: '24px 40px 16px 40px' }}>
                    <div style={{ fontSize: 20 }}>
                        <strong>Danh sách thiết bị</strong> 
                     </div>
                </div>

                {/* KHU VỰC TÌM KIẾM & BỘ LỌC */}
                <div style={{ padding: '0 36px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <Search
                        placeholder="Nhập tên thiết bị cần tìm..."
                        allowClear
                        enterButton="Tìm kiếm"
                        onSearch={onSearch}
                        style={{ maxWidth: 400 }}
                    />
                    <Select
                        value={boLoc}
                        onChange={(giaTri) => { setBoLoc(giaTri); setTrangHienTai(1); }}
                        style={{ width: 200 }}
                        options={danhMucOptions}
                    />
                </div>

                <div style={{ padding: '16px 36px' }}>
                    <Space size={16} wrap>
                        {danhSachThietBi.map((thietBi) => (
                            <ThietBiCard 
                                key={thietBi.ma_thiet_bi} 
                                thietBi={thietBi} 
                                onClick={moChiTiet} 
                            />
                        ))}
                    </Space>
                </div>

                <div style={{ padding: '16px 36px', textAlign: 'center' }}>
                    <Pagination
                        current={trangHienTai}
                        total={tongSoLuong} 
                        pageSize={soThietBiMoiTrang}
                        onChange={(trang) => setTrangHienTai(trang)}
                        showSizeChanger={false}
                    />
                </div>

                <ChiTietThietBi
                    visible={visible}
                    thietBi={thietBiChon}
                    onClose={dongChiTiet}
                    onMuonNgay={moFormMuon}
                />

                <GuiYeuCauMuon
                    visible={muonVisible}
                    thietBi={thietBiChon}
                    soLuongMuon={soLuongMuon}
                    ngayMuon={ngayMuon}
                    ngayTra={ngayTra}
                    lyDo={lyDo}
                    onChangeSoLuongMuon={handleChangeSoLuongMuon}
                    onChangeNgayMuon={handleChangeNgayMuon}
                    onChangeNgayTra={handleChangeNgayTra}
                    onChangeLyDo={handleChangeLyDo}
                    onClose={dongFormMuon}
                    onSuccess={fetchDanhSachThietBi} 
                />
            </div>
        </Spin>
    );
}

export default ThietBi;