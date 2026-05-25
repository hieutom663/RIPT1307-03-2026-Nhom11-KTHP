const pool = require('../config/db.config');

const getDanhSachThietBi = async (req, res) => {
    try {
        const id_danhmuc = req.query.danhMuc || 'tat-ca'; 
        const tuKhoa = req.query.tuKhoa || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        let queryStr = `
            SELECT 
                ma_thiet_bi, 
                ten_thiet_bi, 
                hinh_anh AS img, 
                mo_ta AS moTa, 
                tong_so_luong AS soLuongTong, 
                so_luong_con_lai AS soLuongConLai, 
                id_danhmuc, 
                tinh_trang
            FROM thietbi
            WHERE 1=1
        `;
        let countQueryStr = "SELECT COUNT(*) as total FROM thietbi WHERE 1=1";
        let queryParams = [];

        if (id_danhmuc !== 'tat-ca') {
            queryStr += " AND id_danhmuc = ?";
            countQueryStr += " AND id_danhmuc = ?";
            queryParams.push(id_danhmuc);
        }

        if (tuKhoa.trim() !== '') {
            queryStr += " AND ten_thiet_bi LIKE ?";
            countQueryStr += " AND ten_thiet_bi LIKE ?";
            queryParams.push(`%${tuKhoa}%`);
        }

        queryStr += " LIMIT ? OFFSET ?";
        
        const countParams = [...queryParams];
        queryParams.push(limit, offset);

        const [dataRows] = await pool.query(queryStr, queryParams);
        const [countRows] = await pool.query(countQueryStr, countParams);

        res.json({
            success: true,
            total: countRows[0].total,
            data: dataRows
        });

    } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi lấy dữ liệu" });
    }
};

const getTatCaDanhMuc = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT ma_danh_muc, ten_danh_muc FROM danhmuc");
        res.json({ success: true, data: rows });
    } catch (error) {
        console.log("Lỗi: ", error)
        res.status(500).json({ success: false, message: "Lỗi lấy danh mục" });
    }
};

const taoYeuCauMuon = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const { ma_thiet_bi, so_luong_muon, ngay_muon, ngay_tra, ly_do, ma_sv } = req.body;

        await connection.beginTransaction();

        const [thietBiRows] = await connection.query(
            "SELECT so_luong_con_lai FROM thietbi WHERE ma_thiet_bi = ?", 
            [ma_thiet_bi]
        );

        if (thietBiRows.length === 0) {
            await connection.rollback(); 
            connection.release();
            return res.json({ success: false, message: "Không tìm thấy thiết bị này!" });
        }

        const soLuongConLai = thietBiRows[0].so_luong_con_lai;

        if (so_luong_muon > soLuongConLai) {
            await connection.rollback(); 
            connection.release();
            return res.json({ success: false, message: "Số lượng thiết bị không đủ đáp ứng!" });
        }


        const [maxYCM] = await connection.query("SELECT MAX(ma_yeu_cau) as maxId FROM yeucaumuon");
        let ma_yeu_cau = 'YCM0001'; 
        if (maxYCM[0].maxId) {
            const currentNum = parseInt(maxYCM[0].maxId.replace('YCM', ''), 10);
            const nextNum = currentNum + 1;
            ma_yeu_cau = 'YCM' + nextNum.toString().padStart(4, '0'); 
        }

        const [maxCTD] = await connection.query("SELECT MAX(id) as maxId FROM chitietdon");
        let id_chi_tiet = 'CTD0001';
        if (maxCTD[0].maxId) {
            const currentNum = parseInt(maxCTD[0].maxId.replace('CTD', ''), 10);
            const nextNum = currentNum + 1;
            id_chi_tiet = 'CTD' + nextNum.toString().padStart(4, '0');
        }

        const insertYeuCau = `
            INSERT INTO yeucaumuon 
            (ma_yeu_cau, ma_nguoi_muon, ngay_muon, ngay_tra_du_kien, li_do_muon, trang_thai) 
            VALUES (?, ?, ?, ?, ?, 'Chờ duyệt')
        `;
        await connection.query(insertYeuCau, [
            ma_yeu_cau, 
            ma_sv, 
            ngay_muon, 
            ngay_tra, 
            ly_do     
        ]);

        const insertChiTiet = `
            INSERT INTO chitietdon 
            (id, id_donmuon, id_thietbi, soluong, trang_thai) 
            VALUES (?, ?, ?, ?, 'chưa trả')
        `;
        await connection.query(insertChiTiet, [
            id_chi_tiet, 
            ma_yeu_cau,  
            ma_thiet_bi, 
            so_luong_muon
        ]);

        await connection.query(
            `UPDATE thietbi 
             SET so_luong_da_cho_muon = so_luong_da_cho_muon + ? 
             WHERE ma_thiet_bi = ?`,
            [so_luong_muon, ma_thiet_bi]
        );

        await connection.commit();
        connection.release(); 

        res.json({ success: true, message: "Gửi yêu cầu mượn thành công!" });

    } catch (error) {
        await connection.rollback();
        connection.release();
        console.error("Lỗi:", error);
        res.status(500).json({ success: false, message: "Lỗi server xử lý mượn" });
    }
};


module.exports = { getDanhSachThietBi, getTatCaDanhMuc, taoYeuCauMuon };