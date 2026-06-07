INSERT INTO chippit_ai_employees (id, name, role, description, status, autonomy, current_project, tools, sort_order)
VALUES
  ('intakebee', 'IntakeBee', 'AI Front Desk Employee', 'Handles customer calls, identifies intent, and routes questions to the right AI employee.', 'Routing call', 'Low', 'Your business Test Call', ARRAY['Call Transcript','Gmail','Knowledge Base'], 1),
  ('customer requestbee', 'ScheduleBee', 'AI Request Coordinator', 'Handles customer request questions, author customer requests, RSVPs, and customer request-related staff tasks.', 'Needs review', 'Low', 'Customer Group Request Request', ARRAY['Google Calendar','Slack','Knowledge Base'], 2),
  ('followupbee', 'FollowUpBee', 'AI Order Assistant', 'Handles online order and follow-up questions.', 'Ready', 'Low', 'Online Order Pickup', ARRAY['Gmail','Google Sheets','Knowledge Base'], 3),
  ('policybee', 'PolicyBee', 'AI Used-Books Assistant', 'Handles policy handoff and buying-policy questions.', 'Updated', 'Low', 'Used-Book Drop-off Policy', ARRAY['Google Drive','Knowledge Base','Gmail'], 4),
  ('opsbee', 'OpsBee', 'AI Operations Employee', 'Turns calls and staff messages into tasks, internal updates, and daily summaries.', 'Posting update', 'Medium', 'Staff Task Summary', ARRAY['Slack','Tasks','Calendar'], 5),
  ('managerbee', 'ManagerBee', 'AI Manager', 'Reviews risky actions, blocks unsafe responses, and manages review flow.', 'Strict review mode', 'Low', 'Review Inbox', ARRAY['Review Inbox','Activity Logs','Gmail','Slack'], 6)
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
  ('workspace-call', 'Your business Customer Call', 'Needs review', 'Today', ARRAY['IntakeBee','ScheduleBee','FollowUpBee','PolicyBee','ManagerBee'], 1, 1, 'Customer asked about bringing a 12-person customer group to an customer request, picking up an online order, and dropping off policy questions on the same day.', 'Approve the customer response after ScheduleBee confirms staff availability language.', 1),
  ('tool-connections', 'workspace Tool Connections', 'Ready', 'Today', ARRAY['IntakeBee','ScheduleBee','FollowUpBee','PolicyBee','OpsBee'], 0, 0, 'Gmail, Slack, Calendar, Drive, Sheets, Knowledge Base, Tasks, and Review Inbox are staged for the demo.', 'Run the test workflow from the working room.', 2),
  ('daily-summary', 'workspace Daily Summary', 'On Track', 'Today', ARRAY['OpsBee','ManagerBee'], 0, 0, 'OpsBee prepared a staff summary from the customer call.', 'Post the internal summary after the customer response is approved.', 3)
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
  ('task-bookclub-customer request', 'workspace-call', 'Waiting on Human', 'Confirm if 12-person customer group can attend customer request', 'ScheduleBee', 'Google Calendar', 'Today', 'High', 92, 'Needs staff review', TRUE, 'Do not promise customer request seating until staff confirms availability.', 1),
  ('task-follow-up-guidance', 'workspace-call', 'Done', 'Prepare customer follow-up guidance', 'FollowUpBee', 'Order FAQ', 'Today', 'Low', 94, 'Ready', FALSE, NULL, 2),
  ('task-policys', 'workspace-call', 'Waiting on Human', 'Send policy appointment instructions', 'PolicyBee', 'Drive policy', 'Today', 'High', 89, 'Needs review', TRUE, 'Policy handoff guidance is customer-facing policy guidance.', 3),
  ('task-callback-draft', 'workspace-call', 'Waiting on Human', 'Draft customer callback response', 'IntakeBee', 'Call transcript', 'Today', 'High', 93, 'Needs review', TRUE, 'Customer response mentions schedule availability and policy policy.', 4),
  ('task-staff-update', 'workspace-call', 'Done', 'Post internal staff update', 'OpsBee', 'Slack', 'Today', 'Low', 98, 'Ready', FALSE, NULL, 5),
  ('task-manager-rule', 'tool-connections', 'Done', 'Make ManagerBee strict for all customer-facing messages', 'ManagerBee', 'Review policy', 'Done', 'Low', 99, 'Auto-approved', FALSE, NULL, 6),
  ('task-policy-readonly', 'tool-connections', 'Done', 'Make PolicyBee read-only for same-day handoff promises', 'PolicyBee', 'User direction', 'Done', 'Low', 96, 'Updated', FALSE, NULL, 7)
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
    'Send workspace customer response',
    'IntakeBee + ScheduleBee + PolicyBee',
    'Mentions schedule availability and policy handoff policy',
    'Needs review',
    'Your business callback response',
    ARRAY[
      'Hi! Thanks for calling Your business. We would love to help your customer group plan around the customer request.',
      'For a group of 12, our customer requests team should confirm space before we promise seating. For your online order, our team can help with follow-up timing.',
      'For policy questions, buying and handoff may require appointment instructions, so we can send those details as well.'
    ],
    ARRAY[
      'Hi! Thanks for calling Your business. We would love to help your customer group join us for the customer request.',
      'For 12 people, we should have staff confirm space before we promise seating. We can also help with your customer follow-up and send the right policy handoff instructions.'
    ],
    ARRAY['Customer call transcript','Google Calendar','Knowledge Base','Gmail','Policy policy'],
    'Make it shorter and more casual.',
    1
  ),
  ('a2', 'Confirm schedule capacity language', 'ScheduleBee', 'Request availability promise', 'Needs review', 'Book club schedule capacity', ARRAY['ScheduleBee recommends not promising seating until staff confirms availability.'], ARRAY['ScheduleBee recommends a warm note that staff will gladly help confirm the best customer request plan for the customer group.'], ARRAY['Google Calendar','Request policy'], 'Make it warm and community-focused.', 2),
  ('a3', 'Post internal staff update', 'OpsBee', 'Internal staff update', 'Auto-approved', 'workspace staff update', ARRAY['OpsBee prepared the internal staff update for Slack.'], ARRAY['OpsBee prepared the internal staff update for Slack.'], ARRAY['Customer call transcript'], '', 3),
  ('a4', 'Send policy handoff guidance', 'PolicyBee', 'Customer-facing policy policy', 'Needs review', 'Policy appointment guidance', ARRAY['PolicyBee drafted handoff guidance and routed it to review.'], ARRAY['PolicyBee drafted a shorter policy appointment note and kept same-day promises blocked.'], ARRAY['Policy policy','Google Drive'], 'Make it concise and do not promise same-day handoff.', 4)
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

INSERT INTO chippit_call_lines (id, speaker, line_text, tick, sort_order)
VALUES
  ('line-1', 'Customer', 'Hi, I am calling about the customer request. I want to bring my customer group, maybe 12 people.', 0, 1),
  ('line-2', 'Customer', 'I also ordered a copy online and want to pick it up before the customer request.', 1, 2),
  ('line-3', 'Customer', 'And I have a box of policy questions I wanted to drop off.', 2, 3),
  ('line-4', 'Customer', 'Can I do all of that the same day?', 3, 4),
  ('line-5', 'IntakeBee', 'I detected customer request, order follow-up, and policy handoff intents. Routing now.', 4, 5)
ON CONFLICT (id) DO UPDATE SET
  speaker = EXCLUDED.speaker,
  line_text = EXCLUDED.line_text,
  tick = EXCLUDED.tick,
  sort_order = EXCLUDED.sort_order;

INSERT INTO chippit_call_detections (id, label, value, tick, sort_order)
VALUES
  ('det-customer request', 'Intent 1 detected', 'Request group attendance', 1, 1),
  ('det-order', 'Intent 2 detected', 'Online order follow-up', 2, 2),
  ('det-policys', 'Intent 3 detected', 'Policy handoff question', 3, 3),
  ('det-policy', 'Policy detected', 'Request availability and customer-facing messages need review', 4, 4),
  ('det-risk', 'Risk detected', 'Do not promise seating or same-day handoff before review', 5, 5)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  value = EXCLUDED.value,
  tick = EXCLUDED.tick,
  sort_order = EXCLUDED.sort_order;

INSERT INTO chippit_call_agent_actions (id, agent, body, tick, sort_order)
VALUES
  ('act-frontdesk', 'IntakeBee', 'Split the customer call into 3 routed tasks.', 2, 1),
  ('act-customer request', 'ScheduleBee', 'Checked Calendar and found staff confirmation is needed for 12-person attendance.', 3, 2),
  ('act-order', 'FollowUpBee', 'Prepared customer follow-up guidance from the order FAQ.', 4, 3),
  ('act-policy', 'PolicyBee', 'Checked Drive policy and blocked same-day handoff promises.', 5, 4),
  ('act-manager', 'ManagerBee', 'Created an review card for the customer response.', 6, 5),
  ('act-ops', 'OpsBee', 'Prepared a Slack update and staff tasks.', 7, 6)
ON CONFLICT (id) DO UPDATE SET
  agent = EXCLUDED.agent,
  body = EXCLUDED.body,
  tick = EXCLUDED.tick,
  sort_order = EXCLUDED.sort_order;
