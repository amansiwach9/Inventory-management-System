import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const create = async (productData) => {
    return prisma.product.create({ data: productData });
};

const findAll = async () => {
    return prisma.product.findMany({ include: { category: true, supplier: true } });
};

const findById = async (id) => {
    return prisma.product.findUnique({
        where: { id },
        include: { category: true, supplier: true, movements: true },
    });
};

const update = async (id, productData) => {
    return prisma.product.update({ where: { id }, data: productData });
};

const remove = async (id) => {
    return prisma.product.delete({ where: { id } });
};

export default { create, findAll, findById, update, remove };