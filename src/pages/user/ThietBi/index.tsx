import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Space, Pagination, Select, Spin, message, Input } from 'antd'; 
import { useModel } from 'umi';

import { useFormMuon } from '../../../hooks/useFormMuon';

import ChiTietThietBi from './component/ChiTietThietBi';
import GuiYeuCauMuon from './component/GuiYeuCauMuon';
import { getDanhSachThietBiAPI } from '../../../services/ThietBi/api'; 

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

    const formMuon = useFormMuon();

    const [danhSachThietBi, setDanhSachThietBi] = useState<any[]>([]);
    const [tongSoLuong, setTongSoLuong] = useState(0); 
    const [loading, setLoading] = useState(false);
    const [trangHienTai, setTrangHienTai] = useState(1);
    const [boLoc, setBoLoc] = useState('tat-ca');
    const [tuKhoa, setTuKhoa] = useState(''); 
    const soThietBiMoiTrang = 10;

    const fetchDanhSachThietBi = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getDanhSachThietBiAPI({
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
                                onClick={formMuon.moChiTiet} 
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
                    visible={formMuon.visible}
                    thietBi={formMuon.thietBiChon}
                    onClose={formMuon.dongChiTiet}
                    onMuonNgay={formMuon.moFormMuon}
                />

                <GuiYeuCauMuon
                    visible={formMuon.muonVisible}
                    thietBi={formMuon.thietBiChon}
                    soLuongMuon={formMuon.soLuongMuon}
                    ngayMuon={formMuon.ngayMuon}
                    ngayTra={formMuon.ngayTra}
                    lyDo={formMuon.lyDo}
                    onChangeSoLuongMuon={formMuon.handleChangeSoLuongMuon}
                    onChangeNgayMuon={formMuon.handleChangeNgayMuon}
                    onChangeNgayTra={formMuon.handleChangeNgayTra}
                    onChangeLyDo={formMuon.handleChangeLyDo}
                    onClose={formMuon.dongFormMuon}
                    onSuccess={fetchDanhSachThietBi} 
                />
            </div>
        </Spin>
    );
}

export default ThietBi;