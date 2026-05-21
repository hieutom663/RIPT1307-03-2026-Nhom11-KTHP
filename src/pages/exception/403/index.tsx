import { HomeOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { history } from 'umi';

const NotAccessible = () => {
    const onGoHome = () => {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            if (userInfo.role === 'student') {
                history.push('/user'); 
                return;
            }
        }
        history.push('/admin'); 
    };

    return (
        <Result
            status='403'
            title='Truy cập bị từ chối'
            style={{
                background: 'none',
                marginTop: '10vh'
            }}
            subTitle='Xin lỗi, bạn không có quyền truy cập trang này.'
            extra={
                <Button 
                    type='primary' 
                    icon={<HomeOutlined />} 
                    onClick={onGoHome}
                    style={{ backgroundColor: '#8c2825', borderColor: '#8c2825' }}
                >
                    Về trang chủ
                </Button>
            }
        />
    );
};

export default NotAccessible;