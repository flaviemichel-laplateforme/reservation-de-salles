import { useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanning } from '../../hooks/usePlanning';
import { useAuth } from '../../hooks/useAuth';

// FullCalendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

// Composants réutilisables
import CreateReservationModal from '../../components/CreateReservationModal/CreateReservationModal';
import EditReservationModal from '../../components/EditReservationModal/EditReservationModal';

import './Planning.css';

// ───── Config statique (hors composant = une seule référence) ─────
const PLUGINS = [dayGridPlugin, timeGridPlugin, interactionPlugin];
const HEADER_TOOLBAR = { left: 'prev,next today', center: 'title', right: '' };
const BUTTON_TEXT = { today: "Aujourd'hui" };
const SLOT_LABEL_FORMAT = { hour: '2-digit', minute: '2-digit', hour12: false };

// Calcule le lundi de la semaine courante (une seule fois au chargement du module)
const getMonday = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    return monday.toISOString().split('T')[0];
};
const CURRENT_WEEK_START = getMonday();
const VALID_RANGE = { start: CURRENT_WEEK_START };

function Planning() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const calendarRef = useRef(null);

    // Hook CRUD
    const { reservations, loading, addReservation, modifyReservation, removeReservation } = usePlanning();

    // États des modales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResa, setEditingResa] = useState(null);
    const [defaultDate, setDefaultDate] = useState('');

    // Transforme les réservations en événements FullCalendar
    // Jaune = à moi, Rouge = aux autres, Gris = passé
    const events = useMemo(() => {
        if (!Array.isArray(reservations)) return [];
        const now = new Date();

        return reservations.map(resa => {
            const dateStr = resa.date_resa.split('T')[0];
            const endDateTime = new Date(`${dateStr}T${resa.heure_fin}`);
            const isPast = endDateTime < now;
            const isMine = resa.user_id === user?.id;

            let backgroundColor, borderColor, textColor, classNames;

            if (isPast) {
                backgroundColor = '#d1d5db';
                borderColor = '#9ca3af';
                textColor = '#6b7280';
                classNames = ['event-past'];
            } else if (isMine) {
                backgroundColor = '#fbbf24';
                borderColor = '#f59e0b';
                textColor = '#78350f';
                classNames = ['event-mine'];
            } else {
                backgroundColor = '#ef4444';
                borderColor = '#dc2626';
                textColor = '#fff';
                classNames = ['event-other'];
            }

            return {
                id: String(resa.id),
                title: `${resa.objet} — ${resa.prenom} ${resa.nom}`,
                start: `${dateStr}T${resa.heure_debut}`,
                end: `${dateStr}T${resa.heure_fin}`,
                backgroundColor,
                borderColor,
                textColor,
                classNames,
                extendedProps: { ...resa, isMine, isPast }
            };
        });
    }, [reservations, user]);

    // Clic sur un créneau vide → ouvrir la modale de création
    const handleDateClick = useCallback((info) => {
        const clickedDate = new Date(info.dateStr);
        if (clickedDate < new Date()) return;
        setDefaultDate(info.dateStr.split('T')[0]);
        setIsModalOpen(true);
    }, []);

    // Clic sur un événement → modifier seulement les miens et non passés
    const handleEventClick = useCallback((info) => {
        const resa = info.event.extendedProps;
        if (!resa.isMine || resa.isPast) return;
        setEditingResa(resa);
    }, []);

    if (loading) return <div className="planning-loading">Chargement du calendrier...</div>;

    return (
        <div className="planning-wrapper">
            <header className="planning-header">
                <button className="btn-back" onClick={() => navigate(-1)}>
                    <span className="arrow">←</span> Retour
                </button>
                <div className="planning-legend">
                    <span className="legend-item legend-mine">■ Mes réservations</span>
                    <span className="legend-item legend-other">■ Occupé</span>
                    <span className="legend-item legend-past">■ Passé</span>
                </div>
                <button className="btn-primary" onClick={() => { setDefaultDate(''); setIsModalOpen(true); }}>
                    + Nouvelle Réservation
                </button>
            </header>

            <div className="calendar-fullcalendar">
                <FullCalendar
                    ref={calendarRef}
                    plugins={PLUGINS}
                    initialView="timeGridWeek"
                    locale="fr"
                    headerToolbar={HEADER_TOOLBAR}
                    buttonText={BUTTON_TEXT}
                    weekends={false}
                    firstDay={1}
                    slotMinTime="08:00:00"
                    slotMaxTime="19:00:00"
                    slotDuration="01:00:00"
                    slotLabelInterval="01:00:00"
                    slotLabelFormat={SLOT_LABEL_FORMAT}
                    nowIndicator={true}
                    validRange={VALID_RANGE}
                    events={events}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    editable={false}
                    selectable={true}
                    height="auto"
                    allDaySlot={false}
                />
            </div>

            {/* Modale de création */}
            {isModalOpen && (
                <CreateReservationModal
                    onClose={() => setIsModalOpen(false)}
                    onSave={addReservation}
                    defaultDate={defaultDate}
                />
            )}

            {/* Modale de modification */}
            {editingResa && (
                <EditReservationModal
                    reservation={editingResa}
                    onClose={() => setEditingResa(null)}
                    onSave={modifyReservation}
                />
            )}
        </div>
    );
}

export default Planning;