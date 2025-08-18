const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Add session middleware
app.use(session({
    secret: 'employee-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // For demo only; set to true with HTTPS
}));

// In-memory storage for employees (in a real app, you'd use a database)
let employees = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@company.com",
        position: "Software Engineer",
        department: "Engineering",
        salary: 75000,
        hireDate: "2023-01-15"
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@company.com",
        position: "Product Manager",
        department: "Product",
        salary: 85000,
        hireDate: "2022-08-20"
    },
    {
        id: 3,
        name: "Mike Johnson",
        email: "mike.johnson@company.com",
        position: "UX Designer",
        department: "Design",
        salary: 70000,
        hireDate: "2023-03-10"
    }
];

let nextId = 4;

// Hardcoded admin credentials
const ADMIN_EMAIL = 'admin@company.com';
const ADMIN_PASSWORD = 'admin123';

// Authentication middleware
function requireLogin(req, res, next) {
    if (req.session && req.session.loggedIn) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        req.session.loggedIn = true;
        res.json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'Logged out' });
    });
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET all employees
app.get('/api/employees', requireLogin, (req, res) => {
    res.json(employees);
});

// GET single employee
app.get('/api/employees/:id', requireLogin, (req, res) => {
    const employee = employees.find(emp => emp.id === parseInt(req.params.id));
    if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
});

// POST new employee
app.post('/api/employees', requireLogin, (req, res) => {
    const { name, email, position, department, salary, hireDate } = req.body;
    
    if (!name || !email || !position || !department || !salary || !hireDate) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newEmployee = {
        id: nextId++,
        name,
        email,
        position,
        department,
        salary: parseInt(salary),
        hireDate
    };

    employees.push(newEmployee);
    res.status(201).json(newEmployee);
});

// PUT update employee
app.put('/api/employees/:id', requireLogin, (req, res) => {
    const employeeIndex = employees.findIndex(emp => emp.id === parseInt(req.params.id));
    
    if (employeeIndex === -1) {
        return res.status(404).json({ message: 'Employee not found' });
    }

    const { name, email, position, department, salary, hireDate } = req.body;
    
    if (!name || !email || !position || !department || !salary || !hireDate) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    employees[employeeIndex] = {
        ...employees[employeeIndex],
        name,
        email,
        position,
        department,
        salary: parseInt(salary),
        hireDate
    };

    res.json(employees[employeeIndex]);
});

// DELETE employee
app.delete('/api/employees/:id', requireLogin, (req, res) => {
    const employeeIndex = employees.findIndex(emp => emp.id === parseInt(req.params.id));
    
    if (employeeIndex === -1) {
        return res.status(404).json({ message: 'Employee not found' });
    }

    const deletedEmployee = employees.splice(employeeIndex, 1)[0];
    res.json({ message: 'Employee deleted successfully', employee: deletedEmployee });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 