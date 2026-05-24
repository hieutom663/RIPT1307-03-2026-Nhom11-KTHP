import React, { useState } from 'react';
import { Typography } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import ThanhTimKiem from './components/ThanhTimKiem';
import BoLocTrangThai from './components/BoLocTrangThai';
import BangYeuCau from './components/BangYeuCau';

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

const mockData: YeuCauMuon[] = [
  { key: '1', maYC: 'YC001', tenSV: 'Nguyễn Văn An', maSV: 'SV001', thietBi: 'Loa JBL PartyBox', soLuong: 1, ngayMuon: '2026-05-10', ngayTraDK: '2026-05-12', trangThai: 'cho_duyet' },
  { key: '2', maYC: 'YC002', tenSV: 'Trần Thị Bình', maSV: 'SV002', thietBi: 'Máy chiếu Epson', soLuong: 1, ngayMuon: '2026-05-06', ngayTraDK: '2026-05-09', trangThai: 'da_duyet' },
  { key: '3', maYC: 'YC003', tenSV: 'Lê Văn Cường', maSV: 'SV003', thietBi: 'Micro không dây Shure', soLuong: 2, ngayMuon: '2026-05-05', ngayTraDK: '2026-05-07', trangThai: 'dang_muon' },
  { key: '4', maYC: 'YC004', tenSV: 'Phạm Thị Dung', maSV: 'SV004', thietBi: 'Bàn ghế sự kiện', soLuong: 5, ngayMuon: '2026-04-25', ngayTraDK: '2026-04-27', trangThai: 'da_tra' },
  { key: '5', maYC: 'YC005', tenSV: 'Hoàng Văn Em', maSV: 'SV005', thietBi: 'Laptop Dell XPS', soLuong: 1, ngayMuon: '2026-04-20', ngayTraDK: '2026-04-22', trangThai: 'qua_han' },
  { key: '6', maYC: 'YC006', tenSV: 'Vũ Thị Phương', maSV: 'SV006', thietBi: 'Loa JBL PartyBox', soLuong: 1, ngayMuon: '2026-05-01', ngayTraDK: '2026-05-03', trangThai: 'tu_choi' },
];

const YCMuonDo: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('tat_ca');
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<YeuCauMuon[]>(mockData);

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

      <BangYeuCau data={filteredData} onDataChange={setData} />
    </div>
  );
};

export default YCMuonDo;