import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Spin, message } from 'antd';
import {
  LaptopOutlined, FileTextOutlined, CheckCircleOutlined,
  SwapOutlined, WarningOutlined, TrophyOutlined,
} from '@ant-design/icons';
import { getThongKeTongQuanAPI } from '@/services/ThongKe/api';

const { Text } = Typography;

interface ThongKeData {
  tongThietBi: number;
  tongYeuCau: number;
  choDuyet: number;
  dangMuon: number;
  quaHan: number;
  daHoanThanh: number;
}

const iconMap = [
  { key: 'tongThietBi', label: 'Tổng thiết bị', icon: <LaptopOutlined />, color: '#1677ff', bg: '#e6f4ff' },
  { key: 'tongYeuCau', label: 'Tổng yêu cầu', icon: <FileTextOutlined />, color: '#722ed1', bg: '#f9f0ff' },
  { key: 'choDuyet', label: 'Chờ duyệt', icon: <CheckCircleOutlined />, color: '#fa8c16', bg: '#fff7e6' },
  { key: 'dangMuon', label: 'Đang mượn', icon: <SwapOutlined />, color: '#52c41a', bg: '#f6ffed' },
  { key: 'quaHan', label: 'Quá hạn', icon: <WarningOutlined />, color: '#f5222d', bg: '#fff1f0' },
  { key: 'daHoanThanh', label: 'Đã hoàn thành', icon: <TrophyOutlined />, color: '#13c2c2', bg: '#e6fffb' },
];

const SummaryCards: React.FC = () => {
  const [data, setData] = useState<ThongKeData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getThongKeTongQuanAPI();
        if (res.data.success) {
          setData(res.data.data);
        } else {
          message.error(res.data.message || 'Lỗi khi tải thống kê');
        }
      } catch (error) {
        console.error('Lỗi fetch thống kê tổng quan:', error);
        message.error('Không thể kết nối đến server');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {iconMap.map((c) => (
          <Col xs={12} sm={8} md={4} key={c.label}>
            <Card
              hoverable
              style={{ borderRadius: 12, border: `1px solid ${c.color}20`, textAlign: 'center' }}
              styles={{ body: { padding: '16px 12px' } }}
            >
              <Text type="secondary" style={{ fontSize: 13 }}>{c.label}</Text>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ fontSize: 20, color: c.color }}>{c.icon}</span>
                <span style={{ fontSize: 28, fontWeight: 700, color: c.color }}>
                  {data ? (data as any)[c.key] : 0}
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Spin>
  );
};

export default SummaryCards;
