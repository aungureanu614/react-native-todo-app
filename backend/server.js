const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let todos = [
  { id: 1, text: "Learn React Native", done: false },
  { id: 2, text: "Build a Todo App", done: true },
];

app.get("/api/todos",(req, res) => {res.json(todos)});

app.post("/api/todos", (req, res) => {
  const {text} = req.body;

  if(!text || text.trim() === "") {
    return res.status(400).json({error: "Text is required"});
  }

  const newTodo = {
    id: Date.now(),
    text,
    done: false
  }

  todos = [...todos, newTodo];
  res.status(201).json(newTodo);
});

app.patch("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { done } = req.body;


  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  if (typeof done === "boolean") {
    todo.done = done;
  }

  res.json(todo);
})

app.delete("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  const toDoExists = todos.find((todo) => todo.id === id);
  if(!toDoExists) {
    return res.status(404).json({error: "Todo not found"});
  }

  const removedToDo = todos.filter((todo) => todo.id !== id);
  res.json({message: "Todo deleted", removedToDo})
});


const PORT = 3000;

app.listen(PORT, () =>{
  console.log(`Server running on http://localhost:${PORT}`)
});