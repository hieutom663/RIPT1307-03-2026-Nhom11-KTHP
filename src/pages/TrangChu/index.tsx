import { Button } from "antd";
import { Link } from 'umi';

const TrangChu = () => {
    return(
        <>
            <h2 style={{marginTop:50, textAlign: 'center'}}>
                Trang chu
            </h2>
            <Link to={'/user/login'} style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',  
            }} >
                <Button type='primary'> Dang nhap </Button>
            </Link>
        </>
    );
}

export default TrangChu