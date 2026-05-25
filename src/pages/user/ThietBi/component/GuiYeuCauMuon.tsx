import { Modal, InputNumber, DatePicker, Input, Button, message } from 'antd';

const GuiYeuCauMuon = (props: any) => {
    if (!props.thietBi) {
        return null;
    }

    const xuLyGuiYeuCau = () => {
        if (!props.soLuongMuon || props.soLuongMuon <= 0) {
            message.error('Vui lòng nhập số lượng mượn');
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
        if (props.ngayTra < props.ngayMuon) {
            message.error('Ngày trả phải sau ngày mượn');
            return;
        }
        if (!props.lyDo) {
            message.error('Vui lòng nhập lý do mượn');
            return;
        }
        message.success('Đã gửi yêu cầu mượn thành công!');
        props.onClose();
    };

    return (
        <Modal
            title={'Yêu cầu mượn: ' + props.thietBi.ten}
            open={props.visible}
            onCancel={props.onClose}
            footer={null}
            width={500}
        >
            <div style={{ marginBottom: 12 }}>
                <strong>Thiết bị:</strong> {props.thietBi.ten}
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
                />
            </div>
            <div style={{ marginBottom: 12 }}>
                <div>Ngày trả:</div>
                <DatePicker
                    value={props.ngayTra}
                    onChange={(ngay) => props.onChangeNgayTra(ngay)}
                    style={{ width: '100%' }}
                />
            </div>
            <div style={{ marginBottom: 16 }}>
                <div>Lý do mượn / Mục đích sử dụng:</div>
                <Input.TextArea
                    value={props.lyDo}
                    onChange={(e) => props.onChangeLyDo(e.target.value)}
                    rows={3}
                />
            </div>
            <div style={{ textAlign: 'right' }}>
                <Button onClick={props.onClose} style={{ marginRight: 8 }}>
                    Hủy
                </Button>
                <Button type="primary" onClick={xuLyGuiYeuCau}>
                    Xác nhận gửi
                </Button>
            </div>
        </Modal>
    );
};

export default GuiYeuCauMuon;
