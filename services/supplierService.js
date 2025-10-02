import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const create = async (data) => prisma.supplier.create({ data });
const findAll = async () => prisma.supplier.findMany({ include: { products: true } });
const findById = async (id) => prisma.supplier.findUnique({ where: { id }, include: { products: true } });
const update = async (id, data) => prisma.supplier.update({ where: { id }, data });
const remove = async (id) => prisma.supplier.delete({ where: { id } });

export default { create, findAll, findById, update, remove };