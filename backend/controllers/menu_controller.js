import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient ()

import upload from "../upload_image_menu.js";

export const getAllMenu = async (req, res) => {
try {
    const response = await prisma.menu.findMany()
    res.status(200).json(response)
} catch (error) {
    res.status(500).json({msg: error.message})
    }
}


export const getMenuById = async (req, res) => {
try {
    const result = await prisma.menu.findUnique({
        where:{
            id_menu: Number(req.params.id)
        }
    })
    res.status(200).json(result)
} catch (error) {
    res.status(400).json({msg: error.message})
}
}

export const addMenu = async (req, res) => {
    upload.single('filename')(req, res, async (error)=> {
        if(error){
            return res.status(400).json({message: error})
        } else if (!req.file) {
            return res.status(400).json({message: 'Nothing to Upload'})
        }
        const{nama_menu, jenis, deskripsi, harga} = req.body
        const{filename} = req.file
        
        
    try {
    const result = await prisma.menu.create({
        data: {
            nama_menu: nama_menu,
            jenis: jenis,
            deskripsi: deskripsi,
            gambar: filename,
            harga: Number(harga)
        }
    })
    res.status(200).json(result)
} catch (error) {
    console.log(error)
    res.status(400).json({msg: error.message})
}
        })
    }

export const updateMenu = async (req, res) => {
    upload.single('filename')(req, res, async (error)=> {
        if(error){
            return res.status(400).json({message: error})
        } else if (!req.file) {
            return res.status(400).json({message: 'Nothing to Upload'})
        }
        const{nama_menu, jenis, deskripsi, harga} = req.body
        const{filename} = req.file
        
        
    try {
    const result = await prisma.menu.update({
        where: {
        id_menu: Number(req.params.id)  
        },
        data: {
            nama_menu: nama_menu,
            jenis: jenis,
            deskripsi: deskripsi,
            gambar: filename,
            harga: Number(harga)
        }
    })
    res.status(200).json(result)
} catch (error) {
    console.log(error)
    res.status(400).json({msg: error.message})
}
        })
    }

export const deleteMenu = async (req, res) => {
   try {
    const result = await prisma.menu.delete({
        where: {
            id_menu: Number(req.params.id)
        },
    })
    res.status(200).json(result)
   } catch (error) {
    res.status(400).json({msg: error.message})
   }
}