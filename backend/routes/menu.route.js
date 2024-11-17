import express from 'express'

import {
    getAllMenu,
    getMenuById,
    updateMenu,
    addMenu,
    deleteMenu
} from '../controllers/menu_controller.js'

const app = express()
app.use(express.json())

app.get('/',getAllMenu)
app.get('/:id', getMenuById)
app.post('/', addMenu)
app.put('/:id', updateMenu)
app.delete('/:id', deleteMenu)


export default app