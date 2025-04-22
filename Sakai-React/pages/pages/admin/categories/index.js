import categoryService from './categoryService';
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { config } from '@fullcalendar/core/internal';


const Index = () => {
    const [category, setCategory] = useState([]); 
    const [categories, setCategories] = useState([]);
    
    const [globalFilter, setGlobalFilter] = useState([]);
    const [id, setId] = useState(null);
    
// showData: Lấy danh sách tất cả danh mục từ API và cập nhật vào state categories
const showData = async () => {
    try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

useEffect(() => {
    showData();
}, []);

// fetchData: Gọi hàm showData để tải dữ liệu khi component được render.
const fetchData = async () => {
    showData();
};

let emptyCategory = {
    category_id: null, // Hoặc 0 nếu cần kiểu số
    category_name: "",
    is_deleted: false, // Mặc định là false
};

const [categoryDialog, setCategoryDialog] = useState(false);
const [submitted, setSubmitted] = useState(false);

// openNew: Mở hộp thoại thêm mới danh mục với dữ liệu mặc định.
const openNew = () => {
    setCategory(emptyCategory);
    setSubmitted(false);
    setCategoryDialog(true);
};

// confirmDeleteSelected: Hiển thị hộp thoại xác nhận xóa nhiều danh mục được chọn.
const confirmDeleteSelected = () => {
    setDeleteCategoriesDialog(true);
};

const dt = useRef(null);

// exportCSV: Xuất danh sách danh mục ra tệp CSV.
const exportCSV = () => {
    dt.current.exportCSV();
};

const [selectedCategories, setSelectedCategories] = useState(null);

// hideDialog: Đóng hộp thoại chỉnh sửa/thêm mới danh mục.
const hideDialog = () => {
    setSubmitted(false);
    setCategoryDialog(false);
};

// deleteSelectedCategories: Xóa nhiều danh mục đã chọn và cập nhật danh sách.
const deleteSelectedCategories = () => {
    let _categories = categories.filter((val) => !selectedCategories.includes(val));
    setCategories(_categories);
       
    selectedCategories.map((item) => {
        categoryService.deleteCategory(item.category_id);
    });

    setDeleteCategoriesDialog(false);
    setSelectedCategories(null);
    showData();

    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3500 });
};

// saveCategory: Lưu thông tin danh mục (cập nhật nếu có category_id, thêm mới nếu không).
const saveCategory = async () => {
    setSubmitted(true);

    let _categories = [...categories];
    let _category = { ...category };

    if (_category.category_id) {
        // Trường hợp cập nhật (category_id đã có)
        const index = findIndexById(_category.category_id);
        if (index !== -1) {
            _categories[index] = _category;
            await categoryService.updateCategory(_category);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
        }
    } else {
        // Trường hợp thêm mới (category_id = null)
        const response = await categoryService.addCategory(_category);
        if (response?.category_id) {
            _category.category_id = response.category_id; // Lấy ID mới từ API
            _categories.push(_category);
        }
        showData();
        toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm mới thành công', life: 3000 });
    }

    setCategories(_categories);
    setCategoryDialog(false);
    setCategory(emptyCategory);
};

const categoryDialogFooter = (
    <React.Fragment>
        <Button label='Cancel' icon='pi pi-times' outlined onClick={hideDialog} />
        <Button label='Save' icon='pi pi-check' onClick={saveCategory} />
    </React.Fragment>
);

// findIndexById: Tìm vị trí của danh mục trong danh sách theo category_id.
const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < categories.length; i++) {
        if (categories[i].category_id === id) {
            index = i;
            break;
        }
    }

    return index;
};

// onInputChange: Cập nhật dữ liệu danh mục khi nhập vào form.
const onInputChange = (e, itemname) => {
    const val = (e.target && e.target.value) || '';
    let _category = { ...category };

    _category[`${itemname}`] = val;

    setCategory(_category);
};

// editCategory: Mở hộp thoại chỉnh sửa và tải dữ liệu danh mục vào form.
const editCategory = (category) => {
    setCategory({ ...category });
    setCategoryDialog(true);
};

// confirmDeleteCategory: Mở hộp thoại xác nhận xóa một danh mục cụ thể.
const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
const [deleteCategoriesDialog, setDeleteCategoriesDialog] = useState(false);

const confirmDeleteCategory = (category) => {
    setCategory(category);
    setDeleteCategoryDialog(true);
};

// actionBodyTemplate: Hiển thị các nút thao tác (sửa, xóa) trong danh sách.
const actionBodyTemplate = (rowData) => {
    return (
        <React.Fragment>
            <Button icon='pi pi-pencil' rounded outlined className='mr-2' onClick={() => editCategory(rowData)} />
            <Button icon='pi pi-trash' rounded outlined severity='danger' onClick={() => confirmDeleteCategory(rowData)} />
        </React.Fragment>
    );
};

// hideDeleteCategoryDialog: Đóng hộp thoại xác nhận xóa danh mục.
const hideDeleteCategoryDialog = () => {
    setDeleteCategoryDialog(false);
};

// deleteCategory: Xóa một danh mục khỏi hệ thống và cập nhật danh sách.
const deleteCategory = async () => {
    try {
        await categoryService.deleteCategory(category.category_id); // Đảm bảo truyền đúng category_id
        await showData(); // Chỉ cập nhật danh sách sau khi API thực sự xóa
        setDeleteCategoryDialog(false);

        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });

    } catch (error) {
        console.error("Error deleting category:", error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete record', life: 3000 });
    }
};

const deleteCategoryDialogFooter = (
    <React.Fragment>
        <Button label='No' icon='pi pi-times' outlined onClick={hideDeleteCategoryDialog} />
        <Button label='Yes' icon='pi pi-check' severity='danger' onClick={deleteCategory} />
    </React.Fragment>
);

// hideDeleteCategoriesDialog: Đóng hộp thoại xác nhận xóa nhiều danh mục.
const hideDeleteCategoriesDialog = () => {
    setDeleteCategoriesDialog(false);
};

const deleteCategoriesDialogFooter = (
    <React.Fragment>
        <Button label='No' icon='pi pi-times' outlined onClick={hideDeleteCategoriesDialog} />
        <Button label='Yes' icon='pi pi-check' severity='danger' onClick={deleteSelectedCategories} />
    </React.Fragment>
);

const toast = useRef(null);
const header = (
    <div className='flex flex-wrap gap-2 align-items-center justify-content-between'>
        <h4 className='m-0'>Quản lý danh sách danh mục</h4>
        <div style={{ float: 'right' }}>
            <Button label='' icon='pi pi-plus' severity='success' tooltip='New record' onClick={openNew} /> &nbsp;&nbsp;
            <Button 
                label='' 
                icon='pi pi-trash' 
                tooltip='Delete selected' 
                severity='danger'  
                onClick={confirmDeleteSelected} 
                disabled={!selectedCategories || !selectedCategories.length}  
            />&nbsp;&nbsp;
            <Button label='' icon='pi pi-upload' tooltip='Export excel' className='p-button-help' onClick={exportCSV} /> &nbsp;

            <span className='p-input-icon-left'>
                <i className='pi pi-search' />
                <InputText type='search' onInput={(e) => setGlobalFilter(e.target.value)} placeholder='Search...' />
            </span>
        </div>
    </div>
);


    return ( 
   <div>
       <Toast ref={toast} />
       <div className='card'>
       <DataTable 
    ref={dt} 
    value={categories} 
    selection={selectedCategories} 
    onSelectionChange={(e) => setSelectedCategories(e.value)}
    dataKey="category_id"
    paginator 
    rows={10} 
    rowsPerPageOptions={[2, 5, 10, 25]}
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} Bản ghi" 
    globalFilter={globalFilter} 
    header={header}
>
    <Column selectionMode="multiple" exportable={false}></Column>
    <Column field="category_id" header="ID" sortable style={{ minWidth: '12rem' }}></Column>
    <Column field="category_name" header="Tên Danh Mục" sortable style={{ minWidth: '12rem' }}></Column>
    {/* <Column field="is_deleted" header="Trạng Thái" sortable style={{ minWidth: '12rem' }}></Column> */}
    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
</DataTable>

       </div>
   
       <Dialog visible={categoryDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
    header='Mục tin' modal className='p-fluid' footer={categoryDialogFooter} onHide={hideDialog}>

    {/* Chỉ hiển thị ID nếu đang sửa */}
    {category.category_id && (
        <div className='field'>
            <label htmlFor='category_id' className='font-bold'>ID</label>
            <InputText id='category_id' value={category.category_id} disabled />
        </div>
    )}

    <div className='field'>
        <label htmlFor='category_name' className='font-bold'>Tên danh mục</label>
        <InputText id='category_name' value={category.category_name} 
            onChange={(e) => onInputChange(e, 'category_name')} required 
            className={classNames({ 'p-invalid': submitted && !category.category_name })} />
        {submitted && !category.category_name && <small className='p-error'>Vui lòng nhập tên danh mục.</small>}
    </div>

    {/* <div className='field'>
        <label htmlFor='is_deleted' className='font-bold'>Trạng thái</label>
        <InputText id='is_deleted' value={category.is_deleted} 
            onChange={(e) => onInputChange(e, 'is_deleted')} required 
            className={classNames({ 'p-invalid': submitted && category.is_deleted === null })} />
        {submitted && category.is_deleted === null && <small className='p-error'>Vui lòng nhập trạng thái.</small>}
    </div> */}

</Dialog>


<Dialog visible={deleteCategoryDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
    header='Confirm' modal footer={deleteCategoryDialogFooter} onHide={hideDeleteCategoryDialog}>
    
    <div className='confirmation-content'>
        <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
        {category && (
            <span>
                Bạn có chắc muốn xóa danh mục: <b>{category.category_id}</b>?
            </span>
        )}
    </div>
</Dialog>

<Dialog visible={deleteCategoriesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
    header='Confirm' modal footer={deleteCategoriesDialogFooter} onHide={hideDeleteCategoriesDialog}>
    
    <div className='confirmation-content'>
        <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
        {category && <span>Bạn có muốn xóa các danh mục đã chọn không?</span>}
    </div>
</Dialog>


   </div>
   );
   };
   export default Index;
   