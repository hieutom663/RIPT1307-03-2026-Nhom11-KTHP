import React, { useState, useEffect } from 'react';
import { Row, Col, Image, Button, Card, Spin, Typography } from 'antd';
import { Link } from 'umi';
import { 
    FireTwoTone, 
    AppstoreTwoTone, 
    ClockCircleOutlined, 
    SyncOutlined, 
    WarningOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import banner from '../../../assets/banner.jpg';
import { getThietBiPhoBienAPI, getThietBiSanAPI } from '../../../services/ThietBi/api'; 
import { getLichSuCaNhanAPI } from '../../../services/LichSuMuon/api'; 

import { useFormMuon } from '../../../hooks/useFormMuon'; 
import ChiTietThietBi from '../ThietBi/component/ChiTietThietBi'; 
import GuiYeuCauMuon from '../ThietBi/component/GuiYeuCauMuon';

const { Meta } = Card;
const { Title, Text } = Typography;

const TrangChu = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const ten = userInfo.ho_ten || userInfo.ten || 'Bạn';
    const ma_sv = userInfo.ma_sv;

    const formMuon = useFormMuon();

    const [thietBiPhoBien, setThietBiPhoBien] = useState<any[]>([]);
    const [thietBiSan, setThietBiSan] = useState<any[]>([]);
    const [thongKe, setThongKe] = useState({ choXuLy: 0, dangMuon: 0, quaHan: 0, daTra: 0 });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resPhoBien, resSan, resThongKe] = await Promise.all([
                getThietBiPhoBienAPI(),
                getThietBiSanAPI(),
                ma_sv ? getLichSuCaNhanAPI(ma_sv) : Promise.resolve({ data: { success: false } })
            ]);

            if (resPhoBien.data?.success) setThietBiPhoBien(resPhoBien.data.data);
            if (resSan.data?.success) setThietBiSan(resSan.data.data);
            if (resThongKe.data?.success) setThongKe(resThongKe.data.data);
            
        } catch (error) {
            console.error("Lỗi tải dữ liệu trang chủ:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const scrollContainerStyle: React.CSSProperties = {
        display: 'flex',
        gap: '20px',
        overflowX: 'auto',
        paddingBottom: '16px', 
        paddingTop: '8px',
        paddingLeft: '4px',
        scrollBehavior: 'smooth',
        scrollbarWidth: 'thin', 
    };

    const HomeCard = ({ item }: { item: any }) => (
        <Card
            hoverable
            onClick={() => formMuon.moChiTiet(item)}
            style={{ 
                width: 180, 
                minWidth: 180, 
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }} 
            styles={{ body: { padding: '12px 16px' } }}
            cover={
                <div style={{ padding: '12px 12px 0 12px' }}>
                    <img
                        draggable={false}
                        alt={item.ten_thiet_bi}
                        src={item.img}
                        loading="lazy"
                        style={{ 
                            height: 140, 
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
                title={<span style={{ fontSize: '15px', fontWeight: 600, color: '#262626' }}>{item.ten_thiet_bi}</span>} 
            />
        </Card>
    );

    return (
        <Spin spinning={loading} description="Đang tải...">
            <div style={{ padding: '12px 18px', backgroundColor: '#f5f7fa', minHeight: 'calc(100vh - 64px)' }}>
                
                <div style={{ 
                    background: 'linear-gradient(135deg, #fff1f0 0%, #ffffff 100%)', 
                    borderRadius: '20px', 
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                    marginBottom: '40px'
                }}>
                    <Row align="middle">
                        <Col xs={24} md={12}>
                            <div className="banner" style={{ padding: '40px 68px' }}>
                                <Title level={2} style={{ color: '#cf1322', marginBottom: 16, lineHeight: 1.3 }}>
                                    Chào mừng {ten} <br/>đến với PTIT Borrow!
                                </Title>
                                <Text style={{ fontSize: '16px', color: '#595959', display: 'block', marginBottom: '24px' }}>
                                    Hệ thống mượn đồ dùng nhanh chóng, dễ dàng cho các hoạt động và sự kiện của bạn tại trường.
                                </Text>
                                <Link to={'/user/thiet-bi'}>
                                    <Button type="primary" size="large" icon={<ArrowRightOutlined />} style={{ backgroundColor: '#cf1322', borderColor: '#cf1322', borderRadius: 8, fontWeight: 500 }}>
                                        Khám phá đồ dùng ngay
                                    </Button>
                                </Link>
                            </div>
                        </Col>
                        <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                            <Image 
                                src={banner} 
                                preview={false} 
                                style={{ 
                                    objectFit: 'cover', 
                                    width: '100%', 
                                    height: '100%', 
                                    maxHeight: '350px',
                                    borderTopLeftRadius: '100px'
                                }} 
                            />
                        </Col>
                    </Row>
                </div>

                <div style={{ marginBottom: '40px' }}>
                    <Title level={4} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                        <FireTwoTone twoToneColor="#ff7875" style={{ fontSize: '24px', marginRight: '8px' }} /> 
                        Đang được mượn nhiều nhất
                    </Title>
                    <div style={scrollContainerStyle}>
                        {thietBiPhoBien.length > 0 ? (
                            thietBiPhoBien.map(tb => <HomeCard key={tb.ma_thiet_bi} item={tb} />)
                        ) : (
                            <Text type="secondary">Chưa có dữ liệu thiết bị phổ biến.</Text>
                        )}
                    </div>
                </div>

                <div>
                    <Title level={4} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                        <AppstoreTwoTone twoToneColor="#52c41a" style={{ fontSize: '24px', marginRight: '8px' }} />
                        Sẵn sàng cho mượn
                    </Title>
                    
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div style={{ ...scrollContainerStyle, flex: 1, minWidth: '60%' }}>
                            {thietBiSan.length > 0 ? (
                                thietBiSan.map(tb => <HomeCard key={tb.ma_thiet_bi} item={tb} />)
                            ) : (
                                <Text type="secondary">Hiện tại không có thiết bị nào sẵn sàng.</Text>
                            )}
                        </div>
                        
                        <Card 
                            title={<span style={{ fontWeight: 600, fontSize: '16px' }}>Hoạt động của tôi</span>} 
                            style={{ 
                                width: 320, 
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                            }}
                            styles={{ header: { borderBottom: '1px solid #f0f0f0' }, body: { padding: '16px 24px' } }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                                <ClockCircleOutlined style={{ fontSize: 20, color: '#faad14', marginRight: 12 }} />
                                <Text style={{ flex: 1, fontSize: '15px' }}>Đang chờ duyệt:</Text>
                                <strong style={{ fontSize: '16px', color: '#faad14' }}>{thongKe.choXuLy}</strong>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                                <SyncOutlined spin style={{ fontSize: 20, color: '#1677ff', marginRight: 12 }} />
                                <Text style={{ flex: 1, fontSize: '15px' }}>Đang mượn:</Text>
                                <strong style={{ fontSize: '16px', color: '#1677ff' }}>{thongKe.dangMuon}</strong>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                                <WarningOutlined style={{ fontSize: 20, color: thongKe.quaHan > 0 ? '#ff7875' : '#d9d9d9', marginRight: 12 }} />
                                <Text style={{ flex: 1, fontSize: '15px' }}>Đến / Quá hạn:</Text>
                                <strong style={{ fontSize: '16px', color: thongKe.quaHan > 0 ? '#ff7875' : '#8c8c8c' }}>{thongKe.quaHan}</strong>
                            </div>

                            <Link to={'/user/lich-su-muon'}>
                                <Button block type="dashed" danger style={{ borderRadius: '8px' }}>
                                    Quản lý chi tiết
                                </Button>
                            </Link>
                        </Card>
                    </div>
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
                    onSuccess={fetchData}
                />
            </div>
        </Spin>
    );
}

export default TrangChu;