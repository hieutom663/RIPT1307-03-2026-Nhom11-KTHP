import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Pagination, Select, Spin, message, Input, Row, Col, Typography, Badge, ConfigProvider, Button } from 'antd'; 
import { useModel } from 'umi';
import { AppstoreOutlined, SearchOutlined } from '@ant-design/icons';
import { useFormMuon } from '../../../hooks/useFormMuon';

import ChiTietThietBi from './components/ChiTietThietBi';
import GuiYeuCauMuon from './components/GuiYeuCauMuon';
import { getDanhSachThietBiAPI } from '../../../services/ThietBi/api'; 

const { Search } = Input; 
const { Title, Text, Paragraph } = Typography;

const ThietBiCard = React.memo(({ thietBi, onClick }: { thietBi: any, onClick: (tb: any) => void }) => {
    const isAvailable = thietBi.soLuongConLai > 0;

    return (
        <Card
            hoverable
            style={{ 
                borderRadius: '16px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                border: '1px solid #f0f0f0',
                width: '100%',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease'
            }}
            styles={{ body: { padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } }}
            onClick={() => onClick(thietBi)}
            cover={
                <Badge.Ribbon 
                    text={isAvailable ? 'Còn hàng' : 'Hết hàng'} 
                    color={isAvailable ? 'green' : 'red'}
                    style={{ top: 16, right: -8, zIndex: 2 }} 
                >
                    <div style={{ padding: '16px 16px 0 16px', backgroundColor: 'transparent', position: 'relative' }}>
                        <img
                            draggable={false}
                            alt={thietBi.ten_thiet_bi}
                            src={thietBi.img} 
                            loading="lazy" 
                            style={{ 
                                height: 160, 
                                width: '100%',
                                objectFit: 'contain',
                                backgroundColor: '#f9f9f9',
                                borderRadius: '8px' 
                            }}
                        />
                    </div>
                </Badge.Ribbon>
            }
        >
            <div style={{ flexGrow: 1, marginBottom: 12 }}>
                <Paragraph 
                    strong 
                    ellipsis={{ rows: 2, tooltip: thietBi.ten_thiet_bi }} 
                    style={{ fontSize: '15px', color: '#262626', margin: 0, lineHeight: 1.4, minHeight: '42px' }}
                >
                    {thietBi.ten_thiet_bi}
                </Paragraph>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #e8e8e8', paddingTop: 12 }}>
                <Text type="secondary" style={{ fontSize: '13px' }}>Số lượng:</Text>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>
                    <span style={{ color: isAvailable ? '#52c41a' : '#f5222d' }}>{thietBi.soLuongConLai || 0}</span> 
                    <span style={{ color: '#bfbfbf', margin: '0 4px' }}>/</span> 
                    <span style={{ color: '#595959' }}>{thietBi.soLuongTong || 0}</span>
                </span>
            </div>
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
            <div style={{ backgroundColor: '#f5f7fa', minHeight: 'calc(100vh - 120px)', padding: '20px' }}>

                <div style={{ marginBottom: 32 }}>
                    <Title level={3} style={{ margin: 0, color: '#262626', display: 'flex', alignItems: 'center' }}>
                        <AppstoreOutlined style={{ marginRight: 12, color: '#cf1322' }} /> 
                        Kho Thiết Bị
                    </Title>
                    <Text type="secondary">Tìm kiếm và gửi yêu cầu mượn các thiết bị phục vụ học tập, sự kiện.</Text>
                </div>

                <div style={{ 
                    backgroundColor: '#fff', 
                    padding: '24px', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    display: 'flex', 
                    gap: '16px', 
                    flexWrap: 'wrap',
                    marginBottom: '32px'
                }}>
                    <Search
                        placeholder="Nhập tên thiết bị bạn muốn mượn..."
                        allowClear
                        enterButton={<Button type="primary" style={{ backgroundColor: '#cf1322' }} icon={<SearchOutlined />}>Tìm kiếm</Button>}
                        onSearch={onSearch}
                        size="large"
                        style={{ maxWidth: 500, flexGrow: 1 }}
                    />
                    <Select
                        value={boLoc}
                        onChange={(giaTri) => { setBoLoc(giaTri); setTrangHienTai(1); }}
                        style={{ width: 280 }}
                        size="large"
                        options={danhMucOptions}
                        popupMatchSelectWidth={false}
                    />
                </div>

                <Row gutter={[24, 24]}>
                    {danhSachThietBi.map((thietBi) => (
                        <Col xs={24} sm={12} md={8} lg={6} xl={4} key={thietBi.ma_thiet_bi} style={{ display: 'flex', flexDirection: 'column' }}>
                            <ThietBiCard 
                                thietBi={thietBi} 
                                onClick={formMuon.moChiTiet} 
                            />
                        </Col>
                    ))}
                </Row>

                {danhSachThietBi.length > 0 && (
                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                        {/* Đã bọc ConfigProvider để đổi màu Pagination sang Đỏ PTIT */}
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorPrimary: '#cf1322',
                                },
                            }}
                        >
                            <Pagination
                                current={trangHienTai}
                                total={tongSoLuong} 
                                pageSize={soThietBiMoiTrang}
                                onChange={(trang) => setTrangHienTai(trang)}
                                showSizeChanger={false}
                                style={{ 
                                    display: 'inline-block', 
                                    backgroundColor: '#fff', 
                                    padding: '12px 24px', 
                                    borderRadius: '100px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                }}
                            />
                        </ConfigProvider>
                    </div>
                )}

                {!loading && danhSachThietBi.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <img src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" alt="empty" style={{ height: 120, opacity: 0.6 }} />
                        <div style={{ marginTop: 16, color: '#8c8c8c', fontSize: 16 }}>
                            Opps! Không tìm thấy thiết bị nào phù hợp với từ khóa của bạn.
                        </div>
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