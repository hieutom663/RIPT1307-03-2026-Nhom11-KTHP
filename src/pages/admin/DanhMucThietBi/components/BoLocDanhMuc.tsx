import { Select } from 'antd';

const BoLocDanhMuc = (props: any) => {
    return (
        <Select
            value={props.boLoc}
            onChange={(giaTri) => props.onChangeLoc(giaTri)}
            style={{ width: 200 }}
            options={[
                { value: 'tat-ca', label: 'Tất cả trạng thái' },
                { value: 'hoat-dong', label: 'Đang hoạt động' },
                { value: 'ngung-hoat-dong', label: 'Ngừng hoạt động' },
            ]}
        />
    );
};

export default BoLocDanhMuc;
