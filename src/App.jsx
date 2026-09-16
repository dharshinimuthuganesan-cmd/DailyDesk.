import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

function App() {
  const [page, setPage] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );

  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("currentUser") || ""
  );

  const [showUserBox, setShowUserBox] = useState(false);
  const [newUser, setNewUser] = useState("");

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("currentUser", currentUser);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  function addUser() {
    const name = newUser.trim();

    if (!name) {
      alert("Please enter your name");
      return;
    }

    if (!users.includes(name)) {
      setUsers([...users, name]);
    }

    setCurrentUser(name);
    setNewUser("");
    setShowUserBox(false);
  }

  function deleteUser(name) {
    const result = confirm(
      `Delete ${name}? All saved data for this user will also be removed.`
    );

    if (!result) return;

    setUsers(users.filter((user) => user !== name));

    localStorage.removeItem(`todos_${name}`);
    localStorage.removeItem(`notes_${name}`);

    if (currentUser === name) {
      setCurrentUser("");
      localStorage.removeItem("currentUser");
    }
  }

  const menu = [
    ["Dashboard", "⌂"],
    ["Calculator", "🧮"],
    ["Todo List", "✓"],
    ["Calendar", "📅"],
    ["QR Generator", "▦"],
    ["Notes", "📝"],
  ];

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">DD</div>
          <div>
            <h2>DailyDesk</h2>
            <span>Productivity</span>
          </div>
        </div>

        <div className="user-card">
          <div className="avatar">
            {currentUser ? currentUser.charAt(0).toUpperCase() : "?"}
          </div>

          <div className="user-info">
            <strong>{currentUser || "Guest User"}</strong>
            <small>{currentUser ? "Active user" : "Create a user"}</small>
          </div>

          <button
            className="dots"
            onClick={() => setShowUserBox(!showUserBox)}
          >
            ⋮
          </button>
        </div>

        {showUserBox && (
          <div className="user-menu">
            <input
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              placeholder="Enter user name"
            />

            <button onClick={addUser}>Add / Select User</button>

            <div className="saved-users">
              <b>Saved Users</b>

              {users.length === 0 && <p>No users yet</p>}

              {users.map((user) => (
                <div className="saved-user" key={user}>
                  <span
                    onClick={() => {
                      setCurrentUser(user);
                      setShowUserBox(false);
                    }}
                  >
                    {user}
                  </span>

                  <button onClick={() => deleteUser(user)}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <nav>
          {menu.map(([name, icon]) => (
            <button
              key={name}
              className={page === name ? "active" : ""}
              onClick={() => setPage(name)}
            >
              <span>{icon}</span>
              {name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button onClick={() => setDarkMode(!darkMode)}>
            <span>{darkMode ? "☀" : "☾"}</span>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{page}</h1>
            <p>
              {currentUser
                ? `Welcome back, ${currentUser}!`
                : "Welcome to your productivity space"}
            </p>
          </div>

          <button
            className="mobile-theme"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀" : "☾"}
          </button>
        </header>

        <section className="content">
          {page === "Dashboard" && <Dashboard setPage={setPage} />}
          {page === "Calculator" && <Calculator />}
          {page === "Todo List" && <TodoList user={currentUser} />}
          {page === "Calendar" && <Calendar />}
          {page === "QR Generator" && <QRGenerator />}
          {page === "Notes" && <Notes user={currentUser} />}
        </section>
      </main>
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */

function Dashboard({ setPage }) {
  const cards = [
    {
      title: "Calculator",
      icon: "🧮",
      text: "Perform quick calculations",
      page: "Calculator",
    },
    {
      title: "Todo List",
      icon: "✓",
      text: "Manage your daily tasks",
      page: "Todo List",
    },
    {
      title: "Calendar",
      icon: "📅",
      text: "Check your dates",
      page: "Calendar",
    },
    {
      title: "QR Generator",
      icon: "▦",
      text: "Create QR codes easily",
      page: "QR Generator",
    },
    {
      title: "Notes",
      icon: "📝",
      text: "Write and save your notes",
      page: "Notes",
    },
  ];

  return (
    <div>
      <div className="welcome-box">
        <div>
          <span className="small-label">YOUR PRODUCTIVITY SPACE</span>
          <h2>Everything you need in one place.</h2>
          <p>
            Use simple tools to calculate, organize tasks, create QR codes,
            manage dates and keep important notes.
          </p>
        </div>

        <div className="welcome-icon">✦</div>
      </div>

      <h3 className="section-title">Quick Tools</h3>

      <div className="tool-grid">
        {cards.map((card) => (
          <button
            className="tool-card"
            key={card.title}
            onClick={() => setPage(card.page)}
          >
            <div className="tool-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
            <span className="arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- CALCULATOR ---------------- */

function Calculator() {
  const [display, setDisplay] = useState("");

  const buttons = [
    "C",
    "⌫",
    "%",
    "/",
    "7",
    "8",
    "9",
    "*",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "0",
    ".",
    "=",
  ];

  function press(value) {
    if (value === "C") {
      setDisplay("");
      return;
    }

    if (value === "⌫") {
      setDisplay(display.slice(0, -1));
      return;
    }

    if (value === "=") {
      try {
        if (!display) return;

        const answer = Function(
          `"use strict"; return (${display})`
        )();

        setDisplay(String(answer));
      } catch {
        setDisplay("Error");
      }

      return;
    }

    if (value === "%") {
      try {
        setDisplay(String(Number(display) / 100));
      } catch {
        setDisplay("Error");
      }

      return;
    }

    if (display === "Error") {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  }

  return (
    <div className="calculator-box">
      <div className="calculator">
        <div className="calc-display">{display || "0"}</div>

        <div className="calc-buttons">
          {buttons.map((button) => (
            <button
              key={button}
              className={
                button === "="
                  ? "equals"
                  : ["+", "-", "*", "/"].includes(button)
                  ? "operator"
                  : button === "C"
                  ? "clear"
                  : ""
              }
              onClick={() => press(button)}
            >
              {button}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- TODO ---------------- */

function TodoList({ user }) {
  const storageKey = `todos_${user || "guest"}`;

  const [todos, setTodos] = useState(() => {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  });

  const [task, setTask] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(todos));
  }, [todos, storageKey]);

  function addTask() {
    if (!task.trim()) return;

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: task,
        completed: false,
      },
    ]);

    setTask("");
  }

  function toggleTask(id) {
    setTodos(
      todos.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  }

  function deleteTask(id) {
    setTodos(todos.filter((item) => item.id !== id));
  }

  const completed = todos.filter((item) => item.completed).length;

  return (
    <div className="todo-container">
      <div className="page-card">
        <div className="card-heading">
          <div>
            <span className="small-label">TASK MANAGER</span>
            <h2>Today's Tasks</h2>
          </div>

          <div className="task-count">
            {completed}/{todos.length} done
          </div>
        </div>

        <div className="add-task">
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="What needs to be done?"
          />

          <button onClick={addTask}>+ Add Task</button>
        </div>

        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty">
              <div>✓</div>
              <h3>No tasks yet</h3>
              <p>Add your first task above.</p>
            </div>
          ) : (
            todos.map((item) => (
              <div
                className={
                  item.completed ? "todo-item completed" : "todo-item"
                }
                key={item.id}
              >
                <button
                  className="check"
                  onClick={() => toggleTask(item.id)}
                >
                  {item.completed ? "✓" : ""}
                </button>

                <span>{item.text}</span>

                <button
                  className="delete-btn"
                  onClick={() => deleteTask(item.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- CALENDAR ---------------- */

function Calendar() {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const firstDay = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();

  const dates = [];

  for (let i = 0; i < firstDay; i++) {
    dates.push(null);
  }

  for (let i = 1; i <= days; i++) {
    dates.push(i);
  }

  function previousMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <button onClick={previousMonth}>‹</button>

        <div>
          <h2>{monthNames[month]}</h2>
          <span>{year}</span>
        </div>

        <button onClick={nextMonth}>›</button>
      </div>

      <div className="weekdays">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      <div className="calendar-grid">
        {dates.map((date, index) => {
          const isToday =
            date === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          return (
            <div
              className={isToday ? "calendar-date today" : "calendar-date"}
              key={index}
            >
              {date}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- QR GENERATOR ---------------- */

function QRGenerator() {
  const [text, setText] = useState("https://example.com");

  return (
    <div className="qr-layout">
      <div className="page-card qr-form">
        <span className="small-label">QR TOOL</span>
        <h2>Create QR Code</h2>

        <p>
          Enter text, a website address, phone number or any information.
        </p>

        <label>Your content</label>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here..."
        />

        <div className="qr-info">
          <span>✓</span>
          QR updates automatically
        </div>
      </div>

      <div className="page-card qr-result">
        <span className="small-label">PREVIEW</span>

        <div className="qr-image">
          {text ? (
            <QRCodeCanvas value={text} size={220} />
          ) : (
            <p>Enter content</p>
          )}
        </div>

        <h3>Your QR Code</h3>
        <p>Scan the code using your phone.</p>
      </div>
    </div>
  );
}

/* ---------------- NOTES ---------------- */

function Notes({ user }) {
  const storageKey = `notes_${user || "guest"}`;

  const [notes, setNotes] = useState(() => {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [notes, storageKey]);

  function addNote() {
    if (!title.trim() && !content.trim()) return;

    setNotes([
      ...notes,
      {
        id: Date.now(),
        title: title || "Untitled Note",
        content,
        date: new Date().toLocaleDateString(),
      },
    ]);

    setTitle("");
    setContent("");
  }

  function deleteNote(id) {
    setNotes(notes.filter((note) => note.id !== id));
  }

  return (
    <div className="notes-container">
      <div className="page-card note-editor">
        <span className="small-label">QUICK NOTES</span>

        <h2>Write Something</h2>

        <input
          className="note-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note..."
        />

        <button className="primary-btn" onClick={addNote}>
          Save Note
        </button>
      </div>

      <div className="notes-list">
        {notes.length === 0 ? (
          <div className="page-card empty">
            <div>📝</div>
            <h3>No notes yet</h3>
            <p>Your saved notes will appear here.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div className="note-card" key={note.id}>
              <div className="note-top">
                <h3>{note.title}</h3>

                <button onClick={() => deleteNote(note.id)}>×</button>
              </div>

              <p>{note.content}</p>

              <small>{note.date}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;