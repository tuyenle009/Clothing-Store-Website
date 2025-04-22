import { useRouter } from 'next/router';
import React from 'react';
import { Button } from 'primereact/button';

const AccessDeniedPage = () => {
    const router = useRouter();

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="flex flex-column align-items-center justify-content-center">
                <div className="surface-card p-5 border-round shadow-2 w-full lg:w-6">
                    <div className="flex justify-content-center align-items-center bg-pink-500 border-circle mb-4" style={{ height: '3.2rem', width: '3.2rem' }}>
                        <i className="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
                    </div>
                    <h1 className="text-900 font-bold text-5xl mb-2 text-center">Access Denied</h1>
                    <div className="text-600 mb-5 text-center">You do not have the necessary permissions to access this page.</div>
                    
                    <div className="flex justify-content-center align-items-center mb-5">
                        <i className="pi pi-lock text-pink-500" style={{ fontSize: '5rem' }}></i>
                    </div>
                    
                    <div className="flex justify-content-center">
                        <Button icon="pi pi-arrow-left" label="Return to Home" onClick={() => router.push('/')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessDeniedPage;
