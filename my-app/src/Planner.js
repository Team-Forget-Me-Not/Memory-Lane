import React, { useState } from 'react';
import './Planner.css';

const Planner = () => {
  // State variables
  const [tasks, setTasks] = useState([]); // Store tasks
  const [taskInput, setTaskInput] = useState(''); // Input for new task
  const [priorityInput, setPriorityInput] = useState(''); // Input for task priority
  const [sortOption, setSortOption] = useState('priority'); // Sorting option

  // Add a new task
  const addTask = () => {
    if (taskInput.trim() !== '') {
      const newTask = {
        id: Date.now(),
        task: taskInput,
        priority: priorityInput || 'Normal',
        completed: false,
      };
      // Add new task to the tasks array
      setTasks([...tasks, newTask]);
      // Clear input fields
      setTaskInput('');
      setPriorityInput('');
    }
  };

  // Delete a task
  const deleteTask = (taskId) => {
    // Filter out the task with the given ID
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Toggle task completion status
  const toggleTaskCompletion = (taskId) => {
    // Toggle completion status of the task with the given ID
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Edit task name or priority
  const editTask = (taskId, newTaskName, newPriority) => {
    // Update task with the given ID
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, task: newTaskName, priority: newPriority } : task
    ));
  };

 // Sort tasks based on selected option
const sortTasks = (option) => {
  // Update sort option
  setSortOption(option);
  // Copy tasks array
  const sortedTasks = [...tasks];
  // Sort tasks based on selected option
  switch (option) {
    case 'priority':
      sortedTasks.sort((a, b) => {
        const priorityValue = { High: 3, Normal: 2, Low: 1 };
        return priorityValue[b.priority] - priorityValue[a.priority];
      });
      break;
    case 'completed':
      sortedTasks.sort((a, b) => a.completed - b.completed);
      break;
    default:
      break;
  }
  // Update tasks array with sorted tasks
  setTasks(sortedTasks);
};
  // JSX rendering
  return (
    <div className="planner">
      <h2>Planner</h2>
      <div className="task-input">
        {/* Input fields for task and priority */}
        <input
          type="text"
          placeholder="Enter task"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <select
          value={priorityInput}
          onChange={(e) => setPriorityInput(e.target.value)}
        >
          <option value="">Select priority</option>
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="High">High</option>
        </select>
        {/* Button to add a task */}
        <button style={{ backgroundColor: '#3498db', color: 'white' }} className="add-button" onClick={addTask}>Add Task</button>
      </div>
      <div className="sort-options">
        {/* Dropdown for sorting options */}
        <label>Sort by:</label>
        <select value={sortOption} onChange={(e) => sortTasks(e.target.value)}>
          <option value="priority">Priority</option>
          <option value="completed">Completion Status</option>
        </select>
      </div>
      {/* List of tasks */}
      <div className="task-list">
        {tasks.filter(task => sortOption === 'completed' ? task.completed : true).map(task => (
          <div key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
            {/* Input field for task name */}
            <input
              type="text"
              value={task.task}
              onChange={(e) => editTask(task.id, e.target.value, task.priority)}
              className="task-name"
            />
            {/* Dropdown for task priority */}
            <select
              value={task.priority}
              onChange={(e) => editTask(task.id, task.task, e.target.value)}
              className="task-priority"
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
            </select>
            {/* Button to toggle task completion */}
            <button 
              style={{ 
                backgroundColor: task.completed ? '#808080' : '#18A558', 
                color: 'white', 
                padding: '10px 20px' 
              }} 
              className="complete-button" 
              onClick={() => toggleTaskCompletion(task.id)}
            >
              {task.completed ? <>&#10003; Undo</> : 'Complete'}
            </button>
            {/* Button to delete task */}
            <button 
              style={{ backgroundColor: '#e74c3c', color: 'white', padding: '10px 20px' }} 
              className="delete-button" 
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Planner;
