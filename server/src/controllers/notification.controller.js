const pool = require('../config/db.config');

const getDanhSachThongBaoAdmin = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT id, tieu_de, noi_dung, ngay, nguoinhan_id, loai, trang_thai 
            FROM thongbao 
            WHERE nguoinhan_id LIKE 'AD%' 
            ORDER BY ngay DESC 
            LIMIT 10
        `);

        const data = rows.map(row => ({
            id: row.id,
            title: row.tieu_de,
            desc: row.noi_dung,
            time: row.ngay, 
            unread: row.trang_thai !== 'da_doc' 
        }));

        res.json({ success: true, data: data });
    } catch (error) {
        console.error("Lỗi lấy danh sách thông báo:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi lấy thông báo" });
    }
};

const danhDauDaDoc = async (req, res) => {
    try {
        const id = req.params.id;
        await pool.query(
            "UPDATE thongbao SET trang_thai = 'da_doc' WHERE id = ?", 
            [id]
        );
        res.json({ success: true, message: "Đã cập nhật trạng thái thông báo" });
    } catch (error) {
        console.error("Lỗi cập nhật thông báo:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

const danhDauDocTatCa = async (req, res) => {
    try {
        await pool.query(`
            UPDATE thongbao 
            SET trang_thai = 'da_doc' 
            WHERE nguoinhan_id LIKE 'AD%' 
              AND (trang_thai IS NULL OR trang_thai != 'da_doc')
        `);
        res.json({ success: true, message: "Đã đánh dấu đọc tất cả" });
    } catch (error) {
        console.error("Lỗi cập nhật tất cả thông báo:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
}; 

const getDanhSachThongBaoUser = async (req, res) => {
    try {
        const maSV = req.query.maSV;
        if (!maSV) return res.json({ success: false, message: "Thiếu mã sinh viên" });

        const [rows] = await pool.query(`
            SELECT id, tieu_de, noi_dung, ngay, nguoinhan_id, loai, trang_thai 
            FROM thongbao 
            WHERE nguoinhan_id = ? 
            ORDER BY ngay DESC 
            LIMIT 20
        `, [maSV]);

        const data = rows.map(row => ({
            id: row.id,
            title: row.tieu_de,
            desc: row.noi_dung,
            time: row.ngay, 
            unread: row.trang_thai !== 'da_doc' 
        }));

        res.json({ success: true, data: data });
    } catch (error) {
        console.error("Lỗi lấy danh sách thông báo User:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

const danhDauDocTatCaUser = async (req, res) => {
    try {
        const maSV = req.body.maSV;
        await pool.query(`
            UPDATE thongbao 
            SET trang_thai = 'da_doc' 
            WHERE nguoinhan_id = ? 
              AND (trang_thai IS NULL OR trang_thai != 'da_doc')
        `, [maSV]);
        res.json({ success: true, message: "Đã đánh dấu đọc tất cả" });
    } catch (error) {
        console.error("Lỗi cập nhật tất cả thông báo User:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

const thongBaoQuaHan = async () => {
    try {
        const [sapDenHan] = await pool.query(`
            SELECT ma_yeu_cau, ma_nguoi_muon, DATE_FORMAT(ngay_tra_du_kien, '%d/%m/%Y') as ngay_tra
            FROM yeucaumuon
            WHERE trang_thai = 'Đang mượn' 
              AND DATE(ngay_tra_du_kien) = DATE(DATE_ADD(CURDATE(), INTERVAL 1 DAY))
        `);

        for (const don of sapDenHan) {
            const tieuDe = 'Nhắc nhở sắp đến hạn';
            const noiDung = `Đơn ${don.ma_yeu_cau} sẽ đến hạn trả vào ngày mai (${don.ngay_tra}). Vui lòng trả đồ đúng hạn nhé!`;
            
            await pool.query(
                `INSERT INTO thongbao (tieu_de, noi_dung, ngay, nguoinhan_id, loai, trang_thai) 
                 VALUES (?, ?, NOW(), ?, 'nhắc đến hạn', 'chua_doc')`,
                [tieuDe, noiDung, don.ma_nguoi_muon]
            );
        }

        const [vuaQuaHan] = await pool.query(`
            SELECT ma_yeu_cau, ma_nguoi_muon, DATE_FORMAT(ngay_tra_du_kien, '%d/%m/%Y') as ngay_tra
            FROM yeucaumuon
            WHERE trang_thai = 'Đang mượn' 
              AND DATE(ngay_tra_du_kien) = DATE(DATE_SUB(CURDATE(), INTERVAL 1 DAY))
        `);

        for (const don of vuaQuaHan) {
            const tieuDe = 'Đã quá hạn trả đồ';
            const noiDung = `Đơn ${don.ma_yeu_cau} của bạn ĐÃ QUÁ HẠN từ hôm qua (${don.ngay_tra}). Vui lòng hoàn trả hệ thống ngay lập tức!`;
            
            await pool.query(
                `INSERT INTO thongbao (tieu_de, noi_dung, ngay, nguoinhan_id, loai, trang_thai) 
                 VALUES (?, ?, NOW(), ?, 'cảnh báo', 'chua_doc')`,
                [tieuDe, noiDung, don.ma_nguoi_muon]
            );
        }

        console.log(`[Cron Job] Đã gửi xong nhắc nhở hạn trả đồ lúc ${new Date().toLocaleString()}`);
    } catch (error) {
        console.error("[Cron Job] Lỗi khi quét thông báo hạn trả:", error);
    }
};

module.exports = { 
    getDanhSachThongBaoAdmin, 
    danhDauDaDoc, 
    danhDauDocTatCa,
    getDanhSachThongBaoUser,
    danhDauDocTatCaUser,
    thongBaoQuaHan
};