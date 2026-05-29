import { Input, Table, Tag, message } from "antd";
import { useState, useEffect, useMemo } from "react";
import { getAllPhieuMuonAPI } from "../../../../services/LichSuAdmin/api"; 

const PhieuMuon = () => {
    const [dataSourceRaw, setDataSourceRaw] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const fetchPhieuMuon = async () => {
            setLoading(true);
            try {
                const res = await getAllPhieuMuonAPI();
                if (res.data?.success) setDataSourceRaw(res.data.data);
            } catch (error) {
                message.error('Lỗi kết nối!');
            } finally {
                setLoading(false);
            }
        };
        fetchPhieuMuon();
    }, []);

    const dataSource = useMemo(() => {
        return dataSourceRaw.filter(item => 
            item.maYeuCau.toLowerCase().includes(searchText.toLowerCase()) ||
            item.lyDo.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [dataSourceRaw, searchText]);

    const columns = [
        {
            title: 'Mã SV', 
            dataIndex: 'ma_sv',
            key: 'ma_sv',
            width: 120, 
        },
        {
            title: 'Mã Phiếu', 
            dataIndex: 'maYeuCau', 
            key: 'maYeuCau',
        },
        {
            title: 'Mã Phiếu', 
            dataIndex: 'maYeuCau', 
            key: 'maYeuCau',
        },
        {
            title: 'Ngày tạo phiếu', 
            dataIndex: 'ngayTao', 
            key: 'ngayTao',
            sorter: (a: any, b: any) => new Date(a.ngayTao).getTime() - new Date(b.ngayTao).getTime(),
        },
        {
            title: 'Ngày trả dự kiến', 
            dataIndex: 'ngayTraDuKien', 
            key: 'ngayTraDuKien',
            sorter: (a: any, b: any) => new Date(a.ngayTraDuKien).getTime() - new Date(b.ngayTraDuKien).getTime(),
        },
        {
            title: 'Lý do mượn', 
            dataIndex: 'lyDo', 
            key: 'lyDo',
        },
        {
            title: 'Trạng thái', 
            dataIndex: 'trangThai', 
            key: 'trangThai',
            filters: [
                { text: 'Chờ duyệt', value: 'Chờ duyệt' },
                { text: 'Đã duyệt', value: 'Đã duyệt' },
                { text: 'Đang mượn', value: 'Đang mượn' },
                { text: 'Hoàn thành', value: 'Hoàn thành' },
                { text: 'Bị từ chối', value: 'Bị từ chối' },
            ],
            onFilter: (value: any, record: any) => record.trangThai === value,
            render: (text: string) => {
                const colors: any = { 'Chờ duyệt': 'gold', 'Đã duyệt': 'cyan', 'Đang mượn': 'geekblue', 'Hoàn thành': 'green', 'Bị từ chối': 'red' };
                return <Tag color={colors[text] || 'default'}>{text}</Tag>;
            },
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Input.Search 
                    placeholder="Tìm theo mã phiếu hoặc lý do..." 
                    onChange={(e) => setSearchText(e.target.value)} 
                    style={{ maxWidth: 300 }} 
                />
            </div>
            <Table 
                rowKey="maYeuCau"
                columns={columns} 
                dataSource={dataSource} 
                loading={loading}
                bordered 
                pagination={{ showSizeChanger: true }} 
            />
        </div>
    );
}
export default PhieuMuon;