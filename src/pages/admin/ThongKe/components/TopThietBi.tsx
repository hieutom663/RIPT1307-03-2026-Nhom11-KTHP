import React from 'react';
import { Card, Tag, Typography, Table } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';

const { Text } = Typography;

/* ── Top equipment data ── */
const topEquipment = [
  { key: '1', rank: 1, ten: 'Loa JBL PartyBox', danhMuc: 'Âm thanh', luot: 2, medal: '🥇' },
  { key: '2', rank: 2, ten: 'Micro không dây Shure', danhMuc: 'Âm thanh', luot: 1, medal: '🥈' },
  { key: '3', rank: 3, ten: 'Máy chiếu Epson', danhMuc: 'Hình ảnh', luot: 1, medal: '🥉' },
  { key: '4', rank: 4, ten: 'Bàn ghế sự kiện', danhMuc: 'Nội thất', luot: 1, medal: '' },
  { key: '5', rank: 5, ten: 'Laptop Dell XPS', danhMuc: 'Điện tử', luot: 1, medal: '' },
  { key: '6', rank: 6, ten: 'Màn chiếu 100 inch', danhMuc: 'Hình ảnh', luot: 0, medal: '' },
  { key: '7', rank: 7, ten: 'Cờ banner sự kiện', danhMuc: 'Trang trí', luot: 0, medal: '' },
  { key: '8', rank: 8, ten: 'Máy ảnh Canon EOS', danhMuc: 'Hình ảnh', luot: 0, medal: '' },
];

const danhMucColors: Record<string, { color: string; bg: string }> = {
  'Âm thanh': { color: '#1677ff', bg: '#e6f4ff' },
  'Hình ảnh': { color: '#722ed1', bg: '#f9f0ff' },
  'Nội thất': { color: '#fa8c16', bg: '#fff7e6' },
  'Điện tử': { color: '#f5222d', bg: '#fff1f0' },
  'Trang trí': { color: '#13c2c2', bg: '#e6fffb' },
};

const topColumns = [
  {
    title: 'Hạng', key: 'rank', width: 70, align: 'center' as const,
    render: (_: unknown, r: typeof topEquipment[0]) => (
      <span style={{ fontSize: r.medal ? 20 : 14 }}>{r.medal || r.rank}</span>
    ),
  },
  { title: 'Tên thiết bị', dataIndex: 'ten', key: 'ten', width: 200 },
  {
    title: 'Danh mục', dataIndex: 'danhMuc', key: 'danhMuc', width: 120,
    render: (v: string) => {
      const c = danhMucColors[v] || { color: '#595959', bg: '#fafafa' };
      return <Tag style={{ color: c.color, backgroundColor: c.bg, border: `1px solid ${c.color}30`, borderRadius: 6, fontWeight: 500 }}>{v}</Tag>;
    },
  },
  {
    title: 'Lượt mượn', dataIndex: 'luot', key: 'luot', width: 100,
    render: (v: number) => <Text type={v > 0 ? undefined : 'secondary'}>{v} lượt</Text>,
  },
];

const TopEquipment: React.FC = () => {
  return (
    <Card
      title={
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrophyOutlined style={{ color: '#fa8c16' }} />
          <span>Top Thiết Bị Mượn Nhiều</span>
        </span>
      }
      style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}
      styles={{ body: { padding: 0 } }}
    >
      <Table
        columns={topColumns}
        dataSource={topEquipment}
        pagination={false}
        size="small"
        rowKey="key"
      />
    </Card>
  );
};

export default TopEquipment;
