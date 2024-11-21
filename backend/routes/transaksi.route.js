import express from 'express'

import {
    getAllTransaksi,
    getTransaksiById,
    updateTransaksi,
    addTransaksi,
    deleteTransaksi
} from '../controllers/transaksi_controller.js'

const app = express()
app.use(express.json())

app.get('/',getAllTransaksi)
app.get('/:id', getTransaksiById)
app.post('/', addTransaksi)
app.put('/:id', updateTransaksi)
app.delete('/:id', deleteTransaksi)


export default app