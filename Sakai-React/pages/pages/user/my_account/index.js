import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Dialog } from 'primereact/dialog';
import { Password } from 'primereact/password';
import axios from 'axios';

const MyAccount = () => {
    const router = useRouter();
    const toast = React.useRef(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get('http://localhost:5000/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data && response.data.user) {
                    const profileData = response.data.user;
                    console.log('Fetched profile data:', profileData);

                    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                    const updatedUser = {
                        ...currentUser,
                        phone: profileData.phone || '',
                        address: profileData.address || ''
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUser));

                    setUser(updatedUser);
                    setFormData({
                        full_name: profileData.full_name || '',
                        email: profileData.email || '',
                        phone: profileData.phone || '',
                        address: profileData.address || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Không có token, vui lòng đăng nhập lại');
            }

            console.log('Sending data:', formData);

            const response = await axios.put(
                `http://localhost:5000/user/update-profile`, 
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            console.log('Server response:', response.data);

            if (response.data && response.data.message === 'Cập nhật thông tin thành công') {
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                const updatedUser = {
                    ...currentUser,
                    ...formData
                };
                
                console.log('Updated user data:', updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setEditMode(false);
            } else {
                throw new Error('Không nhận được xác nhận từ server');
            }
        } catch (error) {
            console.error('Error updating profile:', error.response || error);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordSubmit = async () => {
        try {
            if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
                console.error('Please fill in all fields');
                return;
            }

            if (passwordData.newPassword !== passwordData.confirmPassword) {
                console.error('New password and confirmation do not match');
                return;
            }

            if (passwordData.newPassword.length < 6) {
                console.error('New password must be at least 6 characters long');
                return;
            }

            if (passwordData.oldPassword === passwordData.newPassword) {
                console.error('New password must be different from current password');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found, please login again');
            }

            const response = await axios.post(
                'http://localhost:5000/user/change-password',
                {
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data && response.data.message === 'Đổi mật khẩu thành công') {
                console.log('Password changed successfully');
                setShowPasswordDialog(false);
                setPasswordData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            let errorMessage = 'Unable to change password';
            if (error.response?.data?.message === 'Mật khẩu cũ không chính xác') {
                errorMessage = 'Current password is incorrect';
            }
            console.error(errorMessage);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="my-account-page">
            <Toast ref={toast} />
            <div className="grid">
                <div className="col-12">
                    <Card>
                        <div className="flex justify-content-between align-items-center mb-4">
                            <h1></h1>
                            <div className="flex justify-content-end mt-4">
                                {editMode ? (
                                    <div>
                                        <Button
                                            label="Save"
                                            icon="pi pi-check"
                                            className="p-button-success mr-2"
                                            onClick={handleSubmit}
                                        />
                                        <Button
                                            label="Cancel"
                                            icon="pi pi-times"
                                            className="p-button-danger"
                                            onClick={() => {
                                                setEditMode(false);
                                                setFormData({
                                                    full_name: user.full_name || '',
                                                    email: user.email || '',
                                                    phone: user.phone || '',
                                                    address: user.address || ''
                                                });
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <Button 
                                        icon="pi pi-pencil" 
                                        label="Edit Profile" 
                                        className="p-button-outlined"
                                        onClick={() => setEditMode(true)}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col-12 md:col-6">
                                <div className="field">
                                    <label htmlFor="full_name">Full Name</label>
                                    <InputText
                                        id="full_name"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="field">
                                    <label htmlFor="email">Email</label>
                                    <InputText
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="field">
                                    <label htmlFor="phone">Phone</label>
                                    <InputText
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="field">
                                    <label htmlFor="address">Address</label>
                                    <InputText
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <Divider />

                        <div className="flex justify-content-between align-items-center">
                            <h2></h2>
                            <Button
                                icon="pi pi-key"
                                label="Change Password"
                                className="p-button-outlined"
                                onClick={() => setShowPasswordDialog(true)}
                            />
                        </div>
                    </Card>
                </div>
            </div>

            <Dialog
                visible={showPasswordDialog}
                onHide={() => setShowPasswordDialog(false)}
                header="Change Password"
                modal
                className="p-fluid change-password-dialog"
                style={{ width: '450px' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            >
                <div className="field">
                    <label htmlFor="oldPassword">Current Password</label>
                    <Password
                        id="oldPassword"
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        toggleMask
                        feedback={false}
                        className="w-full"
                        inputClassName="w-full"
                    />
                </div>
                <div className="field">
                    <label htmlFor="newPassword">New Password</label>
                    <Password
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        toggleMask
                        className="w-full"
                        inputClassName="w-full"
                    />
                </div>
                <div className="field">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <Password
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        toggleMask
                        feedback={false}
                        className="w-full"
                        inputClassName="w-full"
                    />
                </div>
                <div className="flex justify-content-end mt-4">
                    <Button
                        label="Change Password"
                        icon="pi pi-check"
                        className="p-button-success"
                        onClick={handlePasswordSubmit}
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default MyAccount;
