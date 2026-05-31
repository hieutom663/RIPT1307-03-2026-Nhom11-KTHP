import { useState, useEffect } from 'react';
import { Badge, Button, Dropdown, Typography, message } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Link, history } from 'umi';
import { getDanhSachThongBaoAdminAPI, danhDauDaDocAPI, danhDauDocTatCaAPI } from '@/services/ThongBao/api';

const { Text } = Typography;

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState<any[]>([]);

    const fetchNotifications = async () => {
        try {
            const res = await getDanhSachThongBaoAdminAPI();
            if (res.data?.success) {
                setNotifications(res.data.data);
            }
        } catch (error) {
            console.error("Lỗi lấy thông báo:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

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
                console.error("Lỗi cập nhật trạng thái:", error);
            }
        }
        history.push('/admin/yeu-cau-muon-tra');
    };

    const handleDocTatCa = async (e: any) => {
        e.preventDefault();
        try {
            await danhDauDocTatCaAPI();
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
                    <Text strong={notif.unread} style={{ color: notif.title.includes('hạn') || notif.title.includes('từ chối') ? '#f5222d' : '#1890ff' }}>
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
                    <Link to="/admin/lich-su-admin" style={{ color: '#1890ff', fontWeight: 500, fontSize: '13px' }}>
                        Xem tất cả
                    </Link>
                </div>
            ),
        });
    }

    return (
        <Dropdown 
            menu={{ 
                items: notificationMenuItems,
                style: { maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden' }
            }} 
            placement="bottomRight" 
            trigger={['click']}
        >
            <Badge count={unreadCount} style={{ cursor: 'pointer' }}>
                <Button type="text" icon={<BellOutlined style={{ color: '#fff', fontSize: '18px' }} />} />
            </Badge>
        </Dropdown>
    );
};

export default NotificationDropdown;