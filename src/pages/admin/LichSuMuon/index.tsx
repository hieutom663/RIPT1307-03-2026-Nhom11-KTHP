import React, { useState } from 'react';
import { Table, Tag, Button, Typography, Card, Alert, Space, Modal, message } from 'antd';
import { SwapOutlined, WarningOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CarryOutOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface MuonTra {
  key: string;
  maYC: string;
  tenSV: string;
  maSV: string;
  thietBi: string;
  soLuong: number;
  ngayMuon: string;
  hanTra: string;
  trangThai: 'da_duyet' | 'dang_muon' | 'qua_han';
}

const statusConfig: Record<MuonTra['trangThai'], { label: string; color: string; bg: string }> = {
  da_duyet: { label: 'Đã duyệt', color: '#1677ff', bg: '#e6f4ff' },
  dang_muon: { label: 'Đang mượn', color: '#52c41a', bg: '#f6ffed' },
  qua_han: { label: 'Quá hạn', color: '#f5222d', bg: '#fff1f0' },
};

const choGiaoData: MuonTra[] = [
  { key: 'g1', maYC: 'YC002', tenSV: 'Trần Thị Bình', maSV: 'SV002', thietBi: 'Máy chiếu Epson', soLuong: 1, ngayMuon: '2026-05-06', hanTra: '2026-05-09', trangThai: 'da_duyet' },
];

const dangMuonData: MuonTra[] = [
  { key: 'm1', maYC: 'YC003', tenSV: 'Lê Văn Cường', maSV: 'SV003', thietBi: 'Micro không dây Shure', soLuong: 2, ngayMuon: '2026-05-05', hanTra: '2026-05-07', trangThai: 'dang_muon' },
  { key: 'm2', maYC: 'YC005', tenSV: 'Hoàng Văn Em', maSV: 'SV005', thietBi: 'Laptop Dell XPS', soLuong: 1, ngayMuon: '2026-04-20', hanTra: '2026-04-22', trangThai: 'qua_han' },
];

const GhiNhanMuonTra: React.FC = () => {
  const [choGiao, setChoGiao] = useState(choGiaoData);
  const [dangMuon, setDangMuon] = useState(dangMuonData);

  const quaHanCount = dangMuon.filter((r) => r.trangThai === 'qua_han').length;

  const handleGhiNhanChoMuon = (record: MuonTra) => {
    Modal.confirm({
      title: 'Ghi nhận cho mượn',
      content: `Xác nhận đã giao thiết bị "${record.thietBi}" cho ${record.tenSV}?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        setChoGiao((prev) => prev.filter((r) => r.key !== record.key));
        setDangMuon((prev) => [...prev, { ...record, key: `m_${record.key}`, trangThai: 'dang_muon' as const }]);
        message.success(`Đã ghi nhận cho mượn: ${record.thietBi}`);
      },
    });
  };

  const handleGhiNhanDaTra = (record: MuonTra) => {
    Modal.confirm({
      title: 'Ghi nhận đã trả',
      content: `Xác nhận ${record.tenSV} đã trả "${record.thietBi}"?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        setDangMuon((prev) => prev.filter((r) => r.key !== record.key));
        message.success(`Đã ghi nhận trả: ${record.thietBi}`);
      },
    });
  };

  const choGiaoColumns: ColumnsType<MuonTra> = [
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

  const dangMuonColumns: ColumnsType<MuonTra> = [
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <SwapOutlined style={{ fontSize: 22, color: '#1677ff' }} />
        <Title level={4} style={{ margin: 0 }}>Ghi Nhận Mượn / Trả</Title>
      </div>

      {quaHanCount > 0 && (
        <Alert
          message={<Text strong>Có {quaHanCount} yêu cầu quá hạn trả!</Text>}
          description="Vui lòng liên hệ sinh viên để nhắc nhở trả thiết bị."
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: 24, borderRadius: 10 }}
        />
      )}

      {/* Section: Chờ Giao Thiết Bị */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>📦</span>
          <Title level={5} style={{ margin: 0, color: '#1677ff' }}>Chờ Giao Thiết Bị ({choGiao.length})</Title>
        </div>
        <Card styles={{ body: { padding: 0 } }} style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
          <Table columns={choGiaoColumns} dataSource={choGiao} pagination={false} size="middle" rowKey="key" locale={{ emptyText: 'Không có thiết bị nào chờ giao' }} />
        </Card>
      </div>

      {/* Section: Đang Mượn */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>🔄</span>
          <Title level={5} style={{ margin: 0, color: '#fa8c16' }}>Đang Mượn ({dangMuon.length})</Title>
        </div>
        <Card styles={{ body: { padding: 0 } }} style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
          <Table columns={dangMuonColumns} dataSource={dangMuon} pagination={false} size="middle" rowKey="key" locale={{ emptyText: 'Không có thiết bị nào đang mượn' }} />
        </Card>
      </div>
    </div>
  );
};

export default GhiNhanMuonTra;
