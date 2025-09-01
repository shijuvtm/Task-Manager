import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiCheckSquare, FiSquare } from 'react-icons/fi';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [editingTask, setEditingTask] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', {
        title,
        description,
        priority
      });
      setTasks([response.data, ...tasks]);
      setTitle('');
      setDescription('');
      setPriority('medium');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${editingTask._id}`, {
        title,
        description,
        priority
      });
      setTasks(tasks.map(task => task._id === editingTask._id ? response.data : task));
      setEditingTask(null);
      setTitle('');
      setDescription('');
      setPriority('medium');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const toggleTask = async (taskId, completed) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
        completed: !completed
      });
      setTasks(tasks.map(task => task._id === taskId ? response.data : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {editingTask ? 'Edit Task' : 'Add New Task'}
        </h2>
        <form onSubmit={editingTask ? updateTask : addTask} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 flex items-center"
            >
              <FiPlus className="mr-2" />
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
            {editingTask && (
              <button
                type="button"
                onClick={cancelEditing}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Tasks</h2>
        {tasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-500">No tasks yet. Add your first task above!</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task._id} className={`bg-white rounded-xl shadow-md p-4 border-l-4 ${
              task.completed ? 'border-green-500' : 
              task.priority === 'high' ? 'border-red-500' :
              task.priority === 'medium' ? 'border-yellow-500' : 'border-blue-500'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleTask(task._id, task.completed)}
                    className="mt-1 text-gray-500 hover:text-green-500 transition duration-300"
                  >
                    {task.completed ? (
                      <FiCheckSquare className="h-5 w-5 text-green-500" />
                    ) : (
                      <FiSquare className="h-5 w-5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-600 mt-1">{task.description}</p>
                    )}
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority} priority
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditing(task)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition duration-300"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition duration-300"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
