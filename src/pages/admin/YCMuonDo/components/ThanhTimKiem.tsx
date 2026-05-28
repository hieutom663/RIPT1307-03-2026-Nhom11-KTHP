import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface Props {
  searchText: string;
  onChange: (value: string) => void;
}

const ThanhTimKiem: React.FC<Props> = ({ searchText, onChange }) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <Input
        placeholder="Tìm theo tên SV hoặc tên thiết bị…"
        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
        value={searchText}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: 320, borderRadius: 8 }}
        allowClear
      />
    </div>
  );
};

export default ThanhTimKiem;
