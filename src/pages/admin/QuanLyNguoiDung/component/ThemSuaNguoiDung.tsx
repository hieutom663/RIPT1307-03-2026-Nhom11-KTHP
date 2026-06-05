import { Modal, Input } from 'antd';

const ThemSuaNguoiDung = (props: any) => {
    return (
        <Modal
            title={props.dangSua ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
            open={props.visible}
            onOk={() => props.onSave({
                ma_sv: props.maSV,
                ten: props.ten,
                email: props.email,
                so_phone: props.soPhone,
                ngay_sinh: props.ngaySinh,
                mat_khau: props.matKhau,
            })}
            onCancel={props.onCancel}
            okText="Lưu"
            cancelText="Hủy"
        >
            <div style={{ marginBottom: 12 }}>
                <div>Mã sinh viên:</div>
                <Input
                    value={props.maSV}
                    onChange={(e) => props.onChangeMaSV(e.target.value)}
                    disabled={props.dangSua ? true : false}
                />
            </div>
            <div style={{ marginBottom: 12 }}>
                <div>Họ tên:</div>
                <Input value={props.ten} onChange={(e) => props.onChangeTen(e.target.value)} />
            </div>
            <div style={{ marginBottom: 12 }}>
                <div>Ngày sinh:</div>
                <Input
                    type="date"
                    value={props.ngaySinh}
                    onChange={(e) => props.onChangeNgaySinh(e.target.value)}
                />
            </div>
            <div style={{ marginBottom: 12 }}>
                <div>Email:</div>
                <Input value={props.email} onChange={(e) => props.onChangeEmail(e.target.value)} />
            </div>
            <div style={{ marginBottom: 12 }}>
                <div>Số điện thoại:</div>
                <Input value={props.soPhone} onChange={(e) => props.onChangeSoPhone(e.target.value)} />
            </div>
            {!props.dangSua && (
                <div style={{ marginBottom: 12 }}>
                    <div>Mật khẩu:</div>
                    <Input.Password value={props.matKhau} onChange={(e) => props.onChangeMatKhau(e.target.value)} />
                </div>
            )}
        </Modal>
    );
};

export default ThemSuaNguoiDung;
