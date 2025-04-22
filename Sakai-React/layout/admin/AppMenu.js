import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from '../context/layoutcontext';
import { MenuProvider } from '../context/menucontext';
import Link from 'next/link';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/pages/admin/dashboard' }]
        },
        {
            label: 'Products Management',
            items: [
                { label: 'Categories', icon: 'pi pi-fw pi-tags', to: '/pages/admin/categories' }, // Icon 'tags' phù hợp với danh mục sản phẩm
                { label: 'Products', icon: 'pi pi-fw pi-box', to: '/pages/admin/products' } // Icon 'box' đại diện cho sản phẩm
            ]
        },
        {
            label: 'Orders & Transactions',
            items: [
                { label: 'Orders', icon: 'pi pi-fw pi-shopping-cart', to: '/pages/admin/orders' }, // 'shopping-cart' phù hợp với đơn hàng
                { label: 'Payments', icon: 'pi pi-fw pi-credit-card', to: '/pages/admin/payments' } // 'credit-card' thể hiện thanh toán
            ]
        },
        {
            label: 'Users Management',
            items: [
                { label: 'Users', icon: 'pi pi-fw pi-users', to: '/pages/admin/users' } // 'users' phù hợp với quản lý người dùng
            ]
        },
        {
            label: 'Settings',
            items: [
                {
                    label: 'Đăng xuất',
                    icon: 'pi pi-fw pi-sign-out',
                    command: () => {
                        // Xóa thông tin user khỏi localStorage
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        // Chuyển hướng về trang chủ
                        window.location.href = '/pages/user/home_page';
                    }
                }
            ]
        },
       
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

                <Link href="https://www.primefaces.org/primeblocks-react" target="_blank" style={{ cursor: 'pointer' }}>
                    <img alt="Prime Blocks" className="w-full mt-3" src={`/layout/images/banner2.jpeg`} />
                </Link>
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
