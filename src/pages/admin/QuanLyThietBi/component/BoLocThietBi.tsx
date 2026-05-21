import { Select } from 'antd';

const BoLocThietBi = (props: any) => {
    return (
        <Select
            value={props.boLoc}
            onChange={(giaTri) => props.onChangeLoc(giaTri)}
            style={{ width: 200 }}
            options={[
                { value: 'tat-ca', label: 'Tất cả' },
                { value: 'dien-tu', label: 'Điện tử' },
                { value: 'hoc-tap', label: 'Học tập' },
                { value: 'tien-ich', label: 'Tiện ích' },
            ]}
        />
    );
};

export default BoLocThietBi;
