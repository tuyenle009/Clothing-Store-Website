import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import productDetailService from './productDetailService';
import productService from './productService';

const ProductDetails = () => {
    const router = useRouter();
    const { productId } = router.query;
    const toast = useRef(null);
    
    const [product, setProduct] = useState(null);
    const [productDetails, setProductDetails] = useState([]);
    const [productDetail, setProductDetail] = useState(null);
    const [productDetailDialog, setProductDetailDialog] = useState(false);
    const [deleteProductDetailDialog, setDeleteProductDetailDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (productId) {
            fetchProductDetails();
            fetchProduct();
        }
    }, [productId]);
    
    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const data = await productDetailService.getProductDetailsByProductId(productId);
            const activeDetails = data.filter(detail => !detail.is_deleted);
            setProductDetails(activeDetails);
        } catch (error) {
            console.error('Error fetching product details:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Không thể tải chi tiết sản phẩm', life: 3000 });
        } finally {
            setLoading(false);
        }
    };
    
    const fetchProduct = async () => {
        try {
            const data = await productService.getProductById(productId);
            if (data && data.length > 0) {
                setProduct(data[0]);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Không thể tải thông tin sản phẩm', life: 3000 });
        }
    };
    
    const openNew = () => {
        setProductDetail({
            product_id: parseInt(productId),
            color: '',
            size: '',
            stock_quantity: 0,
            image_url: ''
        });
        setSubmitted(false);
        setProductDetailDialog(true);
    };
    
    const hideDialog = () => {
        setSubmitted(false);
        setProductDetailDialog(false);
    };
    
    const hideDeleteProductDetailDialog = () => {
        setDeleteProductDetailDialog(false);
    };
    
    const saveProductDetail = async () => {
        setSubmitted(true);
        
        if (!productDetail.color || !productDetail.size || productDetail.stock_quantity <= 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Vui lòng điền đầy đủ thông tin', life: 3000 });
            return;
        }
        
        try {
            if (productDetail.detail_id) {
                // Update
                await productDetailService.updateProductDetail(productDetail.detail_id, productDetail);
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Cập nhật chi tiết sản phẩm thành công', life: 3000 });
            } else {
                // Create
                await productDetailService.addProductDetail(productDetail);
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Thêm chi tiết sản phẩm thành công', life: 3000 });
            }
            
            await fetchProductDetails();
            hideDialog();
        } catch (error) {
            console.error('Error saving product detail:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Không thể lưu chi tiết sản phẩm', life: 3000 });
        }
    };
    
    const editProductDetail = (detail) => {
        setProductDetail({ ...detail });
        setProductDetailDialog(true);
    };
    
    const confirmDeleteProductDetail = (detail) => {
        setProductDetail(detail);
        setDeleteProductDetailDialog(true);
    };
    
    const deleteProductDetail = async () => {
        try {
            await productDetailService.deleteProductDetail(productDetail.detail_id);
            await fetchProductDetails();
            setDeleteProductDetailDialog(false);
            toast.current.show({ 
                severity: 'success', 
                summary: 'Thành công', 
                detail: 'Đã ẩn chi tiết sản phẩm', 
                life: 3000 
            });
        } catch (error) {
            console.error('Error deleting product detail:', error);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Lỗi', 
                detail: 'Không thể ẩn chi tiết sản phẩm', 
                life: 3000 
            });
        }
    };
    
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || e;
        let _productDetail = { ...productDetail };
        _productDetail[`${name}`] = val;
        setProductDetail(_productDetail);
    };
    
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProductDetail(rowData)} tooltip="Chỉnh sửa" />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProductDetail(rowData)} tooltip="Xóa" />
            </React.Fragment>
        );
    };
    
    const imageBodyTemplate = (rowData) => {
        return rowData.image_url ? (
            <img src={rowData.image_url} alt={`${rowData.color} - ${rowData.size}`} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
        ) : (
            <span>Không có ảnh</span>
        );
    };
    
    const productDetailDialogFooter = (
        <React.Fragment>
            <Button label="Hủy" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Lưu" icon="pi pi-check" onClick={saveProductDetail} />
        </React.Fragment>
    );
    
    const deleteProductDetailDialogFooter = (
        <React.Fragment>
            <Button label="Không" icon="pi pi-times" outlined onClick={hideDeleteProductDetailDialog} />
            <Button label="Có" icon="pi pi-check" severity="danger" onClick={deleteProductDetail} />
        </React.Fragment>
    );
    
    if (loading) {
        return <div>Đang tải...</div>;
    }
    
    if (!product) {
        return <div>Không tìm thấy sản phẩm</div>;
    }
    
    return (
        <div className="card">
            <Toast ref={toast} />
            
            <div className="flex justify-content-between align-items-center mb-3">
                <h2>Chi tiết sản phẩm: {product.product_name}</h2>
                <Button label="Thêm chi tiết" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
            
            <DataTable value={productDetails} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} 
                      emptyMessage="Không có chi tiết sản phẩm nào">
                <Column field="detail_id" header="ID" sortable style={{ minWidth: '5rem' }} />
                <Column field="color" header="Màu sắc" sortable style={{ minWidth: '10rem' }} />
                <Column field="size" header="Kích thước" sortable style={{ minWidth: '10rem' }} />
                <Column field="stock_quantity" header="Số lượng tồn" sortable style={{ minWidth: '10rem' }} />
                <Column field="image_url" header="Hình ảnh" body={imageBodyTemplate} style={{ minWidth: '10rem' }} />
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }} />
            </DataTable>
            
            <Dialog visible={productDetailDialog} style={{ width: '450px' }} header={productDetail.detail_id ? 'Chỉnh sửa chi tiết sản phẩm' : 'Thêm chi tiết sản phẩm'} 
                    modal className="p-fluid" footer={productDetailDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="color" className="font-bold">Màu sắc</label>
                    <InputText id="color" value={productDetail.color} onChange={(e) => onInputChange(e, 'color')} 
                              required autoFocus className={classNames({ 'p-invalid': submitted && !productDetail.color })} />
                    {submitted && !productDetail.color && <small className="p-error">Vui lòng nhập màu sắc.</small>}
                </div>
                <div className="field">
                    <label htmlFor="size" className="font-bold">Kích thước</label>
                    <InputText id="size" value={productDetail.size} onChange={(e) => onInputChange(e, 'size')} 
                              required className={classNames({ 'p-invalid': submitted && !productDetail.size })} />
                    {submitted && !productDetail.size && <small className="p-error">Vui lòng nhập kích thước.</small>}
                </div>
                <div className="field">
                    <label htmlFor="stock_quantity" className="font-bold">Số lượng tồn</label>
                    <InputNumber id="stock_quantity" value={productDetail.stock_quantity} onValueChange={(e) => onInputChange(e.value, 'stock_quantity')} 
                                required min={0} className={classNames({ 'p-invalid': submitted && productDetail.stock_quantity <= 0 })} />
                    {submitted && productDetail.stock_quantity <= 0 && <small className="p-error">Vui lòng nhập số lượng tồn.</small>}
                </div>
                <div className="field">
                    <label htmlFor="image_url" className="font-bold">URL hình ảnh</label>
                    <InputText id="image_url" value={productDetail.image_url} onChange={(e) => onInputChange(e, 'image_url')} />
                </div>
            </Dialog>
            
            <Dialog visible={deleteProductDetailDialog} style={{ width: '450px' }} header="Xác nhận" modal footer={deleteProductDetailDialogFooter} onHide={hideDeleteProductDetailDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {productDetail && <span>Bạn có chắc chắn muốn xóa chi tiết sản phẩm này?</span>}
                </div>
            </Dialog>
        </div>
    );
};

export default ProductDetails; 