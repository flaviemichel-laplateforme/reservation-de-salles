// Dans n'importe quel composant :
import { useAuth } from '../hooks/useAuth.js';
function MonComposant() {
    const { user, isAuthenticated, logout } = useAuth();
    return <p>Bonjour {user?.firstname} !</p>;
}