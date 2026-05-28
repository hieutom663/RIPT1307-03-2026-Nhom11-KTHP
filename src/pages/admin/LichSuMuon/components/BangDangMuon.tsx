import React from 'react';
import { Table, Tag, Button, Typography, Card, Space, Modal, message } from 'antd';
import { WarningOutlined, CarryOutOutlined } from '@ant-design/icons';
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
  onDaTra: (record: MuonTra) => void;
}

const BangDangMuon: React.FC<Props> = ({ data, onDaTra }) => {
  const handleGhiNhanDaTra = (record: MuonTra) => {
    Modal.confirm({
      title: 'Ghi nhận đã trả',
      content: `Xác nhận ${record.tenSV} đã trả "${record.thietBi}"?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        onDaTra(record);
        message.success(`Đã ghi nhận trả: ${record.thietBi}`);
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
      title: 'Hành động', key: 'action', width: 220, align: 'center' as const,
      render: (_: unknown, record: MuonTra) => (
        <Space direction="vertical" size={4}>
          {record.trangThai === 'qua_han' && (
            <Tag color="error" icon={<WarningOutlined />} style={{ borderRadius: 6, fontWeight: 500 }}>
              Quá hạn trả!
            </Tag>
          )}
          <Button
            size="small"
            type="primary"
            icon={<CarryOutOutlined />}
            onClick={() => handleGhiNhanDaTra(record)}
            style={{ borderRadius: 6, fontWeight: 500, background: '#52c41a', borderColor: '#52c41a' }}
          >
            Ghi nhận đã trả
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 18 }}>🔄</span>
        <Title level={5} style={{ margin: 0, color: '#fa8c16' }}>Đang Mượn ({data.length})</Title>
      </div>
      <Card styles={{ body: { padding: 0 } }} style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
        <Table columns={columns} dataSource={data} pagination={false} size="middle" rowKey="key" locale={{ emptyText: 'Không có thiết bị nào đang mượn' }} />
      </Card>
    </div>
  );
};

export default BangDangMuon;
