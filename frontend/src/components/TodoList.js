import React, { useEffect, useState } from 'react'
import { Table, Button, Container, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTodo, setNewTodo] = useState({
        name: '',
        description: '',
        completed: false,
        _id: '',
    });
    const [isEditMode, setIsEditMode] = useState(false);

    const getdata = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get('http://localhost:8000/api/todos/', {
                headers: { Authorization:`${token}`},
            });
            setTodos(res.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    }
    const handleDelete = async(id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8000/api/todos/${id}`, {
                headers: { Authorization: `${token}` },
            });
            const filteredTodos = todos.filter(todo => todo._id !== id);
            setTodos(filteredTodos);
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    }

    const handleSave = async() => {
        try {
            const token = localStorage.getItem('token');
            let res;
            if (isEditMode) {
                res = await axios.put(
                    `http://localhost:8000/api/todos/${newTodo._id}`,
                    newTodo,
                    { headers: { Authorization: `${token}` } }
                );
            } else {
                res = await axios.post(
                    'http://localhost:8000/api/todos/',
                    newTodo,
                    { headers: { Authorization: `${token}` } }
                );
            }

            if (isEditMode) {
                const updatedTodos = todos.map(todo =>
                    todo._id === newTodo._id ? res.data : todo
                );
                setTodos(updatedTodos);
            } else {
                setTodos([...todos, res.data]);
            }

            handleClose();
        } catch (error) {
            console.error('Error saving todo:', error);
        }
    }

    const handleClose = () => {
        setShowModal(false);
        setNewTodo({ name: '', description: '', completed: false });
        setIsEditMode(false); 
    };

    const handleEdit = (todo) => {
        setNewTodo(todo); 
        setIsEditMode(true); 
        setShowModal(true); 
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };
    

    useEffect(() => {
        getdata();
    }, [])
    return (
        <Container className='mt-5'>
            <Button onClick={handleLogout}>Logout</Button>
            <h3 className='text-center'>To-Do List</h3>
            <div className='float-end'>
                <Button type='suceess' onClick={()=>setShowModal(true)}> Add New To-Do</Button>
            </div>
            <Table striped border hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>To-Do</th>
                        <th>Description</th>
                        <th>Completed</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {todos.map((todo, index) => (
                        <tr key={todo.id}>
                            <td>{index + 1}</td>
                            <td>{todo.name}</td>
                            <td>{todo.description}</td>
                            <td>
                                <Form.Check
                                    type='checkbox'
                                    checked={todo.completed}
                                    disabled
                                />
                            </td>
                            <td>
                                <Button variant='warning' onClick={() => handleEdit(todo)}>Edit</Button>{' '}
                                <Button variant='danger' onClick={() => handleDelete(todo._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New To-Do</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTodoName">
                            <Form.Label>To-Do Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter To-Do name"
                                value={newTodo.name}
                                onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formTodoDescription" className='mt-3'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter description"
                                value={newTodo.description}
                                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formTodoCompleted" className='mt-3'>
                            <Form.Check
                                type="checkbox"
                                label="Completed"
                                checked={newTodo.completed}
                                onChange={(e) => setNewTodo({ ...newTodo, completed: e.target.checked })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>Save To-Do</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default TodoList
