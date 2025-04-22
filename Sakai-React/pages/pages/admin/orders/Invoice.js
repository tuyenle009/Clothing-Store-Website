import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const Invoice = ({ visible, onHide, order, orderDetails, userName }) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

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

    const handlePrint = () => {
        const printContent = document.getElementById('invoice-content').innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = `
            <style>
                .invoice-container {
                    padding: 20px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .invoice-header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .invoice-details {
                    margin-bottom: 20px;
                }
                .invoice-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                .invoice-table th, .invoice-table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                .invoice-table th {
                    background-color: #f8f9fa;
                }
                .invoice-total {
                    text-align: right;
                    margin-top: 20px;
                }
                @media print {
                    body {
                        padding: 0;
                        margin: 0;
                    }
                    .invoice-container {
                        page-break-after: always;
                    }
                }
            </style>
            ${printContent}
        `;

        window.print();
        document.body.innerHTML = originalContent;
    };

    return (
        <Dialog 
            visible={visible} 
            onHide={onHide}
            style={{ width: '50vw' }}
            header="Hóa đơn bán hàng"
            footer={
                <div>
                    <Button label="In hóa đơn" icon="pi pi-print" onClick={handlePrint} />
                    <Button label="Đóng" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                </div>
            }
        >
            <div id="invoice-content" className="invoice-container">
                <div className="invoice-header">
                    <h2>HÓA ĐƠN BÁN HÀNG</h2>
                    <p>Số hóa đơn: #{order?.order_id}</p>
                    <p>Ngày: {formatDateTime(order?.created_at)}</p>
                </div>

                <div className="invoice-details">
                    <p><strong>Khách hàng:</strong> {userName}</p>
                    <p><strong>Trạng thái:</strong> {order?.order_status}</p>
                </div>

                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên sản phẩm</th>
                            <th>Màu sắc</th>
                            <th>Kích thước</th>
                            <th>Số lượng</th>
                            <th>Đơn giá</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderDetails?.map((detail, index) => (
                            <tr key={detail.order_detail_id}>
                                <td>{index + 1}</td>
                                <td>{detail.product_name}</td>
                                <td>{detail.color}</td>
                                <td>{detail.size}</td>
                                <td>{detail.quantity}</td>
                                <td>{formatCurrency(detail.price / detail.quantity)}</td>
                                <td>{formatCurrency(detail.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="invoice-total">
                    <p><strong>Tổng tiền:</strong> {formatCurrency(order?.total_price)}</p>
                </div>

                <div className="invoice-footer" style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p><strong>Người mua hàng</strong></p>
                        <p style={{ fontStyle: 'italic' }}>(Ký, ghi rõ họ tên)</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p><strong>Người bán hàng</strong></p>
                        <p style={{ fontStyle: 'italic' }}>(Ký, ghi rõ họ tên)</p>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default Invoice;