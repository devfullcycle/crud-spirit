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
// POST /projects
// POST /projects/start
// POST /projects/finish
// POST /projects/cancel
// PATCH /projects
// DELETE /projects
// GET /projects
app.patch("/projects/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    started_at,
    cancelled_at,
    finished_at,
    forecasted_at,
  } = req.body;
  const project = await projectService.update(id, {
    name,
    description,
    started_at: started_at ? new Date(started_at) : null,
    cancelled_at: cancelled_at ? new Date(cancelled_at) : null,
    finished_at: finished_at ? new Date(finished_at) : null,
    forecasted_at: forecasted_at ? new Date(forecasted_at) : null,
  });
  res.json(project);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
