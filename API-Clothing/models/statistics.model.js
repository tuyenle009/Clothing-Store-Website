const db = require("../common/db");

const Statistics = (statistics) => {
    this.stat_id = statistics.stat_id;
    this.report_date = statistics.report_date;
    this.total_orders = statistics.total_orders;
    this.total_revenue = statistics.total_revenue;
    this.total_customers = statistics.total_customers;
    this.top_selling_product = statistics.top_selling_product;
};

Statistics.getById = (stat_id, callback) => {
    const sqlString = "SELECT * FROM statistics WHERE stat_id = ?";
    db.query(sqlString, [stat_id], (err, result) => {
        if (err) return callback(err);
        callback(null, result[0]);
    });
};

Statistics.getAll = (callback) => {
    const sqlString = "SELECT * FROM statistics ORDER BY report_date DESC";
    db.query(sqlString, (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

Statistics.getDashboardStats = (callback) => {
    const queries = {
        total_orders: `
            SELECT COUNT(*) as total 
            FROM orders 
            WHERE status != 'cancelled'
        `,
        total_revenue: `
            SELECT COALESCE(SUM(o.total_amount), 0) as total 
            FROM orders o
            WHERE o.status = 'completed'
        `,
        total_customers: `
            SELECT COUNT(DISTINCT u.user_id) as total 
            FROM users u
            LEFT JOIN orders o ON u.user_id = o.user_id
            WHERE u.role = 'user' AND u.is_deleted = 0
        `,
        top_selling_product: `
            SELECT 
                p.name,
                p.product_id,
                SUM(od.quantity) as total_sold,
                SUM(od.quantity * od.price) as revenue
            FROM order_details od 
            JOIN products p ON od.product_id = p.product_id
            JOIN orders o ON od.order_id = o.order_id
            WHERE o.status = 'completed'
            GROUP BY p.product_id, p.name
            ORDER BY total_sold DESC, revenue DESC
            LIMIT 1
        `
    };

    const stats = {};
    let completed = 0;

    Object.entries(queries).forEach(([key, query]) => {
        db.query(query, (err, result) => {
            if (err) return callback(err);
            
            if (key === 'top_selling_product') {
                if (result[0]) {
                    stats[key] = {
                        name: result[0].name,
                        total_sold: result[0].total_sold,
                        revenue: result[0].revenue
                    };
                } else {
                    stats[key] = {
                        name: 'Chưa có dữ liệu',
                        total_sold: 0,
                        revenue: 0
                    };
                }
            } else {
                stats[key] = result[0].total || 0;
            }
            
            completed++;
            if (completed === Object.keys(queries).length) {
                callback(null, stats);
            }
        });
    });
};

Statistics.getMonthlyRevenue = (callback) => {
    const query = `
        SELECT 
            DATE_FORMAT(o.order_date, '%Y-%m') as month,
            COUNT(DISTINCT o.order_id) as total_orders,
            COALESCE(SUM(o.total_amount), 0) as revenue,
            COUNT(DISTINCT o.user_id) as unique_customers
        FROM orders o
        WHERE o.status = 'completed'
        GROUP BY DATE_FORMAT(o.order_date, '%Y-%m')
        ORDER BY month DESC
        LIMIT 12
    `;

    db.query(query, (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

Statistics.insert = (statistics, callBack) => {
    const sqlString = "INSERT INTO statistics SET ?";
    db.query(sqlString, statistics, (err, res) => {
        if (err) return callBack(err);
        callBack(null, { stat_id: res.insertId, ...statistics });
    });
};

Statistics.update = (statistics, stat_id, callBack) => {
    const sqlString = "UPDATE statistics SET ? WHERE stat_id = ?";
    db.query(sqlString, [statistics, stat_id], (err, res) => {
        if (err) return callBack(err);
        callBack(null, `Cập nhật Statistics có stat_id = ${stat_id} thành công`);
    });
};

Statistics.delete = (stat_id, callBack) => {
    db.query(`DELETE FROM statistics WHERE stat_id = ?`, [stat_id], (err, res) => {
        if (err) return callBack(err);
        callBack(null, `Xóa Statistics có stat_id = ${stat_id} thành công`);
    });
};

module.exports = Statistics;
