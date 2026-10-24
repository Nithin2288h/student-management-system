// Lightweight local development backend API server
// Mimics Spring Boot REST endpoints for local testing without Docker/MySQL

import http from 'http';
import { URL } from 'url';

const PORT = 8080;

let students = [
  {
    id: 1,
    studentId: 'STU-2024-001',
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@university.edu',
    department: 'Computer Science',
    course: 'B.Tech Cloud Computing',
    phone: '+91 98765 43210',
    createdAt: '2024-08-15T09:30:00',
  },
  {
    id: 2,
    studentId: 'STU-2024-002',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@university.edu',
    department: 'Information Technology',
    course: 'B.Tech DevOps & SRE',
    phone: '+91 98765 43211',
    createdAt: '2024-08-16T10:15:00',
  },
  {
    id: 3,
    studentId: 'STU-2024-003',
    firstName: 'Rohan',
    lastName: 'Verma',
    email: 'rohan.verma@university.edu',
    department: 'Data Science',
    course: 'M.Tech Artificial Intelligence',
    phone: '+91 98765 43212',
    createdAt: '2024-08-17T11:00:00',
  },
  {
    id: 4,
    studentId: 'STU-2024-004',
    firstName: 'Ananya',
    lastName: 'Iyer',
    email: 'ananya.iyer@university.edu',
    department: 'Computer Science',
    course: 'B.Tech Cybersecurity',
    phone: '+91 98765 43213',
    createdAt: '2024-08-18T14:20:00',
  },
  {
    id: 5,
    studentId: 'STU-2024-005',
    firstName: 'Karan',
    lastName: 'Mehta',
    email: 'karan.mehta@university.edu',
    department: 'Software Engineering',
    course: 'B.Tech Full Stack Web',
    phone: '+91 98765 43214',
    createdAt: '2024-08-19T16:45:00',
  },
];

let nextId = 6;

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:8080'}`);
  const pathname = parsedUrl.pathname;

  // Health Endpoint
  if (pathname === '/api/health' && req.method === 'GET') {
    return sendJson(res, 200, {
      status: 'UP',
      database: 'CONNECTED',
      service: 'Student Management System API (Local Dev)',
      timestamp: new Date().toISOString(),
    });
  }

  // Count Endpoint
  if (pathname === '/api/students/count' && req.method === 'GET') {
    return sendJson(res, 200, { count: students.length });
  }

  // GET /api/students
  if (pathname === '/api/students' && req.method === 'GET') {
    const search = parsedUrl.searchParams.get('search');
    let results = students;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      results = students.filter(
        (s) =>
          s.firstName?.toLowerCase().includes(q) ||
          s.lastName?.toLowerCase().includes(q) ||
          s.studentId?.toLowerCase().includes(q) ||
          s.department?.toLowerCase().includes(q) ||
          s.course?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q)
      );
    }
    return sendJson(res, 200, results);
  }

  // GET /api/students/:id
  const matchId = pathname.match(/^\/api\/students\/(\d+)$/);
  if (matchId && req.method === 'GET') {
    const id = parseInt(matchId[1], 10);
    const student = students.find((s) => s.id === id);
    if (!student) {
      return sendJson(res, 404, { message: `Student with id ${id} not found` });
    }
    return sendJson(res, 200, student);
  }

  // POST /api/students
  if (pathname === '/api/students' && req.method === 'POST') {
    try {
      const data = await parseBody(req);
      const validationErrors = {};
      if (!data.studentId) validationErrors.studentId = 'Student registration number is required';
      if (!data.firstName) validationErrors.firstName = 'First name is required';
      if (!data.lastName) validationErrors.lastName = 'Last name is required';
      if (!data.email) validationErrors.email = 'Email is required';
      if (!data.department) validationErrors.department = 'Department is required';
      if (!data.course) validationErrors.course = 'Course is required';
      if (!data.phone) validationErrors.phone = 'Phone number is required';

      if (Object.keys(validationErrors).length > 0) {
        return sendJson(res, 400, {
          message: 'Validation failed',
          validationErrors,
        });
      }

      const newStudent = {
        id: nextId++,
        studentId: data.studentId.trim(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        department: data.department.trim(),
        course: data.course.trim(),
        phone: data.phone.trim(),
        createdAt: new Date().toISOString(),
      };

      students.unshift(newStudent);
      return sendJson(res, 201, newStudent);
    } catch (err) {
      return sendJson(res, 400, { message: 'Invalid JSON payload' });
    }
  }

  // PUT /api/students/:id
  if (matchId && req.method === 'PUT') {
    try {
      const id = parseInt(matchId[1], 10);
      const index = students.findIndex((s) => s.id === id);
      if (index === -1) {
        return sendJson(res, 404, { message: `Student with id ${id} not found` });
      }

      const data = await parseBody(req);
      students[index] = {
        ...students[index],
        ...data,
        id, // preserve id
      };
      return sendJson(res, 200, students[index]);
    } catch (err) {
      return sendJson(res, 400, { message: 'Invalid JSON payload' });
    }
  }

  // DELETE /api/students/:id
  if (matchId && req.method === 'DELETE') {
    const id = parseInt(matchId[1], 10);
    const initialLen = students.length;
    students = students.filter((s) => s.id !== id);
    if (students.length === initialLen) {
      return sendJson(res, 404, { message: `Student with id ${id} not found` });
    }
    return sendJson(res, 200, { message: 'Student deleted successfully' });
  }

  // 404 fallback
  return sendJson(res, 404, { message: 'Endpoint not found' });
});

server.listen(PORT, () => {
  console.log(`[SMS Backend] Local mock API server listening on http://localhost:${PORT}`);
});
