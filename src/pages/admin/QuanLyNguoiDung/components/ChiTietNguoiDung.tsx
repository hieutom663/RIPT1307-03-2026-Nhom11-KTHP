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
                <Card variant='borderless'>
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="Mã SV">
                            <Tag color="blue">{props.nguoiDung.ma_sv}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Họ tên">
                            {props.nguoiDung.ho_ten}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {props.nguoiDung.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {props.nguoiDung.so_phone || 'Chưa cập nhật'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Vai trò">
                            <Tag color={props.nguoiDung.vai_tro === 'admin' ? 'red' : 'green'}>
                                {props.nguoiDung.vai_tro === 'admin' ? 'Admin' : 'User'}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            )}
        </Modal>
    );
};

export default ChiTietNguoiDung;
