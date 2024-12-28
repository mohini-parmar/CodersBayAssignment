const { validationResult } = require("express-validator");
const TodoModel = require("../models/todoModel")

exports.getAllTodos = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const todos = await TodoModel.find();
        res.status(200).json(todos)
    } catch (err) {
        res.status(500).json({ message: "Error fetching TODO data", error: err })
    }
};

exports.createTodo = async (req, res) => {
    try {
        const newTODO = new TodoModel({
            name: req.body.name,
            description: req.body.description,
            completed: req.body.completed || false,
        });
        const result = await newTODO.save()
        res.status(201).json(result)
    } catch (err) {
        res.status(500).json({ message: "Error creating TODO", error: err })
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const updatedTODO = await TodoModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!updatedTODO) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json(updatedTODO);
    } catch (err) {
        res.status(500).json({ message: "Error updating todo", error: err });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const delTODO = await TodoModel.findByIdAndDelete(req.params.id);
        if (!delTODO) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting todo", error: err });
    }
};
