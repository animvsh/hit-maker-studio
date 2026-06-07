import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bot, GripVertical, Plus, Sparkles } from "lucide-react";
import { ChippitTask, getChippitProjects } from "@/lib/api/chippit.functions";

export const Route = createFileRoute("/app/projects")({
  loader: () => getChippitProjects(),
  component: TasksLayout,
});

type LaneId = "todo" | "progress" | "done";

type BoardTask = ChippitTask & {
  lane: LaneId;
  assignedTo: string;
};

const lanes: Array<{ id: LaneId; title: string; hint: string }> = [
  { id: "todo", title: "Todo", hint: "Captured work waiting for an owner" },
  { id: "progress", title: "In Progress", hint: "AI employees actively working" },
  { id: "done", title: "Done", hint: "Completed or ready to archive" },
];

const aiEmployees = [
  "IntakeBee",
  "FollowUpBee",
  "OpsBee",
  "PolicyBee",
  "ScheduleBee",
  "ManagerBee",
];

function TasksLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/app/projects") return <Outlet />;
  return <TasksBoard />;
}

function normalizeLane(task: ChippitTask): LaneId {
  if (task.stage === "Done") return "done";
  if (task.stage === "In Progress") return "progress";
  return "todo";
}

function TasksBoard() {
  const { tasks } = Route.useLoaderData();
  const initialTasks = useMemo(
    () =>
      tasks.map((task) => ({
        ...task,
        lane: normalizeLane(task),
        assignedTo: task.owner || "OpsBee",
      })),
    [tasks],
  );
  const [boardTasks, setBoardTasks] = useState<BoardTask[]>(initialTasks);
  const [newEmployee, setNewEmployee] = useState("");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  function moveTask(taskId: string, lane: LaneId) {
    setBoardTasks((items) =>
      items.map((item) =>
        item.id === taskId
          ? {
              ...item,
              lane,
              stage: lane === "todo" ? "Captured" : lane === "progress" ? "In Progress" : "Done",
            }
          : item,
      ),
    );
  }

  function assignTask(taskId: string, assignedTo: string) {
    setBoardTasks((items) =>
      items.map((item) => (item.id === taskId ? { ...item, assignedTo, owner: assignedTo } : item)),
    );
  }

  function createEmployeeForTask(taskId: string) {
    const role = newEmployee.trim() || "CustomBee";
    setBoardTasks((items) =>
      items.map((item) => (item.id === taskId ? { ...item, assignedTo: role, owner: role } : item)),
    );
    setNewEmployee("");
  }

  return (
    <div className="mx-auto max-w-[1700px] px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Tasks</p>
          <h1 className="mt-2 text-4xl md:text-5xl">AI task board</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Drag work between Todo, In Progress, and Done. Assign each task to an AI employee or
            create a new one for the job.
          </p>
        </div>
        <div className="smooth-card rounded-2xl border border-border bg-card p-2">
          <div className="flex gap-2">
            <input
              value={newEmployee}
              onChange={(event) => setNewEmployee(event.target.value)}
              placeholder="New employee name"
              className="min-w-0 rounded-xl bg-background px-3 py-2 text-sm outline-none"
            />
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
              <Bot className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {lanes.map((lane) => {
          const laneTasks = boardTasks.filter((task) => task.lane === lane.id);
          return (
            <section
              key={lane.id}
              data-lane={lane.id}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (draggedTaskId) moveTask(draggedTaskId, lane.id);
                setDraggedTaskId(null);
              }}
              className="min-h-[420px] rounded-3xl border border-border bg-secondary/60 p-3"
            >
              <div className="flex items-start justify-between gap-3 px-2 py-2">
                <div>
                  <h2 className="text-lg font-medium">{lane.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{lane.hint}</p>
                </div>
                <span className="rounded-full bg-card px-2.5 py-1 text-xs text-muted-foreground">
                  {laneTasks.length}
                </span>
              </div>
              <div className="mt-2 space-y-3">
                {laneTasks.map((task) => (
                  <article
                    key={task.id}
                    draggable
                    onDragStart={() => setDraggedTaskId(task.id)}
                    onDragEnd={() => setDraggedTaskId(null)}
                    className="clickable-card rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="flex items-start gap-3">
                      <GripVertical className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium leading-snug">{task.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Source: {task.source} · Due {task.due_label}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                      <select
                        value={task.assignedTo}
                        onChange={(event) => assignTask(task.id, event.target.value)}
                        className="smooth-action rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      >
                        {[...new Set([task.assignedTo, ...aiEmployees])].map((employee) => (
                          <option key={employee} value={employee}>
                            {employee}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => createEmployeeForTask(task.id)}
                        className="smooth-action inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm font-medium"
                      >
                        <Plus className="h-4 w-4" />
                        New
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                      <span className="rounded-full bg-accent/30 px-2 py-1 text-primary">
                        {task.assignedTo}
                      </span>
                      {task.requires_approval && (
                        <span className="rounded-full bg-secondary px-2 py-1 text-muted-foreground">
                          Needs review
                        </span>
                      )}
                      {task.confidence && (
                        <span className="rounded-full bg-secondary px-2 py-1 text-muted-foreground">
                          {task.confidence}% confident
                        </span>
                      )}
                    </div>
                  </article>
                ))}

                {laneTasks.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-border bg-card/60 p-6 text-center text-sm text-muted-foreground">
                    Drop a task here
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <div className="smooth-card mt-5 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
        <Sparkles className="mr-2 inline h-4 w-4 text-accent" />
        Tip: drag any card, or use the assignment menu to hand work to a specific AI employee.
      </div>
    </div>
  );
}
