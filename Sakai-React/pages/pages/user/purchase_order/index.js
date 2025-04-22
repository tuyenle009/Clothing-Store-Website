import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { PurchaseOrderService } from './purchaseOrderService';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { TabView, TabPanel } from 'primereact/tabview';

const ORDER_STATUS_LABELS = {
    pending: 'Order Placed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    canceled: 'Cancelled'
};

const PAYMENT_STATUS_LABELS = {
    pending: 'Pending',
    completed: 'Paid',
    failed: 'Failed'
};

const PurchaseOrder = () => {
    const router = useRouter();
    const [activeOrders, setActiveOrders] = useState([]);
    const [canceledOrders, setCanceledOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [orderPayment, setOrderPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const toast = useRef(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/auth/login');
            return;
        }

        const user = JSON.parse(userData);
        fetchUserOrders(user.user_id);
    }, []);

    const fetchUserOrders = async (userId, forceRefresh = false) => {
        try {
            setLoading(true);
            setError(null);
            
            let ordersData;
            if (forceRefresh) {
                setIsRefreshing(true);
                ordersData = await PurchaseOrderService.refreshOrders(userId);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Orders refreshed successfully',
                    life: 3000
                });
            } else {
                ordersData = await PurchaseOrderService.getUserOrders(userId);
            }
            
            // Sắp xếp đơn hàng theo thời gian mới nhất và phân loại
            const sortedOrders = ordersData.sort((a, b) => 
                new Date(b.created_at) - new Date(a.created_at)
            );
            
            // Tách đơn hàng thành 2 danh sách
            const active = sortedOrders.filter(order => order.order_status !== 'canceled');
            const canceled = sortedOrders.filter(order => order.order_status === 'canceled');
            
            setActiveOrders(active);
            setCanceledOrders(canceled);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Unable to load orders. Please try again later.');
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load orders',
                life: 3000
            });
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleRefresh = () => {
        const userData = localStorage.getItem('user');
        if (!userData) return;

        const user = JSON.parse(userData);
        fetchUserOrders(user.user_id, true);
    };

    const handleCancelOrder = async (order) => {
        confirmDialog({
            message: 'Are you sure you want to cancel this order?',
            header: 'Cancel Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await PurchaseOrderService.cancelOrder(order.order_id);
                    // Refresh orders after cancellation
                    const userData = JSON.parse(localStorage.getItem('user'));
                    await fetchUserOrders(userData.user_id, true);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Order cancelled successfully',
                        life: 3000
                    });
                } catch (error) {
                    console.error('Error cancelling order:', error);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to cancel order',
                        life: 3000
                    });
                }
            }
        });
    };

    const loadOrderDetails = async (order) => {
        try {
            setLoading(true);
            setSelectedOrder(order);
            
            const [details, payment] = await Promise.all([
                PurchaseOrderService.getOrderDetails(order.order_id),
                PurchaseOrderService.getOrderPayment(order.order_id)
            ]);

            setOrderDetails(details);
            setOrderPayment(payment);
        } catch (error) {
            console.error('Error loading order details:', error);
            setError('Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const getOrderStatusSeverity = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'warning';
            case 'processing':
                return 'info';
            case 'shipped':
                return 'success';
            case 'delivered':
                return 'success';
            case 'canceled':
                return 'danger';
            default:
                return 'info';
        }
    };

    const formatPrice = (value) => {
        if (!value) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const orderListTemplate = (orders) => (
        <div className="grid">
            {orders.length === 0 ? (
                <div className="col-12 text-center">
                    <i className="pi pi-shopping-cart text-5xl text-500 mb-3"></i>
                    <p className="text-lg text-500">No orders found in this category</p>
                </div>
            ) : (
                orders.map((order) => (
                    <div key={order.order_id} className="col-12">
                        <Card className="order-card mb-2">
                            <div className="flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Order #{order.order_id}</h3>
                                    <p className="text-sm mb-2">
                                        Placed on {formatDate(order.created_at)}
                                    </p>
                                    <div className="flex align-items-center gap-2">
                                        <Tag 
                                            value={ORDER_STATUS_LABELS[order.order_status] || order.order_status} 
                                            severity={getOrderStatusSeverity(order.order_status)}
                                            className={`order-status ${order.order_status ? order.order_status.toLowerCase() : ''} text-sm`}
                                        />
                                        {order.payment && (
                                            <Tag
                                                value={PAYMENT_STATUS_LABELS[order.payment.payment_status]}
                                                severity={order.payment.payment_status === 'completed' ? 'success' : 
                                                        order.payment.payment_status === 'pending' ? 'warning' : 'danger'}
                                                className="text-sm"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h4 className="text-base mb-1">{formatPrice(order.total_price)}</h4>
                                    <p className="text-sm text-500 mb-2">{order.items_count} items</p>
                                    <div className="flex gap-2">
                                        <Button 
                                            label="View Details" 
                                            icon="pi pi-eye"
                                            className="p-button-sm p-button-text p-button-plain" 
                                            style={{ backgroundColor: '#222', color: 'white' }}
                                            onClick={() => loadOrderDetails(order)}
                                        />
                                        {order.order_status === 'pending' && (
                                            <Button 
                                                label="Cancel" 
                                                icon="pi pi-times"
                                                className="p-button-sm p-button-danger" 
                                                onClick={() => handleCancelOrder(order)}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))
            )}
        </div>
    );

    const orderDetailsTemplate = () => {
        if (!selectedOrder) return null;

        return (
            <div className="order-details">
                <div className="mb-3">
                    <Button 
                        icon="pi pi-arrow-left" 
                        label="Back to Orders" 
                        className="p-button-sm mb-2" 
                        style={{ backgroundColor: '#222', color: 'white' }}
                        onClick={() => setSelectedOrder(null)}
                    />
                    <div className="flex justify-content-between align-items-start">
                        <div>
                            <h2 className="text-xl font-medium mb-2">Order #{selectedOrder.order_id}</h2>
                            <p className="text-sm mb-2">Placed on {formatDate(selectedOrder.created_at)}</p>
                            <div className="flex gap-2">
                                <Tag 
                                    value={ORDER_STATUS_LABELS[selectedOrder.order_status]} 
                                    severity={getOrderStatusSeverity(selectedOrder.order_status)}
                                    className={`order-status ${selectedOrder.order_status ? selectedOrder.order_status.toLowerCase() : ''} text-sm`}
                                />
                                {selectedOrder.payment && (
                                    <Tag
                                        value={PAYMENT_STATUS_LABELS[selectedOrder.payment.payment_status]}
                                        severity={selectedOrder.payment.payment_status === 'completed' ? 'success' : 
                                                selectedOrder.payment.payment_status === 'pending' ? 'warning' : 'danger'}
                                        className="text-sm"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <h3 className="text-lg font-medium">Total: {formatPrice(selectedOrder.total_price)}</h3>
                            <p className="text-sm text-500">{selectedOrder.items_count} items</p>
                        </div>
                    </div>
                </div>

                <DataTable 
                    value={orderDetails}
                    loading={loading}
                    className="mb-4"
                >
                    <Column 
                        header="Product" 
                        body={(rowData) => (
                            <div className="flex align-items-center">
                                <img 
                                    src={rowData.image_url} 
                                    alt={rowData.product_name}
                                    className="product-image mr-3"
                                    onError={(e) => e.target.src = '/users/img/product-placeholder.png'}
                                />
                                <div className="product-info">
                                    <h5 className="text-base font-medium mb-1">{rowData.product_name}</h5>
                                    <p className="text-sm mb-1">Color: {rowData.color}</p>
                                    <p className="text-sm">Size: {rowData.size}</p>
                                </div>
                            </div>
                        )}
                    />
                    <Column field="quantity" header="Quantity" />
                    <Column 
                        field="price" 
                        header="Price" 
                        body={(rowData) => (
                            <div className="price-info">
                                <p className="text-base mb-1">{formatPrice(rowData.price)}</p>
                                {rowData.price !== rowData.original_price && (
                                    <p className="text-sm text-500 line-through mb-1">
                                        {formatPrice(rowData.original_price)}
                                    </p>
                                )}
                                <p className="text-sm text-500">
                                    Subtotal: {formatPrice(rowData.subtotal)}
                                </p>
                            </div>
                        )}
                    />
                </DataTable>

                {orderPayment && (
                    <Card className="payment-info">
                        <h3 className="text-lg font-medium mb-3">Payment Information</h3>
                        <div className="grid">
                            <div className="col-6">
                                <p className="text-sm mb-2">
                                    <strong>Method:</strong> {orderPayment.formatted_method}
                                </p>
                                <p className="text-sm">
                                    <strong>Date:</strong> {formatDate(orderPayment.payment_date)}
                                </p>
                            </div>
                            <div className="col-6 text-right">
                                <p className="text-sm mb-2">
                                    <strong>Status: </strong>
                                    <span className={`payment-status ${orderPayment.status}`}>
                                        {PAYMENT_STATUS_LABELS[orderPayment.status]}
                                    </span>
                                </p>
                                <p className="text-sm">
                                    <strong>Amount:</strong> {formatPrice(orderPayment.amount)}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        );
    };

    if (loading && !selectedOrder) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <ProgressSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <Message severity="error" text={error} />
            </div>
        );
    }

    return (
        <div className="purchase-order">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="card">
                <div className="flex align-items-center justify-content-between mb-3">
                    <h1 className="text-2xl font-bold">My Orders</h1>
                    <Button 
                        icon="pi pi-refresh" 
                        className="p-button-text"
                        onClick={handleRefresh}
                        loading={isRefreshing}
                        tooltip="Refresh orders"
                    />
                </div>
                
                {selectedOrder ? (
                    orderDetailsTemplate()
                ) : (
                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                        <TabPanel header={`Active Orders (${activeOrders.length})`}>
                            {orderListTemplate(activeOrders)}
                        </TabPanel>
                        <TabPanel header={`Canceled Orders (${canceledOrders.length})`}>
                            {orderListTemplate(canceledOrders)}
                        </TabPanel>
                    </TabView>
                )}
            </div>
        </div>
    );
};

export default PurchaseOrder;
