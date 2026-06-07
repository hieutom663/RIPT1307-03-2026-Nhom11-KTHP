import { Input, Table, Tag, message, Typography } from "antd";
import { useState, useEffect, useMemo } from "react";
import styles from '../../../../global.less'; 
import { getPhieuMuonAPI } from "../../../../services/LichSuMuon/api"; 

const { Text } = Typography;

const PhieuMuon = () => {
    const [dataSourceRaw, setDataSourceRaw] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const fetchPhieuMuon = async () => {
            setLoading(true);
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                const ma_sv = userInfo.ma_sv;
                if (!ma_sv) return;

                const res = await getPhieuMuonAPI(ma_sv);
                if (res.data?.success) setDataSourceRaw(res.data.data);
            } catch (error) {
                message.error('Lỗi kết nối máy chủ!');
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
            title: 'STT',
            key: 'stt',
            width: 60,
            align: 'center' as const,
            responsive: ['md'] as any, 
            render: (_text: any, _record: any, index: number) => index + 1,
        },
        {
            title: 'Mã Phiếu', 
            dataIndex: 'maYeuCau', 
            key: 'maYeuCau',
            width: 120,
            render: (text: string) => <Text strong style={{ color: '#cf1322', fontFamily: 'monospace' }}>{text}</Text>
        },
        {
            title: 'Ngày tạo phiếu', 
            dataIndex: 'ngayTao', 
            key: 'ngayTao',
            width: 140,
            sorter: (a: any, b: any) => new Date(a.ngayTao).getTime() - new Date(b.ngayTao).getTime(),
        },
        {
            title: 'Ngày trả dự kiến', 
            dataIndex: 'ngayTraDuKien', 
            key: 'ngayTraDuKien',
            width: 140,
            sorter: (a: any, b: any) => new Date(a.ngayTraDuKien).getTime() - new Date(b.ngayTraDuKien).getTime(),
        },
        {
            title: 'Lý do mượn', 
            dataIndex: 'lyDo', 
            key: 'lyDo',
            ellipsis: true, 
            responsive: ['lg'] as any, 
        },
        {
            title: 'Trạng thái', 
            dataIndex: 'trangThai', 
            key: 'trangThai',
            width: 120,
            align: 'center' as const,
            fixed: 'right' as const, 
            filters: [
                { text: 'Chờ duyệt', value: 'Chờ duyệt' },
                { text: 'Đã duyệt', value: 'Đã duyệt' },
                { text: 'Đang mượn', value: 'Đang mượn' },
                { text: 'Hoàn thành', value: 'Hoàn thành' },
                { text: 'Bị từ chối', value: 'Bị từ chối' },
            ],
            onFilter: (value: any, record: any) => record.trangThai === value,
            render: (text: string) => {
                const colors: any = { 'Chờ duyệt': 'blue', 'Đang mượn': 'orange', 'Hoàn thành': 'green', 'Bị từ chối': 'red' };
                return <Tag color={colors[text] || 'default'} style={{ margin: 0 }}>{text}</Tag>;
            },
        },
    ];

    return (
        <div style={{ padding: '0 8px' }}>
            <div style={{ marginBottom: 16 }}>
                <Input.Search 
                    placeholder="Tìm theo mã phiếu hoặc lý do..." 
                    onChange={(e) => setSearchText(e.target.value)} 
                    style={{ width: '100%', maxWidth: 350 }} 
                    size="large"
                    allowClear
                />
            </div>
            <Table 
                className={styles.tableResponsive} 
                rowKey="maYeuCau"
                columns={columns} 
                dataSource={dataSource} 
                loading={loading}
                bordered 
                scroll={{ x: 'max-content' }} 
                pagination={{ showSizeChanger: true, style: { marginTop: 24 } }} 
            />
        </div>
    );
}

export default PhieuMuon;