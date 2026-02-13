import express from 'express';
import { createReservation, getAllReservations } from '../controllers/reservation.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllReservations);

router.post('/', authMiddleware, createReservation);

export default router;