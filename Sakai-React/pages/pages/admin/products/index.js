import productService from './productService';
import productDetailService from './productDetailService';
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { config } from '@fullcalendar/core/internal';
import { useRouter } from 'next/router';


const Index = () => {
    // State declarations
    const [product, setProduct] = useState([]); 
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const [globalFilter, setGlobalFilter] = useState([]);
    const [productId, setProductId] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [productDetailsDialog, setProductDetailsDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [productDetail, setProductDetail] = useState(null);
    const [productDetailDialog, setProductDetailDialog] = useState(false);
    const [deleteProductDetailDialog, setDeleteProductDetailDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [editingDetail, setEditingDetail] = useState(null);
    const [editDetailDialog, setEditDetailDialog] = useState(false);

    // Refs
    const toast = useRef(null);
    const dt = useRef(null);
    const router = useRouter();

    const sizeOptions = [
        { label: 'S', value: 'S' },
        { label: 'M', value: 'M' },
        { label: 'L', value: 'L' },
        { label: 'XL', value: 'XL' },
        { label: 'XXL', value: 'XXL' }
    ];

    const colorOptions = [
        { label: 'Trắng', value: 'Trắng' },
        { label: 'Đen', value: 'Đen' },
        { label: 'Xám', value: 'Xám' },
        { label: 'Be', value: 'Be' },
        { label: 'Nâu', value: 'Nâu' },
        { label: 'Đỏ', value: 'Đỏ' },
        { label: 'Hồng', value: 'Hồng' },
        { label: 'Cam', value: 'Cam' },
        { label: 'Vàng', value: 'Vàng' },
        { label: 'Xanh lá', value: 'Xanh lá' },
        { label: 'Xanh dương', value: 'Xanh dương' },
        { label: 'Tím', value: 'Tím' },
        { label: 'Navy', value: 'Navy' }
    ];

    // showData: Lấy danh sách tất cả sản phẩm từ API và cập nhật vào state products
    const showData = async () => {
        try {
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    };

    useEffect(() => {
        showData();
        fetchCategories();
    }, []);


    // fetchData: Gọi hàm showData để tải dữ liệu khi component được render.
    const fetchData = async () => {
        showData();
    };

    let emptyProduct = {
        product_id: null,
        category_id: null,
        product_name: "",
        description: "",
        price: 0.0,
        image_url: "",
        created_at: new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
    };

    // openNew: Mở hộp thoại thêm mới sản phẩm với dữ liệu mặc định.
    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    // confirmDeleteSelected: Hiển thị hộp thoại xác nhận xóa nhiều sản phẩm được chọn.
    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    // exportCSV: Xuất danh sách sản phẩm ra tệp CSV.
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    // hideDialog: Đóng hộp thoại chỉnh sửa/thêm mới sản phẩm.
    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    // hideProductDetailsDialog: Đóng hộp thoại chi tiết sản phẩm.
    const hideProductDetailsDialog = () => {
        setProductDetailsDialog(false);
    };

    // viewProductDetails: Mở hộp thoại xem chi tiết sản phẩm.
    const viewProductDetails = async (product) => {
        try {
            const details = await productDetailService.getProductDetailsByProductId(product.product_id);
            // Lọc chỉ hiển thị các chi tiết chưa bị xóa
            const activeDetails = details.filter(detail => !detail.is_deleted);
            setProductDetails(activeDetails);
            setProduct(product);
            setProductDetailsDialog(true);
        } catch (error) {
            console.error('Error fetching product details:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Không thể tải chi tiết sản phẩm', life: 3000 });
        }
    };

    // deleteSelectedProducts: Xóa nhiều sản phẩm đã chọn và cập nhật danh sách.
    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));
        setProducts(_products);

        selectedProducts.map((item) => {
            productService.deleteProduct(item.product_id);
        });

        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        showData();

        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Records Deleted', life: 3500 });
    };

    // Thêm hàm format tiền tệ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    // Thêm hàm format ngày tháng
    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        // Chuyển đổi sang múi giờ Việt Nam
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Sử dụng định dạng 24 giờ
            timeZone: 'Asia/Ho_Chi_Minh'
        });
    };

    // saveProduct: Lưu thông tin sản phẩm (cập nhật nếu có product_id, thêm mới nếu không).
    const saveProduct = async () => {
        setSubmitted(true);

        let _products = [...products];
        let _product = { ...product };

        if (_product.product_id) {
            // Trường hợp cập nhật (product_id đã có)
            const index = findIndexById(_product.product_id);
            if (index !== -1) {
                _products[index] = _product;
                await productService.updateProduct(_product);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật sản phẩm thành công', life: 3000 });
            }
        } else {
            // Trường hợp thêm mới (product_id = null)
            const response = await productService.addProduct(_product);
            if (response?.product_id) {
                _product.product_id = response.product_id; // Lấy ID mới từ API
                _products.push(_product);
            }
            showData();
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm sản phẩm thành công', life: 3000 });
        }

        setProducts(_products);
        setProductDialog(false);
        setProduct(emptyProduct);
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button label='Cancel' icon='pi pi-times' outlined onClick={hideDialog} />
            <Button label='Save' icon='pi pi-check' onClick={saveProduct} />
        </React.Fragment>
    );

    // findIndexById: Tìm vị trí của sản phẩm trong danh sách theo product_id.
    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < products.length; i++) {
            if (products[i].product_id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    // onInputChange: Cập nhật dữ liệu sản phẩm khi nhập vào form.
    const onInputChange = (e, itemname) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        _product[`${itemname}`] = val;

        setProduct(_product);
    };

    // editProduct: Mở hộp thoại chỉnh sửa và tải dữ liệu sản phẩm vào form.
    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    // confirmDeleteProduct: Mở hộp thoại xác nhận xóa một sản phẩm cụ thể.
    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    // actionBodyTemplate: Hiển thị các nút thao tác (sửa, xóa) trong danh sách.
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" rounded outlined className="mr-2" onClick={() => viewProductDetails(rowData)} tooltip="Xem chi tiết" />
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} tooltip="Chỉnh sửa" />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} tooltip="Xóa" />
            </React.Fragment>
        );
    };

    // hideDeleteProductDialog: Đóng hộp thoại xác nhận xóa sản phẩm.
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    // deleteProduct: Xóa một sản phẩm khỏi hệ thống và cập nhật danh sách.
    const deleteProduct = async () => {
        try {
            await productService.deleteProduct(product.product_id); // Đảm bảo truyền đúng product_id
            await showData(); // Chỉ cập nhật danh sách sau khi API thực sự xóa
            setDeleteProductDialog(false);

            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Sản phẩm đã bị xóa', life: 3000 });

        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa sản phẩm', life: 3000 });
        }
    };

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label='Không' icon='pi pi-times' outlined onClick={hideDeleteProductDialog} />
            <Button label='Có' icon='pi pi-check' severity='danger' onClick={deleteProduct} />
        </React.Fragment>
    );


    // hideDeleteProductsDialog: Đóng hộp thoại xác nhận xóa nhiều sản phẩm.
    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label='Không' icon='pi pi-times' outlined onClick={hideDeleteProductsDialog} />
            <Button label='Có' icon='pi pi-check' severity='danger' onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    const header = (
        <div className='flex flex-wrap gap-2 align-items-center justify-content-between'>
            <h4 className='m-0'>Quản lý danh sách sản phẩm</h4>
            <div style={{ float: 'right' }}>
                <Button label='' icon='pi pi-plus' severity='success' tooltip='Thêm sản phẩm' onClick={openNew} /> &nbsp;&nbsp;
                <Button 
                    label='' 
                    icon='pi pi-trash' 
                    tooltip='Xóa sản phẩm đã chọn' 
                    severity='danger'  
                    onClick={confirmDeleteSelected} 
                    disabled={!selectedProducts || !selectedProducts.length}  
                />&nbsp;&nbsp;
                <Button label='' icon='pi pi-upload' tooltip='Xuất Excel' className='p-button-help' onClick={exportCSV} /> &nbsp;

                <span className='p-input-icon-left'>
                    <i className='pi pi-search' />
                    <InputText type='search' onInput={(e) => setGlobalFilter(e.target.value)} placeholder='Tìm kiếm...' />
                </span>
            </div>
        </div>
    );

    // Hàm lấy danh sách danh mục
    const fetchCategories = async () => {
        try {
            const data = await productService.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Không thể tải danh sách danh mục', life: 3000 });
        }
    };

    // Hàm helper để lấy tên danh mục từ mã danh mục
    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.category_id === categoryId);
        return category ? category.category_name : 'Không xác định';
    };

    const editProductDetail = (detail) => {
        setEditingDetail({ ...detail });
    };

    const hideEditDetailDialog = () => {
        setEditDetailDialog(false);
        setEditingDetail(null);
    };

    const saveProductDetail = async () => {
        setSubmitted(true);
        
        if (!productDetail.color || !productDetail.size || productDetail.stock_quantity <= 0) {
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng điền đầy đủ thông tin', life: 3000 });
            return;
        }

        try {
            if (productDetail.detail_id) {
                await productDetailService.updateProductDetail(productDetail.detail_id, productDetail);
                toast.current.show({ 
                    severity: 'success', 
                    summary: 'Thành công', 
                    detail: 'Đã cập nhật chi tiết sản phẩm', 
                    life: 3000 
                });
            } else {
                await productDetailService.addProductDetail(productDetail);
                toast.current.show({ 
                    severity: 'success', 
                    summary: 'Thành công', 
                    detail: 'Đã thêm chi tiết mới', 
                    life: 3000 
                });
            }
            await viewProductDetails(product);
            hideProductDetailDialog();
        } catch (error) {
            console.error('Error saving product detail:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể lưu chi tiết sản phẩm', life: 3000 });
        }
    };

    const onDetailInputChange = (e, name) => {
        const val = (e.target && e.target.value) || e.value || e;
        let _detail = { ...productDetail };
        
        if (name === 'stock_quantity') {
            _detail[name] = parseInt(val) || 0;
        } else {
            _detail[name] = val;
        }
        
        setProductDetail(_detail);
    };

    // Hàm hiển thị dialog chi tiết sản phẩm
    const productDetailsDialogContent = () => {
        return (
            <div className="product-details-dialog">
                <h3>{product.product_name}</h3>
                <p><strong>Mã sản phẩm:</strong> {product.product_id}</p>
                <p><strong>Danh mục:</strong> {getCategoryName(product.category_id)}</p>
                <p><strong>Giá:</strong> {formatCurrency(product.price)}</p>
                <p><strong>Mô tả:</strong> {product.description}</p>
                
                <div className="flex justify-content-between align-items-center mt-4 mb-3">
                    <h4 className="m-0"></h4>
                    <Button 
                        label="Thêm chi tiết" 
                        icon="pi pi-plus" 
                        severity="success" 
                        onClick={() => {
                            setProductDetail({
                                product_id: product.product_id,
                                color: '',
                                size: '',
                                stock_quantity: 0,
                                image_url: ''
                            });
                            setSubmitted(false);
                            setProductDetailDialog(true);
                        }}
                    />
                </div>

                {productDetails.length > 0 ? (
                    <DataTable value={productDetails} className="mt-3">
                        <Column field="detail_id" header="Mã chi tiết" style={{ minWidth: '8rem' }}></Column>
                        <Column field="color" header="Màu sắc" style={{ minWidth: '12rem' }}></Column>
                        <Column field="size" header="Kích thước" style={{ minWidth: '12rem' }}></Column>
                        <Column field="stock_quantity" header="Số lượng tồn" style={{ minWidth: '12rem' }}></Column>
                        <Column field="image_url" header="Hình ảnh" style={{ minWidth: '12rem' }} body={(rowData) => (
                            rowData.image_url ? (
                                <img 
                                    src={rowData.image_url} 
                                    alt={`${rowData.color} - ${rowData.size}`} 
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                />
                            ) : (
                                <span>Không có ảnh</span>
                            )
                        )}></Column>
                        <Column body={(rowData) => (
                            <div className="flex gap-2">
                                <Button 
                                    icon="pi pi-pencil" 
                                    rounded 
                                    outlined 
                                    onClick={() => {
                                        setProductDetail(rowData);
                                        setProductDetailDialog(true);
                                    }} 
                                />
                                <Button 
                                    icon="pi pi-trash" 
                                    rounded 
                                    outlined 
                                    severity="danger" 
                                    onClick={() => {
                                        setProductDetail(rowData);
                                        setDeleteProductDetailDialog(true);
                                    }} 
                                />
                            </div>
                        )} header="Thao tác" style={{ minWidth: '10rem' }}></Column>
                    </DataTable>
                ) : (
                    <div className="text-center p-4 border-1 surface-border border-round mt-3 bg-gray-50">
                        <span>Chưa có chi tiết sản phẩm nào</span>
                    </div>
                )}
            </div>
        );
    };

    const hideProductDetailDialog = () => {
        setProductDetailDialog(false);
        setSubmitted(false);
    };

    const deleteProductDetail = async () => {
        try {
            if (!productDetail || !productDetail.detail_id) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Không tìm thấy chi tiết sản phẩm để xóa',
                    life: 3000
                });
                return;
            }

            await productDetailService.deleteProductDetail(productDetail.detail_id);
            
            // Cập nhật lại danh sách chi tiết sản phẩm sau khi xóa
            const updatedDetails = productDetails.filter(detail => detail.detail_id !== productDetail.detail_id);
            setProductDetails(updatedDetails);
            
            setDeleteProductDetailDialog(false);
            setProductDetail(null);
            
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

    return ( 
   <div>
       <Toast ref={toast} />
       <div className='card'>
       <DataTable 
    ref={dt} 
    value={products} 
    selection={selectedProducts} 
    onSelectionChange={(e) => setSelectedProducts(e.value)}
    dataKey="product_id"
    paginator 
    rows={10} 
    rowsPerPageOptions={[2, 5, 10, 25]}
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} sản phẩm" 
    globalFilter={globalFilter} 
    header={header}
>
    <Column selectionMode="multiple" exportable={false}></Column>
    <Column field="product_id" header="ID" sortable style={{ minWidth: '12rem' }}></Column>
    <Column field="product_name" header="Tên sản phẩm" sortable style={{ minWidth: '12rem' }}></Column>
    <Column field="description" header="Mô tả" style={{ minWidth: '12rem' }}></Column>
    <Column 
        field="category_id" 
        header="Danh mục" 
        sortable 
        style={{ minWidth: '12rem' }}
        body={(rowData) => getCategoryName(rowData.category_id)}
    ></Column>
    <Column 
        field="price" 
        header="Giá" 
        sortable 
        style={{ minWidth: '12rem' }}
        body={(rowData) => formatCurrency(rowData.price)}
    ></Column>
    <Column field="image_url" header="Hình ảnh" body={(rowData) => <img src={rowData.image_url} alt="Sản phẩm" style={{ width: '50px', height: '50px' }} />} exportable={false} style={{ minWidth: '12rem' }}></Column>
    <Column 
        field="created_at" 
        header="Ngày thêm" 
        sortable 
        style={{ minWidth: '12rem' }}
        body={(rowData) => formatDateTime(rowData.created_at)}
    ></Column>
    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
</DataTable> 

       </div>
       <Dialog 
    visible={productDialog} 
    style={{ width: '32rem' }} 
    breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
    header='Thông tin sản phẩm' 
    modal 
    className='p-fluid' 
    footer={productDialogFooter} 
    onHide={hideDialog}
>

    {/* Chỉ hiển thị ID nếu đang chỉnh sửa */}
    {product.product_id && (
        <div className='field'>
            <label htmlFor='product_id' className='font-bold'>ID</label>
            <InputText id='product_id' value={product.product_id} disabled />
        </div>
    )}

    <div className='field'>
        <label htmlFor='product_name' className='font-bold'>Tên sản phẩm</label>
        <InputText id='product_name' value={product.product_name} 
            onChange={(e) => onInputChange(e, 'product_name')} required 
            className={classNames({ 'p-invalid': submitted && !product.product_name })} />
        {submitted && !product.product_name && <small className='p-error'>Vui lòng nhập tên sản phẩm.</small>}
    </div>

    <div className='field'>
        <label htmlFor='description' className='font-bold'>Mô tả sản phẩm</label>
        <InputTextarea id='description' value={product.description} 
            onChange={(e) => onInputChange(e, 'description')}
            rows={3} cols={30}
            className={classNames({ 'p-invalid': submitted && !product.description })} />
        {submitted && !product.description && <small className='p-error'>Vui lòng nhập mô tả sản phẩm.</small>}
    </div>

    <div className='field'>
        <label htmlFor='category_id' className='font-bold'>Danh mục</label>
        <Dropdown
            id='category_id'
            value={product.category_id}
            options={categories}
            onChange={(e) => onInputChange(e, 'category_id')}
            optionLabel="category_name"
            optionValue="category_id"
            placeholder="Chọn danh mục"
            className={classNames({ 'p-invalid': submitted && !product.category_id })}
        />
        {submitted && !product.category_id && <small className='p-error'>Vui lòng chọn danh mục.</small>}
    </div>

    <div className='field'>
        <label htmlFor='price' className='font-bold'>Giá</label>
        <InputText 
            id='price' 
            value={formatCurrency(product.price)} 
            onChange={(e) => {
                // Chỉ cho phép nhập số
                const value = e.target.value.replace(/[^0-9]/g, '');
                onInputChange({ target: { value } }, 'price');
            }} 
            required 
            className={classNames({ 'p-invalid': submitted && !product.price })} 
        />
        {submitted && !product.price && <small className='p-error'>Vui lòng nhập giá.</small>}
    </div>

    <div className='field'>
        <label htmlFor='image_url' className='font-bold'>URL hình ảnh</label>
        <InputText id='image_url' value={product.image_url} 
            onChange={(e) => onInputChange(e, 'image_url')} required 
            className={classNames({ 'p-invalid': submitted && !product.image_url })} />
        {submitted && !product.image_url && <small className='p-error'>Vui lòng nhập đường dẫn hình ảnh.</small>}
    </div>

    <div className='field'>
        <label htmlFor='created_at' className='font-bold'>Ngày thêm</label>
        <InputText 
            id='created_at' 
            value={product.created_at ? formatDateTime(product.created_at) : ''} 
            disabled
            className={classNames({ 'p-invalid': submitted && !product.created_at })} 
        />
        {submitted && !product.created_at && <small className='p-error'>Vui lòng nhập ngày thêm.</small>}
    </div>

</Dialog>
<Dialog 
    visible={deleteProductDialog} 
    style={{ width: '32rem' }} 
    breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
    header='Xác nhận' 
    modal 
    footer={deleteProductDialogFooter} 
    onHide={hideDeleteProductDialog}
>
    <div className='confirmation-content'>
        <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
        {product && (
            <span>
                Bạn có chắc muốn xóa sản phẩm: <b>{product.product_id}</b>?
            </span>
        )}
    </div>
</Dialog>
<Dialog 
    visible={deleteProductsDialog} 
    style={{ width: '32rem' }} 
    breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
    header='Xác nhận' 
    modal 
    footer={deleteProductsDialogFooter} 
    onHide={hideDeleteProductsDialog}
>
    <div className='confirmation-content'>
        <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
        {product && <span>Bạn có muốn xóa các sản phẩm đã chọn không?</span>}
    </div>
</Dialog>

{/* Dialog hiển thị chi tiết sản phẩm */}
<Dialog 
    visible={productDetailsDialog} 
    style={{ width: '70vw' }} 
    breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
    header='Chi tiết sản phẩm' 
    modal 
    onHide={hideProductDetailsDialog}
>
    {productDetailsDialogContent()}
</Dialog>

<Dialog 
    visible={editDetailDialog} 
    style={{ width: '450px' }} 
    header="Chỉnh sửa chi tiết sản phẩm" 
    modal 
    className="p-fluid" 
    footer={
        <React.Fragment>
            <Button label="Hủy" icon="pi pi-times" outlined onClick={hideEditDetailDialog} />
            <Button label="Lưu" icon="pi pi-check" onClick={saveProductDetail} />
        </React.Fragment>
    } 
    onHide={hideEditDetailDialog}
>
    {editingDetail && (
        <>
            <div className="field">
                <label htmlFor="color" className="font-bold">Màu sắc</label>
                <InputText id="color" value={editingDetail.color} onChange={(e) => onDetailInputChange(e, 'color')} required />
            </div>
            <div className="field">
                <label htmlFor="size" className="font-bold">Kích thước</label>
                <Dropdown
                    id="size"
                    value={editingDetail.size}
                    options={sizeOptions}
                    onChange={(e) => onDetailInputChange(e, 'size')}
                    placeholder="Chọn kích thước"
                    className={classNames({ 'p-invalid': submitted && !editingDetail.size })}
                />
                {submitted && !editingDetail.size && <small className="p-error">Vui lòng chọn kích thước</small>}
            </div>
            <div className="field">
                <label htmlFor="stock_quantity" className="font-bold">Số lượng tồn</label>
                <InputText 
                    type="number"
                    value={editingDetail.stock_quantity} 
                    onChange={(e) => onDetailInputChange(e, 'stock_quantity')} 
                    className="w-full"
                    min="0"
                />
            </div>
            <div className="field">
                <label htmlFor="image_url" className="font-bold">URL hình ảnh</label>
                <InputText id="image_url" value={editingDetail.image_url} onChange={(e) => onDetailInputChange(e, 'image_url')} />
            </div>
        </>
    )}
</Dialog>

<Dialog 
    visible={productDetailDialog} 
    style={{ width: '450px' }} 
    header={productDetail?.detail_id ? 'Chỉnh sửa chi tiết' : 'Thêm chi tiết mới'} 
    modal 
    className="p-fluid" 
    footer={
        <React.Fragment>
            <Button label="Hủy" icon="pi pi-times" outlined onClick={hideProductDetailDialog} />
            <Button label="Lưu" icon="pi pi-check" onClick={saveProductDetail} />
        </React.Fragment>
    } 
    onHide={hideProductDetailDialog}
>
    <div className="field">
        <label htmlFor="color" className="font-bold">Màu sắc</label>
        <Dropdown
            id="color"
            value={productDetail?.color || ''}
            options={colorOptions}
            onChange={(e) => onDetailInputChange(e, 'color')}
            placeholder="Chọn màu sắc"
            className={classNames({ 'p-invalid': submitted && !productDetail?.color })}
        />
        {submitted && !productDetail?.color && <small className="p-error">Vui lòng chọn màu sắc</small>}
    </div>
    <div className="field">
        <label htmlFor="size" className="font-bold">Kích thước</label>
        <Dropdown
            id="size"
            value={productDetail?.size || ''}
            options={sizeOptions}
            onChange={(e) => onDetailInputChange(e, 'size')}
            placeholder="Chọn kích thước"
            className={classNames({ 'p-invalid': submitted && !productDetail?.size })}
        />
        {submitted && !productDetail?.size && <small className="p-error">Vui lòng chọn kích thước</small>}
    </div>
    <div className="field">
        <label htmlFor="stock_quantity" className="font-bold">Số lượng tồn</label>
        <InputText 
            id="stock_quantity" 
            type="number" 
            value={productDetail?.stock_quantity || 0} 
            onChange={(e) => onDetailInputChange(e, 'stock_quantity')} 
            required 
            min="0"
            className={classNames({ 'p-invalid': submitted && (!productDetail?.stock_quantity || productDetail.stock_quantity <= 0) })} 
        />
        {submitted && (!productDetail?.stock_quantity || productDetail.stock_quantity <= 0) && 
            <small className="p-error">Vui lòng nhập số lượng tồn lớn hơn 0</small>}
    </div>
    <div className="field">
        <label htmlFor="image_url" className="font-bold">URL hình ảnh</label>
        <InputText 
            id="image_url" 
            value={productDetail?.image_url || ''} 
            onChange={(e) => onDetailInputChange(e, 'image_url')} 
        />
    </div>
</Dialog>

{/* Dialog xác nhận xóa chi tiết sản phẩm */}
<Dialog
    visible={deleteProductDetailDialog}
    style={{ width: '450px' }}
    header="Xác nhận"
    modal
    footer={
        <React.Fragment>
            <Button label="Không" icon="pi pi-times" outlined onClick={() => setDeleteProductDetailDialog(false)} />
            <Button label="Có" icon="pi pi-check" severity="danger" onClick={deleteProductDetail} />
        </React.Fragment>
    }
    onHide={() => setDeleteProductDetailDialog(false)}
>
    <div className="confirmation-content">
        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
        {productDetail && (
            <span>
                Bạn có chắc muốn ẩn chi tiết sản phẩm này không?
            </span>
        )}
    </div>
</Dialog>

   </div>
   );
   };
   export default Index;
