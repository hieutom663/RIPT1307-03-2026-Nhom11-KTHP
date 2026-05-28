import { Modal, Input, Select, InputNumber } from 'antd';

const ThemSuaThietBi = (props: any) => {
    return (
        <Modal
            title={props.thietBi ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}
            open={props.visible}
            onOk={() => props.onSave({
                ten: props.ten,
                moTa: props.moTa,
                soLuongTong: props.soLuongTong,
                soLuongConLai: props.soLuongConLai,
                loai: props.loai,
                img: props.img,
            })}
            onCancel={props.onCancel}
            okText="Lưu"
            cancelText="Hủy"
        >
            <div style={{ marginBottom: 12 }}>
                <div>Tên thiết bị:</div>
                <Input value={props.ten} onChange={(e) => props.onChangeTen(e.target.value)} />
            </div>
            <div style={{ marginBottom: 12 }}>
                <div>Mô tả:</div>
                <Input.TextArea value={props.moTa} onChange={(e) => props.onChangeMoTa(e.target.value)} rows={3} />
            </div>
            <div style={{ marginBottom: 12 }}>
                <div>Loại:</div>
                <Select
                    value={props.loai}
                    onChange={(giaTri) => props.onChangeLoai(giaTri)}
                    style={{ width: '100%' }}
                    options={[
                        { value: 'dien-tu', label: 'Điện tử' },
                        { value: 'hoc-tap', label: 'Học tập' },
                        { value: 'tien-ich', label: 'Tiện ích' },
                    ]}
                />
            </div>
            <div style={{ marginBottom: 12 }}>
                <div>Số lượng tổng:</div>
                <InputNumber value={props.soLuongTong} onChange={(giaTri) => props.onChangeSoLuongTong(giaTri || 0)} min={0} style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
                <div>Số lượng còn lại:</div>
                <InputNumber value={props.soLuongConLai} onChange={(giaTri) => props.onChangeSoLuongConLai(giaTri || 0)} min={0} style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
                <div>Link hình ảnh:</div>
                <Input value={props.img} onChange={(e) => props.onChangeImg(e.target.value)} />
            </div>
        </Modal>
    );
};

export default ThemSuaThietBi;
