
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';

import { useRouter } from 'next/router'; // import hook để lấy thông tin route
import Layout from '../layout/admin/layout'; // Layout của admin
import UserLayout from '../layout/user/UserLayout'; // Layout của user
import {LayoutProvider} from '../layout/context/layoutcontext'; // Giả sử đây là context provider nếu bạn cần quản lý trạng thái toàn cục

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const isAdminPage = router.pathname.startsWith('/pages/admin'); // Kiểm tra nếu route bắt đầu bằng /admin thì đây là trang của admin

    // Kiểm tra nếu component có custom layout thì sử dụng layout đó
    if (Component.getLayout) {
        return <LayoutProvider>{Component.getLayout(<Component {...pageProps} />)}</LayoutProvider>;
    }

    // Nếu là trang admin, sử dụng layout admin, nếu không sử dụng layout user
    return (
        <LayoutProvider>
            {isAdminPage ? (
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            ) : (
                <UserLayout>
                    <Component {...pageProps} />
                </UserLayout>
            )}
        </LayoutProvider>
    );
}

