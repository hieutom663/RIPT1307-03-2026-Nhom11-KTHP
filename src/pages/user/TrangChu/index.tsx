import React, { useState, useEffect } from 'react';
import { Row, Col, Image, Button, Card, Spin } from 'antd';
import { Link } from 'umi';
import banner from '../../../assets/banner.jpg';
import { getThietBiPhoBienAPI, getThietBiSanAPI } from '../../../services/ThietBi/api'; 
import { getLichSuCaNhanAPI } from '../../../services/LichSuMuon/api'; 

import { useFormMuon } from '../../../hooks/useFormMuon'; 
import ChiTietThietBi from '../ThietBi/component/ChiTietThietBi'; 
import GuiYeuCauMuon from '../ThietBi/component/GuiYeuCauMuon';

const { Meta } = Card;

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
        gap: '16px',
        overflowX: 'auto',
        paddingBottom: '16px', 
        scrollBehavior: 'smooth',
        scrollbarWidth: 'thin', 
    };

    const HomeCard = ({ item }: { item: any }) => (
        <Card
            hoverable
            onClick={() => formMuon.moChiTiet(item)}
            style={{ width: 160, minWidth: 160, transform: 'translateZ(0)' }} 
            cover={
                <img
                    draggable={false}
                    alt={item.ten_thiet_bi}
                    src={item.img}
                    loading="lazy"
                    style={{ height: 140, objectFit: 'cover', backgroundColor: '#f0f0f0' }}
                />
            }
        >
            <Meta title={item.ten_thiet_bi} />
        </Card>
    );

    return (
        <Spin spinning={loading} description="Đang tải dữ liệu...">
            <div>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={12}>
                        <div className="banner" style={{ padding: '24px 68px' }}>
                            <div style={{ fontSize: 20, marginBottom: 16 }}>
                                <strong>Chào mừng {ten} đến với</strong><br />
                                <strong> PTIT Borrow! </strong>
                            </div>
                            <div>Hệ thống mượn đồ dùng nhanh chóng, dễ dàng cho các hoạt động của bạn.</div>
                            <Link to={'/user/thiet-bi'}>
                                <Button type="primary" style={{ borderRadius: 8, marginTop: 16 }}>
                                    Xem Danh mục Đồ dùng
                                </Button>
                            </Link>
                        </div>
                    </Col>
                    <Col span={12}>
                        <Image src={banner} preview={false} style={{ objectFit: 'cover', width: '100%', borderRadius: '0 0 0 16px' }} />
                    </Col>
                </Row>

                <div style={{ padding: '16px 36px' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Danh mục phổ biến</h3>
                    <div style={scrollContainerStyle}>
                        {thietBiPhoBien.length > 0 ? (
                            thietBiPhoBien.map(tb => <HomeCard key={tb.ma_thiet_bi} item={tb} />)
                        ) : (
                            <div style={{ color: '#888' }}>Chưa có dữ liệu thiết bị phổ biến.</div>
                        )}
                    </div>
                </div>

                <div style={{ padding: '16px 36px' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Đồ dùng sẵn trong kho</h3>
                    
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                        <div style={{ ...scrollContainerStyle, flex: 1 }}>
                            {thietBiSan.length > 0 ? (
                                thietBiSan.map(tb => <HomeCard key={tb.ma_thiet_bi} item={tb} />)
                            ) : (
                                <div style={{ color: '#888' }}>Hiện tại không có thiết bị nào sẵn sàng.</div>
                            )}
                        </div>
                        
                        {/* THAY ĐỔI DỮ LIỆU ĐỘNG TẠI ĐÂY */}
                        <Card 
                            title="Hoạt động của tôi" 
                            variant='borderless'
                            style={{ width: 300, minWidth: 300, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                        >
                            <p style={{ margin: 0, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                                Đang chờ duyệt: <strong style={{ color: '#faad14' }}>{thongKe.choXuLy}</strong> yêu cầu
                            </p>
                            <p style={{ margin: 0, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                                Đang mượn: <strong style={{ color: '#1677ff' }}>{thongKe.dangMuon}</strong> thiết bị
                            </p>
                            <p style={{ margin: 0, padding: '8px 0' }}>
                                Đến / Quá hạn: <strong style={{ color: thongKe.quaHan > 0 ? '#ff4d4f' : 'inherit' }}>{thongKe.quaHan}</strong> thiết bị
                            </p>
                            <Link to={'/user/lich-su-muon'} style={{ display: 'block', textAlign: 'right', marginTop: 8 }}>
                                <u>Xem tất cả</u>
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