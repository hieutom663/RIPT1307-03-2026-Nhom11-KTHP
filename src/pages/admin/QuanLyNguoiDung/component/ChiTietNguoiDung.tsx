import { Modal, Card, Descriptions, Tag } from 'antd';

const ChiTietNguoiDung = (props: any) => {
    return (
        <Modal
            title="Chi tiết người dùng"
            open={props.visible}
            onCancel={props.onCancel}
            footer={null}
            width={500}
        >
            {props.nguoiDung && (
                <Card bordered={false}>
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="Mã SV">
                            <Tag color="blue">{props.nguoiDung.ma_sv}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Họ tên">
                            {props.nguoiDung.ten}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh">
                            {props.nguoiDung.ngay_sinh || 'Chưa cập nhật'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {props.nguoiDung.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {props.nguoiDung.so_phone || 'Chưa cập nhật'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Mật khẩu">
                            {props.nguoiDung.mat_khau || '******'}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            )}
        </Modal>
    );
};

export default ChiTietNguoiDung;
