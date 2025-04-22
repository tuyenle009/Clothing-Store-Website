// Sakai-React/pages/pages/admin/dashboard/index.js
import React, { useContext, useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { getUserData } from '../../../../utils/auth';
import { Card } from 'primereact/card';
import axios from 'axios';
import { API_URL } from '../../../../config/api';

const AdminDashboard = () => {
    const [statistics, setStatistics] = useState({
        total_orders: 0,
        total_revenue: 0,
        total_customers: 0,
        top_selling_product: null
    });
    const [chartData, setChartData] = useState({});
    const [lineOptions, setLineOptions] = useState(null);
    const { layoutConfig } = useContext(LayoutContext);
    const user = getUserData();

    useEffect(() => {
        // Fetch dashboard statistics
        const fetchDashboardStats = async () => {
            try {
                const response = await axios.get(`${API_URL}/statistics/dashboard`);
                setStatistics(response.data);
            } catch (error) {
                console.error('Error fetching dashboard statistics:', error);
            }
        };

        // Fetch monthly revenue for chart
        const fetchMonthlyRevenue = async () => {
            try {
                const response = await axios.get(`${API_URL}/statistics/monthly-revenue`);
                const monthlyData = response.data;
                
                const documentStyle = getComputedStyle(document.documentElement);
                const data = {
                    labels: monthlyData.map(item => {
                        const [year, month] = item.month.split('-');
                        return `Tháng ${month}/${year}`;
                    }).reverse(),
                    datasets: [
                        {
                            label: 'Doanh thu',
                            data: monthlyData.map(item => item.revenue).reverse(),
                            fill: false,
                            borderColor: documentStyle.getPropertyValue('--primary-color'),
                            tension: 0.4
                        }
                    ]
                };
                
                const options = {
                    maintainAspectRatio: false,
                    aspectRatio: 0.6,
                    plugins: {
                        legend: {
                            labels: {
                                color: documentStyle.getPropertyValue('--text-color')
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: documentStyle.getPropertyValue('--text-color')
                            },
                            grid: {
                                color: documentStyle.getPropertyValue('--surface-border')
                            }
                        },
                        y: {
                            ticks: {
                                color: documentStyle.getPropertyValue('--text-color')
                            },
                            grid: {
                                color: documentStyle.getPropertyValue('--surface-border')
                            }
                        }
                    }
                };

                setChartData(data);
                setLineOptions(options);
            } catch (error) {
                console.error('Error fetching monthly revenue:', error);
            }
        };

        fetchDashboardStats();
        fetchMonthlyRevenue();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    return (
        <ProtectedRoute adminOnly>
            <div className="grid">
                <div className="col-12">
                    <h2 className="text-lg mb-4">Thống kê tổng quan</h2>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <Card className="mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3 text-sm">Đơn hàng</span>
                                <div className="text-900 font-medium text-lg">{statistics.total_orders || 0}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-shopping-cart text-blue-500 text-lg" />
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <Card className="mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3 text-sm">Doanh thu</span>
                                <div className="text-900 font-medium text-lg">{formatCurrency(statistics.total_revenue || 0)}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-money-bill text-green-500 text-lg" />
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <Card className="mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3 text-sm">Khách hàng</span>
                                <div className="text-900 font-medium text-lg">{statistics.total_customers || 0}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-users text-purple-500 text-lg" />
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <Card className="mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3 text-sm">Sản phẩm bán chạy</span>
                                <div className="text-900 font-medium text-lg">{statistics.top_selling_product?.name || 'Chưa có dữ liệu'}</div>
                                {statistics.top_selling_product?.total_sold > 0 && (
                                    <div className="text-500 text-sm mt-2">
                                        Đã bán: {statistics.top_selling_product.total_sold} sản phẩm
                                        <br />
                                        Doanh thu: {formatCurrency(statistics.top_selling_product.revenue)}
                                    </div>
                                )}
                            </div>
                            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-star text-orange-500 text-lg" />
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-12">
                    <Card>
                        <div className="flex justify-content-between align-items-center mb-5">
                            <div className="text-900 font-medium text-lg">Biểu đồ doanh thu theo tháng</div>
                        </div>
                        <Chart type="line" data={chartData} options={lineOptions} />
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default AdminDashboard;