import React, { useState, useEffect } from 'react';
import { Card, Tag, Typography, Progress, Spin, message } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import { getPhanBoTrangThaiAPI } from '@/services/ThongKe/api';

const { Text } = Typography;

interface StatusItem {
  label: string;
  color: string;
  bg: string;
  count: number;
  pct: number;
}

const StatusDistribution: React.FC = () => {
  const [data, setData] = useState<StatusItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getPhanBoTrangThaiAPI();
        if (res.data.success) {
          setData(res.data.data);
        } else {
          message.error(res.data.message || 'Lỗi khi tải phân bố trạng thái');
        }
      } catch (error) {
        console.error('Lỗi fetch phân bố trạng thái:', error);
        message.error('Không thể kết nối đến server');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      <Spin spinning={loading}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {data.map((s) => (
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
      </Spin>
    </Card>
  );
};

export default StatusDistribution;
