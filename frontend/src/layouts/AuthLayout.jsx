// layouts/AuthLayout.jsx (plein écran, pas de Header)
import { Outlet } from 'react-router-dom';
function AuthLayout() {
    return (
        <>
            <Outlet />
        </>
    );
}
export default AuthLayout;