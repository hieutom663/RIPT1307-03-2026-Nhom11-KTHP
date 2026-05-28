import { Input, Table, Tag, Button, message, Modal, Segmented } from "antd";
import { useState, useEffect, useMemo } from "react";
import { layDanhSachDangMuonAPI, ghiNhanDaTraAPI } from '../../../../services/QuanLyLichSu/api';

const DangMuon = () => {
    const [pageTable, setPageTable] = useState<string>('Tất cả');
    const [dataSourceRaw, setDataSourceRaw] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        layDuLieu();
    }, []);

    const layDuLieu = async () => {
        setLoading(true);
        try {
            const res = await layDanhSachDangMuonAPI();
            if (res.data?.success) {
                setDataSourceRaw(res.data.data);
            } else {
                message.error(res.data?.message || 'Không thể lấy dữ liệu');
            }
        } catch (error) {
            console.error('Lỗi lấy dữ liệu:', error);
            message.error('Lỗi kết nối đến máy chủ!');
        } finally {
            setLoading(false);
        }
    };

    const dataSource = useMemo(() => {
        return dataSourceRaw.filter(item => {
            const matchType =
                pageTable === 'Tất cả' ? true :
                pageTable === 'Đang mượn' ? item.trangThai === 'dang_muon' :
                pageTable === 'Quá hạn' ? item.trangThai === 'qua_han' : true;

            const matchSearch =
                item.maYC.toLowerCase().includes(searchText.toLowerCase()) ||
                item.tenSV.toLowerCase().includes(searchText.toLowerCase()) ||
                item.thietBi.toLowerCase().includes(searchText.toLowerCase());

            return matchType && matchSearch;
        });
    }, [pageTable, dataSourceRaw, searchText]);

    const xuLyDaTra = (record: any) => {
        Modal.confirm({
            title: 'Ghi nhận đã trả',
            content: 'Xác nhận ' + record.tenSV + ' đã trả "' + record.thietBi + '"?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await ghiNhanDaTraAPI(record.maYC);
                    message.success('Đã ghi nhận trả: ' + record.thietBi);
                    layDuLieu();
                } catch (error) {
                    console.error('Lỗi:', error);
                    message.error('Lỗi khi ghi nhận trả');
                }
            },
        });
    };

    const columns = [
        { title: 'Mã YC', dataIndex: 'maYC', key: 'maYC' },
        { title: 'Sinh viên', dataIndex: 'tenSV', key: 'tenSV' },
        { title: 'Mã SV', dataIndex: 'maSV', key: 'maSV' },
        { title: 'Thiết bị', dataIndex: 'thietBi', key: 'thietBi' },
        { title: 'SL', dataIndex: 'soLuong', key: 'soLuong', width: 60, align: 'center' as const },
        {
            title: 'Hạn trả', dataIndex: 'hanTra', key: 'hanTra',
            sorter: (a: any, b: any) => new Date(a.hanTra).getTime() - new Date(b.hanTra).getTime(),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            render: (text: string) => {
                const colors: any = { 'dang_muon': 'orange', 'qua_han': 'red' };
                const labels: any = { 'dang_muon': 'Đang mượn', 'qua_han': 'Quá hạn' };
                return <Tag color={colors[text] || 'default'}>{labels[text] || text}</Tag>;
            },
        },
        {
            title: 'Hành động', key: 'action',
            render: (_: any, record: any) => (
                <Button size="small" type="primary" onClick={() => xuLyDaTra(record)}
                    style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                    Ghi nhận đã trả
                </Button>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                <Segmented
                    value={pageTable}
                    onChange={setPageTable}
                    options={['Tất cả', 'Đang mượn', 'Quá hạn']}
                    style={{ background: '#f0f0f0', padding: 4 }}
                />

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#888' }}>
                        Đang xem: <strong>{pageTable}</strong>
                    </span>
                    <Input.Search
                        placeholder="Tìm mã YC, sinh viên hoặc thiết bị..."
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 280 }}
                        allowClear
                    />
                </div>
            </div>

            <Table
                rowKey="key"
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                bordered
                pagination={{ showSizeChanger: true }}
            />
        </div>
    );
};

export default DangMuon;
