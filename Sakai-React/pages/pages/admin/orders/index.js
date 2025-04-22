import orderService from './orderService';
import orderDetailService from './orderDetailService';
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { config } from '@fullcalendar/core/internal';
import OrderDetails from './OrderDetails';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import Invoice from './Invoice';

const Index = () => {
    const [order, setOrder] = useState([]); 
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    
    const [globalFilter, setGlobalFilter] = useState([]);
    const [orderId, setOrderId] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const [invoiceDialog, setInvoiceDialog] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const hideInvoiceDialog = () => {
        setInvoiceDialog(false);
        setSelectedOrderDetails([]);
    };

    const showInvoice = async (rowData) => {
        try {
            const details = await orderDetailService.getOrderDetailsByOrderId(rowData.order_id);
            setSelectedOrderDetails(details);
            setOrder(rowData);
            const user = users.find(u => u.user_id === rowData.user_id);
            setSelectedUser(user);
            setInvoiceDialog(true);
        } catch (error) {
            console.error('Error fetching order details:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể tải thông tin chi tiết đơn hàng',
                life: 3000
            });
        }
    };

    // Hàm lấy danh sách người dùng
    const fetchUsers = async () => {
        try {
            const data = await orderService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Không thể tải danh sách người dùng', life: 3000 });
        }
    };

    // Hàm helper để lấy tên người dùng từ user_id
    const getUserName = (userId) => {
        const user = users.find(u => u.user_id === userId);
        return user ? user.full_name : 'Không xác định';
    };

    // showData: Lấy danh sách tất cả đơn hàng từ API và cập nhật vào state orders
    const showData = async () => {
        try {
            const data = await orderService.getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        showData();
        fetchUsers();
    }, []);

    let emptyOrder = {
        order_id: null,
        user_id: null,
        total_price: 0.0,
        order_status: "pending",
        created_at: new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
    };

    const [orderDialog, setOrderDialog] = useState(false);
    const [orderDetailsDialog, setOrderDetailsDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // openNew: Mở hộp thoại thêm mới đơn hàng với dữ liệu mặc định.
    const openNew = () => {
        setOrder(emptyOrder);
        setSubmitted(false);
        setOrderDialog(true);
    };
    // confirmDeleteSelected: Hiển thị hộp thoại xác nhận xóa nhiều đơn hàng được chọn.
    const confirmDeleteSelected = () => {
        setDeleteOrdersDialog(true);
    };

    const dt = useRef(null);

    // exportCSV: Xuất danh sách đơn hàng ra tệp CSV.
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const [selectedOrders, setSelectedOrders] = useState(null);

    // hideDialog: Đóng hộp thoại chỉnh sửa/thêm mới đơn hàng.
    const hideDialog = () => {
        setSubmitted(false);
        setOrderDialog(false);
    };

    // deleteSelectedOrders: Xóa nhiều đơn hàng đã chọn và cập nhật danh sách.
    const deleteSelectedOrders = () => {
        let _orders = orders.filter((val) => !selectedOrders.includes(val));
        setOrders(_orders);
        
        selectedOrders.map((item) => {
            orderService.deleteOrder(item.order_id);
        });

        setDeleteOrdersDialog(false);
        setSelectedOrders(null);
        showData();

        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Order Deleted', life: 3500 });
    };
    // saveOrder: Lưu thông tin đơn hàng (cập nhật nếu có order_id, thêm mới nếu không).
    const saveOrder = async () => {
        setSubmitted(true);

        let _orders = [...orders];
        let _order = { ...order };

        // Đảm bảo ngày tháng được format đúng trước khi gửi lên server
        if (_order.created_at) {
            const date = new Date(_order.created_at);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            
            _order.created_at = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        if (_order.order_id) {
            // Trường hợp cập nhật (order_id đã có)
            const index = findIndexById(_order.order_id);
            if (index !== -1) {
                _orders[index] = _order;
                await orderService.updateOrder(_order);
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật đơn hàng thành công', life: 3000 });
            }
        } else {
            // Trường hợp thêm mới (order_id = null)
            const response = await orderService.addOrder(_order);
            if (response?.order_id) {
                _order.order_id = response.order_id;
                _orders.push(_order);
            }
            showData();
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm đơn hàng thành công', life: 3000 });
        }

        setOrders(_orders);
        setOrderDialog(false);
        setOrder(emptyOrder);
    };

    const orderDialogFooter = (
        <React.Fragment>
            <Button label='Cancel' icon='pi pi-times' outlined onClick={hideDialog} />
            <Button label='Save' icon='pi pi-check' onClick={saveOrder} />
        </React.Fragment>
    );

    // findIndexById: Tìm vị trí của đơn hàng trong danh sách theo order_id.
    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < orders.length; i++) {
            if (orders[i].order_id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    // onInputChange: Cập nhật dữ liệu đơn hàng khi nhập vào form.
    const onInputChange = (e, itemname) => {
        const val = (e.target && e.target.value) || '';
        let _order = { ...order };

        _order[`${itemname}`] = val;

        setOrder(_order);
    };

    // editOrder: Mở hộp thoại chỉnh sửa và tải dữ liệu đơn hàng vào form.
    const editOrder = (order) => {
        setOrder({ ...order });
        setOrderDialog(true);
    };

    // confirmDeleteOrder: Mở hộp thoại xác nhận xóa một đơn hàng cụ thể.
    const [deleteOrderDialog, setDeleteOrderDialog] = useState(false);
    const [deleteOrdersDialog, setDeleteOrdersDialog] = useState(false);

    const confirmDeleteOrder = (order) => {
        setOrder(order);
        setDeleteOrderDialog(true);
    };

    // actionBodyTemplate: Hiển thị các nút thao tác (sửa, xóa) trong danh sách đơn hàng.
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button 
                    icon='pi pi-eye' 
                    rounded 
                    outlined 
                    className='mr-2' 
                    onClick={() => handleOrderClick(rowData.order_id)}
                    tooltip="Xem chi tiết"
                />
                <Button 
                    icon='pi pi-pencil' 
                    rounded 
                    outlined 
                    className='mr-2' 
                    onClick={() => editOrder(rowData)} 
                />
                <Button 
                    icon='pi pi-trash' 
                    rounded 
                    outlined 
                    severity='danger' 
                    onClick={() => confirmDeleteOrder(rowData)} 
                />
                <Button 
                    icon='pi pi-file' 
                    rounded 
                    outlined 
                    severity='info' 
                    onClick={() => showInvoice(rowData)} 
                    tooltip="Hiển thị hóa đơn"
                />
            </React.Fragment>
        );
    };

    // hideDeleteOrderDialog: Đóng hộp thoại xác nhận xóa đơn hàng.
    const hideDeleteOrderDialog = () => {
        setDeleteOrderDialog(false);
    };

    // deleteOrder: Xóa một đơn hàng khỏi hệ thống và cập nhật danh sách.
    const deleteOrder = async () => {
        try {
            await orderService.deleteOrder(order.order_id); // Đảm bảo truyền đúng order_id
            await showData(); // Chỉ cập nhật danh sách sau khi API thực sự xóa
            setDeleteOrderDialog(false);

            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });

        } catch (error) {
            console.error("Error deleting order:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete record', life: 3000 });
        }
    };

    const deleteOrderDialogFooter = (
        <React.Fragment>
            <Button label='No' icon='pi pi-times' outlined onClick={hideDeleteOrderDialog} />
            <Button label='Yes' icon='pi pi-check' severity='danger' onClick={deleteOrder} />
        </React.Fragment>
    );
    // hideDeleteOrdersDialog: Đóng hộp thoại xác nhận xóa nhiều đơn hàng.
    const hideDeleteOrdersDialog = () => {
        setDeleteOrdersDialog(false);
    };

    const deleteOrdersDialogFooter = (
        <React.Fragment>
            <Button label='No' icon='pi pi-times' outlined onClick={hideDeleteOrdersDialog} />
            <Button label='Yes' icon='pi pi-check' severity='danger' onClick={deleteSelectedOrders} />
        </React.Fragment>
    );

    const toast = useRef(null);
    const header = (
        <div className='flex flex-wrap gap-2 align-items-center justify-content-between'>
            <h4 className='m-0'>Quản lý danh sách đơn hàng</h4>
            <div style={{ float: 'right' }}>
                <Button label='' icon='pi pi-plus' severity='success' tooltip='New record' onClick={openNew} /> &nbsp;&nbsp;
                <Button label='' icon='pi pi-trash' tooltip='Delete selected' severity='danger' onClick={confirmDeleteSelected} disabled={!selectedOrders || !selectedOrders.length} />&nbsp;&nbsp;
                <Button label='' icon='pi pi-upload' tooltip='Export excel' className='p-button-help' onClick={exportCSV} /> &nbsp;

                <span className='p-input-icon-left'>
                    <i className='pi pi-search' />
                    <InputText type='search' onInput={(e) => setGlobalFilter(e.target.value)} placeholder='Search...' />
                </span>
            </div>
        </div>
    );

    const handleOrderClick = (orderId) => {
        setSelectedOrderId(orderId);
        setOrderDetailsDialog(true);
    };

    const hideOrderDetailsDialog = () => {
        setOrderDetailsDialog(false);
        setSelectedOrderId(null);
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
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return ( 
        <div className="orders-container">
            <Toast ref={toast} />
            <div className='card'>
                <DataTable 
                    ref={dt} 
                    value={orders} 
                    selection={selectedOrders} 
                    onSelectionChange={(e) => setSelectedOrders(e.value)}
                    dataKey="order_id"
                    paginator 
                    rows={10} 
                    rowsPerPageOptions={[2, 5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} Đơn hàng" 
                    globalFilter={globalFilter} 
                    header={header}
                >
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="order_id" header="Mã Đơn Hàng" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column 
                        field="user_id" 
                        header="Khách Hàng" 
                        sortable 
                        style={{ minWidth: '12rem' }}
                        body={(rowData) => getUserName(rowData.user_id)}
                    ></Column>
                    <Column 
                        field="total_price" 
                        header="Tổng Tiền" 
                        sortable 
                        style={{ minWidth: '12rem' }}
                        body={(rowData) => formatCurrency(rowData.total_price)}
                    ></Column>
                    <Column field="order_status" header="Trạng Thái" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column 
                        field="created_at" 
                        header="Ngày Đặt" 
                        sortable 
                        style={{ minWidth: '12rem' }}
                        body={(rowData) => formatDateTime(rowData.created_at)}
                    ></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={orderDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                header='Thông tin đơn hàng' modal className='p-fluid' footer={orderDialogFooter} onHide={hideDialog}>

                {/* Chỉ hiển thị ID nếu đang sửa */}
                {order.order_id && (
                    <div className='field'>
                        <label htmlFor='order_id' className='font-bold'>Mã Đơn Hàng</label>
                        <InputText id='order_id' value={order.order_id} disabled />
                    </div>
                )}

                <div className='field'>
                    <label htmlFor='user_id' className='font-bold'>Khách Hàng</label>
                    <Dropdown
                        id='user_id'
                        value={order.user_id}
                        options={users}
                        onChange={(e) => onInputChange(e, 'user_id')}
                        optionLabel="full_name"
                        optionValue="user_id"
                        placeholder="Chọn khách hàng"
                        className={classNames({ 'p-invalid': submitted && !order.user_id })}
                    />
                    {submitted && !order.user_id && <small className='p-error'>Vui lòng chọn khách hàng.</small>}
                </div>

                <div className='field'>
                    <label htmlFor='total_price' className='font-bold'>Tổng Tiền</label>
                    <InputText 
                        id='total_price' 
                        value={formatCurrency(order.total_price)} 
                        onChange={(e) => {
                            // Chỉ cho phép nhập số
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            onInputChange({ target: { value } }, 'total_price');
                        }} 
                        required 
                        className={classNames({ 'p-invalid': submitted && !order.total_price })} 
                    />
                    {submitted && !order.total_price && <small className='p-error'>Vui lòng nhập tổng tiền.</small>}
                </div>

                <div className='field'>
                    <label htmlFor='order_status' className='font-bold'>Trạng Thái</label>
                    <Dropdown
                        id='order_status'
                        value={order.order_status}
                        options={[
                            { label: 'Chờ xử lý', value: 'pending' },
                            { label: 'Đang xử lý', value: 'processing' },
                            { label: 'Đã gửi hàng', value: 'shipped' },
                            { label: 'Đã giao hàng', value: 'delivered' },
                            { label: 'Đã hủy', value: 'canceled' }
                        ]}
                        onChange={(e) => onInputChange(e, 'order_status')}
                        required
                        className={classNames({ 'p-invalid': submitted && !order.order_status })}
                    />
                    {submitted && !order.order_status && <small className='p-error'>Vui lòng chọn trạng thái.</small>}
                </div>

                <div className='field'>
                    <label htmlFor='created_at' className='font-bold'>Ngày Đặt</label>
                    <Calendar
                        id='created_at'
                        value={order.created_at ? new Date(order.created_at) : null}
                        onChange={(e) => {
                            let _order = { ...order };
                            if (e.value) {
                                // Lấy ngày giờ địa phương
                                const localDate = new Date(e.value);
                                const year = localDate.getFullYear();
                                const month = String(localDate.getMonth() + 1).padStart(2, '0');
                                const day = String(localDate.getDate()).padStart(2, '0');
                                const hours = String(localDate.getHours()).padStart(2, '0');
                                const minutes = String(localDate.getMinutes()).padStart(2, '0');
                                const seconds = String(localDate.getSeconds()).padStart(2, '0');
                                
                                // Tạo chuỗi ngày giờ địa phương
                                _order.created_at = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                            } else {
                                _order.created_at = null;
                            }
                            setOrder(_order);
                        }}
                        showTime
                        hourFormat="24"
                        dateFormat="dd/mm/yy"
                        placeholder="Chọn ngày đặt hàng"
                        required
                        disabled={!!order.order_id}
                        className={classNames({ 'p-invalid': submitted && !order.created_at })}
                    />
                    {submitted && !order.created_at && <small className='p-error'>Vui lòng chọn ngày đặt hàng.</small>}
                </div>

            </Dialog>

            <Dialog visible={deleteOrderDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                header='Xác nhận' modal footer={deleteOrderDialogFooter} onHide={hideDeleteOrderDialog}>
                
                <div className='confirmation-content'>
                    <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
                    {order && (
                        <span>
                            Bạn có chắc muốn xóa đơn hàng: <b>{order.order_id}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteOrdersDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                header='Xác nhận' modal footer={deleteOrdersDialogFooter} onHide={hideDeleteOrdersDialog}>

                <div className='confirmation-content'>
                    <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
                    {order && <span>Bạn có muốn xóa các đơn hàng đã chọn không?</span>}
                </div>
            </Dialog>

            <OrderDetails 
                orderId={selectedOrderId} 
                visible={orderDetailsDialog}
                onHide={hideOrderDetailsDialog}
            />

            <Dialog visible={invoiceDialog} style={{ width: '50rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                header='Hóa đơn' modal onHide={hideInvoiceDialog}>
                <Invoice 
                    visible={invoiceDialog} 
                    onHide={hideInvoiceDialog} 
                    order={order} 
                    orderDetails={selectedOrderDetails}
                    userName={selectedUser?.full_name}
                />
            </Dialog>
        </div>
    );
};

export default Index;