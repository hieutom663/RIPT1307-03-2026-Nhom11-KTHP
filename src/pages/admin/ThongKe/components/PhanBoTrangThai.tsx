import React from 'react';
import { Card, Tag, Typography, Progress } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';

const { Text } = Typography;

/* ── Status distribution ── */
const statusDist = [
  { label: 'Chờ duyệt', color: '#fa8c16', bg: '#fff7e6', count: 1, pct: 17 },
  { label: 'Đã duyệt', color: '#1677ff', bg: '#e6f4ff', count: 1, pct: 17 },
  { label: 'Đang mượn', color: '#52c41a', bg: '#f6ffed', count: 1, pct: 17 },
  { label: 'Đã trả', color: '#8c8c8c', bg: '#fafafa', count: 1, pct: 17 },
  { label: 'Từ chối', color: '#ff4d4f', bg: '#fff1f0', count: 1, pct: 17 },
  { label: 'Quá hạn', color: '#f5222d', bg: '#fff1f0', count: 1, pct: 17 },
];

const StatusDistribution: React.FC = () => {
  return (
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
  );
};

export default StatusDistribution;
