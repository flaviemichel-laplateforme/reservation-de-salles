const ReservationCard = ({ reservation, onDelete, onEdit }) => {
    // On ajoute T00:00:00 pour éviter le décalage UTC → heure locale
    const dateFormatted = new Date(reservation.date_resa + 'T00:00:00').toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <div className="reservation-card">
            <div className="card-top">
                <h4 className="resa-objet">{reservation.objet}</h4>
                <p className="resa-date text-capitalize">{dateFormatted}</p>
                <p className="resa-time">⏰ {reservation.heure_debut} - {reservation.heure_fin}</p>
            </div>

            <div className="card-actions">
                <button className="btn-edit" onClick={onEdit}>✏️ Modifier</button>
                <button className="btn-delete" onClick={onDelete}>🗑️ Annuler</button>
            </div>
        </div>
    );
};

export default ReservationCard;

