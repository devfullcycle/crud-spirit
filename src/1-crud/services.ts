import { Repository } from "typeorm";
import { Project, ProjectStatus, TaskStatus } from "./entities";

export class ProjectService {
  constructor(private projectRepo: Repository<Project>) {}

  findAll(): Promise<Project[]> {
    return this.projectRepo.find();
  }

  findOne(id: string): Promise<Project> {
    return this.projectRepo.findOneOrFail({ where: { id } });
  }

  create(props: {
    name: string;
    description: string;
    started_at?: Date | null;
    forecasted_at?: Date | null;
  }) {
    const project = new Project({
      name: props.name,
      description: props.description,
      started_at: props.started_at,
      forecasted_at: props.forecasted_at,
    });

    if(props.started_at){
      project.started_at = props.started_at;
      project.status = ProjectStatus.Active;
    }

    return this.projectRepo.save(project);
  }

  async update(
    id: string,
    props: {
      name?: string;
      description?: string;
      started_at?: Date | null;
      cancelled_at?: Date | null;
      finished_at?: Date | null;
      forecasted_at?: Date | null;
    }
  ) {
    const project = await this.projectRepo.findOneOrFail({ where: { id } });
    props.name && (project.name = props.name);
    props.description && (project.description = props.description);
    props.forecasted_at && (project.forecasted_at = props.forecasted_at);

    if (props.started_at) {
      if (project.status === ProjectStatus.Active) {
        throw new Error("Cannot start active project");
      }

      if (project.status === ProjectStatus.Completed) {
        throw new Error("Cannot start completed project");
      }

      if (project.status === ProjectStatus.Cancelled) {
        throw new Error("Cannot start cancelled project");
      }

      project.started_at = props.started_at;
      project.status = ProjectStatus.Active;
    }

    if (props.cancelled_at) {
      if (project.status === ProjectStatus.Completed) {
        throw new Error("Cannot cancel completed project");
      }

      if (project.status === ProjectStatus.Cancelled) {
        throw new Error("Cannot cancel cancelled project");
      }

      if (props.cancelled_at < project.started_at!) {
        throw new Error("Cannot cancel project before it started");
      }

      project.cancelled_at = props.cancelled_at;
      project.status = ProjectStatus.Cancelled;

      if (!project.tasks) {
        return;
      }

      const pendingOrActiveTasks = project.tasks.filter(
        (task) => task.status === TaskStatus.Pending
      );
      pendingOrActiveTasks.forEach(
        (task) => (task.cancelled_at = props.cancelled_at!)
      );
    }

    if (props.finished_at) {
      if (project.status === ProjectStatus.Completed) {
        throw new Error("Cannot complete completed project");
      }

      if (project.status === ProjectStatus.Cancelled) {
        throw new Error("Cannot complete cancelled project");
      }

      if (props.finished_at! < project.started_at!) {
        throw new Error("Cannot complete project before it started");
      }

      project.finished_at = props.finished_at;
      project.status = ProjectStatus.Completed;

      if (!project.tasks) {
        return;
      }

      const pendingOrActiveTasks = project.tasks.filter(
        (task) =>
          task.status === TaskStatus.Pending ||
          task.status === TaskStatus.Active
      );

      if (pendingOrActiveTasks.length > 0) {
        throw new Error("Cannot complete project with pending or active tasks");
      }
    }

    return this.projectRepo.save(project);
  }

}
