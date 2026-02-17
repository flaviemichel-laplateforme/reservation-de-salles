// pages/Dashboard/Dashboard.jsx
import { useAuth } from '../../hooks/useAuth.js';

function Dashboard() {
    const { user } = useAuth();

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Bienvenue {user?.prenom} {user?.nom} !</p>
        </div>
    );
}
export default Dashboard;
