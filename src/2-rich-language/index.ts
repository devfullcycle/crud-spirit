import express from "express";
import { DataSource } from "typeorm";
import { Project, Task } from "./entities";
import { ProjectService } from "./services";

const app = express();

app.use(express.json());

const dataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  entities: [Project, Task],
  synchronize: true,
});

dataSource
  .initialize()
  .then(() => {
    console.log("Database initialized");
  })
  .catch((err) => {
    console.error(err);
  });

const projectService = new ProjectService(
  dataSource.manager.getRepository(Project)
);

app.get("/projects", async (req, res) => {
  const projects = await projectService.findAll();
  res.json(projects);
});

app.post("/projects", async (req, res) => {
  const {
    name,
    description,
    started_at = null,
    forecasted_at = null,
  } = req.body;
  const project = await projectService.create({
    name,
    description,
    started_at: started_at ? new Date(started_at) : null,
    forecasted_at: forecasted_at ? new Date(forecasted_at) : null,
  });
  res.json(project);
});

app.post("/projects/:id/start", async (req, res) => {
  const { id } = req.params;
  const { started_at } = req.body;
  const project = await projectService.start(id, new Date(started_at));
  res.json(project);
});

app.post("/projects/:id/cancel", async (req, res) => {
    const { id } = req.params;
    const { cancelled_at } = req.body;
    const project = await projectService.cancel(id, new Date(cancelled_at));
    res.json(project);
});

app.post("/projects/:id/complete", async (req, res) => {
    const { id } = req.params;
    const { finished_at } = req.body;
    const project = await projectService.complete(id, new Date(finished_at));
    res.json(project);
});

app.post("/projects/:id/tasks", async (req, res) => {
    const { id } = req.params;
    const {
        name,
        description,
        started_at = null,
        finished_at = null,
        forecasted_at = null,
    } = req.body;
    const task = await projectService.addTask({
        project_id: id,
        name,
        description,
        started_at: started_at ? new Date(started_at) : null,
        finished_at: finished_at ? new Date(finished_at) : null,
        forecasted_at: forecasted_at ? new Date(forecasted_at) : null,
    });
    res.json(task);
});

app.put("/projects/:id", async (req, res) => {
    const { id } = req.params;
    const { name, description, forecasted_at = null } = req.body;
    const project = await projectService.update(id, {
        name,
        description,
        forecasted_at: forecasted_at ? new Date(forecasted_at) : null,
    });
    res.json(project);
});

app.post("/projects/:id/tasks/:task_id/start", async (req, res) => {
    const { id, task_id } = req.params;
    const { started_at } = req.body;
    const task = await projectService.startTask(id, task_id, new Date(started_at));
    res.json(task);
});

app.post("/projects/:id/tasks/:task_id/cancel", async (req, res) => {
    const { id, task_id } = req.params;
    const { cancelled_at } = req.body;
    const task = await projectService.cancelTask(id, task_id, new Date(cancelled_at));
    res.json(task);
});

app.post("/projects/:id/tasks/:task_id/complete", async (req, res) => {
    const { id, task_id } = req.params;
    const { finished_at } = req.body;
    const task = await projectService.completeTask(id, task_id, new Date(finished_at));
    res.json(task);
});

app.put("/projects/:id/tasks/:task_id", async (req, res) => {
    const { id, task_id } = req.params;
    const { name, description, forecasted_at = null } = req.body;
    const task = await projectService.updateTask(id, task_id, {
        name,
        description,
        forecasted_at: forecasted_at ? new Date(forecasted_at) : null,
    });
    res.json(task);
});


app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
