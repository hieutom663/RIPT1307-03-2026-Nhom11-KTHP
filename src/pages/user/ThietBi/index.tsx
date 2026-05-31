import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Pagination, Select, Spin, message, Input, Row, Col, Typography } from 'antd'; 
import { useModel } from 'umi';
import { AppstoreOutlined } from '@ant-design/icons';
import { useFormMuon } from '../../../hooks/useFormMuon';

import ChiTietThietBi from './component/ChiTietThietBi';
import GuiYeuCauMuon from './component/GuiYeuCauMuon';
import { getDanhSachThietBiAPI } from '../../../services/ThietBi/api'; 

const { Meta } = Card;
const { Search } = Input; 
const { Title } = Typography;

const ThietBiCard = React.memo(({ thietBi, onClick }: { thietBi: any, onClick: (tb: any) => void }) => {
    return (
        <Card
            hoverable
            style={{ 
                borderRadius: '12px', 
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: 'none',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
            styles={{ body: { padding: '16px', flexGrow: 1 } }}
            onClick={() => onClick(thietBi)}
            cover={
                <div style={{ padding: '12px 12px 0 12px', backgroundColor: '#fff' }}>
                    <img
                        draggable={false}
                        alt={thietBi.ten_thiet_bi}
                        src={thietBi.img} 
                        loading="lazy" 
                        style={{ 
                            height: 160, 
                            width: '100%',
                            objectFit: 'cover', 
                            backgroundColor: '#f5f5f5',
                            borderRadius: '8px' 
                        }}
                    />
                </div>
            }
        >
            <Meta 
                title={<span style={{ fontSize: '15px', fontWeight: 600, color: '#262626' }}>{thietBi.ten_thiet_bi}</span>}
                description={<span style={{ color: '#8c8c8c', fontSize: '13px' }}>SL còn: <strong style={{ color: thietBi.soLuongConLai > 0 ? '#52c41a' : '#f5222d' }}>{thietBi.soLuongConLai || 0}</strong>/{thietBi.soLuongTong || 0}</span>}
            />
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
    const soThietBiMoiTrang = 12; 

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
            <div style={{ backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 120px)', padding: '24px' }}>

                <Title level={3} style={{ marginBottom: 24, marginTop: 0 }}>
                    <AppstoreOutlined style={{ marginRight: 12, color: '#1677ff' }} /> 
                    Danh sách thiết bị
                </Title>

                <div style={{ 
                    backgroundColor: '#fff', 
                    padding: '20px', 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex', 
                    gap: '16px', 
                    flexWrap: 'wrap',
                    marginBottom: '24px'
                }}>
                    <Search
                        placeholder="Nhập tên thiết bị cần tìm..."
                        allowClear
                        enterButton="Tìm kiếm"
                        onSearch={onSearch}
                        size="large"
                        style={{ maxWidth: 400, flexGrow: 1 }}
                    />
                    <Select
                        value={boLoc}
                        onChange={(giaTri) => { setBoLoc(giaTri); setTrangHienTai(1); }}
                        style={{ width: 250 }}
                        size="large"
                        options={danhMucOptions}
                    />
                </div>

                <Row gutter={[24, 24]}>
                    {danhSachThietBi.map((thietBi) => (
                        <Col xs={24} sm={12} md={8} lg={6} xl={4} key={thietBi.ma_thiet_bi}>
                            <ThietBiCard 
                                thietBi={thietBi} 
                                onClick={formMuon.moChiTiet} 
                            />
                        </Col>
                    ))}
                </Row>

                {danhSachThietBi.length > 0 && (
                    <div style={{ marginTop: '32px', textAlign: 'center' }}>
                        <Pagination
                            current={trangHienTai}
                            total={tongSoLuong} 
                            pageSize={soThietBiMoiTrang}
                            onChange={(trang) => setTrangHienTai(trang)}
                            showSizeChanger={false}
                        />
                    </div>
                )}

                {!loading && danhSachThietBi.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                        Không tìm thấy thiết bị nào phù hợp.
                    </div>
                )}

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