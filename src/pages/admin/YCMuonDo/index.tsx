import React, { useState, useEffect, useMemo } from 'react';
import { Typography, message, Spin, Card, ConfigProvider } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import ThanhTimKiem from './components/ThanhTimKiem';
import BoLocTrangThai from './components/BoLocTrangThai';
import BangYeuCau from './components/BangYeuCau';
import { getDanhSachYeuCauAPI } from '@/services/YeuCauMuon/api';

const { Title, Text } = Typography;

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

  const filteredData = useMemo(() => {
    return data
      .filter((r) => activeFilter === 'tat_ca' || r.trangThai === activeFilter)
      .filter((r) =>
        searchText === '' ||
        r.tenSV.toLowerCase().includes(searchText.toLowerCase()) ||
        r.thietBi.toLowerCase().includes(searchText.toLowerCase()) ||
        r.maYC.toLowerCase().includes(searchText.toLowerCase()),
      );
  }, [data, activeFilter, searchText]);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#cf1322' } }}>
      <div style={{minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <FileTextOutlined style={{ fontSize: 24, color: '#cf1322' }} />
            <div>
              <Title level={3} style={{ margin: 0, color: '#262626' }}>Quản Lý Phiếu Mượn & Trả Thiết Bị</Title>
              <Text type="secondary">Phê duyệt các yêu cầu đăng ký mới, theo dõi thiết bị đang cho sinh viên mượn và thu hồi đồ dùng</Text>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: 24 }}>
            <ThanhTimKiem searchText={searchText} onChange={setSearchText} />
            
            <BoLocTrangThai
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              getStatusCount={getStatusCount}
            />
          </div>

          <Spin spinning={loading} description="Đang tải dữ liệu phiếu mượn...">
            <BangYeuCau data={filteredData} onRefresh={fetchData} />
          </Spin>
      </div>
    </ConfigProvider>
  );
};

export default YCMuonDo;