const db = require("../common/db");

function Order_details(order_details) {
    this.order_detail_id = order_details.order_detail_id;
    this.order_id = order_details.order_id;
    this.detail_id = order_details.detail_id;
    this.quantity = order_details.quantity;
    this.price = order_details.price;
}

Order_details.getById = (order_detail_id, callback) => {
    const sqlString = `
        SELECT od.*, 
               pd.color, pd.size, pd.image_url, pd.stock_quantity,
               p.product_name, p.description, p.price as product_price
        FROM order_details od
        JOIN product_details pd ON od.detail_id = pd.detail_id
        JOIN products p ON pd.product_id = p.product_id
        WHERE od.order_detail_id = ?`;
    db.query(sqlString, [order_detail_id], (err, result) => {
        if (err) return callback(err);
        callback(null, result[0]);
    });
};

Order_details.getAll = (callback) => {
    const sqlString = `
        SELECT od.*, 
               pd.color, pd.size, pd.image_url, pd.stock_quantity,
               p.product_name, p.description, p.price as product_price
        FROM order_details od
        JOIN product_details pd ON od.detail_id = pd.detail_id
        JOIN products p ON pd.product_id = p.product_id`;
    db.query(sqlString, (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

Order_details.getByOrderId = (order_id, callback) => {
    const sqlString = `
        SELECT od.*, 
               pd.color, pd.size, pd.image_url, pd.stock_quantity,
               p.product_name, p.description, p.price as product_price
        FROM order_details od
        JOIN product_details pd ON od.detail_id = pd.detail_id
        JOIN products p ON pd.product_id = p.product_id
        WHERE od.order_id = ?`;
    db.query(sqlString, [order_id], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

Order_details.insert = (order_details, callBack) => {
    // Kiểm tra số lượng tồn kho trước khi thêm
    const checkStockSql = `
        SELECT stock_quantity, product_id
        FROM product_details 
        WHERE detail_id = ? AND is_deleted = FALSE
        FOR UPDATE`; // Thêm FOR UPDATE để lock record
    
    // Bắt đầu transaction
    db.beginTransaction(err => {
        if (err) return callBack(err);
        
        db.query(checkStockSql, [order_details.detail_id], (err, stockResult) => {
            if (err) {
                return db.rollback(() => callBack(err));
            }
            
            if (!stockResult.length) {
                return db.rollback(() => callBack("Sản phẩm không tồn tại hoặc đã bị xóa"));
            }

            if (stockResult[0].stock_quantity < order_details.quantity) {
                return db.rollback(() => callBack("Số lượng sản phẩm trong kho không đủ"));
            }

            // Insert order detail
            const insertSql = "INSERT INTO order_details SET ?";
            db.query(insertSql, order_details, (err, res) => {
                if (err) {
                    return db.rollback(() => callBack(err));
                }

                // Update stock quantity
                const updateStockSql = `
                    UPDATE product_details 
                    SET stock_quantity = stock_quantity - ? 
                    WHERE detail_id = ?`;
                
                db.query(updateStockSql, [order_details.quantity, order_details.detail_id], (err) => {
                    if (err) {
                        return db.rollback(() => callBack(err));
                    }

                    // Commit transaction
                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => callBack(err));
                        }
                        callBack(null, { order_detail_id: res.insertId, ...order_details });
                    });
                });
            });
        });
    });
};

Order_details.update = (order_details, order_detail_id, callBack) => {
    // Lấy thông tin chi tiết đơn hàng cũ
    db.query("SELECT detail_id, quantity FROM order_details WHERE order_detail_id = ?", 
    [order_detail_id], (err, oldOrderDetail) => {
        if (err) return callBack(err);
        if (!oldOrderDetail.length) return callBack("Không tìm thấy chi tiết đơn hàng");

        const oldQuantity = oldOrderDetail[0].quantity;
        const oldDetailId = oldOrderDetail[0].detail_id;
        const newQuantity = order_details.quantity || oldQuantity;
        const newDetailId = order_details.detail_id || oldDetailId;

        // Kiểm tra và cập nhật số lượng tồn kho
        if (newDetailId === oldDetailId) {
            // Cùng một sản phẩm, chỉ cập nhật số lượng
            const quantityDiff = newQuantity - oldQuantity;
            if (quantityDiff !== 0) {
                db.query(
                    "UPDATE product_details SET stock_quantity = stock_quantity - ? WHERE detail_id = ?",
                    [quantityDiff, oldDetailId],
                    (stockErr) => {
                        if (stockErr) return callBack(stockErr);
                        updateOrderDetail();
                    }
                );
            } else {
                updateOrderDetail();
            }
        } else {
            // Khác sản phẩm, cập nhật cả hai sản phẩm
            db.query(
                "UPDATE product_details SET stock_quantity = stock_quantity + ? WHERE detail_id = ?; " +
                "UPDATE product_details SET stock_quantity = stock_quantity - ? WHERE detail_id = ?",
                [oldQuantity, oldDetailId, newQuantity, newDetailId],
                (stockErr) => {
                    if (stockErr) return callBack(stockErr);
                    updateOrderDetail();
                }
            );
        }

        function updateOrderDetail() {
            const sqlString = "UPDATE order_details SET ? WHERE order_detail_id = ?";
            db.query(sqlString, [order_details, order_detail_id], (updateErr, res) => {
                if (updateErr) return callBack(updateErr);
                callBack(null, `Cập nhật Order_details có order_detail_id = ${order_detail_id} thành công`);
            });
        }
    });
};

Order_details.delete = (order_detail_id, callBack) => {
    // Lấy thông tin chi tiết đơn hàng trước khi xóa
    db.query(
        "SELECT detail_id, quantity FROM order_details WHERE order_detail_id = ?",
        [order_detail_id],
        (err, result) => {
            if (err) return callBack(err);
            if (!result.length) return callBack("Không tìm thấy chi tiết đơn hàng");

            const { detail_id, quantity } = result[0];

            // Hoàn lại số lượng vào kho
            db.query(
                "UPDATE product_details SET stock_quantity = stock_quantity + ? WHERE detail_id = ?",
                [quantity, detail_id],
                (stockErr) => {
                    if (stockErr) return callBack(stockErr);

                    // Xóa chi tiết đơn hàng
                    const sqlString = "DELETE FROM order_details WHERE order_detail_id = ?";
                    db.query(sqlString, [order_detail_id], (deleteErr, res) => {
                        if (deleteErr) return callBack(deleteErr);
                        callBack(null, `Xóa Order_details có order_detail_id = ${order_detail_id} thành công`);
                    });
                }
            );
        }
    );
};

module.exports = Order_details;
