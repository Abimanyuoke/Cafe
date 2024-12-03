import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllTransaksi = async (req, res) => {
  try {
    const result = await prisma.transaksi.findMany({
      include: {
        user: {
          select: {
            nama_user: true,
            role: true,
          },
        },
        meja: {
          select: {
            nomor_meja: true,
          },
        },
        detail_transaksi: {
          select: {
            id_menu: true,
            qty: true,
            total_harga: true,
          },
        },
      },
    });

    const transaksiWithMenu = await Promise.all(
      result.map(async (transaksi) => {
        let bayar = 0;
        const detailTransaksiWithMenu = await Promise.all(
          transaksi.detail_transaksi.map(async (detail) => {
            const menu = await prisma.menu.findUnique({
              where: {
                id_menu: detail.id_menu,
              },
            });

            bayar += detail.total_harga; //hitung semua sub total

            return {
              ...detail,
              nama_menu: menu ? menu.nama_menu : null, // Tambahkan nama_menu ke setiap detail_transaksi
              harga: menu ? menu.harga : null,
            };
          })
        );

        return {
          ...transaksi, // Tambahkan semua data transaksi
          detail_transaksi: detailTransaksiWithMenu, // Ganti detail_transaksi dengan yang sudah ada nama_menu
          total_bayar: bayar,
        };
      })
    );

    res.status(200).json({
      data: transaksiWithMenu,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};
export const getTransaksiById = async (req, res) => {
  try {
    const result = await prisma.transaksi.findUnique({
      where: {
        id_transaksi: Number(req.params.id),
      },
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

export const addTransaksi = async (req, res) => {
  let { id_user, id_meja, id_menu, nama_pelanggan, qty } = req.body;

  const [getUserId, getMejaId] = await Promise.all([
    prisma.user.findUnique({ where: { id_user: Number(id_user) } }),
    prisma.meja.findUnique({ where: { id_meja: Number(id_meja) } }),
  ]);

  // Periksa apakah id_menu adalah array
  if (
    !Array.isArray(id_menu) ||
    id_menu.length === 0 ||
    !Array.isArray(qty) ||
    qty.length !== id_menu.length
  ) {
    return res
      .status(400)
      .json({
        msg: "id_menu dan qty harus berupa array dengan panjang yang sama dan tidak boleh kosong",
      });
  }

  if (getUserId && getMejaId) {
    try {
      const result = await prisma.transaksi.create({
        data: {
          nama_pelanggan: nama_pelanggan,
          user: {
            connect: {
              id_user: Number(id_user),
            },
          },
          meja: {
            connect: {
              id_meja: Number(id_meja),
            },
          },
        },
      });
      if (result) {
        let total_harga = 0;
        const detailPromises = id_menu.map(async (id_menu, index) => {
          const getMenuId = await prisma.menu.findUnique({
            where: { id_menu: Number(id_menu) },
          });

          if (!getMenuId) {
            throw new Error(`Menu dengan id_menu ${id_menu} tidak ditemukan`);
          }

          const subTotal = getMenuId.harga * qty[index];
          total_harga += subTotal;

          return prisma.detail_Transaksi.create({
            data: {
              transaksi: {
                connect: {
                  id_transaksi: result.id_transaksi,
                },
              },
              menu: {
                connect: {
                  id_menu: Number(id_menu),
                },
              },
              qty: qty[index],
              total_harga: subTotal,
            },
          });
        });
        // Tunggu hingga semua detail transaksi selesai dibuat
        const details = await Promise.all(detailPromises);

        res.status(200).json({
          success: true,
          transaksi: result,
          detail: details,
          total_harga,
        });
      } else {
        res.status(400).json({ msg: "transaksi gagal" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  } else {
    res.json({ msg: "pilih user, meja, dan menu yg tersedia" });
  }
};

export const updateTransaksi = async (req, res) => {
  let { id_user, id_meja, id_menu, nama_pelanggan } = req.body;

  const [getUserId, getMejaId] = await Promise.all([
    prisma.user.findUnique({ where: { id_user: Number(id_user) } }),
    prisma.meja.findUnique({ where: { id_meja: Number(id_meja) } }),
  ]);

  // Periksa apakah id_menu adalah array
  if (!Array.isArray(id_menu) || id_menu.length === 0) {
    return res
      .status(400)
      .json({ msg: "id_menu harus berupa array dan tidak boleh kosong" });
  }

  if (getUserId && getMejaId) {
    try {
      const result = await prisma.transaksi.update({
        data: {
          nama_pelanggan: nama_pelanggan,
          user: {
            connect: {
              id_user: Number(id_user),
            },
          },
          meja: {
            connect: {
              id_meja: Number(id_meja),
            },
          },
        },
      });
      if (result) {
        const detailPromises = id_menu.map(async (id_menu) => {
          const getMenuId = await prisma.menu.findUnique({
            where: { id_menu: Number(id_menu) },
          });

          if (!getMenuId) {
            throw new Error(`Menu dengan id_menu ${id_menu} tidak ditemukan`);
          }
          return prisma.detail_Transaksi.update({
            data: {
              transaksi: {
                connect: {
                  id_transaksi: result.id_transaksi,
                },
              },
              menu: {
                connect: {
                  id_menu: Number(id_menu),
                },
              },
              total_harga: getMenuId.harga,
            },
          });
        });
        // Tunggu hingga semua detail transaksi selesai dibuat
        const details = await Promise.all(detailPromises);

        res.status(200).json({
          success: true,
          transaksi: result,
          detail: details,
        });
      } else {
        res.status(400).json({ msg: "transaksi gagal" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  } else {
    res.json({ msg: "pilih user, meja, dan menu yg tersedia" });
  }
};
export const deleteTransaksi = async (req, res) => {
  try {
    const chekTransaksi = await prisma.transaksi.findUnique({
      where: {
        id_transaksi: Number(req.params.id),
      },
      include: {
        detail_transaksi: {
          select: {
            id_menu: true,
          },
        },
      },
    });

    if (chekTransaksi) {
      const deleteDetail = await prisma.detail_Transaksi.deleteMany({
        where: {
          id_transaksi: chekTransaksi.id_transaksi,
        },
      });
      if (deleteDetail) {
        return prisma.transaksi.delete({
          where: {
            id_transaksi: chekTransaksi.id_transaksi,
          },
        });
      }
      res.status(200).json({
        success: true,
        message: "Data has been delete",
        data: chekTransaksi,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "data transaksi not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: error,
    });
  }
};
