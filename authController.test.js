const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const listServices = async (req, res) => {
  try {
    const { professionalId } = req.query;
    const where = professionalId ? { professionalId } : {};
    const services = await prisma.service.findMany({ where, orderBy: { name: 'asc' } });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar serviços' });
  }
};

const getService = async (req, res) => {
  try {
    const service = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!service) return res.status(404).json({ error: 'Serviço não encontrado' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar serviço' });
  }
};

const createService = async (req, res) => {
  try {
    const { name, description, durationMin, price } = req.body;
    if (!name || !durationMin || !price)
      return res.status(400).json({ error: 'name, durationMin e price são obrigatórios' });
    if (durationMin <= 0)
      return res.status(400).json({ error: 'durationMin deve ser maior que zero' });

    const professional = await prisma.professional.findUnique({ where: { userId: req.user.id } });
    if (!professional) return res.status(403).json({ error: 'Perfil profissional não encontrado' });

    const service = await prisma.service.create({
      data: { name, description, durationMin: parseInt(durationMin), price: parseFloat(price), professionalId: professional.id }
    });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar serviço' });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, durationMin, price } = req.body;

    const service = await prisma.service.findUnique({ where: { id }, include: { professional: true } });
    if (!service) return res.status(404).json({ error: 'Serviço não encontrado' });
    if (service.professional.userId !== req.user.id) return res.status(403).json({ error: 'Sem permissão' });

    const updated = await prisma.service.update({
      where: { id },
      data: { name, description, durationMin: durationMin ? parseInt(durationMin) : undefined, price: price ? parseFloat(price) : undefined }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar serviço' });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({ where: { id }, include: { professional: true } });
    if (!service) return res.status(404).json({ error: 'Serviço não encontrado' });
    if (service.professional.userId !== req.user.id) return res.status(403).json({ error: 'Sem permissão' });

    await prisma.service.delete({ where: { id } });
    res.json({ message: 'Serviço removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover serviço' });
  }
};

module.exports = { listServices, getService, createService, updateService, deleteService };
