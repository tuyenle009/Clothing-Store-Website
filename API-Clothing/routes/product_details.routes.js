// Lấy danh sách màu sắc của một sản phẩm
router.get("/colors/:productId", (req, res) => {
    const productId = req.params.productId;
    const sql = `
        SELECT DISTINCT color 
        FROM product_details 
        WHERE product_id = ? AND is_deleted = FALSE
        ORDER BY color`;
    
    db.query(sql, [productId], (err, result) => {
        if (err) {
            console.error('Error fetching colors:', err);
            return res.status(500).json({ message: "Error fetching colors" });
        }
        res.json(result.map(item => item.color));
    });
});

// Lấy danh sách kích thước của một sản phẩm theo màu
router.get("/sizes/:productId/:color", (req, res) => {
    const { productId, color } = req.params;
    const sql = `
        SELECT DISTINCT size 
        FROM product_details 
        WHERE product_id = ? AND color = ? AND is_deleted = FALSE
        ORDER BY size`;
    
    db.query(sql, [productId, color], (err, result) => {
        if (err) {
            console.error('Error fetching sizes:', err);
            return res.status(500).json({ message: "Error fetching sizes" });
        }
        res.json(result.map(item => item.size));
    });
});

// Lấy detail_id dựa trên product_id, color và size
router.get("/detail/:productId/:color/:size", (req, res) => {
    const { productId, color, size } = req.params;
    const sql = `
        SELECT detail_id, stock_quantity 
        FROM product_details 
        WHERE product_id = ? AND color = ? AND size = ? AND is_deleted = FALSE`;
    
    db.query(sql, [productId, color, size], (err, result) => {
        if (err) {
            console.error('Error fetching detail_id:', err);
            return res.status(500).json({ message: "Error fetching detail_id" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Product detail not found" });
        }
        res.json(result[0]);
    });
}); 