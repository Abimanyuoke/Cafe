import { PrismaClient } from "@prisma/client";
import e from "express";

const prisma = new PrismaClient ()

export const getAllTransaksi = async (req, res) => {
try {
    const response = await prisma.transaksi.findMany()
    res.status(200).json(response)
    } catch (error) {
    res.status(500).json({msg: error.message})
    }
}

export const getTransaksiById = async (req, res) => {
try {
    const result = await prisma.transaksi.findUnique({
        where:{
            id_transaksi: Number(req.params.id)
        }
    })
    res.status(200).json(result)
} catch (error) {
    res.status(400).json({msg: error.message})
}
}

export const addTransaksi = async (req, res) => {
    let {id_user, id_meja, id_menu, nama_pelanggan} = req.body

    const [getUserById, getMejaById, getMenuById] = await Promise.all ([
        prisma.user.findUnique({where: {id_user: Number(id_user)}}),
        prisma.meja.findUnique({where: {id_user: Number(id_meja)}}),
        prisma.menu.findUnique({where: {id_user: Number(id_menu)}}),
    ]);

    if (getUserById && getMejaById && getMenuById) {
        try {
            const result = await prisma.transaksi.create({
                data: {
                    nama_pelanggan: nama_pelanggan,
                    user: {
                        connect: {
                            id_user: Number(id_user)
                        }
                    },
                    meja: {
                        connect: {
                            id_meja: Number(id_meja)
                        }
                    }
                }
            })
            if(result) {
                const createDetail = await prisma.detail_Transaksi.create({
                    data: {
                        transaksi: {
                            connect: {
                                id_transaksi: result.id_transaksi,
                            }
                        },
                        menu: {
                            connect: {
                                id_menu: Number(id_menu)
                            }
                        },
                        total_harga: getMenuById.harga
                    }
                })
                res.status(200).json({
                    success: true,
                    transaksi: result,
                    detail: createDetail,
                });
            } else {
                res.status(400).json({msg: "transasksi gagal"})
            }
        } catch (error) {
            console.log(error)
            res.status(404).json({msg: error.message})
        }
    } else {
        res.json({msg: "pilih user, meja, dna menu yang tersedia"})
    }
}

export const updateTransaksi = async (req, res) => {
    let {id_user, id_meja, id_menu, nama_pelanggan} = req.body

    const [getUserById, getMejaById, getMenuById] = await Promise.all ([
        prisma.user.findUnique({where: {id_user: Number(id_user)}}),
        prisma.meja.findUnique({where: {id_user: Number(id_meja)}}),
        prisma.menu.findUnique({where: {id_user: Number(id_menu)}}),
    ]);

    if (getUserById && getMejaById && getMenuById) {
        try {
            const result = await prisma.transaksi.update({
                data: {
                    nama_pelanggan: nama_pelanggan,
                    status: 'bayar',
                    user: {
                        connect: {
                            id_user: Number(id_user)
                        }
                    },
                    meja: {
                        connect: {
                            id_meja: Number(id_meja)
                        }
                    }
                }
            })
            if(result) {
                const createDetail = await prisma.detail_Transaksi.create({
                    data: {
                        transaksi: {
                            connect: {
                                id_transaksi: result.id_transaksi,
                            }
                        },
                        menu: {
                            connect: {
                                id_menu: Number(id_menu)
                            }
                        },
                        total_harga: getMenuById.harga
                    }
                })
                res.status(200).json({
                    success: true,
                    transaksi: result,
                    detail: createDetail,
                });
            } else {
                res.status(400).json({msg: "transasksi gagal"})
            }
        } catch (error) {
            console.log(error)
            res.status(404).json({msg: error.message})
        }
    } else {
        res.json({msg: "pilih user, meja, dna menu yang tersedia"})
    }
}

export const deleteTransaksi = async (req, res) => {
try {
    const result = await prisma.transaksi.delete({
        where: {
            id_transaksi: Number(req.params.id)
        },
    })
    res.status(200).json(result)
} catch (error) {
    res.status(400).json({msg: error.message})
}
}

