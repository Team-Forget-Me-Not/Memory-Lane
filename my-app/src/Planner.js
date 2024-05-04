import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth functions
import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore'; // Import Firestore functions
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import './Planner.css';
import { Link } from 'react-router-dom';

const Planner = () => {
  // State variables
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [priorityInput, setPriorityInput] = useState('');
  const [sortOption, setSortOption] = useState('priority');
  const [currentUser, setCurrentUser] = useState(null); // State to store current user

  // Firestore instance
  const firestore = getFirestore();
  const auth = getAuth();

  // Fetch tasks from Firestore on component mount
  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Set current user state
      if (user) {
        fetchTasks(user.uid); // Fetch tasks for the current user
      } else {
        setTasks([]); // Clear tasks if no user is logged in
      }
    });

    return () => unsubscribe(); // Cleanup function
  }, []);

  // Function to fetch tasks from Firestore
  const fetchTasks = async (uid) => {
    try {
      const userTasksQuery = query(collection(firestore, 'tasks'), where('uid', '==', uid));
      const tasksSnapshot = await getDocs(userTasksQuery);
      const tasksData = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks: ', error);
    }
  };

  // Function to add a new task
  const addTask = async () => {
    try {
      if (currentUser) {
        const newTaskRef = await addDoc(collection(firestore, 'tasks'), {
          task: taskInput,
          priority: priorityInput || 'Normal',
          completed: false,
          uid: currentUser.uid // Associate task with current user's UID
        });
        setTasks([...tasks, { id: newTaskRef.id, task: taskInput, priority: priorityInput || 'Normal', completed: false }]);
        setTaskInput('');
        setPriorityInput('');
      }
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

  // Function to delete a task
  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(firestore, 'tasks', taskId)); // Delete task document
      setTasks(tasks.filter(task => task.id !== taskId)); // Remove task from tasks array
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  // Function to toggle task completion status
  const toggleTaskCompletion = async (taskId, completed) => {
    try {
      await updateDoc(doc(firestore, 'tasks', taskId), { completed: !completed }); // Update task completion status
      setTasks(tasks.map(task => (task.id === taskId ? { ...task, completed: !completed } : task))); // Update tasks array
    } catch (error) {
      console.error('Error updating task completion: ', error);
    }
  };

  // Function to edit task name or priority
  const editTask = async (taskId, newTaskName, newPriority) => {
    try {
      await updateDoc(doc(firestore, 'tasks', taskId), { task: newTaskName, priority: newPriority }); // Update task document
      setTasks(tasks.map(task => (task.id === taskId ? { ...task, task: newTaskName, priority: newPriority } : task))); // Update tasks array
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  // Function to sort tasks based on selected option
  const sortTasks = (option) => {
    setSortOption(option); // Update sort option state
    const sortedTasks = [...tasks]; // Create a copy of tasks array
    switch (option) {
      case 'priority':
        sortedTasks.sort((a, b) => {
          const priorityValue = { High: 3, Normal: 2, Low: 1 };
          return priorityValue[b.priority] - priorityValue[a.priority]; // Sort tasks by priority
        });
        break;
      case 'completed':
        sortedTasks.sort((a, b) => a.completed - b.completed); // Sort tasks by completion status
        break;
      default:
        break;
    }
    setTasks(sortedTasks); // Update tasks array with sorted tasks
  };

  // Function to get emoji based on priority
  const getPriorityEmoji = (priority) => {
    switch (priority) {
      case 'High':
        return '🔥🚀';
      case 'Normal':
        return '😊✅';
      case 'Low':
        return '🟢🐢';
      default:
        return '';
    }
  };

  // JSX rendering
  return (
    <div className="planner">
    <div className="banner-header">
      <div className="header-left">
        <img src="MemoryLaneB.png" alt="Logo" className="logo" />
        Memory Lane
      </div>
      <div className="header-right">
        <Link to="/App" style={{ textDecoration: 'none', color: 'inherit' }}>
          <FontAwesomeIcon icon={faHouse} /> Home
        </Link>
        <Link to="/my-calendar" style={{ textDecoration: 'none', color: 'inherit' }}>
          <FontAwesomeIcon icon={faCalendarAlt} /> Calendar
        </Link>
        <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
          <FontAwesomeIcon icon={faUser} /> Profile
        </Link>
      </div>
    </div>
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
            {/* Priority Emoji */}
            <span>{getPriorityEmoji(task.priority)}</span>
            {/* Button to toggle task completion */}
            <button 
              style={{ 
                backgroundColor: task.completed ? '#808080' : '#18A558', 
                color: 'white', 
                padding: '10px 20px' 
              }} 
              className="complete-button" 
              onClick={() => toggleTaskCompletion(task.id, task.completed)}
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
