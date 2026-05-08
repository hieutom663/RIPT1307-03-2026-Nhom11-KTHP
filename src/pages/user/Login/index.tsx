import { Button } from 'antd';
import { Link } from 'umi';

const Login = () => {

  return (
    <div>
      <div style={{ padding: 50, textAlign: 'center' }}>
        <h1>Trang Đăng nhập</h1>
      </div>
      <Link to={'/'} style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
      }}>
          <Button type='primary'>Trang chu</Button>
        </Link>
    </div>
  );
}

export default Login;