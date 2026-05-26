import React from 'react';
import { Table, Tag, Button, Typography, Card, Modal, message } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MuonTra } from '../index';

const { Title, Text } = Typography;

const statusConfig: Record<MuonTra['trangThai'], { label: string; color: string; bg: string }> = {
  da_duyet: { label: 'Đã duyệt', color: '#1677ff', bg: '#e6f4ff' },
  dang_muon: { label: 'Đang mượn', color: '#52c41a', bg: '#f6ffed' },
  qua_han: { label: 'Quá hạn', color: '#f5222d', bg: '#fff1f0' },
};

interface Props {
  data: MuonTra[];
  onChoMuon: (record: MuonTra) => void;
}

const BangChoGiao: React.FC<Props> = ({ data, onChoMuon }) => {
  const handleGhiNhanChoMuon = (record: MuonTra) => {
    Modal.confirm({
      title: 'Ghi nhận cho mượn',
      content: `Xác nhận đã giao thiết bị "${record.thietBi}" cho ${record.tenSV}?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        onChoMuon(record);
        message.success(`Đã ghi nhận cho mượn: ${record.thietBi}`);
      },
    });
  };

  const columns: ColumnsType<MuonTra> = [
    {
      title: 'Mã YC', dataIndex: 'maYC', key: 'maYC', width: 90,
      render: (v: string) => <Text strong style={{ color: '#1677ff' }}>{v}</Text>,
    },
    {
      title: 'Sinh viên', key: 'sinhVien', width: 170,
      render: (_: unknown, r: MuonTra) => (
        <div><Text strong>{r.tenSV}</Text><br /><Text type="secondary" style={{ fontSize: 12 }}>{r.maSV}</Text></div>
      ),
    },
    { title: 'Thiết bị', dataIndex: 'thietBi', key: 'thietBi', width: 200 },
    { title: 'SL', dataIndex: 'soLuong', key: 'soLuong', width: 60, align: 'center' as const },
    { title: 'Ngày mượn', dataIndex: 'ngayMuon', key: 'ngayMuon', width: 120 },
    { title: 'Hạn trả', dataIndex: 'hanTra', key: 'hanTra', width: 120 },
    {
      title: 'Trạng thái', key: 'trangThai', width: 120, align: 'center' as const,
      render: (_: unknown, r: MuonTra) => {
        const cfg = statusConfig[r.trangThai];
        return <Tag style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}30`, borderRadius: 6, fontWeight: 600, fontSize: 12, padding: '2px 12px' }}>{cfg.label}</Tag>;
      },
    },
    {
      title: 'Hành động', key: 'action', width: 200, align: 'center' as const,
      render: (_: unknown, record: MuonTra) => (
        <Button
          type="primary"
          danger
          size="small"
          icon={<CheckCircleOutlined />}
          onClick={() => handleGhiNhanChoMuon(record)}
          style={{ borderRadius: 6, fontWeight: 500 }}
        >
          Ghi nhận cho mượn
        </Button>
      ),
    },
  ];

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 18 }}>📦</span>
        <Title level={5} style={{ margin: 0, color: '#1677ff' }}>Chờ Giao Thiết Bị ({data.length})</Title>
      </div>
      <Card styles={{ body: { padding: 0 } }} style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
        <Table columns={columns} dataSource={data} pagination={false} size="middle" rowKey="key" locale={{ emptyText: 'Không có thiết bị nào chờ giao' }} />
      </Card>
    </div>
  );
};

export default BangChoGiao;
