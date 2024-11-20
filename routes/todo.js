const express = require('express');
const router = express.Router();
const auth = require('../middleware/user_jwt');

const Todo = require('../models/ToDo');

// creating a task
router.post('/', auth, async (req, resp, next) => {
    try {
        const todo = await Todo.create({title: req.body.title, description: req.body.description, user: req.user.id}); 

        if(!todo) {
            return resp.status(400).json({
                success: false,
                msg: 'Something went wrong'
            });
        }

        resp.status(200).json({
            success: true,
            todo: todo,
            msg: 'Successfully Created'
        })

    } catch (error) {
        next(error);
    }
});

// fetch todo
router.get('/', auth, async (req, resp, next) => {
    try {
        const todo = await Todo.find({user: req.user.id, finished: false});

        if(!todo) {
            return resp.status(400).json({
                success: false,
                msg: 'Some error occured'
            })
        }

        resp.status(200).json({
            success: true,
            todo: todo,
            msg: 'Successfully fetched',
            count: todo.length
        })

    } catch (error) {
        next(error);        
    }
});

// updating task
router.put('/:id', auth, async (req, resp, next) => {
    try {
        let toDo = await Todo.findById(req.params.id);

        if(!toDo) {
            return resp.status(200).json({
                success: false,
                msg: 'Task not exists'
            });
        }

        toDo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        if(!toDo) {
            return resp.status(400).json({
                success: false,
                msg: 'Something went wrong'
            });
        }

        resp.status(200).json({
            success: true,
            msg: 'Successfully Updated',
            todo: toDo
        });

    } catch (error) {
        next(error);
    }
});

//delete task
router.delete('/:id', auth, async (req, resp, next) => {
    try {
        let toDo = await Todo.findById(req.params.id);

        if(!toDo) return resp.status(400).json({success: false, msg: 'Task not found'});

        toDo = await Todo.findByIdAndDelete(req.params.id);

        resp.status(200).json({success: true, msg: 'Task successfully deleted'});

    } catch (error) {
        next(error);
    }
})

// fetch finished tasks
router.get('/finished', auth, async (req, resp, next) => {
    try {
        const todo = await Todo.find({user: req.user.id, finished: true});

        if(!todo) {
            return resp.status(400).json({
                success: false,
                msg: 'Some error occured'
            })
        }

        resp.status(200).json({
            success: true,
            todo: todo,
            msg: 'Successfully fetched finished tasks',
            count: todo.length
        })

    } catch (error) {
        next(error);        
    }
});

module.exports = router;