import { Input, Table, Tag, message, Segmented, Typography } from "antd";
import { useState, useEffect, useMemo } from "react";
import styles from '../../../../global.less'; 
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
                pageTable === 'Sắp đến hạn' ? (item.trangThai === 'Chưa trả' || item.trangThai === 'Đang mượn') :
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
            responsive: ['md'] as any, 
            render: (_text: any, _record: any, index: number) => index + 1 
        },
        { 
            title: 'Mã Phiếu', 
            dataIndex: 'maPhieu', 
            key: 'maPhieu', 
            width: 120, 
            render: (text: string) => <Text strong style={{ color: '#cf1322', fontFamily: 'monospace' }}>{text}</Text> 
        },
        { 
            title: 'Mã Thiết bị', 
            dataIndex: 'maDoDung', 
            key: 'maDoDung', 
            width: 120, 
            responsive: ['lg'] as any, 
            render: (text: string) => <Text strong style={{ color: '#cf1322', fontFamily: 'monospace' }}>{text}</Text> 
        },
        { 
            title: 'Tên thiết bị', 
            dataIndex: 'tenDoDung', 
            key: 'tenDoDung',
            ellipsis: true ,
            render: (text: any) => (<Text strong>{text}</Text>),
        },
        { 
            title: 'SL', 
            dataIndex: 'soLuong', 
            key: 'soLuong', 
            width: 60, 
            align: 'center' as const 
        },
        { 
            title: 'Hạn trả', 
            dataIndex: 'hanTra', 
            key: 'hanTra',
            width: 140,
            sorter: (a: any, b: any) => new Date(a.hanTra).getTime() - new Date(b.hanTra).getTime(),
        },
        {
            title: 'Trạng thái', 
            dataIndex: 'trangThai', 
            key: 'trangThai',
            width: 100,
            align: 'center' as const,
            fixed: 'right' as const, 
            render: (text: string) => {
                const colors: any = { 'Đã trả': 'green', 'Quá hạn': 'red', 'Đang mượn': 'orange', 'Chưa trả': 'orange' };
                return <Tag color={colors[text] || 'default'} style={{ margin: 0 }}>{text}</Tag>;
            },
        },
    ];

    return (
        <div style={{ padding: '0 8px' }}> 
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' }}>
                <Segmented
                    value={pageTable}
                    onChange={setPageTable}
                    options={['Tất cả', 'Sắp đến hạn', 'Quá hạn']}
                    style={{ background: '#f0f0f0', padding: 4, borderRadius: '8px', overflowX: 'auto', maxWidth: '100%' }}
                />
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', flex: '1 1 300px', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '13px', color: '#8c8c8c' }}>
                        Đang xem: <strong style={{ color: '#262626' }}>{pageTable}</strong>
                    </span>
                    <Input.Search 
                        placeholder="Tìm mã phiếu, mã TB hoặc tên..." 
                        onChange={(e) => setSearchText(e.target.value)} 
                        style={{ flex: 1, minWidth: '220px', maxWidth: '350px' }} 
                        allowClear
                    />
                </div>
            </div>
            
            <Table 
                className={styles.tableResponsive} // Tuyệt chiêu chặn Pull-to-refresh
                rowKey={(record) => record.maPhieu + record.maDoDung}
                columns={columns} 
                dataSource={dataSource} 
                loading={loading} 
                size="middle"
                scroll={{ x: 'max-content' }} // Vũ khí tối thượng chống vỡ lề
                pagination={{ showSizeChanger: false, style: { marginTop: 24 } }} 
                locale={{ emptyText: 'Không tìm thấy chi tiết lịch sử nào' }}
                bordered
            />
        </div>
    );
}

export default TatCaLichSu;