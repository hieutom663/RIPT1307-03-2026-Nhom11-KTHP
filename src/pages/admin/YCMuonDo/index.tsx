import React, { useState } from 'react';
import { Table, Tag, Button, Input, Space, Badge, Typography, Card, Tooltip, Modal, message } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, SearchOutlined, FileTextOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface YeuCauMuon {
  key: string;
  maYC: string;
  tenSV: string;
  maSV: string;
  thietBi: string;
  soLuong: number;
  ngayMuon: string;
  ngayTraDK: string;
  trangThai: 'cho_duyet' | 'da_duyet' | 'dang_muon' | 'da_tra' | 'qua_han' | 'tu_choi';
}

type FilterStatus = 'tat_ca' | YeuCauMuon['trangThai'];

const statusConfig: Record<YeuCauMuon['trangThai'], { label: string; color: string; bg: string }> = {
  cho_duyet: { label: 'Chờ duyệt', color: '#fa8c16', bg: '#fff7e6' },
  da_duyet: { label: 'Đã duyệt', color: '#1677ff', bg: '#e6f4ff' },
  dang_muon: { label: 'Đang mượn', color: '#52c41a', bg: '#f6ffed' },
  da_tra: { label: 'Đã trả', color: '#8c8c8c', bg: '#fafafa' },
  qua_han: { label: 'Quá hạn', color: '#f5222d', bg: '#fff1f0' },
  tu_choi: { label: 'Từ chối', color: '#ff4d4f', bg: '#fff1f0' },
};

const filterTabs: { key: FilterStatus; label: string; color: string }[] = [
  { key: 'tat_ca', label: 'Tất cả', color: '#1677ff' },
  { key: 'cho_duyet', label: 'Chờ duyệt', color: '#fa8c16' },
  { key: 'da_duyet', label: 'Đã duyệt', color: '#1677ff' },
  { key: 'dang_muon', label: 'Đang mượn', color: '#52c41a' },
  { key: 'qua_han', label: 'Quá hạn', color: '#f5222d' },
  { key: 'da_tra', label: 'Đã trả', color: '#8c8c8c' },
  { key: 'tu_choi', label: 'Từ chối', color: '#ff4d4f' },
];

const mockData: YeuCauMuon[] = [
  { key: '1', maYC: 'YC001', tenSV: 'Nguyễn Văn An', maSV: 'SV001', thietBi: 'Loa JBL PartyBox', soLuong: 1, ngayMuon: '2026-05-10', ngayTraDK: '2026-05-12', trangThai: 'cho_duyet' },
  { key: '2', maYC: 'YC002', tenSV: 'Trần Thị Bình', maSV: 'SV002', thietBi: 'Máy chiếu Epson', soLuong: 1, ngayMuon: '2026-05-06', ngayTraDK: '2026-05-09', trangThai: 'da_duyet' },
  { key: '3', maYC: 'YC003', tenSV: 'Lê Văn Cường', maSV: 'SV003', thietBi: 'Micro không dây Shure', soLuong: 2, ngayMuon: '2026-05-05', ngayTraDK: '2026-05-07', trangThai: 'dang_muon' },
  { key: '4', maYC: 'YC004', tenSV: 'Phạm Thị Dung', maSV: 'SV004', thietBi: 'Bàn ghế sự kiện', soLuong: 5, ngayMuon: '2026-04-25', ngayTraDK: '2026-04-27', trangThai: 'da_tra' },
  { key: '5', maYC: 'YC005', tenSV: 'Hoàng Văn Em', maSV: 'SV005', thietBi: 'Laptop Dell XPS', soLuong: 1, ngayMuon: '2026-04-20', ngayTraDK: '2026-04-22', trangThai: 'qua_han' },
  { key: '6', maYC: 'YC006', tenSV: 'Vũ Thị Phương', maSV: 'SV006', thietBi: 'Loa JBL PartyBox', soLuong: 1, ngayMuon: '2026-05-01', ngayTraDK: '2026-05-03', trangThai: 'tu_choi' },
];

const YCMuonDo: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('tat_ca');
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<YeuCauMuon[]>(mockData);

  const getStatusCount = (status: FilterStatus) => {
    if (status === 'tat_ca') return data.length;
    return data.filter((r) => r.trangThai === status).length;
  };

  const filteredData = data
    .filter((r) => activeFilter === 'tat_ca' || r.trangThai === activeFilter)
    .filter((r) =>
      searchText === '' ||
      r.tenSV.toLowerCase().includes(searchText.toLowerCase()) ||
      r.thietBi.toLowerCase().includes(searchText.toLowerCase()) ||
      r.maYC.toLowerCase().includes(searchText.toLowerCase()),
    );

  const handleDuyet = (record: YeuCauMuon) => {
    Modal.confirm({
      title: 'Xác nhận duyệt',
      content: `Duyệt yêu cầu ${record.maYC} của ${record.tenSV}?`,
      okText: 'Duyệt',
      cancelText: 'Hủy',
      onOk: () => {
        setData((prev) => prev.map((r) => (r.key === record.key ? { ...r, trangThai: 'da_duyet' as const } : r)));
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
        setData((prev) => prev.map((r) => (r.key === record.key ? { ...r, trangThai: 'tu_choi' as const } : r)));
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
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <FileTextOutlined style={{ fontSize: 22, color: '#1677ff' }} />
        <Title level={4} style={{ margin: 0 }}>Quản Lý Yêu Cầu Mượn</Title>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm theo tên SV hoặc tên thiết bị…"
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 320, borderRadius: 8 }}
          allowClear
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20, alignItems: 'center' }}>
        {filterTabs.map((t) => {
          const count = getStatusCount(t.key);
          const isActive = activeFilter === t.key;
          return (
            <div
              key={t.key}
              onClick={() => setActiveFilter(t.key)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 20,
                cursor: 'pointer', fontSize: 13, fontWeight: isActive ? 600 : 400,
                color: isActive ? '#fff' : '#595959', backgroundColor: isActive ? t.color : '#fafafa',
                border: `1px solid ${isActive ? t.color : '#e8e8e8'}`, transition: 'all .2s ease', userSelect: 'none',
              }}
            >
              {t.label}
              <Badge
                count={count}
                style={{
                  backgroundColor: isActive ? '#fff' : t.color,
                  color: isActive ? t.color : '#fff',
                  fontSize: 11, boxShadow: 'none', minWidth: 20, height: 20, lineHeight: '20px',
                }}
              />
            </div>
          );
        })}
      </div>

      <Card styles={{ body: { padding: 0 } }} style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5, showTotal: (total) => `Tổng ${total} yêu cầu`, style: { marginRight: 16 } }}
          size="middle"
          rowKey="key"
        />
      </Card>
    </div>
  );
};

export default YCMuonDo;