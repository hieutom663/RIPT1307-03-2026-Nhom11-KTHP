import React from 'react';
import { Row, Col, Typography, ConfigProvider } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import SummaryCards from './components/TheTongQuan';
import TopEquipment from './components/TopThietBi';
import StatusDistribution from './components/PhanBoTrangThai';

const { Title, Text } = Typography;

const ThongKe: React.FC = () => {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#cf1322' } }}>
      <div style={{ minHeight: 'calc(100vh - 64px)' }}>
        
        {/* Header chuẩn form Admin */}
        <div style={{ marginBottom: 32 }}>
          <Title level={3} style={{ margin: 0, color: '#262626', display: 'flex', alignItems: 'center' }}>
            <BarChartOutlined style={{ color: '#cf1322', marginRight: 12 }} />
            Báo Cáo Thống Kê Hệ Thống
          </Title>
          <Text type="secondary">Tổng hợp số liệu mượn trả, phân tích tần suất sử dụng thiết bị và trạng thái yêu cầu</Text>
        </div>

        {/* Thẻ tổng quan */}
        <div style={{ marginBottom: 24 }}>
          <SummaryCards />
        </div>

        {/* Các biểu đồ chi tiết */}
        <Row gutter={[24, 24]}>
          {/* Top thiết bị mượn nhiều */}
          <Col xs={24} xl={14}>
            <TopEquipment />
          </Col>

          {/* Phân bố trạng thái */}
          <Col xs={24} xl={10}>
            <StatusDistribution />
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default ThongKe;