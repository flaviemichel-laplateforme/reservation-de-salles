import { useState, useEffect, useCallback } from 'react';
import { getAllReservations, createReservation, updateReservation, deleteReservation } from '../services/reservationService';
import toast from 'react-hot-toast';

export const usePlanning = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. LIRE (Read)
    const loadPlanning = useCallback(async () => {
        try {
            // Le backend retourne directement un tableau de réservations
            const data = await getAllReservations();
            setReservations(Array.isArray(data) ? data : []);
        } catch (err) {
            toast.error("Impossible de charger le planning.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPlanning();
    }, [loadPlanning]);

    // 2. CRÉER (Create)
    const addReservation = async (reservationData) => {
        const toastId = toast.loading('Réservation en cours...');
        try {
            await createReservation(reservationData);
            // Recharger le planning pour récupérer les données complètes
            // (prenom, nom, user_id venant du JOIN SQL)
            await loadPlanning();
            toast.success('Salle réservée avec succès !', { id: toastId });
            return true;
        } catch (err) {
            toast.error(err.message || "Erreur lors de la réservation.", { id: toastId });
            throw err;
        }
    };

    // 3. MODIFIER (Update)
    const modifyReservation = async (id, updatedData) => {
        const previousReservations = [...reservations];

        // Optimistic UI : on met à jour l'écran tout de suite
        setReservations(prev => prev.map(resa =>
            resa.id === id ? { ...resa, ...updatedData } : resa
        ));

        try {
            await updateReservation(id, updatedData);
            // Recharger pour avoir les données complètes du JOIN
            await loadPlanning();
            toast.success('Réservation modifiée avec succès !');
        } catch (err) {
            setReservations(previousReservations); // Annulation si erreur
            toast.error(err.message || "Impossible de modifier la réservation.");
            throw err;
        }
    };

    // 4. SUPPRIMER (Delete)
    const removeReservation = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir annuler ce créneau ?")) return;

        const previousReservations = [...reservations];
        setReservations(prev => prev.filter(resa => resa.id !== id));

        try {
            await deleteReservation(id);
            toast.success('Réservation annulée !');
        } catch (err) {
            setReservations(previousReservations);
            toast.error(err.message || "Échec de l'annulation.");
        }
    };

    // On exporte toutes les fonctions pour que la page puisse les utiliser
    return {
        reservations, loading,
        addReservation, modifyReservation, removeReservation
    };
};