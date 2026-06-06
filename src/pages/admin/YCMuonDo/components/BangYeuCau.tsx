import React, { useState } from 'react';
import { Table, Tag, Button, Space, Typography, Tooltip, Modal, Input, message } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, RollbackOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { YeuCauMuon } from '../index';
import { duyetYeuCauAPI, tuChoiYeuCauAPI, xacNhanTraThietBiAPI } from '@/services/YeuCauMuon/api';
import ModalChiTiet from './ModalChiTiet';

const { Text } = Typography;
const { TextArea } = Input;

const statusConfig: Record<YeuCauMuon['trangThai'], { label: string; color: string; bg: string }> = {
  cho_duyet: { label: 'Chờ duyệt', color: '#1677ff', bg: '#e6f4ff' },
  dang_muon: { label: 'Đang mượn', color: '#fa8c16', bg: '#fff7e6' },
  da_tra: { label: 'Đã trả', color: '#52c41a', bg: '#f6ffed' },
  qua_han: { label: 'Quá hạn', color: '#f5222d', bg: '#fff1f0' },
  tu_choi: { label: 'Từ chối', color: '#ff4d4f', bg: '#fff1f0' },
};

interface Props {
  data: YeuCauMuon[];
  onRefresh: () => void;
}

const BangYeuCau: React.FC<Props> = ({ data, onRefresh }) => {
  const [chiTietMaYC, setChiTietMaYC] = useState<string | null>(null);
  const [chiTietOpen, setChiTietOpen] = useState(false);

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
      title: 'Xác nhận phê duyệt phiếu mượn',
      content: `Bạn có chắc chắn muốn duyệt yêu cầu mượn đồ ${record.maYC} của sinh viên ${record.tenSV}?`,
      okText: 'Phê duyệt',
      cancelText: 'Hủy',
      okButtonProps: { style: { backgroundColor: '#52c41a', borderColor: '#52c41a' } },
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

  const handleTraThietBi = (record: YeuCauMuon) => {
    Modal.confirm({
      title: 'Xác nhận thu hồi thiết bị',
      content: `Xác nhận sinh viên ${record.tenSV} đã hoàn trả đầy đủ thiết bị của phiếu mượn ${record.maYC}?`,
      okText: 'Xác nhận đã trả',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const res = await xacNhanTraThietBiAPI(record.maYC);
          if (res.data.success) {
            message.success(res.data.message || 'Đã xác nhận trả thiết bị thành công');
            onRefresh();
          } else {
            message.error(res.data.message);
          }
        } catch (error) {
          console.error('Lỗi trả thiết bị:', error);
          message.error('Lỗi kết nối khi xác nhận trả');
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
      title: 'Mã YC', 
      dataIndex: 'maYC', 
      key: 'maYC', 
      width: 100,
      render: (v: string) => <Text strong style={{ color: '#cf1322', fontFamily: 'monospace' }}>{v}</Text>,
    },
    {
      title: 'Sinh viên', 
      key: 'sinhVien', 
      width: 180,
      render: (_: unknown, r: YeuCauMuon) => (
        <div>
          <Text strong style={{ fontSize: '14px' }}>{r.tenSV}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{r.maSV}</Text>
        </div>
      ),
    },
    { 
      title: 'Thiết bị đăng ký mượn', 
      dataIndex: 'thietBi', 
      key: 'thietBi',
      render: (text: string) => <Text strong>{text}</Text>
    },
    { title: 'SL', dataIndex: 'soLuong', key: 'soLuong', width: 60, align: 'center' as const, render: (val) => <Text strong>{val}</Text> },
    { title: 'Ngày mượn', dataIndex: 'ngayMuon', key: 'ngayMuon', width: 120, render: (val) => <Text type="secondary">{val}</Text> },
    { title: 'Ngày trả DK', dataIndex: 'ngayTraDK', key: 'ngayTraDK', width: 120, render: (val) => <Text type="secondary">{val}</Text> },
    {
      title: 'Trạng thái', 
      key: 'trangThai', 
      width: 130, 
      align: 'center' as const,
      render: (_: unknown, r: YeuCauMuon) => {
        const cfg = statusConfig[r.trangThai];
        return (
          <Tag style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}25`, borderRadius: 4, fontWeight: 500, padding: '2px 10px' }}>
            {cfg.label}
          </Tag>
        );
      },
    },
    {
      title: 'Hành động', 
      key: 'action', 
      width: 200, 
      align: 'center' as const,
      render: (_: unknown, record: YeuCauMuon) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết phiếu">
            <Button size="small" type="text" icon={<EyeOutlined />} style={{ color: '#595959', padding: '0 4px' }} onClick={() => handleXemChiTiet(record)}>Xem</Button>
          </Tooltip>
          
          {record.trangThai === 'cho_duyet' && (
            <>
              <Tooltip title="Phê duyệt phiếu mượn">
                <Button size="small" type="text" icon={<CheckOutlined />} style={{ color: '#52c41a', fontWeight: 500, padding: '0 4px' }} onClick={() => handleDuyet(record)}>Duyệt</Button>
              </Tooltip>
              <Tooltip title="Từ chối phiếu mượn">
                <Button size="small" type="text" danger icon={<CloseOutlined />} style={{ fontWeight: 500, padding: '0 4px' }} onClick={() => handleOpenTuChoi(record)}>Từ chối</Button>
              </Tooltip>
            </>
          )}

          {(record.trangThai === 'dang_muon' || record.trangThai === 'qua_han') && (
            <Tooltip title="Xác nhận sinh viên đã hoàn trả đồ dùng">
              <Button size="small" type="link" icon={<RollbackOutlined />} style={{ color: '#cf1322', fontWeight: 500, padding: 0 }} onClick={() => handleTraThietBi(record)}>
                Xác nhận trả đồ
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      {/* ĐÃ SỬA: Loại bỏ lớp Card bọc thừa để Table phẳng lì và thoáng đãng trên trang cha */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ 
          pageSize: 10, 
          showTotal: (total) => `Tổng số ${total} yêu cầu`,
          showSizeChanger: false,
          style: { marginTop: '24px' } 
        }}
        size="middle"
        rowKey="key"
        locale={{ emptyText: 'Không tìm thấy phiếu mượn nào phù hợp' }}
      />

      <ModalChiTiet
        maYC={chiTietMaYC}
        open={chiTietOpen}
        onClose={() => { setChiTietOpen(false); setChiTietMaYC(null); }}
      />

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CloseOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
            <span style={{ fontWeight: 600 }}>Từ chối yêu cầu mượn đồ</span>
          </div>
        }
        open={tuChoiOpen}
        onCancel={() => { setTuChoiOpen(false); setTuChoiRecord(null); setLyDoTuChoi(''); }}
        onOk={handleConfirmTuChoi}
        okText="Xác nhận từ chối"
        okButtonProps={{ danger: true, loading: tuChoiLoading }}
        cancelText="Hủy"
        destroyOnHidden
        centered
      >
        {tuChoiRecord && (
          <div style={{ marginBottom: 16, marginTop: 16, padding: '12px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
            <Text style={{ display: 'block', marginBottom: 4 }}>Phiếu mượn: <Text strong style={{ color: '#cf1322' }}>{tuChoiRecord.maYC}</Text></Text>
            <Text style={{ display: 'block', marginBottom: 4 }}>Sinh viên: <Text strong>{tuChoiRecord.tenSV}</Text> ({tuChoiRecord.maSV})</Text>
            <Text style={{ display: 'block' }}>Thiết bị mượn: <Text type="secondary">{tuChoiRecord.thietBi}</Text></Text>
          </div>
        )}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Lý do từ chối phiếu mượn <Text type="danger">*</Text>
          </Text>
          <TextArea
            rows={4}
            placeholder="Nhập cụ thể lý do từ chối để sinh viên nhận được thông báo rõ ràng..."
            value={lyDoTuChoi}
            onChange={(e) => setLyDoTuChoi(e.target.value)}
            style={{ borderRadius: '6px' }}
          />
        </div>
      </Modal>
    </>
  );
};

export default BangYeuCau;