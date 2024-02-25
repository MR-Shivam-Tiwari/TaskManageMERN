import React, { useState, useEffect } from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Stack from "@mui/joy/Stack";
import { useNavigate } from "react-router-dom";
function ItemManage() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [Edit, setEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const navigate = useNavigate();
  const handlelogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleSearch = () => {
    const filterdTask = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTasks(filterdTask);
  };
  useEffect(() => {
    // Fetch tasks when the component mounts
    fetchTasks();
  }, []);
  const [editedTask, setEditedTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTasks(data);
      } else {
        console.error("Failed to fetch tasks:", data.message);
      }
    } catch (error) {
      console.error("Error during task fetch:", error.message);
    }
  };

  const handleTaskCreate = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Task created successfully:", data);
        // Optionally, you can fetch tasks again to update the task list
        fetchTasks();
        setNewTask({
          title: "",
          description: "",
          dueDate: "",
        });
      } else {
        console.error("Failed to create task:", data.message);
      }
    } catch (error) {
      console.error("Error during task creation:", error.message);
    }
  };

  const handleTaskUpdate = async (taskId, updatedTaskData) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTaskData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Task updated successfully:", data);
        // Optionally, you can fetch tasks again to update the task list
        fetchTasks();
        setEditingTask(null); // Clear editing task
      } else {
        console.error("Failed to update task:", data.message);
      }
    } catch (error) {
      console.error("Error during task update:", error.message);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Task deleted successfully:", data);
        // Optionally, you can fetch tasks again to update the task list
        fetchTasks();
      } else {
        console.error("Failed to delete task:", data.message);
      }
    } catch (error) {
      console.error("Error during task deletion:", error.message);
    }
  };
  const handleCompletedClick = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/taskscompleted/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: !tasks.completed }), // Toggle the completed value
        }
      );

      const updatedTask = await response.json();

      if (response.ok) {
        // Assuming setTasks is a state setter function
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === taskId ? updatedTask : t))
        );
      } else {
        console.error("Failed to update task:", updatedTask.message);
      }
    } catch (error) {
      console.error("Error during task update:", error.message);
    }
  };

  return (
    <div>
      <div className="text-center">
        <div className="d-flex align-items-center justify-content-between mb-3 ">
          <h2 className="">Task Management</h2>

          <Button
            className="d-flex gap-2 align-items-center "
            variant="outlined"
            onClick={handlelogout}
          >
            Logout
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-box-arrow-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
              />
              <path
                fill-rule="evenodd"
                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
              />
            </svg>
          </Button>
        </div>
        <div className="row mb-4">
          <div className=" col-12 col-lg-6 mb-3" >
            <div className="d-flex gap-2 ">
              <Input
              fullWidth
                className="rounded-4"
                type="text"
                placeholder="Search Tasks.."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              ></Input>
              <Button
                color="neutral"
                className="rounded-4"
                onClick={handleSearch}
              >
                {" "}
                Search
              </Button>
            </div>
          </div>
          <div className="col-12 col-lg-6 mb-2">
            <Button
            fullWidth
              className="d-flex gap-2 "
              color="primary"
              onClick={() => setOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                fill="currentColor"
                class="bi bi-clipboard2-plus"
                viewBox="0 0 16 16"
              >
                <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z" />
                <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z" />
                <path d="M8.5 6.5a.5.5 0 0 0-1 0V8H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V9H10a.5.5 0 0 0 0-1H8.5z" />
              </svg>
              Create Task
            </Button>
          </div>
        </div>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogContent>Fill in the information of the Task.</DialogContent>
            <form
              onSubmit={(event) => {
                setOpen(false);
              }}
            >
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>Task Name</FormLabel>
                  <Input
                    placeholder="Title"
                    type="text"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    autoFocus
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Due Date</FormLabel>
                  <Input
                    type="number"
                    placeholder="Due Date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    required
                  />
                </FormControl>
                <Button type="submit" onClick={handleTaskCreate}>
                  Submit
                </Button>
              </Stack>
            </form>
          </ModalDialog>
        </Modal>

        <div>
          <h3>Your Tasks</h3>
          <div className="row">
            {tasks.map((task) => (
              <div className=" col-12 col-lg-4 p-2" key={task._id}>
                <div
                  className="card mb-3 text-start p-2 rounded-3 "
                  style={{ background: "#5d5d5d", height: "350px" }}
                >
                  <div
                    className=" mb-3 text-start p-2 rounded-3  "
                    style={{ background: "#d7dbde" }}
                  >
                    <strong>{task.title}</strong>
                    <p>{task.description}</p>
                    <p>Due: {task.dueDate} days remaining</p>
                  </div>
                  <Button
                    className="mb-2 m-2 text-white"
                    variant="soft"
                    style={{
                      backgroundColor: task.completed ? "green" : "red",
                    }}
                    onClick={() => handleCompletedClick(task._id)}
                  >
                    {task.completed ? "Completed" : " Incomplete"}
                  </Button>

                  <Button
                    variant="soft"
                    className="mb-2 m-2"
                    onClick={() => {
                      setEditingTask(task._id);
                      setEdit(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="soft"
                    className="mb-3 m-2"
                    onClick={() => handleTaskDelete(task._id)}
                  >
                    Delete
                  </Button>
                  {editingTask === task._id && (
                    <Modal open={Edit} onClose={() => setEdit(false)}>
                      <ModalDialog>
                        <div className="fw-bold">Edit Task</div>
                        <div>
                          <div>
                            <Input
                              className="mb-2"
                              type="text"
                              placeholder="New Title"
                              value={editedTask.title}
                              onChange={(e) =>
                                setEditedTask({
                                  ...editedTask,
                                  title: e.target.value,
                                })
                              }
                            />
                            <Input
                              className="mb-2"
                              type="text"
                              placeholder="New Description"
                              value={editedTask.description}
                              onChange={(e) =>
                                setEditedTask({
                                  ...editedTask,
                                  description: e.target.value,
                                })
                              }
                            />
                            <Input
                              className="mb-2"
                              type="text"
                              placeholder="New Due Date"
                              value={editedTask.dueDate}
                              onChange={(e) =>
                                setEditedTask({
                                  ...editedTask,
                                  dueDate: e.target.value,
                                })
                              }
                            />
                          </div>
                          {/* Button to save changes */}
                          <Button
                            fullWidth
                            onClick={() => {
                              handleTaskUpdate(task._id, editedTask);
                              setEditingTask(null);
                            }}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </ModalDialog>
                    </Modal>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemManage;
