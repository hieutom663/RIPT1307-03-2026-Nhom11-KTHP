import { useState, useEffect } from 'react';
import { Card, Tag, Typography, Table, Spin, message } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import { getTopThietBiAPI } from '@/services/ThongKe/api';
import styles from '../../../../global.less'; 


const { Text } = Typography;

interface TopThietBiItem {
  key: string;
  rank: number;
  ten: string;
  danhMuc: string;
  luot: number;
  medal: string;
}

const defaultTagStyle = { color: '#595959', bg: '#fafafa', border: '#d9d9d9' };

const topColumns = [
  {
    title: 'Hạng', key: 'rank', width: 60, align: 'center' as const,
    render: (_: unknown, r: TopThietBiItem) => (
      <span style={{ fontSize: r.medal ? 20 : 14 }}>{r.medal || r.rank}</span>
    ),
  },
  { 
    title: 'Tên thiết bị', dataIndex: 'ten', key: 'ten', width: 180 
  },
  {
    title: 'Danh mục', dataIndex: 'danhMuc', key: 'danhMuc', width: 120,
    responsive: ['md'] as any, 
    render: (v: string) => {
      return <Tag style={{ color: defaultTagStyle.color, backgroundColor: defaultTagStyle.bg, border: `1px solid ${defaultTagStyle.border}`, borderRadius: 6, fontWeight: 500 }}>{v}</Tag>;
    },
  },
  {
    title: 'Lượt mượn', dataIndex: 'luot', key: 'luot', width: 90, align: 'center' as const,
    render: (v: number) => <Text type={v > 0 ? undefined : 'secondary'} strong>{v}</Text>, 
  },
];

const TopEquipment = () => {
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
          <TrophyOutlined style={{ color: '#fa8c16', fontSize: '18px' }} />
          <span style={{ fontWeight: 600 }}>Top Thiết Bị Mượn Nhiều</span>
        </span>
      }
      style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,.03)', border: 'none' }}
      styles={{ body: { padding: 0 } }}
    >
      <Spin spinning={loading}>
        <Table
          className={styles.tableResponsive}
          columns={topColumns}
          dataSource={data}
          scroll={{ x: 'max-content' }} 
          pagination={{ 
            pageSize: 5, 
            showSizeChanger: false, 
            position: ['bottomCenter'] 
          }} 
          size="small"
          rowKey="key"
        />
      </Spin>
    </Card>
  );
};

export default TopEquipment;