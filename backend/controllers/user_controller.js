import { PrismaClient } from "@prisma/client";
import md5 from "md5";

const prisma = new PrismaClient ()

export const getAllUser = async (req, res) => {
try {
    const response = await prisma.user.findMany() 
    res.status(200).json(response)
} catch (error) {
    res.status(500).json({msg: error.message})
}
}


export const getUserById = async (req, res) => {
try {
    const result = await prisma.user.findUnique({
        where:{
            id_user: Number(req.params.id)
        }
    })
    res.status(200).json(result)
} catch (error) {
    res.status(400).json({msg: error.message})
}
}

export const addUser = async (req, res) => {
try {
    const {nama_user, username, password, role} = req.body
    const result = await prisma.user.create({
        data: {
            nama_user: nama_user,
            username: username,
            password: md5(password),
            role : role
        }
    })
    res.status(200).json(result)
} catch (error) {
    console.log(error)
    res.status(400).json({msg: error.message})
}
}

export const updateUser = async (req, res) => {
try {
    const {nama_user, username, password, role} = req.body
    const result = await prisma.user.update({
        where:{
            id_user: Number(req.params.id)
        },
        data: {
            nama_user: nama_user,
            username: username,
            password: md5(password),
            role : role
        }
    })
    res.status(200).json(result)
} catch (error) {
    res.status(400).json({msg: error.message})
}
}

export const deleteUser = async (req, res) => {
try {
    const result = await prisma.user.delete({
        where: {
            id_user: Number(req.params.id)
        },
    })
    res.status(200).json(result)
} catch (error) {
    res.status(400).json({msg: error.message})
}
}
