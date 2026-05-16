import React from 'react';
import { Row, Col, Card, Tag, Typography, Table, Progress } from 'antd';
import {
  LaptopOutlined, FileTextOutlined, CheckCircleOutlined,
  SwapOutlined, WarningOutlined, TrophyOutlined,
  BarChartOutlined, PieChartOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

/* ── Summary cards data ── */
const summaryCards = [
  { label: 'Tổng thiết bị', value: 8, icon: <LaptopOutlined />, color: '#1677ff', bg: '#e6f4ff' },
  { label: 'Tổng yêu cầu', value: 6, icon: <FileTextOutlined />, color: '#722ed1', bg: '#f9f0ff' },
  { label: 'Chờ duyệt', value: 1, icon: <CheckCircleOutlined />, color: '#fa8c16', bg: '#fff7e6' },
  { label: 'Đang mượn', value: 1, icon: <SwapOutlined />, color: '#52c41a', bg: '#f6ffed' },
  { label: 'Quá hạn', value: 1, icon: <WarningOutlined />, color: '#f5222d', bg: '#fff1f0' },
  { label: 'Đã hoàn thành', value: 1, icon: <TrophyOutlined />, color: '#13c2c2', bg: '#e6fffb' },
];

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

/* ── Status distribution ── */
const statusDist = [
  { label: 'Chờ duyệt', color: '#fa8c16', bg: '#fff7e6', count: 1, pct: 17 },
  { label: 'Đã duyệt', color: '#1677ff', bg: '#e6f4ff', count: 1, pct: 17 },
  { label: 'Đang mượn', color: '#52c41a', bg: '#f6ffed', count: 1, pct: 17 },
  { label: 'Đã trả', color: '#8c8c8c', bg: '#fafafa', count: 1, pct: 17 },
  { label: 'Từ chối', color: '#ff4d4f', bg: '#fff1f0', count: 1, pct: 17 },
  { label: 'Quá hạn', color: '#f5222d', bg: '#fff1f0', count: 1, pct: 17 },
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

const ThongKe: React.FC = () => {
  return (
    <div>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <BarChartOutlined style={{ fontSize: 22, color: '#1677ff' }} />
        <Title level={4} style={{ margin: 0 }}>Thống Kê Hệ Thống</Title>
      </div>

      {/* Summary cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {summaryCards.map((c) => (
          <Col xs={12} sm={8} md={4} key={c.label}>
            <Card
              hoverable
              style={{ borderRadius: 12, border: `1px solid ${c.color}20`, textAlign: 'center' }}
              styles={{ body: { padding: '16px 12px' } }}
            >
              <Text type="secondary" style={{ fontSize: 13 }}>{c.label}</Text>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ fontSize: 20, color: c.color }}>{c.icon}</span>
                <span style={{ fontSize: 28, fontWeight: 700, color: c.color }}>{c.value}</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Bottom sections */}
      <Row gutter={[16, 16]}>
        {/* Top thiết bị mượn nhiều */}
        <Col xs={24} md={14}>
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
        </Col>

        {/* Phân bố trạng thái */}
        <Col xs={24} md={10}>
          <Card
            title={
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PieChartOutlined style={{ color: '#722ed1' }} />
                <span>Phân Bố Trạng Thái Yêu Cầu</span>
              </span>
            }
            style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}
            styles={{ body: { padding: '16px 20px' } }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {statusDist.map((s) => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Tag style={{ minWidth: 80, textAlign: 'center', color: s.color, backgroundColor: s.bg, border: `1px solid ${s.color}30`, borderRadius: 6, fontWeight: 600, fontSize: 12 }}>
                    {s.label}
                  </Tag>
                  <Progress
                    percent={s.pct}
                    showInfo={false}
                    strokeColor={s.color}
                    trailColor="#f5f5f5"
                    style={{ flex: 1, margin: 0 }}
                    size="small"
                  />
                  <Text style={{ minWidth: 20, textAlign: 'right', fontWeight: 500 }}>{s.count}</Text>
                  <Text type="secondary" style={{ minWidth: 36 }}>{s.pct}%</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ThongKe;
