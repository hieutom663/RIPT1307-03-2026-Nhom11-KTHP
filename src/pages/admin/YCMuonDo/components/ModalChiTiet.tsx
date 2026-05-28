import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Tag, Table, Typography, Spin, Divider, message } from 'antd';
import {
  UserOutlined, PhoneOutlined, MailOutlined, CalendarOutlined,
  FileTextOutlined, CheckCircleOutlined, ToolOutlined,
} from '@ant-design/icons';
import { getChiTietYeuCauAPI } from '@/services/YeuCauMuon/api';

const { Text, Title } = Typography;

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  cho_duyet: { label: 'Chờ duyệt', color: '#fa8c16', bg: '#fff7e6' },
  da_duyet: { label: 'Đã duyệt', color: '#1677ff', bg: '#e6f4ff' },
  dang_muon: { label: 'Đang mượn', color: '#52c41a', bg: '#f6ffed' },
  da_tra: { label: 'Đã trả', color: '#8c8c8c', bg: '#fafafa' },
  qua_han: { label: 'Quá hạn', color: '#f5222d', bg: '#fff1f0' },
  tu_choi: { label: 'Từ chối', color: '#ff4d4f', bg: '#fff1f0' },
};

interface Props {
  maYC: string | null;
  open: boolean;
  onClose: () => void;
}

interface ChiTietData {
  maYC: string;
  maSV: string;
  tenSV: string;
  emailSV: string;
  sdtSV: string;
  ngayMuon: string;
  ngayTraDK: string;
  ngayDuyet: string | null;
  lyDoMuon: string | null;
  lyDoTuChoi: string | null;
  trangThaiGoc: string;
  trangThai: string;
  chiTietThietBi: {
    maDonMuon: string;
    maThietBi: string;
    tenThietBi: string;
    danhMuc: string;
    soLuong: number;
    ngayTraThucTe: string | null;
    trangThaiThietBi: string;
  }[];
}

const ModalChiTiet: React.FC<Props> = ({ maYC, open, onClose }) => {
  const [data, setData] = useState<ChiTietData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && maYC) {
      const fetchDetail = async () => {
        setLoading(true);
        try {
          const res = await getChiTietYeuCauAPI(maYC);
          if (res.data.success) {
            setData(res.data.data);
          } else {
            message.error(res.data.message || 'Lỗi khi tải chi tiết');
          }
        } catch (error) {
          console.error('Lỗi fetch chi tiết:', error);
          message.error('Không thể kết nối đến server');
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    } else {
      setData(null);
    }
  }, [open, maYC]);

  const trangThaiCfg = data ? statusConfig[data.trangThai] || statusConfig['cho_duyet'] : null;

  const tbColumns = [
    {
      title: 'Mã TB', dataIndex: 'maThietBi', key: 'maThietBi', width: 90,
      render: (v: string) => <Text code>{v}</Text>,
    },
    { title: 'Tên thiết bị', dataIndex: 'tenThietBi', key: 'tenThietBi', width: 160 },
    {
      title: 'Danh mục', dataIndex: 'danhMuc', key: 'danhMuc', width: 100,
      render: (v: string) => <Tag color="blue">{v || 'N/A'}</Tag>,
    },
    { title: 'SL', dataIndex: 'soLuong', key: 'soLuong', width: 50, align: 'center' as const },
    {
      title: 'Trạng thái', dataIndex: 'trangThaiThietBi', key: 'trangThaiThietBi', width: 100,
      render: (v: string) => {
        const colorMap: Record<string, string> = {
          'Chưa trả': 'orange',
          'Đã trả': 'green',
          'Quá hạn': 'red',
        };
        return <Tag color={colorMap[v] || 'default'}>{v}</Tag>;
      },
    },
    {
      title: 'Ngày trả TT', dataIndex: 'ngayTraThucTe', key: 'ngayTraThucTe', width: 110,
      render: (v: string | null) => v || <Text type="secondary">—</Text>,
    },
  ];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileTextOutlined style={{ color: '#1677ff', fontSize: 20 }} />
          <span>Chi Tiết Yêu Cầu Mượn {maYC && <Text strong style={{ color: '#1677ff' }}>{maYC}</Text>}</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      destroyOnClose
    >
      <Spin spinning={loading}>
        {data && (
          <div>
            {/* Trạng thái */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              {trangThaiCfg && (
                <Tag
                  style={{
                    color: trangThaiCfg.color,
                    backgroundColor: trangThaiCfg.bg,
                    border: `1px solid ${trangThaiCfg.color}40`,
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 14,
                    padding: '4px 20px',
                  }}
                >
                  {trangThaiCfg.label}
                </Tag>
              )}
            </div>

            {/* Thông tin sinh viên */}
            <Divider orientation="left" style={{ fontSize: 14, color: '#1677ff' }}>
              <UserOutlined /> Thông tin sinh viên
            </Divider>
            <Descriptions column={2} size="small" bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Họ tên">{data.tenSV}</Descriptions.Item>
              <Descriptions.Item label="Mã SV">{data.maSV}</Descriptions.Item>
              <Descriptions.Item label={<><MailOutlined /> Email</>}>{data.emailSV || '—'}</Descriptions.Item>
              <Descriptions.Item label={<><PhoneOutlined /> SĐT</>}>{data.sdtSV || '—'}</Descriptions.Item>
            </Descriptions>

            {/* Thông tin yêu cầu */}
            <Divider orientation="left" style={{ fontSize: 14, color: '#1677ff' }}>
              <CalendarOutlined /> Thông tin yêu cầu
            </Divider>
            <Descriptions column={2} size="small" bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Ngày mượn">{data.ngayMuon}</Descriptions.Item>
              <Descriptions.Item label="Ngày trả DK">{data.ngayTraDK}</Descriptions.Item>
              {data.ngayDuyet && (
                <Descriptions.Item label="Ngày duyệt">{data.ngayDuyet}</Descriptions.Item>
              )}
              <Descriptions.Item label="Lý do mượn" span={2}>
                {data.lyDoMuon || <Text type="secondary">Không có</Text>}
              </Descriptions.Item>
              {data.lyDoTuChoi && (
                <Descriptions.Item label="Lý do từ chối" span={2}>
                  <Text type="danger">{data.lyDoTuChoi}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Chi tiết thiết bị */}
            <Divider orientation="left" style={{ fontSize: 14, color: '#1677ff' }}>
              <ToolOutlined /> Chi tiết thiết bị ({data.chiTietThietBi.length})
            </Divider>
            <Table
              columns={tbColumns}
              dataSource={data.chiTietThietBi}
              pagination={false}
              size="small"
              rowKey="maDonMuon"
              style={{ marginBottom: 8 }}
            />
          </div>
        )}
      </Spin>
    </Modal>
  );
};

export default ModalChiTiet;
