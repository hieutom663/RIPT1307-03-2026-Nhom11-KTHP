import { useState, useEffect } from 'react';
import { Table, Tag, Button, message, Modal, Space, Alert } from 'antd';
import { layDanhSachChoGiaoAPI, layDanhSachDangMuonAPI, ghiNhanChoMuonAPI, ghiNhanDaTraAPI } from '../../../services/QuanLyLichSu/api';

const GhiNhanMuonTra = () => {
    const [choGiao, setChoGiao] = useState([]);
    const [dangMuon, setDangMuon] = useState([]);
    const [dangTai, setDangTai] = useState(false);

    // Lấy dữ liệu từ database
    const layDuLieu = async () => {
        setDangTai(true);
        try {
            const resChoGiao = await layDanhSachChoGiaoAPI();
            if (resChoGiao.data.success) {
                setChoGiao(resChoGiao.data.data);
            }

            const resDangMuon = await layDanhSachDangMuonAPI();
            if (resDangMuon.data.success) {
                setDangMuon(resDangMuon.data.data);
            }
        } catch (error) {
            console.error('Lỗi lấy dữ liệu:', error);
            message.error('Không thể lấy dữ liệu từ server');
        }
        setDangTai(false);
    };

    useEffect(() => {
        layDuLieu();
    }, []);

    // Ghi nhận cho mượn
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
                    layDuLieu(); // Tải lại danh sách
                } catch (error) {
                    console.error('Lỗi:', error);
                    message.error('Lỗi khi ghi nhận cho mượn');
                }
            },
        });
    };

    // Ghi nhận đã trả
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
                    layDuLieu(); // Tải lại danh sách
                } catch (error) {
                    console.error('Lỗi:', error);
                    message.error('Lỗi khi ghi nhận trả');
                }
            },
        });
    };

    const quaHanCount = dangMuon.filter((r: any) => r.trangThai === 'qua_han').length;

    // Cột bảng chờ giao
    const cotChoGiao = [
        { title: 'Mã YC', dataIndex: 'maYC', width: 90 },
        {
            title: 'Sinh viên', width: 170,
            render: (_: any, r: any) => (
                <div>
                    <strong>{r.tenSV}</strong><br />
                    <span style={{ fontSize: 12, color: '#999' }}>{r.maSV}</span>
                </div>
            ),
        },
        { title: 'Thiết bị', dataIndex: 'thietBi', width: 200 },
        { title: 'SL', dataIndex: 'soLuong', width: 60 },
        { title: 'Ngày mượn', dataIndex: 'ngayMuon', width: 120 },
        { title: 'Hạn trả', dataIndex: 'hanTra', width: 120 },
        {
            title: 'Trạng thái', width: 120,
            render: () => <Tag color="blue">Đã duyệt</Tag>,
        },
        {
            title: 'Hành động', width: 200,
            render: (_: any, record: any) => (
                <Button type="primary" danger size="small" onClick={() => xuLyChoMuon(record)}>
                    Ghi nhận cho mượn
                </Button>
            ),
        },
    ];

    // Cột bảng đang mượn
    const cotDangMuon = [
        { title: 'Mã YC', dataIndex: 'maYC', width: 90 },
        {
            title: 'Sinh viên', width: 170,
            render: (_: any, r: any) => (
                <div>
                    <strong>{r.tenSV}</strong><br />
                    <span style={{ fontSize: 12, color: '#999' }}>{r.maSV}</span>
                </div>
            ),
        },
        { title: 'Thiết bị', dataIndex: 'thietBi', width: 200 },
        { title: 'SL', dataIndex: 'soLuong', width: 60 },
        { title: 'Ngày mượn', dataIndex: 'ngayMuon', width: 120 },
        { title: 'Hạn trả', dataIndex: 'hanTra', width: 120 },
        {
            title: 'Trạng thái', width: 120,
            render: (_: any, r: any) => {
                if (r.trangThai === 'qua_han') return <Tag color="red">Quá hạn</Tag>;
                return <Tag color="green">Đang mượn</Tag>;
            },
        },
        {
            title: 'Hành động', width: 220,
            render: (_: any, record: any) => (
                <Space direction="vertical" size={4}>
                    {record.trangThai === 'qua_han' && (
                        <Tag color="error">⚠ Quá hạn trả!</Tag>
                    )}
                    <Button size="small" type="primary" onClick={() => xuLyDaTra(record)}
                        style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                        Ghi nhận đã trả
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ fontSize: 20, marginBottom: 20 }}>
                <strong>📋 Ghi Nhận Mượn / Trả</strong>
            </div>

            {quaHanCount > 0 && (
                <Alert
                    message={'Có ' + quaHanCount + ' yêu cầu quá hạn trả!'}
                    description="Vui lòng liên hệ sinh viên để nhắc nhở trả thiết bị."
                    type="error"
                    showIcon
                    style={{ marginBottom: 24 }}
                />
            )}

            <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 16, marginBottom: 12, color: '#1677ff' }}>
                    <strong>📦 Chờ Giao Thiết Bị ({choGiao.length})</strong>
                </div>
                <Table
                    columns={cotChoGiao}
                    dataSource={choGiao}
                    pagination={false}
                    loading={dangTai}
                    locale={{ emptyText: 'Không có thiết bị nào chờ giao' }}
                />
            </div>

            <div>
                <div style={{ fontSize: 16, marginBottom: 12, color: '#fa8c16' }}>
                    <strong>🔄 Đang Mượn ({dangMuon.length})</strong>
                </div>
                <Table
                    columns={cotDangMuon}
                    dataSource={dangMuon}
                    pagination={false}
                    loading={dangTai}
                    locale={{ emptyText: 'Không có thiết bị nào đang mượn' }}
                />
            </div>
        </div>
    );
};

export default GhiNhanMuonTra;
