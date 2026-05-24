import React from 'react';
import { Table, Tag, Button, Space, Typography, Card, Tooltip, Modal, message } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { YeuCauMuon } from '../index';

const { Text } = Typography;

const statusConfig: Record<YeuCauMuon['trangThai'], { label: string; color: string; bg: string }> = {
  cho_duyet: { label: 'Chờ duyệt', color: '#fa8c16', bg: '#fff7e6' },
  da_duyet: { label: 'Đã duyệt', color: '#1677ff', bg: '#e6f4ff' },
  dang_muon: { label: 'Đang mượn', color: '#52c41a', bg: '#f6ffed' },
  da_tra: { label: 'Đã trả', color: '#8c8c8c', bg: '#fafafa' },
  qua_han: { label: 'Quá hạn', color: '#f5222d', bg: '#fff1f0' },
  tu_choi: { label: 'Từ chối', color: '#ff4d4f', bg: '#fff1f0' },
};

interface Props {
  data: YeuCauMuon[];
  onDataChange: React.Dispatch<React.SetStateAction<YeuCauMuon[]>>;
}

const BangYeuCau: React.FC<Props> = ({ data, onDataChange }) => {
  const handleDuyet = (record: YeuCauMuon) => {
    Modal.confirm({
      title: 'Xác nhận duyệt',
      content: `Duyệt yêu cầu ${record.maYC} của ${record.tenSV}?`,
      okText: 'Duyệt',
      cancelText: 'Hủy',
      onOk: () => {
        onDataChange((prev) => prev.map((r) => (r.key === record.key ? { ...r, trangThai: 'da_duyet' as const } : r)));
        message.success(`Đã duyệt yêu cầu ${record.maYC}`);
      },
    });
  };

  const handleTuChoi = (record: YeuCauMuon) => {
    Modal.confirm({
      title: 'Xác nhận từ chối',
      content: `Từ chối yêu cầu ${record.maYC} của ${record.tenSV}?`,
      okText: 'Từ chối',
      okButtonProps: { danger: true },
      cancelText: 'Hủy',
      onOk: () => {
        onDataChange((prev) => prev.map((r) => (r.key === record.key ? { ...r, trangThai: 'tu_choi' as const } : r)));
        message.info(`Đã từ chối yêu cầu ${record.maYC}`);
      },
    });
  };

  const columns: ColumnsType<YeuCauMuon> = [
    {
      title: 'Mã YC', dataIndex: 'maYC', key: 'maYC', width: 100,
      render: (v: string) => <Text strong style={{ color: '#1677ff' }}>{v}</Text>,
    },
    {
      title: 'Sinh viên', key: 'sinhVien', width: 170,
      render: (_: unknown, r: YeuCauMuon) => (
        <div><Text strong>{r.tenSV}</Text><br /><Text type="secondary" style={{ fontSize: 12 }}>{r.maSV}</Text></div>
      ),
    },
    { title: 'Thiết bị', dataIndex: 'thietBi', key: 'thietBi', width: 200 },
    { title: 'SL', dataIndex: 'soLuong', key: 'soLuong', width: 60, align: 'center' as const },
    { title: 'Ngày mượn', dataIndex: 'ngayMuon', key: 'ngayMuon', width: 120 },
    { title: 'Ngày trả DK', dataIndex: 'ngayTraDK', key: 'ngayTraDK', width: 120 },
    {
      title: 'Trạng thái', key: 'trangThai', width: 130, align: 'center' as const,
      render: (_: unknown, r: YeuCauMuon) => {
        const cfg = statusConfig[r.trangThai];
        return (
          <Tag style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}30`, borderRadius: 6, fontWeight: 600, fontSize: 12, padding: '2px 12px' }}>
            {cfg.label}
          </Tag>
        );
      },
    },
    {
      title: 'Hành động', key: 'action', width: 220, align: 'center' as const,
      render: (_: unknown, record: YeuCauMuon) => (
        <Space size={4}>
          <Tooltip title="Xem chi tiết">
            <Button size="small" icon={<EyeOutlined />} style={{ borderColor: '#d9d9d9' }}>Xem</Button>
          </Tooltip>
          {record.trangThai === 'cho_duyet' && (
            <>
              <Tooltip title="Duyệt yêu cầu">
                <Button size="small" type="primary" icon={<CheckOutlined />} style={{ background: '#52c41a', borderColor: '#52c41a' }} onClick={() => handleDuyet(record)}>Duyệt</Button>
              </Tooltip>
              <Tooltip title="Từ chối">
                <Button size="small" danger icon={<CloseOutlined />} onClick={() => handleTuChoi(record)}>Từ chối</Button>
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card styles={{ body: { padding: 0 } }} style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5, showTotal: (total) => `Tổng ${total} yêu cầu`, style: { marginRight: 16 } }}
        size="middle"
        rowKey="key"
      />
    </Card>
  );
};

export default BangYeuCau;
