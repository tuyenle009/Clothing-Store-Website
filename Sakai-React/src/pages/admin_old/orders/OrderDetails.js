import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { getAllProducts, getProductColors, getProductSizes, getDetailId, getAllOrderDetails, saveOrderDetail, updateOrderDetail, deleteOrderDetail } from './orderDetailService';
import { formatCurrency } from '../../../utilities/NumberUtils';

export const OrderDetails = ({ orderId }) => {
    const [orderDetails, setOrderDetails] = useState([]);
    const [orderDetailDialog, setOrderDetailDialog] = useState(false);
    const [deleteOrderDetailDialog, setDeleteOrderDetailDialog] = useState(false);
    const [orderDetail, setOrderDetail] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [colors, setColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [sizes, setSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [stockQuantity, setStockQuantity] = useState(0);
    const toast = useRef(null);

    useEffect(() => {
        loadOrderDetails();
        loadProducts();
    }, []);

    const loadOrderDetails = async () => {
        try {
            const data = await getAllOrderDetails(orderId);
            setOrderDetails(data);
        } catch (error) {
            console.error('Error loading order details:', error);
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load order details', life: 3000 });
            }
        }
    };

    const loadProducts = async () => {
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load products', life: 3000 });
            }
        }
    };

    const onProductChange = async (e) => {
        setSelectedProduct(e.value);
        setSelectedColor(null);
        setSelectedSize(null);
        setStockQuantity(0);
        
        if (e.value) {
            try {
                const colors = await getProductColors(e.value.product_id);
                setColors(colors);
            } catch (error) {
                console.error('Error loading colors:', error);
                if (toast.current) {
                    toast.current.show({ 
                        severity: 'error', 
                        summary: 'Lỗi', 
                        detail: 'Không thể tải danh sách màu sắc', 
                        life: 3000 
                    });
                }
            }
        } else {
            setColors([]);
        }
    };

    const onColorChange = async (e) => {
        setSelectedColor(e.value);
        setSelectedSize(null);
        setStockQuantity(0);
        
        if (selectedProduct && e.value) {
            try {
                const sizes = await getProductSizes(selectedProduct.product_id, e.value);
                setSizes(sizes);
            } catch (error) {
                console.error('Error loading sizes:', error);
                if (toast.current) {
                    toast.current.show({ 
                        severity: 'error', 
                        summary: 'Lỗi', 
                        detail: 'Không thể tải danh sách kích thước', 
                        life: 3000 
                    });
                }
            }
        } else {
            setSizes([]);
        }
    };

    const onSizeChange = async (e) => {
        setSelectedSize(e.value);
        
        if (selectedProduct && selectedColor && e.value) {
            try {
                const detailData = await getDetailId(selectedProduct.product_id, selectedColor, e.value);
                setStockQuantity(detailData.stock_quantity);
                setOrderDetail(prevState => ({
                    ...prevState,
                    detail_id: detailData.detail_id,
                    price: selectedProduct.price
                }));
            } catch (error) {
                console.error('Error loading detail info:', error);
                if (toast.current) {
                    toast.current.show({ 
                        severity: 'error', 
                        summary: 'Lỗi', 
                        detail: 'Không thể tải thông tin chi tiết sản phẩm', 
                        life: 3000 
                    });
                }
            }
        }
    };

    const openNew = () => {
        setOrderDetail({
            order_id: orderId,
            quantity: 1
        });
        setSelectedProduct(null);
        setSelectedColor(null);
        setSelectedSize(null);
        setStockQuantity(0);
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

    const saveOrderDetailItem = async () => {
        setSubmitted(true);

        if (!orderDetail.detail_id || !orderDetail.quantity) {
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields', life: 3000 });
            }
            return;
        }

        if (orderDetail.quantity > stockQuantity) {
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Quantity exceeds available stock', life: 3000 });
            }
            return;
        }

        try {
            if (orderDetail.order_detail_id) {
                await updateOrderDetail(orderDetail);
                if (toast.current) {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Order Detail Updated', life: 3000 });
                }
            } else {
                await saveOrderDetail(orderDetail);
                if (toast.current) {
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Order Detail Created', life: 3000 });
                }
            }

            hideDialog();
            loadOrderDetails();
        } catch (error) {
            console.error('Error saving order detail:', error);
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save order detail', life: 3000 });
            }
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

    const deleteOrderDetailItem = async () => {
        try {
            await deleteOrderDetail(orderDetail.order_detail_id);
            loadOrderDetails();
            setDeleteOrderDetailDialog(false);
            if (toast.current) {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Order Detail Deleted', life: 3000 });
            }
        } catch (error) {
            console.error('Error deleting order detail:', error);
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete order detail', life: 3000 });
            }
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editOrderDetail(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteOrderDetail(rowData)} />
            </React.Fragment>
        );
    };

    const orderDetailDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveOrderDetailItem} />
        </React.Fragment>
    );

    const deleteOrderDetailDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteOrderDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-danger" onClick={deleteOrderDetailItem} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />

            <div className="card">
                <Button label="Add Order Detail" icon="pi pi-plus" className="p-button-success mb-3" onClick={openNew} />

                <DataTable value={orderDetails} responsiveLayout="scroll">
                    <Column field="product_name" header="Product" />
                    <Column field="color" header="Color" />
                    <Column field="size" header="Size" />
                    <Column field="quantity" header="Quantity" />
                    <Column field="price" header="Price" body={(rowData) => formatCurrency(rowData.price)} />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }} />
                </DataTable>
            </div>

            <Dialog visible={orderDetailDialog} style={{ width: '450px' }} header="Order Detail" modal className="p-fluid" footer={orderDetailDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="product">Product</label>
                    <Dropdown id="product" value={selectedProduct} options={products} onChange={onProductChange} optionLabel="name" 
                            placeholder="Select a Product" className={classNames({ 'p-invalid': submitted && !orderDetail?.detail_id })} />
                    {submitted && !orderDetail?.detail_id && <small className="p-error">Product is required.</small>}
                </div>

                <div className="field">
                    <label htmlFor="color">Color</label>
                    <Dropdown id="color" value={selectedColor} options={colors} onChange={onColorChange}
                            placeholder="Select a Color" disabled={!selectedProduct} />
                </div>

                <div className="field">
                    <label htmlFor="size">Size</label>
                    <Dropdown id="size" value={selectedSize} options={sizes} onChange={onSizeChange}
                            placeholder="Select a Size" disabled={!selectedColor} />
                </div>

                <div className="field">
                    <label htmlFor="quantity">Quantity (Available: {stockQuantity})</label>
                    <InputNumber id="quantity" value={orderDetail?.quantity} onValueChange={(e) => setOrderDetail({ ...orderDetail, quantity: e.value })} 
                               mode="decimal" showButtons min={1} max={stockQuantity}
                               className={classNames({ 'p-invalid': submitted && !orderDetail?.quantity })} />
                    {submitted && !orderDetail?.quantity && <small className="p-error">Quantity is required.</small>}
                </div>

                {selectedProduct && (
                    <div className="field">
                        <label>Price</label>
                        <div className="p-inputtext">{formatCurrency(selectedProduct.price)}</div>
                    </div>
                )}
            </Dialog>

            <Dialog visible={deleteOrderDetailDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteOrderDetailDialogFooter} onHide={hideDeleteOrderDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {orderDetail && <span>Are you sure you want to delete this order detail?</span>}
                </div>
            </Dialog>
        </div>
    );
};

export default OrderDetails; 