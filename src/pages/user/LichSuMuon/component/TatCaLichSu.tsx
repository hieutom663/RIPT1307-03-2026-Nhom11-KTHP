import { Input, Table, Tag, message, Segmented, Typography } from "antd";
import { useState, useEffect, useMemo } from "react";
import { getChiTietLichSuAPI } from "../../../../services/LichSuMuon/api"; 

const { Text } = Typography;

const TatCaLichSu = () => {
    const [pageTable, setPageTable] = useState<string>('Tất cả');
    const [dataSourceRaw, setDataSourceRaw] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const fetchChiTietLichSu = async () => {
            setLoading(true);
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                const ma_sv = userInfo.ma_sv;
                if (!ma_sv) {
                    message.error("Không tìm thấy thông tin sinh viên!");
                    setLoading(false);
                    return;
                }

                const res = await getChiTietLichSuAPI(ma_sv);
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
        {
            title: 'STT',
            key: 'stt',
            width: 60,
            align: 'center' as const,
            render: (_text: any, _record: any, index: number) => <Text type="secondary">{index + 1}</Text>,
        },
        { 
            title: 'Mã Phiếu', 
            dataIndex: 'maPhieu', 
            key: 'maPhieu',
            width: 110,
            render: (text: string) => <Text strong style={{ color: '#cf1322', fontFamily: 'monospace' }}>{text}</Text>
        },
        { 
            title: 'Mã Thiết bị', 
            dataIndex: 'maDoDung', 
            key: 'maDoDung',
            width: 110,
            render: (text: string) => <Text strong>{text}</Text>
        },
        { 
            title: 'Tên thiết bị', 
            dataIndex: 'tenDoDung', 
            key: 'tenDoDung',
            render: (text: string) => <Text strong style={{ fontSize: '14px' }}>{text}</Text>
        },
        { 
            title: 'SL', 
            dataIndex: 'soLuong', 
            key: 'soLuong', 
            align: 'center' as const,
            render: (val: number) => <Text strong>{val}</Text>
        },
        { 
            title: 'Hạn trả', 
            dataIndex: 'hanTra', 
            key: 'hanTra',
            width: 120,
            sorter: (a: any, b: any) => new Date(a.hanTra).getTime() - new Date(b.hanTra).getTime(),
            render: (text: string) => <Text type="secondary">{text}</Text>
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
                const colors: any = { 'Chờ duyệt': 'blue', 'Đang mượn': 'orange', 'Đã trả': 'green', 'Quá hạn': 'red' };
                return <Tag color={colors[text] || 'default'}>{text}</Tag>;
            },
        },
    ];

    return (
        <div> 
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' }}>
                <Segmented
                    value={pageTable}
                    onChange={setPageTable}
                    options={['Tất cả', 'Sắp đến hạn', 'Quá hạn']}
                    style={{ background: '#f0f0f0', padding: 4, borderRadius: '8px' }}
                />
                
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#8c8c8c' }}>
                        Đang xem: <strong style={{ color: '#262626' }}>{pageTable}</strong>
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
                size="middle"
                pagination={{ showSizeChanger: false, style: { marginTop: 24 } }} 
                locale={{ emptyText: 'Không tìm thấy chi tiết lịch sử nào' }}
                bordered
            />
        </div>
    );
}

export default TatCaLichSu;