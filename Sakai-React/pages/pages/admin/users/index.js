import userService from './userService';
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';


const Index = () => {

const [user, setUser] = useState([]); 
const [users, setUsers] = useState([]);

const [globalFilter, setGlobalFilter] = useState([]);
const [id, setid] = useState(null);


//showData: Lấy danh sách tất cả người dùng từ API và cập nhật vào state users
const showData = async () => {
    try {
        const data = await userService.getAllUsers();
        setUsers(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        toast.current.show({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Không thể tải danh sách người dùng. Vui lòng đảm bảo bạn đã đăng nhập.', 
            life: 5000 
        });
    }
};

useEffect(() => {
    fetchData();
}, []);

//fetchData: Gọi hàm showData để tải dữ liệu khi component được render.
const fetchData = async () => {
    showData();
};

let emptyUser = {
    user_id: null, // Hoặc 0 nếu cần kiểu số
    full_name: "",
    email: "",
    password_hash: "",
    phone: "",
    address: "",
    role: "customer", // Hoặc một giá trị mặc định hợp lệ của ENUM
    created_at: new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }), // Nếu cần timestamp mặc định
};

const [userDialog, setUserDialog] = useState(false);
const [submitted, setSubmitted] = useState(false);

//openNew: Mở hộp thoại thêm mới người dùng với dữ liệu mặc định.
const openNew = () => {
setUser(emptyUser);
setSubmitted(false);
setUserDialog(true);
};

//confirmDeleteSelected: Hiển thị hộp thoại xác nhận xóa nhiều người dùng được chọn.
const confirmDeleteSelected = () => {
setDeleteUsersDialog(true);
};
const dt = useRef(null);

//exportCSV: Xuất danh sách người dùng ra tệp CSV.
const exportCSV = () => {
dt.current.exportCSV();
};

const [selectedUsers, setSelectedUsers] = useState(null);

//hideDialog: Đóng hộp thoại chỉnh sửa/thêm mới người dùng.
const hideDialog = () => {
setSubmitted(false);
setUserDialog(false);
};

//deleteSelectedUsers: Xóa nhiều người dùng đã chọn và cập nhật danh sách.
const deleteSelectedUsers = () => {
let _users = users.filter((val) => !selectedUsers.includes(val));
setUsers(_users);
       
selectedUsers.map((item)=>{
userService.deleteUser(item.user_id);
});
setDeleteUsersDialog(false);
setSelectedUsers(null);
showData();


toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3500 });
};


//saveUser: Lưu thông tin người dùng (cập nhật nếu có user_id, thêm mới nếu không).
const saveUser = async () => {
    setSubmitted(true);

    let _users = [...users];
    let _user = { ...user };

    // Đảm bảo ngày tháng được format đúng trước khi gửi lên server
    if (_user.created_at) {
        const date = new Date(_user.created_at);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        _user.created_at = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    if (_user.user_id) {
        // Trường hợp cập nhật (user_id đã có)
        const index = findIndexById(_user.user_id);
        if (index !== -1) {
            _users[index] = _user;
            await userService.updateUser(_user);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công', life: 3000 });
        }
    } else {
        // Trường hợp thêm mới (user_id = null)
        const response = await userService.addUser(_user);
        if (response?.user_id) {
            _user.user_id = response.user_id; // Lấy ID mới từ API
            _users.push(_user);
        }
        showData();
        toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Thêm mới thành công', life: 3000 });
    }

    setUsers(_users);
    setUserDialog(false);
    setUser(emptyUser);
};



const userDialogFooter = (
<React.Fragment>
<Button label='Cancel' icon='pi pi-times' outlined onClick={hideDialog} />
<Button label='Save' icon='pi pi-check' onClick={saveUser} />
</React.Fragment>
);
    
//findIndexById: Tìm vị trí của người dùng trong danh sách theo user_id.
const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < users.length; i++) {
        if (users[i].user_id=== id) {
            index = i;
            break;
        }
    }

    return index;
};

//onInputChange: Cập nhật dữ liệu người dùng khi nhập vào form.
const onInputChange = (e, itemname) => {
    const val = (e.target && e.target.value) || '';
    let _user = { ...user };

    _user[`${itemname}`] = val;

    setUser(_user);
};

//editUser: Mở hộp thoại chỉnh sửa và tải dữ liệu người dùng vào form.

const editUser = (user) => {
    setUser({ ...user });
    setUserDialog(true);
    };

//confirmDeleteUser: Mở hộp thoại xác nhận xóa một người dùng cụ thể.
const [deleteUserDialog, setDeleteUserDialog] = useState(false);
const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
const [changePasswordDialog, setChangePasswordDialog] = useState(false);
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [passwordError, setPasswordError] = useState('');

const confirmDeleteUser = (user) => {
setUser(user);
setDeleteUserDialog(true);
};

const openChangePassword = (user) => {
    setUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setChangePasswordDialog(true);
};

const hideChangePasswordDialog = () => {
    setChangePasswordDialog(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
};

const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
        setPasswordError('Vui lòng nhập đầy đủ thông tin');
        return;
    }

    if (newPassword !== confirmPassword) {
        setPasswordError('Mật khẩu xác nhận không khớp');
        return;
    }

    if (newPassword.length < 6) {
        setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
        return;
    }

    try {
        await userService.changePassword(user.user_id, newPassword);
        toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đổi mật khẩu thành công', life: 3000 });
        hideChangePasswordDialog();
    } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: error.message || 'Không thể đổi mật khẩu', life: 3000 });
    }
};

const changePasswordDialogFooter = (
    <React.Fragment>
        <Button label="Hủy" icon="pi pi-times" outlined onClick={hideChangePasswordDialog} />
        <Button label="Đổi mật khẩu" icon="pi pi-check" onClick={handleChangePassword} />
    </React.Fragment>
);

//actionBodyTemplate: Hiển thị các nút thao tác (sửa, xóa) trong danh sách.
const actionBodyTemplate = (rowData) => {
    return (
        <React.Fragment>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <Button 
                    icon="pi pi-pencil" 
                    rounded 
                    outlined 
                    className="p-button-sm" 
                    onClick={() => editUser(rowData)} 
                />
                <Button 
                    icon="pi pi-key" 
                    rounded 
                    outlined 
                    className="p-button-sm p-button-info" 
                    onClick={() => openChangePassword(rowData)}
                    tooltip="Đổi mật khẩu"
                />
                <Button 
                    icon="pi pi-trash" 
                    rounded 
                    outlined 
                    severity="danger" 
                    className="p-button-sm"
                    onClick={() => confirmDeleteUser(rowData)} 
                />
            </div>
        </React.Fragment>
    );
};


//hideDeleteUserDialog: Đóng hộp thoại xác nhận xóa người dùng.
const hideDeleteUserDialog = () => {
setDeleteUserDialog(false);
};


//deleteUser: Xóa một người dùng khỏi hệ thống và cập nhật danh sách.

const deleteUser = async () => {
    try {
        await userService.deleteUser(user.user_id); // Đảm bảo truyền đúng user_id
        await showData(); // Chỉ cập nhật danh sách sau khi API thực sự xóa
        setDeleteUserDialog(false);

        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });

    } catch (error) {
        console.error("Error deleting supplier:", error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete record', life: 3000 });
    
    }
};


const deleteUserDialogFooter = (
<React.Fragment>
<Button label='No' icon='pi pi-times' outlined onClick={hideDeleteUserDialog} />
<Button label='Yes' icon='pi pi-check' severity='danger' onClick={deleteUser} />
</React.Fragment>
);

//hideDeleteUsersDialog: Đóng hộp thoại xác nhận xóa nhiều người dùng.
const hideDeleteUsersDialog = () => {
setDeleteUsersDialog(false);
};
const deleteUsersDialogFooter = (
<React.Fragment>
<Button label='No' icon='pi pi-times' outlined onClick={hideDeleteUsersDialog} />
<Button label='Yes' icon='pi pi-check' severity='danger' onClick={deleteSelectedUsers} />
</React.Fragment>
);
    
const toast = useRef(null);
const header = (
<div className='flex flex-wrap gap-2 align-items-center justify-content-between'>
<h4 className='m-0'>Quản lý danh sách user</h4>
<div style={{float:'right'}}>
<Button label='' icon='pi pi-plus' severity='success' tooltip='New record' onClick={openNew} /> &nbsp;&nbsp;
<Button label='' icon='pi pi-trash' tooltip='Delete selected' severity='danger'  onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length}  />&nbsp;&nbsp;
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
    value={users} 
    selection={selectedUsers} 
    onSelectionChange={(e) => setSelectedUsers(e.value)}
    dataKey="user_id"
    paginator 
    rows={10} 
    rowsPerPageOptions={[2, 5, 10, 25]}
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} Bản ghi" 
    globalFilter={globalFilter} 
    header={header}
>
    <Column selectionMode="multiple" exportable={false}></Column>
    <Column field="user_id" header="ID" sortable style={{ minWidth: '12rem' }}></Column>
    <Column field="full_name" header="Họ Tên" sortable style={{ minWidth: '12rem' }}></Column>
    <Column field="email" header="Email" sortable style={{ minWidth: '12rem' }}></Column>
    <Column field="phone" header="SĐT" sortable style={{ minWidth: '12rem' }}></Column>
    <Column field="address" header="Địa Chỉ" sortable style={{ minWidth: '12rem' }}></Column>
    <Column field="role" header="Vai Trò" sortable style={{ minWidth: '12rem' }}></Column>
    <Column 
        field="created_at" 
        header="Ngày Tạo" 
        sortable 
        style={{ minWidth: '12rem' }}
        body={(rowData) => {
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


<Dialog visible={userDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
    header='Mục tin' modal className='p-fluid' footer={userDialogFooter} onHide={hideDialog}>

    {/* Chỉ hiển thị ID nếu đang sửa */}
    {user.user_id && (
        <div className='field'>
            <label htmlFor='user_id' className='font-bold'>ID</label>
            <InputText id='user_id' value={user.user_id} disabled />
        </div>
    )}

    <div className='field'>
        <label htmlFor='full_name' className='font-bold'>Họ tên</label>
        <InputText id='full_name' value={user.full_name} 
            onChange={(e) => onInputChange(e, 'full_name')} required 
            className={classNames({ 'p-invalid': submitted && !user.full_name })} />
        {submitted && !user.full_name && <small className='p-error'>Vui lòng nhập họ tên.</small>}
    </div>

    <div className='field'>
        <label htmlFor='email' className='font-bold'>Email</label>
        <InputText id='email' value={user.email} 
            onChange={(e) => onInputChange(e, 'email')} required 
            className={classNames({ 'p-invalid': submitted && !user.email })} />
        {submitted && !user.email && <small className='p-error'>Vui lòng nhập email.</small>}
    </div>

    <div className='field'>
        <label htmlFor='phone' className='font-bold'>Số điện thoại</label>
        <InputText id='phone' value={user.phone} 
            onChange={(e) => onInputChange(e, 'phone')} required 
            className={classNames({ 'p-invalid': submitted && !user.phone })} />
        {submitted && !user.phone && <small className='p-error'>Vui lòng nhập số điện thoại.</small>}
    </div>

    <div className='field'>
        <label htmlFor='address' className='font-bold'>Địa chỉ</label>
        <InputText id='address' value={user.address} 
            onChange={(e) => onInputChange(e, 'address')} required 
            className={classNames({ 'p-invalid': submitted && !user.address })} />
        {submitted && !user.address && <small className='p-error'>Vui lòng nhập địa chỉ.</small>}
    </div>
    <div className='field'>
        <label htmlFor='role' className='font-bold'>Vai trò</label>
        <Dropdown
            id='role'
            value={user.role}
            onChange={(e) => onInputChange(e, 'role')}
            options={[
                { label: 'Khách hàng', value: 'customer' },
                { label: 'Quản trị viên', value: 'admin' }
            ]}
            optionLabel="label"
            optionValue="value"
            placeholder="Chọn vai trò"
            className={classNames({ 'p-invalid': submitted && !user.role })}
        />
        {submitted && !user.role && <small className='p-error'>Vui lòng chọn vai trò.</small>}
    </div>

    <div className='field'>
        <label htmlFor='created_at' className='font-bold'>Ngày tạo</label>
        <InputText 
            id='created_at' 
            value={user.created_at ? new Date(user.created_at).toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }) : ''} 
            disabled
            className={classNames({ 'p-invalid': submitted && !user.created_at })} 
        />
        {submitted && !user.created_at && <small className='p-error'>Vui lòng nhập ngày tạo.</small>}
    </div>

</Dialog>

<Dialog visible={deleteUserDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header='Confirm' modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
    <div className='confirmation-content'>
        <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
        {user && (
            <span>
                Bạn có chắc muốn xóa bản tin: <b>{user.user_id}</b>?
            </span>
        )}
    </div>
</Dialog>

<Dialog visible={deleteUsersDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header='Confirm' modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
    <div className='confirmation-content'>
        <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
        {user && <span>Bạn có muốn xóa các bản tin đã chọn không?</span>}
    </div>
</Dialog>

<Dialog visible={changePasswordDialog} style={{ width: '32rem' }} header="Đổi mật khẩu" modal className="p-fluid" footer={changePasswordDialogFooter} onHide={hideChangePasswordDialog}>
    <div className="field">
        <label htmlFor="user_name" className="font-bold">Tên người dùng</label>
        <InputText id="user_name" value={user?.full_name} disabled />
    </div>
    <div className="field">
        <label htmlFor="new_password" className="font-bold">Mật khẩu mới</label>
        <InputText 
            id="new_password" 
            type="password"
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)}
            className={classNames({ 'p-invalid': passwordError })} 
        />
        {passwordError && <small className="p-error">{passwordError}</small>}
    </div>
    <div className="field">
        <label htmlFor="confirm_password" className="font-bold">Xác nhận mật khẩu</label>
        <InputText 
            id="confirm_password" 
            type="password"
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={classNames({ 'p-invalid': passwordError })} 
        />
    </div>
</Dialog>

</div>
);
};
export default Index;
