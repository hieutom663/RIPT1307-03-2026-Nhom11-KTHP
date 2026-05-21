import { Button, Image, Flex, Col, Row, Form, Input, Checkbox, message } from 'antd';
import { loginAPI } from '../services/TaiKhoan/index';
import LogoPtit from '../../assets/LogoPtit.png';
import hocVien from '../../assets/HocVien.png';
import { Link, history } from 'umi';

const Login = () => {
  
  const onFinish = async (values: any) => {
    const { email, password } = values; 
    
    try {
        const result = await loginAPI(email, password);
        
        if (result.success) {
            localStorage.setItem('accessToken', result.token ?? '');
            localStorage.setItem('userInfo', JSON.stringify(result.user));
            
            const userRole = result.user?.vai_tro;
            
            if (userRole === 'admin') {
                message.info('Chào mừng Admin quay trở lại!');
                history.push('/admin/trang-chu'); 
            } else {
                message.info(`Chào mừng bạn ${result.user.ten}!`);
                history.push('/user/trang-chu');  
            }
        }
    } catch (error: any) {
        message.error(error.message || 'Đăng nhập thất bại, vui lòng kiểm tra lại');
    }
  };

  return (
    <div style={{ backgroundColor:'#8c2825' }}>
      <Row>
        <Col span={11}>
        <Flex className='logo'>
          <Link to={'/'}>
            <Image width={40} alt='Logo' src={LogoPtit} preview={false} />
            <span style={{
              marginLeft: 10, 
              fontWeight: 600,
              marginTop: 10, 
              color: 'white'
              }}>
                HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG
              </span>
          </Link>
        </Flex >
        <Flex 
          align='center'
          justify='center'
          style={{ minHeight: '90vh' }}
        >
          <Form 
            name="basic"
            onFinish={onFinish} 
            wrapperCol={{ span: 24 }}
            style={{ 
              minWidth: 400, 
              backgroundColor:'white', 
              padding: 20, 
              alignItems: 'center', 
              borderRadius:8, 
              minHeight: 400,
              justifySelf: 'center'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h2>ĐĂNG NHẬP</h2>  
              <p style={{ color: 'gray' }}>Vui lòng điền thông tin đăng nhập của bạn</p>
            </div>
            
            <Form.Item
              layout='vertical'
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập Email của bạn!' },
                { type: 'email', message: 'Email không đúng định dạng!' } 
              ]}
            >
              <Input placeholder='Email Address' />
            </Form.Item>
            
            <Form.Item
              layout='vertical'
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}
            >
              <Input.Password placeholder='Password' />
            </Form.Item>
            
            <Flex justify='space-between' align='center'>
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox> Ghi nhớ</Checkbox>
              </Form.Item>
              <Form.Item>
                <Link to={'/'}>Quên mật khẩu?</Link>
              </Form.Item>
            </Flex>
            
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Đăng nhập
            </Button>
          </Form>
          </Flex>
        </Col>
        
        <Col span={13}>
            <Image 
              src={hocVien} 
              width='100%'
              height='100%'
              preview={false} 
              style={{ objectFit: 'cover' }} 
            />
        </Col>
      </Row>
    </div>
  );
}

export default Login;