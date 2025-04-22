import React, { useState, useEffect, useRef } from 'react';
import orderDetailService from './orderDetailService';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';

const OrderDetails = ({ orderId, visible, onHide }) => {
    const [orderDetails, setOrderDetails] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderDetail, setOrderDetail] = useState(null);
    const [orderDetailDialog, setOrderDetailDialog] = useState(false);
    const [deleteOrderDetailDialog, setDeleteOrderDetailDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const [products, setProducts] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
        fetchProductDetails();
    }, []);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const data = await orderDetailService.getAllProductDetails();
            console.log('Fetched product details:', data);
            setProductDetails(data);
        } catch (err) {
            console.error('Error fetching product details:', err);
            if (toast.current) {
                toast.current.show({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'Không thể tải danh sách chi tiết sản phẩm', 
                    life: 3000 
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const getProductInfo = (detailId) => {
        const detail = productDetails.find(p => p.detail_id === detailId);
        if (!detail) return { name: 'Không xác định', color: '', size: '' };
        return {
            name: detail.product_name || 'Không xác định',
            color: detail.color || '',
            size: detail.size || '',
            image_url: detail.image_url,
            stock_quantity: detail.stock_quantity,
            price: detail.price
        };
    };

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const data = await orderDetailService.getOrderDetailsByOrderId(orderId);
            console.log('Fetched order details:', data);
            setOrderDetails(data);
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError(err.message);
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Không thể tải chi tiết đơn hàng',
                    life: 3000
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await orderDetailService.getAllProducts();
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
            if (toast.current) {
                toast.current.show({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'Không thể tải danh sách sản phẩm', 
                    life: 3000 
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchProductColors = async (productId) => {
        try {
            const data = await orderDetailService.getProductColors(productId);
            setColors(data);
            setSelectedColor(null);
            setSizes([]);
            setSelectedSize(null);
        } catch (err) {
            console.error('Error fetching colors:', err);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Không thể tải danh sách màu sắc', 
                life: 3000 
            });
        }
    };

    const fetchProductSizes = async (productId, color) => {
        try {
            const data = await orderDetailService.getProductSizes(productId, color);
            setSizes(data);
            setSelectedSize(null);
        } catch (err) {
            console.error('Error fetching sizes:', err);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Không thể tải danh sách kích thước', 
                life: 3000 
            });
        }
    };

    const onProductChange = (e) => {
        const product = e.value;
        setSelectedProduct(product);
        if (product) {
            fetchProductColors(product.product_id);
        } else {
            setColors([]);
            setSizes([]);
            setSelectedColor(null);
            setSelectedSize(null);
        }
    };

    const onColorChange = (e) => {
        const color = e.value;
        setSelectedColor(color);
        if (color && selectedProduct) {
            fetchProductSizes(selectedProduct.product_id, color);
        } else {
            setSizes([]);
            setSelectedSize(null);
        }
    };

    const onSizeChange = async (e) => {
        const size = e.value;
        setSelectedSize(size);
        if (size && selectedProduct && selectedColor) {
            try {
                const detailData = await orderDetailService.getDetailId(
                    selectedProduct.product_id,
                    selectedColor,
                    size
                );
                let _orderDetail = { ...orderDetail };
                _orderDetail.detail_id = detailData.detail_id;
                _orderDetail.price = selectedProduct.price * (_orderDetail.quantity || 1);
                setOrderDetail(_orderDetail);
            } catch (err) {
                console.error('Error getting detail_id:', err);
            }
        }
    };

    const openNew = () => {
        setOrderDetail({
            order_detail_id: null,
            order_id: orderId,
            detail_id: null,
            quantity: 1,
            price: 0
        });
        setSubmitted(false);
        setOrderDetailDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setOrderDetailDialog(false);
    };

    const hideDeleteOrderDialog = () => {
        setDeleteOrderDetailDialog(false);
    };

    const saveOrderDetail = async () => {
        setSubmitted(true);

        if (!orderDetail.detail_id || !orderDetail.quantity) {
            return;
        }

        try {
            const productInfo = getProductInfo(orderDetail.detail_id);
            if (!productInfo) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Không tìm thấy thông tin sản phẩm',
                    life: 3000
                });
                return;
            }

            // Tính toán giá dựa trên giá sản phẩm và số lượng
            const totalPrice = productInfo.price * orderDetail.quantity;
            const orderDetailData = {
                ...orderDetail,
                price: totalPrice
            };

            if (orderDetail.order_detail_id) {
                await orderDetailService.updateOrderDetail(orderDetailData);
                toast.current.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Cập nhật chi tiết đơn hàng thành công',
                    life: 3000
                });
            } else {
                await orderDetailService.addOrderDetail(orderDetailData);
                toast.current.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Thêm chi tiết đơn hàng thành công',
                    life: 3000
                });
            }
            hideDialog();
            fetchOrderDetails();
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error.message,
                life: 3000
            });
        }
    };

    const editOrderDetail = (orderDetail) => {
        setOrderDetail({ ...orderDetail });
        setOrderDetailDialog(true);
    };

    const confirmDeleteOrderDetail = (orderDetail) => {
        setOrderDetail(orderDetail);
        setDeleteOrderDetailDialog(true);
    };

    const deleteOrderDetail = async () => {
        try {
            await orderDetailService.deleteOrderDetail(orderDetail.order_detail_id);
            toast.current.show({ 
                severity: 'success', 
                summary: 'Thành công', 
                detail: 'Xóa chi tiết đơn hàng thành công', 
                life: 3000 
            });
            hideDeleteOrderDialog();
            fetchOrderDetails();
        } catch (error) {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Lỗi', 
                detail: error.message, 
                life: 3000 
            });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _orderDetail = { ...orderDetail };

        if (name === 'detail_id') {
            _orderDetail.detail_id = val;
            // Cập nhật giá dựa trên số lượng hiện tại
            const selectedProduct = productDetails.find(p => p.detail_id === val);
            if (selectedProduct) {
                const quantity = _orderDetail.quantity || 1;
                _orderDetail.price = selectedProduct.price * quantity;
                _orderDetail.quantity = quantity;
            }
        } else if (name === 'quantity') {
            const quantity = parseInt(val) || 0;
            const selectedProduct = productDetails.find(p => p.detail_id === _orderDetail.detail_id);
            if (selectedProduct) {
                _orderDetail.quantity = quantity;
                _orderDetail.price = selectedProduct.price * quantity;
            } else {
                _orderDetail.quantity = quantity;
            }
        }

        setOrderDetail(_orderDetail);
    };

    const orderDetailDialogFooter = (
        <React.Fragment>
            <Button label="Hủy" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Lưu" icon="pi pi-check" onClick={saveOrderDetail} />
        </React.Fragment>
    );

    const deleteOrderDetailDialogFooter = (
        <React.Fragment>
            <Button label="Không" icon="pi pi-times" outlined onClick={hideDeleteOrderDialog} />
            <Button label="Có" icon="pi pi-check" severity="danger" onClick={deleteOrderDetail} />
        </React.Fragment>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <Button 
                        icon="pi pi-pencil" 
                        rounded 
                        outlined 
                        className="p-button-sm" 
                        onClick={() => editOrderDetail(rowData)} 
                    />
                    <Button 
                        icon="pi pi-trash" 
                        rounded 
                        outlined 
                        severity="danger" 
                        className="p-button-sm"
                        onClick={() => confirmDeleteOrderDetail(rowData)} 
                    />
                </div>
            </React.Fragment>
        );
    };

    return (
        <>
            <Dialog 
                visible={visible} 
                onHide={onHide}
                header="Chi tiết đơn hàng"
                style={{ width: '45vw' }}
                modal
                className="p-fluid"
                footer={
                    <React.Fragment>
                        <Button label="Thêm mới" icon="pi pi-plus" severity="success" onClick={openNew} />
                        <Button label="Đóng" icon="pi pi-times" outlined onClick={onHide} />
                    </React.Fragment>
                }
            >
                <Toast ref={toast} />
                {loading ? (
                    <div>Đang tải chi tiết đơn hàng...</div>
                ) : error ? (
                    <div>Lỗi: {error}</div>
                ) : (
                    <div className="order-details-container">
                        <table className="order-details-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '50px' }}>ID</th>
                                    <th style={{ width: '200px' }}>Sản phẩm</th>
                                    <th style={{ width: '100px' }}>Màu sắc</th>
                                    <th style={{ width: '80px' }}>Kích thước</th>
                                    <th style={{ width: '80px' }}>Số lượng</th>
                                    <th style={{ width: '120px' }}>Giá</th>
                                    <th style={{ width: '100px', textAlign: 'center' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails.map((detail) => {
                                    const productInfo = getProductInfo(detail.detail_id);
                                    return (
                                        <tr key={detail.order_detail_id}>
                                            <td>{detail.order_detail_id}</td>
                                            <td>{detail.product_name}</td>
                                            <td>{detail.color}</td>
                                            <td>{detail.size}</td>
                                            <td>{detail.quantity}</td>
                                            <td>
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0
                                                }).format(detail.price)}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>{actionBodyTemplate(detail)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Dialog>

            <Dialog visible={orderDetailDialog} style={{ width: '32rem' }} header={orderDetail?.order_detail_id ? 'Chỉnh sửa chi tiết đơn hàng' : 'Thêm chi tiết đơn hàng'} modal className="p-fluid" footer={orderDetailDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="product" className="font-bold">Tên sản phẩm</label>
                    <Dropdown
                        id="product"
                        value={selectedProduct}
                        options={products}
                        onChange={onProductChange}
                        optionLabel="product_name"
                        placeholder="Chọn sản phẩm"
                        className={classNames({ 'p-invalid': submitted && !selectedProduct })}
                        filter
                    />
                    {submitted && !selectedProduct && <small className="p-error">Vui lòng chọn sản phẩm.</small>}
                </div>

                <div className="field">
                    <label htmlFor="color" className="font-bold">Màu sắc</label>
                    <Dropdown
                        id="color"
                        value={selectedColor}
                        options={colors}
                        onChange={onColorChange}
                        placeholder="Chọn màu sắc"
                        className={classNames({ 'p-invalid': submitted && !selectedColor })}
                        disabled={!selectedProduct}
                    />
                    {submitted && !selectedColor && <small className="p-error">Vui lòng chọn màu sắc.</small>}
                </div>

                <div className="field">
                    <label htmlFor="size" className="font-bold">Kích thước</label>
                    <Dropdown
                        id="size"
                        value={selectedSize}
                        options={sizes}
                        onChange={onSizeChange}
                        placeholder="Chọn kích thước"
                        className={classNames({ 'p-invalid': submitted && !selectedSize })}
                        disabled={!selectedColor}
                    />
                    {submitted && !selectedSize && <small className="p-error">Vui lòng chọn kích thước.</small>}
                </div>

                <div className="field">
                    <label htmlFor="quantity" className="font-bold">Số lượng</label>
                    <InputText 
                        id="quantity" 
                        value={orderDetail?.quantity} 
                        onChange={(e) => onInputChange(e, 'quantity')} 
                        required 
                        type="number"
                        min="1"
                        className={classNames({ 'p-invalid': submitted && !orderDetail?.quantity })} 
                        disabled={!selectedSize}
                    />
                    {submitted && !orderDetail?.quantity && <small className="p-error">Vui lòng nhập số lượng.</small>}
                </div>

                <div className="field">
                    <label htmlFor="price" className="font-bold">Thành tiền</label>
                    <InputText 
                        id="price" 
                        value={new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(orderDetail?.price || 0)} 
                        disabled
                        className="text-right"
                    />
                </div>
            </Dialog>

            <Dialog visible={deleteOrderDetailDialog} style={{ width: '32rem' }} header="Xác nhận" modal footer={deleteOrderDetailDialogFooter} onHide={hideDeleteOrderDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {orderDetail && (
                        <span>
                            Bạn có chắc muốn xóa chi tiết đơn hàng: <b>{orderDetail.order_detail_id}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </>
    );
};

export default OrderDetails; 