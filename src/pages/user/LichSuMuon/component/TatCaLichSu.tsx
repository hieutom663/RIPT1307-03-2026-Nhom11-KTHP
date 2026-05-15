import { Input, Row, Col, Button, Table, Checkbox, Segmented } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

const TatCaLichSu = () => {
    const [pageTable, setPageTable] =useState<string>('Tất cả');
    const dataSource: any = [];

    const columns = [
        {
            title: 'TT', 
            dataIndex: 'tt', 
            key: 'tt',
        },
        {
            title: 'Tên đồ dùng', 
            dataIndex: 'tenDoDung', 
            key: 'tendodung',
        },
        {
            title: 'Mã đồ dùng', 
            dataIndex: 'maDoDung', 
            key: 'madodung', 
            filterIcon: () => <SearchOutlined />,
            filterDropdown: () => <div><Input.Search placeholder="Tìm theo mã đồ dùng" /></div>,
    },
        {
            title: 'Họ tên', 
            dataIndex: 'hoTen', 
            key: 'hoten',
            filterIcon: () => <SearchOutlined />,
            filterDropdown: () => <div><Input.Search placeholder="Tìm theo tên" /></div>,
        },
        {
            title: 'Thời gian mượn', 
            dataIndex: 'thoiGianMuon', 
            key: 'thoigianmuon',
            sorter: (a: any, b: any) => new Date(a.thoi_gian_dang_ky).getTime() - new Date(b.thoi_gian_dang_ky).getTime(),
        },
        {
            title: 'Hạn trả', 
            dataIndex: 'hanTra', 
            key: 'thoigianmuon',
            sorter: (a: any, b: any) => new Date(a.thoi_gian_dang_ky).getTime() - new Date(b.thoi_gian_dang_ky).getTime(),
        },
        {
            title: 'Ghi chú', 
            dataIndex: 'ghiChu', 
            key: 'ghichu',
        },
        {
            title: 'Trạng thái', 
            dataIndex: 'trangThai', 
            key: 'trangthai',
            filterDropdown: () => <div style={{display: 'flex', flexDirection: 'column', padding:8}}>
                <div>
                    <Input.Search placeholder="Tìm theo bộ lọc" /> 
                </div>
                <Checkbox.Group 
                     style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                    <Checkbox value="Chờ duyệt">Chờ duyệt</Checkbox> 
                    <Checkbox value="Đã duyệt">Đã duyệt</Checkbox> 
                    <Checkbox value="Không duyệt">Không duyệt</Checkbox>
                </Checkbox.Group>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <Button size="small" type="text" danger >
                        Bỏ lọc
                    </Button>
                    <Button size="small" type="primary" onClick={() => confirm()}>
                        Đồng ý
                    </Button>
                </div>
            </div>,
        },
    ];

    return (
        <div> 
            <Segmented
                value={pageTable}
                onChange={setPageTable}
                options={['Tất cả', 'Sắp đến hạn', 'Quá hạn']}
            />
            <div className="congCu" style={{display: 'flex', justifyContent: 'end', marginBottom: 8}}>
                <Input.Search placeholder="Tìm theo Mã định danh, Họ tên,..." style={{maxWidth: 250}} />
            </div>
            <Table 
            columns={columns} 
            dataSource={dataSource} 
            bordered 
            pagination={{
                total: 1,
                showTotal: (total) => `Tổng số: ${total}`,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                defaultPageSize: 10,
                }} 
            />
        </div>
    );
}
export  default TatCaLichSu;