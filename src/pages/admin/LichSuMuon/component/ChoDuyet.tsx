import { Input, Table, Tag, Button, message, Modal } from "antd";
import { useState, useEffect, useMemo } from "react";
import { layDanhSachChoDuyetAPI, ghiNhanChoMuonAPI } from '../../../../services/QuanLyLichSu/api';

const ChoDuyet = () => {
    const [dataSourceRaw, setDataSourceRaw] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        layDuLieu();
    }, []);

    const layDuLieu = async () => {
        setLoading(true);
        try {
            const res = await layDanhSachChoDuyetAPI();
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
        return dataSourceRaw.filter(item =>
            item.maYC.toLowerCase().includes(searchText.toLowerCase()) ||
            item.tenSV.toLowerCase().includes(searchText.toLowerCase()) ||
            item.thietBi.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [dataSourceRaw, searchText]);

    const xuLyChoMuon = (record: any) => {
        Modal.confirm({
            title: 'Ghi nhận cho mượn',
            content: 'Xác nhận đã giao thiết bị "' + record.thietBi + '" cho ' + record.tenSV + '?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await ghiNhanChoMuonAPI(record.maYC);
                    message.success('Đã ghi nhận cho mượn: ' + record.thietBi);
                    layDuLieu();
                } catch (error) {
                    console.error('Lỗi:', error);
                    message.error('Lỗi khi ghi nhận cho mượn');
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
            title: 'Ngày mượn', dataIndex: 'ngayMuon', key: 'ngayMuon',
            sorter: (a: any, b: any) => new Date(a.ngayMuon).getTime() - new Date(b.ngayMuon).getTime(),
        },
        { title: 'Hạn trả', dataIndex: 'hanTra', key: 'hanTra' },
        {
            title: 'Trạng thái', key: 'trangThai',
            render: () => {
                return <Tag color="cyan">Đã duyệt</Tag>;
            },
        },
        {
            title: 'Hành động', key: 'action',
            render: (_: any, record: any) => (
                <Button type="primary" danger size="small" onClick={() => xuLyChoMuon(record)}>
                    Ghi nhận cho mượn
                </Button>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                <div />
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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

export default ChoDuyet;
