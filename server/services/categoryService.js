import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const create = async (data) => prisma.category.create({ data });
const findAll = async () => prisma.category.findMany({ include: { products: true } });
const findById = async (id) => prisma.category.findUnique({ where: { id }, include: { products: true }});
const update = async (id, data) => prisma.category.update({ where: { id }, data });
const remove = async (id) => prisma.category.delete({ where: { id } });

export default { create, findAll, findById, update, remove };