import crypto from "crypto";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

export enum ProjectStatus {
  Pending = "pending",
  Active = "active",
  Cancelled = "cancelled",
  Completed = "completed",
}

@Entity()
export class Project {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true, type: "datetime" })
  started_at: Date | null = null;

  @Column({ nullable: true, type: "datetime" })
  cancelled_at: Date | null = null;

  @Column({ nullable: true, type: "datetime" })
  finished_at: Date | null = null;

  @Column({ nullable: true, type: "datetime" })
  forecasted_at: Date | null = null;

  @Column({ type: "simple-enum" })
  status: ProjectStatus = ProjectStatus.Pending;

  @OneToMany(() => Task, (task) => task.project, { eager: true, cascade: true })
  tasks: Task[];

  constructor(
    props: {
      name: string;
      description: string;
      started_at?: Date | null;
      cancelled_at?: Date | null;
      finished_at?: Date | null;
      forecasted_at?: Date | null;
    },
    id?: string
  ) {
    Object.assign(this, props);
    this.id = id ?? crypto.randomUUID();
  }

}

export enum TaskStatus {
  Pending = "pending",
  Active = "active",
  Cancelled = "cancelled",
  Completed = "completed",
}

@Entity()
export class Task {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true, type: "datetime" })
  started_at: Date | null = null;

  @Column({ nullable: true, type: "datetime" })
  cancelled_at: Date | null = null;

  @Column({ nullable: true, type: "datetime" })
  finished_at: Date | null = null;

  @Column({ nullable: true, type: "datetime" })
  forecasted_at: Date | null = null;

  @Column({ type: "simple-enum" })
  status = TaskStatus.Pending;

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  constructor(
    props: {
      name: string;
      description: string;
      started_at?: Date | null;
      cancelled_at?: Date | null;
      finished_at?: Date | null;
      forecasted_at?: Date | null;
    },
    id?: string
  ) {
    Object.assign(this, props);
    this.id = id ?? crypto.randomUUID();
  }

  
}
