import { useState, useEffect } from 'react';
import { Badge, Button, Dropdown, Typography, message } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Link, history } from 'umi';
import { getDanhSachThongBaoUserAPI, danhDauDaDocAPI, danhDauDocTatCaUserAPI } from '@/services/ThongBao/api';

const { Text } = Typography;

const ThongBao = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [maSV, setMaSV] = useState<string>('');

    useEffect(() => {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            setMaSV(userInfo.ma_sv);
            fetchNotifications(userInfo.ma_sv);
        }
    }, []);

    const fetchNotifications = async (ma_sinh_vien: string) => {
        try {
            const res = await getDanhSachThongBaoUserAPI(ma_sinh_vien);
            if (res.data?.success) {
                setNotifications(res.data.data);
            }
        } catch (error) {
            console.error("Lỗi lấy thông báo:", error);
        }
    };

    const tinhThoiGian = (dateString: string) => {
        if (!dateString) return '';
        const now = new Date();
        const past = new Date(dateString);
        const diffMs = now.getTime() - past.getTime();
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMs / 3600000);
        const diffDays = Math.round(diffMs / 86400000);
        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        return `${diffDays} ngày trước`;
    };

    const handleClickThongBao = async (notif: any) => {
        if (notif.unread) {
            try {
                await danhDauDaDocAPI(notif.id);
                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
            } catch (error) {
                console.error("Lỗi cập nhật:", error);
            }
        }
            history.push('/user/lich-su-muon');
    };

    const handleDocTatCa = async (e: any) => {
        e.preventDefault();
        if (!maSV) return;
        try {
            await danhDauDocTatCaUserAPI(maSV);
            setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
            message.success("Đã đánh dấu đọc tất cả!");
        } catch (error) {
            console.error("Lỗi cập nhật tất cả:", error);
        }
    };

    const unreadCount = notifications.filter(n => n.unread).length;

    const notificationMenuItems: MenuProps['items'] = notifications.length === 0 ? [
        { key: 'empty', label: <div style={{ padding: 16, textAlign: 'center', color: '#999' }}>Không có thông báo nào</div> }
    ] : notifications.map(notif => ({
        key: notif.id,
        onClick: () => handleClickThongBao(notif),
        label: (
            <div style={{ display: 'flex', flexDirection: 'column', width: 280, whiteSpace: 'normal', padding: '4px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong={notif.unread} style={{ color: notif.title.includes('từ chối') || notif.title.includes('hạn') ? '#f5222d' : '#52c41a' }}>
                        {notif.title}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>{tinhThoiGian(notif.time)}</Text>
                </div>
                <Text style={{ fontSize: '13px', marginTop: 4, color: notif.unread ? '#333' : '#888' }}>
                    {notif.desc}
                </Text>
            </div>
        ),
    }));

    if (notifications.length > 0) {
        notificationMenuItems.push({ type: 'divider' });
        notificationMenuItems.push({
            key: 'actions',
            label: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                    <a onClick={handleDocTatCa} style={{ fontSize: '12px', color: '#888' }}>
                        <CheckOutlined style={{ marginRight: 4 }} /> Đánh dấu tất cả đã đọc
                    </a>
                    <Link to="/user/lich-su-muon" style={{ color: '#1890ff', fontWeight: 500, fontSize: '13px' }}>
                        Xem tất cả
                    </Link>
                </div>
            ),
        });
    }

    return (
        <Dropdown 
            menu={{ items: notificationMenuItems, style: { maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden' } }} 
            placement="bottomRight" 
            trigger={['click']}
        >
            <Badge count={unreadCount} style={{ cursor: 'pointer' }}>
                <Button type="text" icon={<BellOutlined style={{ color: '#fff', fontSize: '18px' }} />} />
            </Badge>
        </Dropdown>
    );
};

export default ThongBao;