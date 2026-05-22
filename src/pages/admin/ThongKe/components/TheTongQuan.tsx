import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import {
  LaptopOutlined, FileTextOutlined, CheckCircleOutlined,
  SwapOutlined, WarningOutlined, TrophyOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const summaryCards = [
  { label: 'Tổng thiết bị', value: 8, icon: <LaptopOutlined />, color: '#1677ff', bg: '#e6f4ff' },
  { label: 'Tổng yêu cầu', value: 6, icon: <FileTextOutlined />, color: '#722ed1', bg: '#f9f0ff' },
  { label: 'Chờ duyệt', value: 1, icon: <CheckCircleOutlined />, color: '#fa8c16', bg: '#fff7e6' },
  { label: 'Đang mượn', value: 1, icon: <SwapOutlined />, color: '#52c41a', bg: '#f6ffed' },
  { label: 'Quá hạn', value: 1, icon: <WarningOutlined />, color: '#f5222d', bg: '#fff1f0' },
  { label: 'Đã hoàn thành', value: 1, icon: <TrophyOutlined />, color: '#13c2c2', bg: '#e6fffb' },
];

const SummaryCards: React.FC = () => {
  return (
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
  );
};

export default SummaryCards;
