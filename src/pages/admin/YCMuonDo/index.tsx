import React, { useState, useEffect } from 'react';
import { Typography, message, Spin } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import ThanhTimKiem from './components/ThanhTimKiem';
import BoLocTrangThai from './components/BoLocTrangThai';
import BangYeuCau from './components/BangYeuCau';
import { getDanhSachYeuCauAPI } from '@/services/YeuCauMuon/api';

const { Title } = Typography;

export interface YeuCauMuon {
  key: string;
  maYC: string;
  tenSV: string;
  maSV: string;
  thietBi: string;
  soLuong: number;
  ngayMuon: string;
  ngayTraDK: string;
  trangThai: 'cho_duyet' | 'da_duyet' | 'dang_muon' | 'da_tra' | 'qua_han' | 'tu_choi';
}

export type FilterStatus = 'tat_ca' | YeuCauMuon['trangThai'];

const YCMuonDo: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('tat_ca');
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<YeuCauMuon[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch dữ liệu từ BE
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getDanhSachYeuCauAPI();
      if (res.data.success) {
        setData(res.data.data);
      } else {
        message.error(res.data.message || 'Lỗi khi tải dữ liệu');
      }
    } catch (error) {
      console.error('Lỗi fetch yêu cầu mượn:', error);
      message.error('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusCount = (status: FilterStatus) => {
    if (status === 'tat_ca') return data.length;
    return data.filter((r) => r.trangThai === status).length;
  };

  const filteredData = data
    .filter((r) => activeFilter === 'tat_ca' || r.trangThai === activeFilter)
    .filter((r) =>
      searchText === '' ||
      r.tenSV.toLowerCase().includes(searchText.toLowerCase()) ||
      r.thietBi.toLowerCase().includes(searchText.toLowerCase()) ||
      r.maYC.toLowerCase().includes(searchText.toLowerCase()),
    );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <FileTextOutlined style={{ fontSize: 22, color: '#1677ff' }} />
        <Title level={4} style={{ margin: 0 }}>Quản Lý Yêu Cầu Mượn</Title>
      </div>

      <ThanhTimKiem searchText={searchText} onChange={setSearchText} />

      <BoLocTrangThai
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        getStatusCount={getStatusCount}
      />

      <Spin spinning={loading}>
        <BangYeuCau data={filteredData} onRefresh={fetchData} />
      </Spin>
    </div>
  );
};

export default YCMuonDo;