const db = require('../models');

const createTypeOfEvent = async (req, res) => {
    try {
        const { TypeName } = req.body;
        if (!TypeName) {
            return res.status(400).json({ message: 'Type name is required' });
        }
        const typeOfEvent = await db.TypeOfEvent.create({ EventName: TypeName });
        return res.status(201).json(typeOfEvent);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getTypeOfEvents = async (req, res) => {
    try {
        const typeOfEvents = await db.TypeOfEvent.findAll();
        return res.status(200).json(typeOfEvents);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getTypeOfEventById = async (req, res) => {
    try {
        const typeOfEvent = await db.TypeOfEvent.findByPk(req.params.id);
        if (!typeOfEvent) {
            return res.status(404).json({ message: 'Type of event not found' });
        }
        return res.status(200).json(typeOfEvent);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const deleteTypeOfEvent = async (req, res) => {
    try {
        const typeOfEvent = await db.TypeOfEvent.findByPk(req.params.id);
        if (!typeOfEvent) {
            return res.status(404).json({ message: 'Type of event not found' });
        }
        await typeOfEvent.destroy();
        return res.status(200).json({ message: 'Type of event deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateTypeOfEvent = async (req, res) => {
    try {
        const { TypeName } = req.body;
        const typeOfEvent = await db.TypeOfEvent.findByPk(req.params.id);
        if (!typeOfEvent) {
            return res.status(404).json({ message: 'Type of event not found' });
        }
        await typeOfEvent.update({ EventName: TypeName });
        return res.status(200).json(typeOfEvent);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createTypeOfEvent,
    getTypeOfEvents,
    getTypeOfEventById,
    deleteTypeOfEvent,
    updateTypeOfEvent
};
