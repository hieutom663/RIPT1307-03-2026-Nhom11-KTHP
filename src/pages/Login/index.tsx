import { useEffect } from 'react';
import { Button, Image, Flex, Col, Row, Form, Input, Checkbox, message, ConfigProvider } from 'antd';
import { loginAPI } from '../../services/TaiKhoan/index';
import LogoPtit from '../../assets/LogoPtit.png';
import hocVien from '../../assets/HocVien.png';
import { Link, history } from 'umi';

const Login = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail');
    
    if (savedEmail) {
      form.setFieldsValue({
        email: savedEmail,
        remember: true,
      });
    }
  }, [form]);

  const onFinish = async (values: any) => {
    const { email, password, remember } = values;

    try {
      const result = await loginAPI(email, password);

      if (result.success) {
        if (remember) {
          localStorage.setItem('rememberEmail', email);
        } else {
          localStorage.removeItem('rememberEmail');
          localStorage.removeItem('rememberPassword');
        }

        localStorage.setItem('token', result.token ?? '');
        localStorage.setItem('userInfo', JSON.stringify(result.user));

        const userRole = result.user?.vai_tro;

        if (userRole === 'admin') {
          message.info('Chào mừng Admin quay trở lại!');
          history.push('/admin/trang-chu');
        } else {
          message.info(`Chào mừng bạn ${result.user.ho_ten}!`);
          history.push('/user/trang-chu');
        }
      }
    } catch (error: any) {
      message.error(error.message || 'Đăng nhập thất bại, vui lòng kiểm tra lại');
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#cf1322',
        },
      }}
    >
      <div style={{ backgroundColor: '#8c2825', minHeight: '100vh', overflow: 'hidden' }}>
        <Row style={{ minHeight: '100vh' }}>
          <Col xs={24} lg={11} style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
            
            <Flex className='logo' align='center'>
              <Link to={'/'} style={{ display: 'flex', alignItems: 'center' }}>
                <Image width={40} alt='Logo' src={LogoPtit} preview={false} />
                <span style={{
                  marginLeft: 10,
                  fontWeight: 600,
                  color: 'white'
                }}>
                  HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG
                </span>
              </Link>
            </Flex>

            <Flex
              align='center'
              justify='center'
              style={{ flex: 1 }}
            >
              <Form
                form={form}
                name="basic"
                onFinish={onFinish}
                wrapperCol={{ span: 24 }}
                style={{
                  width: '100%',
                  maxWidth: 420,
                  backgroundColor: 'white',
                  padding: '32px 24px',
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <h2 style={{ margin: 0, fontWeight: 700, color: '#333' }}>ĐĂNG NHẬP</h2>
                  <p style={{ color: 'gray', marginTop: 4 }}>Vui lòng điền thông tin đăng nhập của bạn</p>
                </div>

                <Form.Item
                  layout='vertical'
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập Email của bạn!' },
                    { type: 'email', message: 'Email không đúng định dạng!' }
                  ]}
                >
                  <Input placeholder='Email Address' size="large" />
                </Form.Item>

                <Form.Item
                  layout='vertical'
                  name="password"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}
                >
                  <Input.Password placeholder='Password' size="large" />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 16 }}>
                  <Checkbox>Ghi nhớ</Checkbox>
                </Form.Item>

                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large"
                  style={{ 
                    width: '100%', 
                    backgroundColor: '#8c2825', 
                    borderColor: '#8c2825',
                    fontWeight: 600
                  }}
                >
                  Đăng nhập
                </Button>
              </Form>
            </Flex>
          </Col>

          <Col xs={0} lg={13} style={{ height: '100vh' }}>
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
    </ConfigProvider>
  );
}

export default Login;