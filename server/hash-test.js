const bcrypt = require('bcryptjs');

// Mật khẩu cậu muốn mã hóa
const plainPassword = 'pass@123'; 

// Tạo hash với độ khó là 10 (chuẩn mực bảo mật hiện nay)
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(plainPassword, salt);

console.log('=================================');
console.log('Mật khẩu gốc:', plainPassword);
console.log('Mật khẩu đã hash:', hashedPassword);
console.log('Hãy copy chuỗi hash trên vào MySQL!');
console.log('=================================');