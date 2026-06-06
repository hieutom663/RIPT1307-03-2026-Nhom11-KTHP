import { Modal, InputNumber, DatePicker, Input, Button, message, Typography, Row, Col } from 'antd';
import { useState } from 'react';
import { guiDonMuonThietBi } from '../../../../services/YeuCauMuon/api'; 

const { Text } = Typography;

const GuiYeuCauMuon = (props: any) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!props.thietBi) {
        return null;
    }

    const soLuongConLai = props.thietBi.soLuongConLai !== undefined ? props.thietBi.soLuongConLai : (props.thietBi.so_luong_con_lai || 0);

    const xuLyGuiYeuCau = async () => {
        if (!props.soLuongMuon || props.soLuongMuon <= 0) {
            message.error('Vui lòng nhập số lượng mượn hợp lệ');
            return;
        }
        if (!props.ngayMuon) {
            message.error('Vui lòng chọn ngày mượn');
            return;
        }
        if (!props.ngayTra) {
            message.error('Vui lòng chọn ngày trả');
            return;
        }
        if (props.ngayTra.isBefore(props.ngayMuon, 'day')) {
            message.error('Ngày trả phải từ ngày mượn trở đi');
            return;
        }
        if (!props.lyDo || props.lyDo.trim() === '') {
            message.error('Vui lòng nhập lý do mượn');
            return;
        }

        setIsSubmitting(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const ma_sv = userInfo.ma_sv; 

            const payload = {
                ma_thiet_bi: props.thietBi.ma_thiet_bi,
                so_luong_muon: props.soLuongMuon,
                ngay_muon: props.ngayMuon.format('YYYY-MM-DD'),
                ngay_tra: props.ngayTra.format('YYYY-MM-DD'),
                ly_do: props.lyDo,
                ma_sv: ma_sv
            };

            const response = await guiDonMuonThietBi(payload);

            if (response.data.success) {
                message.success(response.data.message || 'Đã gửi yêu cầu mượn thành công!');
                
                if (props.onSuccess) {
                    props.onSuccess();
                }
                props.onClose(); 
            } else {
                message.error(response.data.message || 'Mượn thất bại, vui lòng thử lại!');
            }
        } catch (error) {
            console.error("Lỗi: ", error);
            message.error('Lỗi kết nối đến máy chủ Backend!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            title={<span style={{ fontSize: '18px' }}>Lập phiếu mượn thiết bị</span>}
            open={props.visible}
            onCancel={props.onClose}
            footer={null}
            width={550}
            centered 
        >
            <div style={{ 
                backgroundColor: '#f0f5ff', 
                border: '1px solid #adc6ff', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                marginBottom: '24px',
                marginTop: '12px'
            }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#1d39c4', marginBottom: 6 }}>
                    {props.thietBi.ten_thiet_bi}
                </div>
                <div>
                    <Text type="secondary">Số lượng sẵn sàng: </Text>
                    <Text strong style={{ color: soLuongConLai > 0 ? '#52c41a' : '#f5222d', fontSize: '16px' }}>
                        {soLuongConLai}
                    </Text>
                </div>
            </div>

            <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>Số lượng mượn: <span style={{ color: '#f5222d' }}>*</span></div>
                <InputNumber
                    size="large" 
                    value={props.soLuongMuon}
                    onChange={(giaTri) => props.onChangeSoLuongMuon(giaTri)}
                    min={1}
                    max={soLuongConLai}
                    style={{ width: '100%', borderRadius: '6px' }}
                />
            </div>

            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                    <div style={{ marginBottom: 8, fontWeight: 500 }}>Ngày mượn: <span style={{ color: '#f5222d' }}>*</span></div>
                    <DatePicker
                        size="large"
                        value={props.ngayMuon}
                        onChange={(ngay) => props.onChangeNgayMuon(ngay)}
                        style={{ width: '100%', borderRadius: '6px' }}
                        format="DD/MM/YYYY"
                    />
                </Col>
                <Col span={12}>
                    <div style={{ marginBottom: 8, fontWeight: 500 }}>Ngày trả: <span style={{ color: '#f5222d' }}>*</span></div>
                    <DatePicker
                        size="large"
                        value={props.ngayTra}
                        onChange={(ngay) => props.onChangeNgayTra(ngay)}
                        style={{ width: '100%', borderRadius: '6px' }}
                        format="DD/MM/YYYY"
                    />
                </Col>
            </Row>

            <div style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>Lý do mượn / Mục đích sử dụng: <span style={{ color: '#f5222d' }}>*</span></div>
                <Input.TextArea
                    value={props.lyDo}
                    onChange={(e) => props.onChangeLyDo(e.target.value)}
                    rows={4}
                    placeholder="Vui lòng mô tả chi tiết mục đích sử dụng để hệ thống phê duyệt nhanh hơn..."
                    style={{ borderRadius: '6px' }}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <Button 
                    size="large"
                    onClick={props.onClose} 
                    disabled={isSubmitting}
                >
                    Hủy bỏ
                </Button>
                <Button 
                    type="primary" 
                    size="large"
                    onClick={xuLyGuiYeuCau} 
                    loading={isSubmitting}
                >
                    Xác nhận gửi yêu cầu
                </Button>
            </div>
        </Modal>
    );
};

export default GuiYeuCauMuon;