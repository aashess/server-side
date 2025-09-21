
import express from 'express'

import { authMiddleware } from '../middleware/authMiddleware.js'


const router = express.Router()

router.get('/', authMiddleware,(req, res) => {
    res.json("OK You arrived to final endpoint.")
 })


router.post('/', (req, res) => { })


router.put('/:id', (req, res) => { })


router.delete('/:id', (req, res) => { })


export default router

