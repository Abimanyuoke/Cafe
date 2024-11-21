import express from 'express'

import {
    getAllUser,
    getUserById,
    updateUser,
    addUser,
    deleteUser
} from '../controllers/user_controller.js'
import { authenticate,  authorize } from '../controllers/auth_controller.js'
import { IsAdmin, IsManager } from '../middleware/role_validation.js'


const app = express()
app.use(express.json())

app.get('/',getAllUser)
app.get('/:id', getUserById) //siapapun boleh mengakses 
app.post('/', addUser) //cara menambahkan manager
app.put('/:id', authorize, [IsAdmin], updateUser)
app.delete('/:id', authorize, [IsAdmin], deleteUser)

app.post('login', authenticate)

export default app