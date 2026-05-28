import React, { useState } from 'react';
import { Typography } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import CanhBaoQuaHan from './components/CanhBaoQuaHan';
import BangChoGiao from './components/BangChoGiao';
import BangDangMuon from './components/BangDangMuon';

const { Title } = Typography;

export interface MuonTra {
  key: string;
  maYC: string;
  tenSV: string;
  maSV: string;
  thietBi: string;
  soLuong: number;
  ngayMuon: string;
  hanTra: string;
  trangThai: 'da_duyet' | 'dang_muon' | 'qua_han';
}

const choGiaoData: MuonTra[] = [
  { key: 'g1', maYC: 'YC002', tenSV: 'Trần Thị Bình', maSV: 'SV002', thietBi: 'Máy chiếu Epson', soLuong: 1, ngayMuon: '2026-05-06', hanTra: '2026-05-09', trangThai: 'da_duyet' },
];

const dangMuonData: MuonTra[] = [
  { key: 'm1', maYC: 'YC003', tenSV: 'Lê Văn Cường', maSV: 'SV003', thietBi: 'Micro không dây Shure', soLuong: 2, ngayMuon: '2026-05-05', hanTra: '2026-05-07', trangThai: 'dang_muon' },
  { key: 'm2', maYC: 'YC005', tenSV: 'Hoàng Văn Em', maSV: 'SV005', thietBi: 'Laptop Dell XPS', soLuong: 1, ngayMuon: '2026-04-20', hanTra: '2026-04-22', trangThai: 'qua_han' },
];

const GhiNhanMuonTra: React.FC = () => {
  const [choGiao, setChoGiao] = useState(choGiaoData);
  const [dangMuon, setDangMuon] = useState(dangMuonData);

  const quaHanCount = dangMuon.filter((r) => r.trangThai === 'qua_han').length;

  const handleChoMuon = (record: MuonTra) => {
    setChoGiao((prev) => prev.filter((r) => r.key !== record.key));
    setDangMuon((prev) => [...prev, { ...record, key: `m_${record.key}`, trangThai: 'dang_muon' as const }]);
  };

  const handleDaTra = (record: MuonTra) => {
    setDangMuon((prev) => prev.filter((r) => r.key !== record.key));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <SwapOutlined style={{ fontSize: 22, color: '#1677ff' }} />
        <Title level={4} style={{ margin: 0 }}>Ghi Nhận Mượn / Trả</Title>
      </div>

      <CanhBaoQuaHan quaHanCount={quaHanCount} />

      <BangChoGiao data={choGiao} onChoMuon={handleChoMuon} />

      <BangDangMuon data={dangMuon} onDaTra={handleDaTra} />
    </div>
  );
};

export default GhiNhanMuonTra;
