import paymentService from './paymentService';
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { config } from '@fullcalendar/core/internal';
import { Dropdown } from 'primereact/dropdown';



const Index = () => {
    const [payment, setPayment] = useState([]); 
    const [payments, setPayments] = useState([]);
    
    const [globalFilter, setGlobalFilter] = useState([]);
    const [paymentId, setPaymentId] = useState(null);

    
// showData: Lấy danh sách tất cả các thanh toán từ API và cập nhật vào state payments
const showData = async () => {
    try {
        const data = await paymentService.getAllPayments();
        setPayments(data);
    } catch (error) {
        console.error('Error fetching payment data:', error);
    }
};

useEffect(() => {
    fetchData();
}, []);


// fetchData: Gọi hàm showData để tải dữ liệu khi component được render.
const fetchData = async () => {
    showData();
};

let emptyPayment = {
    payment_id: null,
    order_id: null,
    payment_method: "COD",
    payment_status: "pending",
    created_at: new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
};

const [paymentDialog, setPaymentDialog] = useState(false);
const [submitted, setSubmitted] = useState(false);

// openNew: Mở hộp thoại thêm mới thanh toán với dữ liệu mặc định.
const openNew = () => {
    setPayment(emptyPayment);
    setSubmitted(false);
    setPaymentDialog(true);
};

// confirmDeleteSelected: Hiển thị hộp thoại xác nhận xóa nhiều thanh toán được chọn.
const confirmDeleteSelected = () => {
    setDeletePaymentsDialog(true);
};

const dt = useRef(null);

// exportCSV: Xuất danh sách thanh toán ra tệp CSV.
const exportCSV = () => {
    dt.current.exportCSV();
};

const [selectedPayments, setSelectedPayments] = useState(null);

// hideDialog: Đóng hộp thoại chỉnh sửa/thêm mới thanh toán.
const hideDialog = () => {
    setSubmitted(false);
    setPaymentDialog(false);
};

// deleteSelectedPayments: Xóa nhiều thanh toán đã chọn và cập nhật danh sách.
const deleteSelectedPayments = () => {
    let _payments = payments.filter((val) => !selectedPayments.includes(val));
    setPayments(_payments);

    selectedPayments.map((item) => {
        paymentService.deletePayment(item.payment_id);
    });

    setDeletePaymentsDialog(false);
    setSelectedPayments(null);
    showData();

    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thanh toán đã bị xóa', life: 3500 });
};


// savePayment: Lưu thông tin thanh toán (cập nhật nếu có payment_id, thêm mới nếu không).
const savePayment = async () => {
    setSubmitted(true);

    let _payments = [...payments];
    let _payment = { ...payment };

    // Chỉ set ngày thanh toán khi trạng thái là completed
    if (_payment.payment_status === 'completed') {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        _payment.created_at = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } else {
        // Set ngày thanh toán là null cho các trạng thái khác
        _payment.created_at = null;
    }

    if (_payment.payment_id) {
        // Trường hợp cập nhật (payment_id đã có)
        const index = findIndexById(_payment.payment_id);
        if (index !== -1) {
            _payments[index] = _payment;
            await paymentService.updatePayment(_payment);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thanh toán thành công', life: 3000 });
        }
    } else {
        // Trường hợp thêm mới (payment_id = null)
        const response = await paymentService.addPayment(_payment);
        if (response?.payment_id) {
            _payment.payment_id = response.payment_id;
            _payments.push(_payment);
        }
        showData();
        toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm thanh toán thành công', life: 3000 });
    }

    setPayments(_payments);
    setPaymentDialog(false);
    setPayment(emptyPayment);
};

const paymentDialogFooter = (
    <React.Fragment>
        <Button label='Cancel' icon='pi pi-times' outlined onClick={hideDialog} />
        <Button label='Save' icon='pi pi-check' onClick={savePayment} />
    </React.Fragment>
);



// findIndexById: Tìm vị trí của thanh toán trong danh sách theo payment_id.
const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < payments.length; i++) {
        if (payments[i].payment_id === id) {
            index = i;
            break;
        }
    }

    return index;
};

// onInputChange: Cập nhật dữ liệu thanh toán khi nhập vào form.
const onInputChange = (e, fieldName) => {
    const val = (e.target && e.target.value) || '';
    let _payment = { ...payment };

    _payment[`${fieldName}`] = val;

    setPayment(_payment);
};

// editPayment: Mở hộp thoại chỉnh sửa và tải dữ liệu thanh toán vào form.
const editPayment = (payment) => {
    setPayment({ ...payment });
    setPaymentDialog(true);
};

// confirmDeletePayment: Mở hộp thoại xác nhận xóa một thanh toán cụ thể.
const [deletePaymentDialog, setDeletePaymentDialog] = useState(false);
const [deletePaymentsDialog, setDeletePaymentsDialog] = useState(false);
const confirmDeletePayment = (payment) => {
    setPayment(payment);
    setDeletePaymentDialog(true);
};

// actionBodyTemplate: Hiển thị các nút thao tác (sửa, xóa) trong danh sách.
const actionBodyTemplate = (rowData) => {
    return (
        <React.Fragment>
            <Button icon='pi pi-pencil' rounded outlined className='mr-2' onClick={() => editPayment(rowData)} />
            <Button icon='pi pi-trash' rounded outlined severity='danger' onClick={() => confirmDeletePayment(rowData)} />
        </React.Fragment>
    );
};

// hideDeletePaymentDialog: Đóng hộp thoại xác nhận xóa thanh toán.
const hideDeletePaymentDialog = () => {
    setDeletePaymentDialog(false);
};

// deletePayment: Xóa một thanh toán khỏi hệ thống và cập nhật danh sách.
const deletePayment = async () => {
    try {
        await paymentService.deletePayment(payment.payment_id); // Đảm bảo truyền đúng payment_id
        await showData(); // Chỉ cập nhật danh sách sau khi API thực sự xóa
        setDeletePaymentDialog(false);

        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });

    } catch (error) {
        console.error("Error deleting payment:", error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete record', life: 3000 });
    }
};

const deletePaymentDialogFooter = (
    <React.Fragment>
        <Button label='No' icon='pi pi-times' outlined onClick={hideDeletePaymentDialog} />
        <Button label='Yes' icon='pi pi-check' severity='danger' onClick={deletePayment} />
    </React.Fragment>
);



// hideDeletePaymentsDialog: Đóng hộp thoại xác nhận xóa nhiều thanh toán.
const hideDeletePaymentsDialog = () => {
    setDeletePaymentsDialog(false);
};

const deletePaymentsDialogFooter = (
<React.Fragment>
<Button label='No' icon='pi pi-times' outlined onClick={hideDeletePaymentsDialog} />
<Button label='Yes' icon='pi pi-check' severity='danger' onClick={deleteSelectedPayments} />
</React.Fragment>
);
    
const toast = useRef(null);
const header = (
<div className='flex flex-wrap gap-2 align-items-center justify-content-between'>
<h4 className='m-0'>Quản lý danh sách thanh toán</h4>
<div style={{float:'right'}}>
<Button label='' icon='pi pi-plus' severity='success' tooltip='Thêm mới' onClick={openNew} /> &nbsp;&nbsp;
<Button label='' icon='pi pi-trash' tooltip='Xóa đã chọn' severity='danger' onClick={confirmDeleteSelected} disabled={!selectedPayments || !selectedPayments.length}  />&nbsp;&nbsp;
<Button label='' icon='pi pi-upload' tooltip='Xuất Excel' className='p-button-help' onClick={exportCSV} /> &nbsp;

<span className='p-input-icon-left'>
<i className='pi pi-search' />
<InputText type='search' onInput={(e) => setGlobalFilter(e.target.value)} placeholder='Tìm kiếm...' />
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
    value={payments} 
    selection={selectedPayments} 
    onSelectionChange={(e) => setSelectedPayments(e.value)}
    dataKey="payment_id"
    paginator 
    rows={10} 
    rowsPerPageOptions={[2, 5, 10, 25]}
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} Bản ghi" 
    globalFilter={globalFilter} 
    header={header}
>
    <Column selectionMode="multiple" exportable={false}></Column>
    <Column field="payment_id" header="ID" sortable style={{ minWidth: '12rem' }}></Column>
    <Column field="order_id" header="Mã Đơn Hàng" sortable style={{ minWidth: '12rem' }}></Column>
    <Column field="payment_method" header="Phương Thức Thanh Toán" sortable style={{ minWidth: '12rem' }}></Column>
    <Column field="payment_status" header="Trạng Thái Thanh Toán" sortable style={{ minWidth: '12rem' }}></Column>
    <Column 
        field="created_at" 
        header="Ngày Thanh Toán" 
        sortable 
        style={{ minWidth: '12rem' }}
        body={(rowData) => {
            if (!rowData.created_at) return 'Chưa thanh toán';
            const date = new Date(rowData.created_at);
            return date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }}
    ></Column>
    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
</DataTable>

       </div>
   
       <Dialog visible={paymentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
    header='Thông tin thanh toán' modal className='p-fluid' footer={paymentDialogFooter} onHide={hideDialog}>

    {/* Chỉ hiển thị ID nếu đang sửa */}
    {payment.payment_id && (
        <div className='field'>
            <label htmlFor='payment_id' className='font-bold'>ID</label>
            <InputText id='payment_id' value={payment.payment_id} disabled />
        </div>
    )}

    <div className='field'>
        <label htmlFor='order_id' className='font-bold'>Mã đơn hàng</label>
        <InputText id='order_id' value={payment.order_id} 
            onChange={(e) => onInputChange(e, 'order_id')} required 
            className={classNames({ 'p-invalid': submitted && !payment.order_id })} />
        {submitted && !payment.order_id && <small className='p-error'>Vui lòng nhập mã đơn hàng.</small>}
    </div>

    <div className='field'>
        <label htmlFor='payment_method' className='font-bold'>Phương thức thanh toán</label>
        <Dropdown 
            id='payment_method' 
            value={payment.payment_method} 
            options={[
                { label: 'Thanh toán khi nhận hàng', value: 'COD' }
            ]}
            onChange={(e) => onInputChange(e, 'payment_method')} 
            required 
            className={classNames({ 'p-invalid': submitted && !payment.payment_method })} 
        />
        {submitted && !payment.payment_method && <small className='p-error'>Vui lòng chọn phương thức thanh toán.</small>}
    </div>

    <div className='field'>
        <label htmlFor='payment_status' className='font-bold'>Trạng thái thanh toán</label>
        <Dropdown 
            id='payment_status' 
            value={payment.payment_status} 
            options={[
                { label: 'Chờ xử lý', value: 'pending' },
                { label: 'Hoàn thành', value: 'completed' },
                { label: 'Thất bại', value: 'failed' }
            ]}
            onChange={(e) => {
                let _payment = { ...payment };
                _payment.payment_status = e.value;
                // Nếu trạng thái là completed, tự động set ngày thanh toán là ngày hiện tại
                if (e.value === 'completed') {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    const seconds = String(now.getSeconds()).padStart(2, '0');
                    
                    _payment.created_at = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                } else {
                    _payment.created_at = null;
                }
                setPayment(_payment);
            }} 
            required 
            className={classNames({ 'p-invalid': submitted && !payment.payment_status })} 
        />
        {submitted && !payment.payment_status && <small className='p-error'>Vui lòng chọn trạng thái thanh toán.</small>}
    </div>

    <div className='field'>
        <label htmlFor='created_at' className='font-bold'>Ngày thanh toán</label>
        <InputText 
            id='created_at' 
            value={payment.created_at ? new Date(payment.created_at).toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }) : 'Chưa thanh toán'} 
            disabled
            className={classNames({ 'p-invalid': submitted && !payment.created_at })} 
        />
        {submitted && !payment.created_at && <small className='p-error'>Vui lòng nhập ngày thanh toán.</small>}
    </div>

</Dialog>

<Dialog visible={deletePaymentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
    header='Xác nhận' modal footer={deletePaymentDialogFooter} onHide={hideDeletePaymentDialog}>
    
    <div className='confirmation-content'>
        <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
        {payment && (
            <span>
                Bạn có chắc muốn xóa thông tin thanh toán: <b>{payment.payment_id}</b>?
            </span>
        )}
    </div>
</Dialog>

<Dialog visible={deletePaymentsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
    header='Xác nhận' modal footer={deletePaymentsDialogFooter} onHide={hideDeletePaymentsDialog}>

    <div className='confirmation-content'>
        <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
        {payment && <span>Bạn có muốn xóa các giao dịch đã chọn không?</span>}
    </div>

</Dialog>



   </div>
   );
   };
   export default Index;