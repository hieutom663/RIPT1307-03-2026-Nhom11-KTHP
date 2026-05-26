import { Modal, Button } from 'antd';

const ChiTietThietBi = (props: any) => {
    if (!props.thietBi) {
        return null;
    }

    return (
        <Modal
            title={props.thietBi.ten_thiet_bi}
            open={props.visible}
            onCancel={props.onClose}
            footer={null}
            width={500}
        >
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <img
                    src={props.thietBi.img}
                    alt={props.thietBi.ten_thiet_bi}
                    style={{ width: 200, height: 200, borderRadius: 8, objectFit: 'cover' }}
                />
            </div>
            <div style={{ marginBottom: 12 }}>
                <strong>Mô tả:</strong>
                <p>{props.thietBi.moTa}</p> 
            </div>
            <div style={{ marginBottom: 8 }}>
                <strong>Số lượng tổng:</strong> {props.thietBi.soLuongTong}
            </div>
            <div style={{ marginBottom: 16 }}>
                <strong>Số lượng còn lại:</strong> {props.thietBi.soLuongConLai}
            </div>
            <div style={{ textAlign: 'right' }}>
                <Button onClick={props.onClose} style={{ marginRight: 8 }}>
                    Đóng
                </Button>
                <Button
                    type="primary"
                    disabled={props.thietBi.soLuongConLai === 0}
                    onClick={props.onMuonNgay}
                >
                    {props.thietBi.soLuongConLai === 0 ? 'Hết hàng' : 'Mượn ngay'}
                </Button>
            </div>
        </Modal>
    );
};

export default ChiTietThietBi;