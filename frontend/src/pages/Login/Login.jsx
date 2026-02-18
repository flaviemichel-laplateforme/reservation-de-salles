import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Assure-toi que le chemin est bon
import useForm from '../../hooks/useForm';
import useAsync from '../../hooks/useAsync';
import toast from 'react-hot-toast';

import './Login.css';

function Login() {
    // 1. Gestion du Formulaire avec useForm
    // Plus besoin de multiples useState pour email/password
    const { values, handleChange } = useForm({
        email: '',
        password: ''
    });

    // 2. Gestion de l'Asynchrone avec useAsync
    // Plus besoin de gérer loading/error manuellement dans la fonction
    const { loading, error, execute } = useAsync();

    // 3. Navigation et Auth
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    // 4. La soumission nettoyée
    const handleSubmit = async (e) => {
        e.preventDefault();

        await toast.promise(
            execute(() => login(values.email, values.password)),
            {
                loading: 'Connexion en cours...',
                success: (data) => {
                    // On redirige seulement quand l'animation de succès commence
                    setTimeout(() => {
                        navigate(from, { replace: true });
                    }, 1000);

                    return `Bienvenue ${data.user?.prenom || 'Utilisateur'} !`;
                },
                error: (err) => {
                    // On peut personnaliser le message ici
                    return "Email ou mot de passe incorrect !";
                },
            }
        );
    };
    return (
        <div className="login-page">
            <div className="container-login">
                <img src="/assets/logo/Logo.png" alt="TechSpace Logo" className="login-logo" />

                {/* Affichage de l'erreur gérée par useAsync */}
                {error && <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"             // ⚠️ Important pour useForm
                            value={values.email}     // ✅ Vient de useForm
                            onChange={handleChange}  // ✅ Vient de useForm
                            required
                        />
                    </div>

                    <div>
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            name="password"          // ⚠️ Important pour useForm
                            value={values.password}  // ✅ Vient de useForm
                            onChange={handleChange}  // ✅ Vient de useForm
                            required
                        />
                    </div>

                    {/* Bouton géré par useAsync */}
                    <button type="submit" disabled={loading} className={loading ? 'btn-loading' : ''}>
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </form>

                <p>Pas de compte ? <Link to="/register">S'inscrire</Link></p>
            </div>
        </div>
    );
}

export default Login;