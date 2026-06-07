CREATE TABLE IF NOT EXISTS chippit_ai_employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  autonomy TEXT NOT NULL,
  current_project TEXT NOT NULL,
  tools TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chippit_projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  deadline TEXT NOT NULL,
  team TEXT[] NOT NULL DEFAULT '{}',
  blockers INTEGER NOT NULL DEFAULT 0,
  approvals INTEGER NOT NULL DEFAULT 0,
  summary TEXT NOT NULL DEFAULT '',
  next_action TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chippit_project_tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES chippit_projects(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  title TEXT NOT NULL,
  owner TEXT NOT NULL,
  source TEXT NOT NULL,
  due_label TEXT NOT NULL,
  risk TEXT NOT NULL,
  confidence INTEGER,
  status TEXT NOT NULL,
  requires_approval BOOLEAN NOT NULL DEFAULT FALSE,
  reason TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chippit_approvals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  agent TEXT NOT NULL,
  risk TEXT NOT NULL,
  status TEXT NOT NULL,
  subject TEXT NOT NULL,
  draft TEXT[] NOT NULL DEFAULT '{}',
  revised_draft TEXT[] NOT NULL DEFAULT '{}',
  context_sources TEXT[] NOT NULL DEFAULT '{}',
  revision_prompt TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chippit_inbox_messages (
  id TEXT PRIMARY KEY,
  channel TEXT NOT NULL,
  agent TEXT NOT NULL,
  time_label TEXT NOT NULL,
  body TEXT NOT NULL,
  actions TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chippit_activity_events (
  id TEXT PRIMARY KEY,
  time_label TEXT NOT NULL,
  actor TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chippit_knowledge_sources (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  source_type TEXT NOT NULL,
  used_by TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'Indexed',
  extracted_fact TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chippit_call_lines (
  id TEXT PRIMARY KEY,
  speaker TEXT NOT NULL,
  line_text TEXT NOT NULL,
  tick INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS chippit_call_detections (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  tick INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS chippit_call_agent_actions (
  id TEXT PRIMARY KEY,
  agent TEXT NOT NULL,
  body TEXT NOT NULL,
  tick INTEGER NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

INSERT INTO chippit_ai_employees (id, name, role, description, status, autonomy, current_project, tools, sort_order)
VALUES
  ('supportbee', 'SupportBee', 'Customer support', 'Answers common questions and drafts customer-ready replies.', 'Listening', 'Low', 'Customer Follow-up Flow', ARRAY['Calls','FAQ','Reviews'], 1),
  ('taskbee', 'TaskBee', 'Project operations', 'Creates tasks, owners, deadlines, and follow-up plans from messy inputs.', 'Waiting for review', 'Low', 'Demo Workspace Setup', ARRAY['Tasks','Calendar','Team chat'], 2),
  ('inboxbee', 'InboxBee', 'Inbox triage', 'Routes email, chat, and call follow-ups to the right workflow.', 'Working', 'Medium', 'Lead Follow-up', ARRAY['Inbox','FAQ','Email'], 3),
  ('policybee', 'PolicyBee', 'Policy guardrails', 'Checks business rules before Chippit promises, sends, or changes anything.', 'Active', 'Medium', 'Review Guardrails', ARRAY['Policies','Reviews'], 4),
  ('opsbee', 'OpsBee', 'Workspace operations', 'Turns calls and team messages into tasks, updates, and owners.', 'Active', 'Medium', 'Daily Operating Brief', ARRAY['Calls','Team chat','Tasks'], 5),
  ('managerbee', 'ManagerBee', 'Governance', 'Blocks risky promises and prepares daily summaries.', 'Active', 'Low', 'Morning Brief', ARRAY['Reviews','Policies','Reports'], 6)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  autonomy = EXCLUDED.autonomy,
  current_project = EXCLUDED.current_project,
  tools = EXCLUDED.tools,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

INSERT INTO chippit_projects (id, name, status, deadline, team, blockers, approvals, summary, next_action, sort_order)
VALUES
  ('customer-follow-up', 'Customer Follow-up + Review Flow', 'Waiting on Human', 'Today', ARRAY['SupportBee','InboxBee','PolicyBee'], 1, 2, 'Help a customer understand Chippit without promising scope, timing, or external actions prematurely.', 'Approve the warmer follow-up draft and assign TaskBee to confirm onboarding scope.', 1),
  ('demo-workspace', 'Chippit Demo Workspace Setup', 'At Risk', 'Tomorrow', ARRAY['TaskBee','OpsBee','ManagerBee'], 1, 1, 'Create the Chippit demo workspace and connect the AI employee workflow.', 'Confirm setup scope and review rules.', 2),
  ('inbox-triage', 'Inbox Triage Automation', 'On Track', 'Today', ARRAY['InboxBee','SupportBee'], 0, 0, 'Route inbox follow-ups into Chippit work queues.', 'Keep monitoring incoming customer requests.', 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  status = EXCLUDED.status,
  deadline = EXCLUDED.deadline,
  team = EXCLUDED.team,
  blockers = EXCLUDED.blockers,
  approvals = EXCLUDED.approvals,
  summary = EXCLUDED.summary,
  next_action = EXCLUDED.next_action,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

INSERT INTO chippit_project_tasks (id, project_id, stage, title, owner, source, due_label, risk, confidence, status, requires_approval, reason, sort_order)
VALUES
  ('task-captured-follow-up', 'customer-follow-up', 'Captured', 'Customer asks for follow-up and scope confirmation', 'SupportBee', 'call', 'Today', 'Medium', 96, 'Captured', FALSE, NULL, 1),
  ('task-inbox-route', 'customer-follow-up', 'In Progress', 'Route inbox follow-up request', 'InboxBee', 'call', 'Today', 'Low', 91, 'Working', FALSE, NULL, 2),
  ('task-policy-guidance', 'customer-follow-up', 'In Progress', 'Prepare review policy guidance', 'PolicyBee', 'policy', 'Today', 'Low', 94, 'Active', FALSE, NULL, 3),
  ('task-implementation-plan', 'customer-follow-up', 'Waiting on Human', 'Create implementation plan from call', 'TaskBee', 'review policy', 'Today', 'High', 88, 'Needs review', TRUE, NULL, 4),
  ('task-approve-follow-up', 'customer-follow-up', 'Waiting on Human', 'Approve customer follow-up summary', 'SupportBee', 'call', 'Today', 'High', 92, 'Needs review', TRUE, NULL, 5),
  ('task-block-scope', 'customer-follow-up', 'Blocked', 'Promise onboarding scope', 'ManagerBee', 'governance', 'Blocked', 'High', NULL, 'Blocked', FALSE, 'Do not promise onboarding scope before human review', 6),
  ('task-internal-update', 'customer-follow-up', 'Done', 'Post internal team update', 'OpsBee', 'call', 'Done', 'Low', NULL, 'Auto-approved', FALSE, NULL, 7)
ON CONFLICT (id) DO UPDATE SET
  project_id = EXCLUDED.project_id,
  stage = EXCLUDED.stage,
  title = EXCLUDED.title,
  owner = EXCLUDED.owner,
  source = EXCLUDED.source,
  due_label = EXCLUDED.due_label,
  risk = EXCLUDED.risk,
  confidence = EXCLUDED.confidence,
  status = EXCLUDED.status,
  requires_approval = EXCLUDED.requires_approval,
  reason = EXCLUDED.reason,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

INSERT INTO chippit_approvals (id, title, agent, risk, status, subject, draft, revised_draft, context_sources, revision_prompt, sort_order)
VALUES
  (
    'a1',
    'Send customer follow-up draft',
    'SupportBee + InboxBee',
    'External customer message',
    'Needs review',
    'Chippit setup follow-up',
    ARRAY[
      'Thanks for talking with Chippit today. We can help your team turn customer calls into tasks, route inbox follow-ups, and draft customer-ready responses.',
      'Before anything goes to a customer, Chippit can check your review rules and pause for a human review when the action is external or risky.',
      'I captured your request for call summaries, inbox monitoring, and review-protected replies. I can send over the proposed setup plan next.'
    ],
    ARRAY[
      'Thanks so much for talking with Chippit today. We are excited to help your team turn busy customer conversations into organized, review-safe work.',
      'Chippit can listen to calls, create tasks, monitor inbox follow-ups, and draft customer responses while keeping humans in control of external messages.',
      'Next, we will prepare a simple setup plan for SupportBee, InboxBee, TaskBee, PolicyBee, OpsBee, and ManagerBee so you can review exactly what each AI employee is allowed to do.'
    ],
    ARRAY['Customer call transcript','Inbox workflow FAQ','Review policy','Chippit workspace context'],
    'Make it warmer and add that we are excited to help their team.',
    1
  ),
  ('a2', 'Confirm proposed onboarding scope', 'TaskBee', 'Scope commitment', 'Needs review', 'Onboarding scope confirmation', ARRAY['TaskBee prepared a proposed scope for human review before Chippit promises timing or workflow coverage.'], ARRAY['TaskBee prepared a warmer setup scope note for human review before Chippit promises timing or workflow coverage.'], ARRAY['Customer call transcript','Task context','Review policy'], 'Make the scope confirmation more concise.', 2),
  ('a3', 'Post internal workspace update', 'OpsBee', 'Internal', 'Auto-approved', 'Internal update', ARRAY['OpsBee posted the internal Chippit workspace update.'], ARRAY['OpsBee posted the internal Chippit workspace update.'], ARRAY['Customer call transcript'], '', 3),
  ('a4', 'Send policy review guidance', 'PolicyBee', 'Customer-facing policy message', 'Needs review', 'Review policy guidance', ARRAY['PolicyBee prepared review guidance for the customer-facing response.'], ARRAY['PolicyBee prepared a clearer review guidance note for the customer-facing response.'], ARRAY['Review policy'], 'Make the policy guidance clearer.', 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  agent = EXCLUDED.agent,
  risk = EXCLUDED.risk,
  status = EXCLUDED.status,
  subject = EXCLUDED.subject,
  draft = EXCLUDED.draft,
  revised_draft = EXCLUDED.revised_draft,
  context_sources = EXCLUDED.context_sources,
  revision_prompt = EXCLUDED.revision_prompt,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

INSERT INTO chippit_inbox_messages (id, channel, agent, time_label, body, actions, sort_order)
VALUES
  ('msg-ops', 'customer-workflows', 'OpsBee', '10:37 AM', 'New customer request from call:' || chr(10) || 'A customer asked whether Chippit can turn calls into tasks, monitor inbox follow-ups, and draft replies with approvals.' || chr(10) || chr(10) || 'Actions created:' || chr(10) || '- TaskBee: create setup plan' || chr(10) || '- InboxBee: map inbox follow-up workflow' || chr(10) || '- PolicyBee: check review rules' || chr(10) || '- SupportBee: draft customer follow-up' || chr(10) || chr(10) || 'Risk:' || chr(10) || 'Do not send the customer reply until a human approves.', ARRAY['Approve customer follow-up','Assign to tasks lead','View source transcript'], 1),
  ('msg-project', 'customer-workflows', 'TaskBee', '10:38 AM', 'I found the customer context. Scope and external messaging need human review before we promise anything.', ARRAY[]::TEXT[], 2),
  ('msg-policy', 'customer-workflows', 'PolicyBee', '10:39 AM', 'Review guidance is ready. I am not sending externally until a human approves.', ARRAY['Review guidance'], 3),
  ('msg-manager', 'customer-workflows', 'ManagerBee', '10:40 AM', 'Customer-facing promise is blocked until a human approves the scope response.', ARRAY[]::TEXT[], 4)
ON CONFLICT (id) DO UPDATE SET
  channel = EXCLUDED.channel,
  agent = EXCLUDED.agent,
  time_label = EXCLUDED.time_label,
  body = EXCLUDED.body,
  actions = EXCLUDED.actions,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

INSERT INTO chippit_activity_events (id, time_label, actor, description, sort_order)
VALUES
  ('evt-policy-check', '9:10 AM', 'PolicyBee', 'checked review policy before external reply.', 1),
  ('evt-call-join', '10:30 AM', 'SupportBee', 'joined the customer workflow call.', 2),
  ('evt-request-detected', '10:31 AM', 'TaskBee', 'detected customer setup and follow-up request.', 3),
  ('evt-inbox', '10:32 AM', 'InboxBee', 'retrieved inbox follow-up workflow.', 4),
  ('evt-policy', '10:33 AM', 'PolicyBee', 'retrieved review policy.', 5),
  ('evt-blocked', '10:34 AM', 'ManagerBee', 'blocked external scope promise pending human review.', 6),
  ('evt-project', '10:36 AM', 'OpsBee', 'posted internal update and created the customer request task.', 7)
ON CONFLICT (id) DO UPDATE SET
  time_label = EXCLUDED.time_label,
  actor = EXCLUDED.actor,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

INSERT INTO chippit_knowledge_sources (id, source, source_type, used_by, status, extracted_fact, sort_order)
VALUES
  ('knowledge-company', 'Company context', 'Website', ARRAY['SupportBee','ManagerBee'], 'Indexed', 'Chippit turns calls, messages, and policies into managed AI employee work.', 1),
  ('knowledge-project', 'Task context', 'Website', ARRAY['TaskBee'], 'Indexed', 'External scope commitments should be approved by a human before sending.', 2),
  ('knowledge-policy', 'Review policy', 'Policy', ARRAY['PolicyBee','ManagerBee'], 'Indexed', 'PolicyBee blocks external promises until the relevant review rule is satisfied.', 3),
  ('knowledge-inbox', 'Inbox workflow FAQ', 'FAQ', ARRAY['InboxBee','SupportBee'], 'Indexed', 'Inbox follow-up questions should route through InboxBee and SupportBee.', 4),
  ('knowledge-call', 'Customer call transcript', 'Call', ARRAY['OpsBee','TaskBee'], 'Indexed', NULL, 5)
ON CONFLICT (id) DO UPDATE SET
  source = EXCLUDED.source,
  source_type = EXCLUDED.source_type,
  used_by = EXCLUDED.used_by,
  status = EXCLUDED.status,
  extracted_fact = EXCLUDED.extracted_fact,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

INSERT INTO chippit_call_lines (id, speaker, line_text, tick, sort_order)
VALUES
  ('line-1', 'Caller', 'Hi, I want to understand how Chippit would work for our team.', 0, 1),
  ('line-2', 'Caller', 'Can it turn this call into tasks and a customer follow-up?', 1, 2),
  ('line-3', 'Caller', 'We also need it to watch our inbox and summarize the important messages.', 2, 3),
  ('line-4', 'Caller', 'And before it replies to customers, it should check our review rules.', 3, 4),
  ('line-5', 'Caller', 'Can it draft the response but wait for a human before sending?', 4, 5)
ON CONFLICT (id) DO UPDATE SET
  speaker = EXCLUDED.speaker,
  line_text = EXCLUDED.line_text,
  tick = EXCLUDED.tick,
  sort_order = EXCLUDED.sort_order;

INSERT INTO chippit_call_detections (id, label, value, tick, sort_order)
VALUES
  ('detect-1', 'Intent 1 detected', 'Call-to-task workflow', 1, 1),
  ('detect-2', 'Intent 2 detected', 'Customer follow-up draft', 2, 2),
  ('detect-3', 'Intent 3 detected', 'Inbox monitoring', 3, 3),
  ('detect-4', 'Policy detected', 'Review required before customer replies', 4, 4),
  ('detect-5', 'Risk detected', 'Do not send external messages without human review', 5, 5)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  value = EXCLUDED.value,
  tick = EXCLUDED.tick,
  sort_order = EXCLUDED.sort_order;

INSERT INTO chippit_call_agent_actions (id, agent, body, tick, sort_order)
VALUES
  ('agent-action-1', 'TaskBee', 'Created a task plan from the call and identified owners.', 2, 1),
  ('agent-action-2', 'InboxBee', 'Drafting follow-up guidance using the inbox workflow FAQ.', 3, 2),
  ('agent-action-3', 'PolicyBee', 'Found an review rule. External replies need review.', 4, 3),
  ('agent-action-4', 'OpsBee', 'Creating 3 team tasks and 1 review item.', 5, 4),
  ('agent-action-5', 'ManagerBee', 'Blocking customer-facing send until a human approves the draft.', 6, 5),
  ('agent-action-6', 'SupportBee', 'Customer follow-up summary drafted.', 7, 6)
ON CONFLICT (id) DO UPDATE SET
  agent = EXCLUDED.agent,
  body = EXCLUDED.body,
  tick = EXCLUDED.tick,
  sort_order = EXCLUDED.sort_order;
