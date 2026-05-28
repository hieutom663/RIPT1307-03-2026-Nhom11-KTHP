import React from 'react';
import { Row, Col, Typography } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import SummaryCards from './components/TheTongQuan';
import TopEquipment from './components/TopThietBi';
import StatusDistribution from './components/PhanBoTrangThai';

const { Title } = Typography;

const ThongKe: React.FC = () => {
  return (
    <div>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <BarChartOutlined style={{ fontSize: 22, color: '#1677ff' }} />
        <Title level={4} style={{ margin: 0 }}>Thống Kê Hệ Thống</Title>
      </div>

      {/* Summary cards */}
      <SummaryCards />

      {/* Bottom sections */}
      <Row gutter={[16, 16]}>
        {/* Top thiết bị mượn nhiều */}
        <Col xs={24} md={14}>
          <TopEquipment />
        </Col>

        {/* Phân bố trạng thái */}
        <Col xs={24} md={10}>
          <StatusDistribution />
        </Col>
      </Row>
    </div>
  );
};

export default ThongKe;
