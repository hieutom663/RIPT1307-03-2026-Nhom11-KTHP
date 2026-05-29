import { Input, Table, Tag, message, Segmented } from "antd";
import { useState, useEffect, useMemo } from "react";
import { getChiTietLichSuAPI } from "../../../../services/LichSuAdmin/api"; 

const TatCaLichSu = () => {
    const [pageTable, setPageTable] = useState<string>('Tất cả');
    const [dataSourceRaw, setDataSourceRaw] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const fetchChiTietLichSu = async () => {
            setLoading(true);
            try {

                const res = await getChiTietLichSuAPI();
                if (res.data?.success) {
                    setDataSourceRaw(res.data.data);
                } else {
                    message.error(res.data?.message || 'Không thể lấy lịch sử chi tiết');
                }
            } catch (error) {
                console.error("Lỗi fetchChiTietLichSu:", error);
                message.error('Lỗi kết nối đến máy chủ!');
            } finally {
                setLoading(false);
            }
        };

        fetchChiTietLichSu();
    }, []);

    const dataSource = useMemo(() => {
        return dataSourceRaw.filter(item => {
            const matchType = 
                pageTable === 'Tất cả' ? true :
                pageTable === 'Sắp đến hạn' ? item.trangThai === 'Chưa trả' :
                pageTable === 'Quá hạn' ? item.trangThai === 'Quá hạn' : true;

            const matchSearch = 
                item.maPhieu.toLowerCase().includes(searchText.toLowerCase()) ||
                item.maDoDung.toLowerCase().includes(searchText.toLowerCase()) ||
                item.tenDoDung.toLowerCase().includes(searchText.toLowerCase());

            return matchType && matchSearch;
        });
    }, [pageTable, dataSourceRaw, searchText]);

    const columns = [
        { title: 'Mã SV', dataIndex: 'ma_sv', key: 'ma_sv', width: 100 },
        { title: 'Mã Phiếu', dataIndex: 'maPhieu', key: 'maPhieu' },
        { title: 'Mã Thiết bị', dataIndex: 'maDoDung', key: 'maDoDung' },
        { title: 'Tên thiết bị', dataIndex: 'tenDoDung', key: 'tenDoDung' },
        { title: 'SL', dataIndex: 'soLuong', key: 'soLuong', width: 60, align: 'center' as const },
        { 
            title: 'Hạn trả', 
            dataIndex: 'hanTra', 
            key: 'hanTra',
            sorter: (a: any, b: any) => new Date(a.hanTra).getTime() - new Date(b.hanTra).getTime(),
        },
        {
            title: 'Trạng thái', 
            dataIndex: 'trangThai', 
            key: 'trangThai',
            render: (text: string) => {
                const colors: any = { 'Chưa trả': 'orange', 'Đã trả': 'green', 'Quá hạn': 'red' };
                return <Tag color={colors[text] || 'default'}>{text}</Tag>;
            },
        },
    ];

    return (
        <div> 
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                <Segmented
                    value={pageTable}
                    onChange={setPageTable}
                    options={['Tất cả', 'Sắp đến hạn', 'Quá hạn']}
                    style={{ background: '#f0f0f0', padding: 4 }}
                />
                
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#888' }}>
                        Đang xem: <strong>{pageTable}</strong>
                    </span>
                    <Input.Search 
                        placeholder="Tìm mã phiếu, mã TB hoặc tên..." 
                        onChange={(e) => setSearchText(e.target.value)} 
                        style={{ width: 280 }} 
                        allowClear
                    />
                </div>
            </div>
            
            <Table 
                rowKey={(record) => record.maPhieu + record.maDoDung}
                columns={columns} 
                dataSource={dataSource} 
                loading={loading} 
                bordered 
                pagination={{ showSizeChanger: true }} 
            />
        </div>
    );
}

export default TatCaLichSu;