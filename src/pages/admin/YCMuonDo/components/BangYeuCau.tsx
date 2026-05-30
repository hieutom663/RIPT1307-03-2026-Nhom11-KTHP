import React, { useState } from 'react';
import { Table, Tag, Button, Space, Typography, Card, Tooltip, Modal, Input, message } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { YeuCauMuon } from '../index';
import { duyetYeuCauAPI, tuChoiYeuCauAPI } from '@/services/YeuCauMuon/api';
import ModalChiTiet from './ModalChiTiet';

const { Text } = Typography;
const { TextArea } = Input;

const statusConfig: Record<YeuCauMuon['trangThai'], { label: string; color: string; bg: string }> = {
  cho_duyet: { label: 'Chờ duyệt', color: '#fa8c16', bg: '#fff7e6' },
  da_duyet: { label: 'Đã duyệt', color: '#1677ff', bg: '#e6f4ff' },
  dang_muon: { label: 'Đang mượn', color: '#52c41a', bg: '#f6ffed' },
  da_tra: { label: 'Đã trả', color: '#8c8c8c', bg: '#fafafa' },
  qua_han: { label: 'Quá hạn', color: '#f5222d', bg: '#fff1f0' },
  tu_choi: { label: 'Từ chối', color: '#ff4d4f', bg: '#fff1f0' },
};

interface Props {
  data: YeuCauMuon[];
  onRefresh: () => void;
}

const BangYeuCau: React.FC<Props> = ({ data, onRefresh }) => {
  // State cho modal chi tiết
  const [chiTietMaYC, setChiTietMaYC] = useState<string | null>(null);
  const [chiTietOpen, setChiTietOpen] = useState(false);

  // State cho modal từ chối
  const [tuChoiOpen, setTuChoiOpen] = useState(false);
  const [tuChoiRecord, setTuChoiRecord] = useState<YeuCauMuon | null>(null);
  const [lyDoTuChoi, setLyDoTuChoi] = useState('');
  const [tuChoiLoading, setTuChoiLoading] = useState(false);

  const handleXemChiTiet = (record: YeuCauMuon) => {
    setChiTietMaYC(record.maYC);
    setChiTietOpen(true);
  };

  const handleDuyet = (record: YeuCauMuon) => {
    Modal.confirm({
      title: 'Xác nhận duyệt',
      content: `Duyệt yêu cầu ${record.maYC} của ${record.tenSV}?`,
      okText: 'Duyệt',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const res = await duyetYeuCauAPI(record.maYC);
          if (res.data.success) {
            message.success(res.data.message);
            onRefresh();
          } else {
            message.error(res.data.message);
          }
        } catch (error) {
          console.error('Lỗi duyệt:', error);
          message.error('Lỗi khi duyệt yêu cầu');
        }
      },
    });
  };

  const handleOpenTuChoi = (record: YeuCauMuon) => {
    setTuChoiRecord(record);
    setLyDoTuChoi('');
    setTuChoiOpen(true);
  };

  const handleConfirmTuChoi = async () => {
    if (!tuChoiRecord) return;
    if (!lyDoTuChoi.trim()) {
      message.warning('Vui lòng nhập lý do từ chối');
      return;
    }
    setTuChoiLoading(true);
    try {
      const res = await tuChoiYeuCauAPI(tuChoiRecord.maYC, lyDoTuChoi.trim());
      if (res.data.success) {
        message.info(res.data.message);
        setTuChoiOpen(false);
        setTuChoiRecord(null);
        setLyDoTuChoi('');
        onRefresh();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error('Lỗi từ chối:', error);
      message.error('Lỗi khi từ chối yêu cầu');
    } finally {
      setTuChoiLoading(false);
    }
  };

  const columns: ColumnsType<YeuCauMuon> = [
    {
      title: 'Mã YC', dataIndex: 'maYC', key: 'maYC', width: 100,
      render: (v: string) => <Text strong style={{ color: '#1677ff' }}>{v}</Text>,
    },
    {
      title: 'Sinh viên', key: 'sinhVien', width: 170,
      render: (_: unknown, r: YeuCauMuon) => (
        <div><Text strong>{r.tenSV}</Text><br /><Text type="secondary" style={{ fontSize: 12 }}>{r.maSV}</Text></div>
      ),
    },
    { title: 'Thiết bị', dataIndex: 'thietBi', key: 'thietBi', width: 200 },
    { title: 'SL', dataIndex: 'soLuong', key: 'soLuong', width: 60, align: 'center' as const },
    { title: 'Ngày mượn', dataIndex: 'ngayMuon', key: 'ngayMuon', width: 120 },
    { title: 'Ngày trả DK', dataIndex: 'ngayTraDK', key: 'ngayTraDK', width: 120 },
    {
      title: 'Trạng thái', key: 'trangThai', width: 130, align: 'center' as const,
      render: (_: unknown, r: YeuCauMuon) => {
        const cfg = statusConfig[r.trangThai];
        return (
          <Tag style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}30`, borderRadius: 6, fontWeight: 600, fontSize: 12, padding: '2px 12px' }}>
            {cfg.label}
          </Tag>
        );
      },
    },
    {
      title: 'Hành động', key: 'action', width: 220, align: 'center' as const,
      render: (_: unknown, record: YeuCauMuon) => (
        <Space size={4}>
          <Tooltip title="Xem chi tiết">
            <Button size="small" icon={<EyeOutlined />} style={{ borderColor: '#d9d9d9' }} onClick={() => handleXemChiTiet(record)}>Xem</Button>
          </Tooltip>
          {record.trangThai === 'cho_duyet' && (
            <>
              <Tooltip title="Duyệt yêu cầu">
                <Button size="small" type="primary" icon={<CheckOutlined />} style={{ background: '#52c41a', borderColor: '#52c41a' }} onClick={() => handleDuyet(record)}>Duyệt</Button>
              </Tooltip>
              <Tooltip title="Từ chối">
                <Button size="small" danger icon={<CloseOutlined />} onClick={() => handleOpenTuChoi(record)}>Từ chối</Button>
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card styles={{ body: { padding: 0 } }} style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 5, showTotal: (total) => `Tổng ${total} yêu cầu`, style: { marginRight: 16 } }}
          size="middle"
          rowKey="key"
        />
      </Card>

      {/* Modal xem chi tiết */}
      <ModalChiTiet
        maYC={chiTietMaYC}
        open={chiTietOpen}
        onClose={() => { setChiTietOpen(false); setChiTietMaYC(null); }}
      />

      {/* Modal từ chối có lý do */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CloseOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
            <span>Từ chối yêu cầu {tuChoiRecord?.maYC}</span>
          </div>
        }
        open={tuChoiOpen}
        onCancel={() => { setTuChoiOpen(false); setTuChoiRecord(null); setLyDoTuChoi(''); }}
        onOk={handleConfirmTuChoi}
        okText="Xác nhận từ chối"
        okButtonProps={{ danger: true, loading: tuChoiLoading }}
        cancelText="Hủy"
        destroyOnClose
      >
        {tuChoiRecord && (
          <div style={{ marginBottom: 16 }}>
            <Text>Từ chối yêu cầu <Text strong style={{ color: '#1677ff' }}>{tuChoiRecord.maYC}</Text> của <Text strong>{tuChoiRecord.tenSV}</Text></Text>
            <br />
            <Text type="secondary" style={{ fontSize: 13 }}>Thiết bị: {tuChoiRecord.thietBi}</Text>
          </div>
        )}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 6 }}>
            Lý do từ chối <Text type="danger">*</Text>
          </Text>
          <TextArea
            rows={3}
            placeholder="Nhập lý do từ chối yêu cầu mượn..."
            value={lyDoTuChoi}
            onChange={(e) => setLyDoTuChoi(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
};

export default BangYeuCau;
