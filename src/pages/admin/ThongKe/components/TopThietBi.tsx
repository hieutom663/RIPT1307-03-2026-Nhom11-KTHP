import React, { useState, useEffect } from 'react';
import { Card, Tag, Typography, Table, Spin, message } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import { getTopThietBiAPI } from '@/services/ThongKe/api';

const { Text } = Typography;

interface TopThietBiItem {
  key: string;
  rank: number;
  ten: string;
  danhMuc: string;
  luot: number;
  medal: string;
}

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
    render: (_: unknown, r: TopThietBiItem) => (
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
  const [data, setData] = useState<TopThietBiItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getTopThietBiAPI();
        if (res.data.success) {
          setData(res.data.data);
        } else {
          message.error(res.data.message || 'Lỗi khi tải top thiết bị');
        }
      } catch (error) {
        console.error('Lỗi fetch top thiết bị:', error);
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
          <TrophyOutlined style={{ color: '#fa8c16' }} />
          <span>Top Thiết Bị Mượn Nhiều</span>
        </span>
      }
      style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}
      styles={{ body: { padding: 0 } }}
    >
      <Spin spinning={loading}>
        <Table
          columns={topColumns}
          dataSource={data}
          pagination={false}
          size="small"
          rowKey="key"
        />
      </Spin>
    </Card>
  );
};

export default TopEquipment;
