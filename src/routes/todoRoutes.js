
import express from 'express'
import db from '../db.js'
import { authMiddleware } from '../middleware/authMiddleware.js'


const router = express.Router()

router.get('/', authMiddleware,(req, res) => {
    res.json("OK")
 })


router.post('/', (req, res) => { })


router.put('/:id', (req, res) => { })


router.delete('/:id', (req, res) => { })


export default router

