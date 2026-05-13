import { Button, Image, Flex, Col, Row, Form, Input, Checkbox, Space } from 'antd';
import LogoPtit from '../../assets/LogoPtit.png';
import hocVien from '../../assets/HocVien.png';
import { Link } from 'umi';

const Login = () => {

  return (
    <div style={{backgroundColor:'#8c2825', }}>
      <Row>
        <Col span={11}>
        <Flex className='logo'>
          <Link to= {'/'} style={{textDecoration: 'none',color: 'inherit'}}>
            <Image width={50} alt='Logo' src={LogoPtit} />
            <span style={{marginLeft: 10, fontWeight: 700, fontFamily: 'Arial, sans-serif', marginTop: 10, color: 'white'}}>HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</span>
          </Link>
        </Flex >
        <Flex 
          align='center'
          justify='center'
          style={{ 
            minHeight: '90vh', 
          }}
        >
          <Form 
            name="basic"
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
            <div style={{textAlign: 'center'}}>
              <h2 >ĐĂNG NHẬP</h2>  
              <p style={{color: 'gray'}}> Vui lòng điền thông tin đăng nhập của bạn</p>
            </div>
            <Form.Item
              layout='vertical'
              name="email"
              rules={[{ required: true, message: 'Vui lòng nhập Email của bạn!' }]}
            >
              <Input placeholder='Email Adress' />
            </Form.Item>
            <Form.Item
              layout='vertical'
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}
            >
              <Input.Password placeholder='Password' />
            </Form.Item>
            <Flex justify='space-between' align='center'>
              <Form.Item>
                <Checkbox> Ghi nhớ</Checkbox>
              </Form.Item>
              <Form.Item>
                <Link to={'/'}>Quên mật khẩu?</Link>
              </Form.Item>
            </Flex>
            <Button type="primary" htmlType="submit" style={{width: '100%'}}>
              Đăng nhập
            </Button>
          </Form>
          </Flex>
        </Col>
        <Col span={13}>
            <Image 
              src= {hocVien} 
              width= '100%'
              height='100%'
            />
        </Col>
      </Row>
    </div>
  );
}

export default Login;