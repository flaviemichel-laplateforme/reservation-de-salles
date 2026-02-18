import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

/**
 * Composant de transition futuriste entre les pages.
 * Détecte les changements de route et joue une animation cybernétique.
 */
function PageTransition({ children }) {
    const location = useLocation();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [displayChildren, setDisplayChildren] = useState(children);
    const prevLocation = useRef(location.pathname);

    useEffect(() => {
        // Ne pas animer au premier rendu
        if (prevLocation.current === location.pathname) return;

        prevLocation.current = location.pathname;
        setIsTransitioning(true);

        // Changer le contenu immédiatement (l'overlay le cache)
        setDisplayChildren(children);

        // Retirer l'overlay après l'animation
        const endTimer = setTimeout(() => {
            setIsTransitioning(false);
        }, 1200);

        return () => {
            clearTimeout(endTimer);
        };
    }, [location.pathname, children]);

    // Mettre à jour quand pas en transition
    useEffect(() => {
        if (!isTransitioning) {
            setDisplayChildren(children);
        }
    }, [children, isTransitioning]);

    return (
        <div className="page-transition-wrapper">
            {displayChildren}

            {/* Overlay de transition */}
            {isTransitioning && (
                <div className="transition-overlay">
                    <div className="scan-line" />
                    <div className="glitch-bars">
                        <span /><span /><span /><span /><span />
                    </div>
                    <div className="cyber-grid" />
                </div>
            )}
        </div>
    );
}

export default PageTransition;
