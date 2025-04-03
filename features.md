### **MongoDB Models for the Project**  

#### 1️⃣ **User Model (Student & Faculty)**  
```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "faculty"], required: true }, // Role-based authentication
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }], // Bookmarked projects for students
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
```

---

#### 2️⃣ **Project Model**  
```javascript
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  domain: { type: String, required: true }, // Example: Web Dev, AI, Blockchain, etc.
  techStack: [{ type: String, required: true }], // Example: ["React", "Node.js", "MongoDB"]
  status: { type: String, enum: ["completed", "looking for collaborators"], default: "looking for collaborators" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Owner of the project
  contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Students who joined the project
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
```

---

#### 3️⃣ **Request Model (For Joining a Project)**  
```javascript
const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Request", requestSchema);
```

---

#### 4️⃣ **Notification Model (For Requests & Approvals)**  
```javascript
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
```

---

### **Pages Required for the Website**  

#### **🔹 Authentication Pages**
1. **Login Page** (Role-based login for students & faculty)  
2. **Register Page** (Signup for students & faculty)  

#### **🔹 Main Pages**
3. **Home Page** (Lists all available projects)  
4. **Project Details Page** (Displays a single project's details, owner, contributors, and join request button)  
5. **Create Project Page** (For students to upload a project)  
6. **Edit Project Page** (For project owners to update details)  
7. **My Projects Page** (Lists the projects created by a logged-in student)  

#### **🔹 Collaboration & Requests**
8. **Join Requests Page** (Lists requests sent by students to join projects)  
9. **Manage Requests Page** (For project owners to accept/reject requests)  

#### **🔹 Faculty Features**
10. **Admin Dashboard (Faculty Page)** (Lists projects with delete option)  

#### **🔹 Additional Features**
11. **Search & Filter Page** (Search projects by name, domain, or tech stack)  
12. **Stats Page** (Shows graphs on completed projects vs. those needing collaborators)  
13. **Notifications Page** (Lists all notifications for the logged-in user)  
14. **Bookmarks Page** (Students can view their saved projects)  
15. **Profile Page** (Shows user details and projects contributed to)  

---

