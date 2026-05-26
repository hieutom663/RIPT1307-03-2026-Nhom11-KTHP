import React from 'react';
import { Alert, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Props {
  quaHanCount: number;
}

const CanhBaoQuaHan: React.FC<Props> = ({ quaHanCount }) => {
  if (quaHanCount <= 0) return null;

  return (
    <Alert
      message={<Text strong>Có {quaHanCount} yêu cầu quá hạn trả!</Text>}
      description="Vui lòng liên hệ sinh viên để nhắc nhở trả thiết bị."
      type="error"
      showIcon
      icon={<ExclamationCircleOutlined />}
      style={{ marginBottom: 24, borderRadius: 10 }}
    />
  );
};

export default CanhBaoQuaHan;
