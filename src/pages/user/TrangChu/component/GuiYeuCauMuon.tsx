import { Modal, InputNumber, DatePicker, Input, Button, message } from 'antd';
import { useState } from 'react';
import { guiDonMuonThietBi } from '../../../../services/YeuCauMuon/api'; 

const GuiYeuCauMuon = (props: any) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!props.thietBi) {
        return null;
    }

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
            title={'Yêu cầu mượn: ' + props.thietBi.ten_thiet_bi}
            open={props.visible}
            onCancel={props.onClose}
            footer={null}
            width={500}
        >
            <div style={{ marginBottom: 12 }}>
                <strong>Thiết bị:</strong> {props.thietBi.ten_thiet_bi}
            </div>
            <div style={{ marginBottom: 12 }}>
                <strong>Số lượng còn lại:</strong> {props.thietBi.soLuongConLai}
            </div>
            <div style={{ marginBottom: 12 }}>
                <div>Số lượng mượn:</div>
                <InputNumber
                    value={props.soLuongMuon}
                    onChange={(giaTri) => props.onChangeSoLuongMuon(giaTri)}
                    min={1}
                    max={props.thietBi.soLuongConLai}
                    style={{ width: '100%' }}
                />
            </div>
            <div style={{ marginBottom: 12 }}>
                <div>Ngày mượn:</div>
                <DatePicker
                    value={props.ngayMuon}
                    onChange={(ngay) => props.onChangeNgayMuon(ngay)}
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                />
            </div>
            <div style={{ marginBottom: 12 }}>
                <div>Ngày trả:</div>
                <DatePicker
                    value={props.ngayTra}
                    onChange={(ngay) => props.onChangeNgayTra(ngay)}
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                />
            </div>
            <div style={{ marginBottom: 16 }}>
                <div>Lý do mượn / Mục đích sử dụng:</div>
                <Input.TextArea
                    value={props.lyDo}
                    onChange={(e) => props.onChangeLyDo(e.target.value)}
                    rows={3}
                    placeholder="Nhập chi tiết mục đích sử dụng..."
                />
            </div>
            <div style={{ textAlign: 'right' }}>
                <Button 
                    onClick={props.onClose} 
                    style={{ marginRight: 8 }}
                    disabled={isSubmitting}
                >
                    Hủy
                </Button>
                <Button 
                    type="primary" 
                    onClick={xuLyGuiYeuCau} 
                    loading={isSubmitting}
                >
                    Xác nhận gửi
                </Button>
            </div>
        </Modal>
    );
};

export default GuiYeuCauMuon;