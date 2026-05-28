import React from 'react';
import { Badge } from 'antd';
import type { FilterStatus } from '../index';

const filterTabs: { key: FilterStatus; label: string; color: string }[] = [
  { key: 'tat_ca', label: 'Tất cả', color: '#1677ff' },
  { key: 'cho_duyet', label: 'Chờ duyệt', color: '#fa8c16' },
  { key: 'da_duyet', label: 'Đã duyệt', color: '#1677ff' },
  { key: 'dang_muon', label: 'Đang mượn', color: '#52c41a' },
  { key: 'qua_han', label: 'Quá hạn', color: '#f5222d' },
  { key: 'da_tra', label: 'Đã trả', color: '#8c8c8c' },
  { key: 'tu_choi', label: 'Từ chối', color: '#ff4d4f' },
];

interface Props {
  activeFilter: FilterStatus;
  onFilterChange: (key: FilterStatus) => void;
  getStatusCount: (status: FilterStatus) => number;
}

const BoLocTrangThai: React.FC<Props> = ({ activeFilter, onFilterChange, getStatusCount }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20, alignItems: 'center' }}>
      {filterTabs.map((t) => {
        const count = getStatusCount(t.key);
        const isActive = activeFilter === t.key;
        return (
          <div
            key={t.key}
            onClick={() => onFilterChange(t.key)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 20,
              cursor: 'pointer', fontSize: 13, fontWeight: isActive ? 600 : 400,
              color: isActive ? '#fff' : '#595959', backgroundColor: isActive ? t.color : '#fafafa',
              border: `1px solid ${isActive ? t.color : '#e8e8e8'}`, transition: 'all .2s ease', userSelect: 'none',
            }}
          >
            {t.label}
            <Badge
              count={count}
              style={{
                backgroundColor: isActive ? '#fff' : t.color,
                color: isActive ? t.color : '#fff',
                fontSize: 11, boxShadow: 'none', minWidth: 20, height: 20, lineHeight: '20px',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default BoLocTrangThai;
