# AI component research

Research snapshot: 2026-09-18

The shadcn directory was searched read-only across twelve AI-focused registries. No registry source
was installed or copied. The search returned 576 catalog items from:

- `@agentui`
- `@ai-elements`
- `@assistant-ui`
- `@prompt-kit`
- `@scrimui`
- `@inferencesh`
- `@tool-ui`
- `@nexus-ui`
- `@agents-ui`
- `@extend`
- `@gaia`
- `@dominik-ui`

## Product direction

Pasta UI should not compete by republishing baseline primitives. Its public catalog should lead with
opinionated components for agentic applications, streamed interfaces, human approval, code changes,
and rich tool output. Baseline components remain internal building blocks.

## Priority 1: agent conversation

- Message Bubble
- Message Scroller
- Prompt Input
- Streaming Response
- Thinking Shimmer
- Reasoning Text
- Citations
- Message Queue
- Attachments
- Model Picker
- Voice Input

## Priority 1: conversation utilities

- Follow-up Suggestions
- Draft Restore
- Quote Reply
- Edit Message
- Regenerate Menu
- Message Timing

## Priority 1: agent execution

- Todo List / Agent Plan
- Agent Activity
- Tool Result
- Tool Approval
- Approval Card
- File Diff / Reviewable Diff
- Code Block
- Terminal
- Code Runner
- Test Results
- Tool Error

## Priority 2: durable agent work

- Background Runs
- Trace Waterfall
- Job Progress
- Connection State
- Cost Meter
- Context Breakdown
- Memory
- Permission Grant

## Priority 2: rich outputs

- Image Generation
- File Tree
- Retrieval Chunks
- Document Reference
- Research Report
- Data Table
- Chart
- Computer Use
- Link Preview
- Image Gallery

## Priority 2: planning

- Schedule Card
- Prompt Library
- Activity Graph

## Priority 2: background work and collaboration

- Background Inbox
- Tool Timeline
- Quota Banner
- Shared Conversation
- Feedback Dialog
- Reviewable Diff

## Priority 2: realtime agents and generative UI

- Agent Control Bar
- Audio Visualizer
- Live Transcript
- Agent Widget
- Question Flow
- Option List
- Parameter Slider

## Priority 2: answer formats and execution detail

- Spec Sheet
- Map Answer
- Read Aloud
- Math Block
- Inline Citation
- Agent Status
- Task Card
- Tool Group

## Priority 2: agent workspace and developer output

- AI Sidebar
- Commit
- Environment Variables
- JSX Preview

## Priority 2: coordination, trust, and control

- Subagent List
- MCP Server Panel
- Guardrail Notice
- Confidence Marker
- Reasoning Effort

## First Pasta UI collection

The first collection follows the 15 focused agent components surfaced by `@agentui`, authored from
scratch in Pasta UI's visual system:

1. Message Bubble
2. Message Scroller
3. Prompt Input
4. Todo List
5. Code Block
6. Approval Card
7. File Diff
8. Tool Result
9. Streaming Response
10. Image Generation
11. Tool Approval
12. Citations
13. Agent Activity
14. Reasoning Text
15. Thinking Shimmer

## Second Pasta UI collection

The next collection extends the agent workflow beyond a single response:

1. Message Queue
2. Attachments
3. Model Picker
4. Voice Input
5. Terminal
6. Code Runner
7. Test Results
8. Tool Error
9. Trace Waterfall

## Third Pasta UI collection

The operations collection makes longer-running agents observable, recoverable, and governable while
adding the first durable rich-output surface:

1. Background Runs
2. Job Progress
3. Connection State
4. Cost Meter
5. Context Breakdown
6. Memory
7. Permission Grant

## Fourth Pasta UI collection

The rich-output collection turns agent results into inspectable product surfaces instead of plain
message content:

1. File Tree
2. Retrieval Chunks
3. Document Reference
4. Research Report
5. Computer Use

## Fifth Pasta UI collection

Registry metadata from `@ai-elements` and `@tool-ui` exposed another useful cluster around structured
tool output and multimodal results. `Plan` and `Progress Tracker` were intentionally deduplicated
against Todo List and Job Progress.

1. Data Chart
2. Message Draft
3. Transcription
4. Audio Player

## Sixth Pasta UI collection

This collection adds workspace navigation and developer artifacts surfaced by `@agentui`,
`@ai-elements`, and `@tool-ui`. Every component is authored locally; registry metadata was used only
to identify the product pattern.

1. AI Sidebar
2. Commit
3. Environment Variables
4. JSX Preview
5. Link Preview
6. Image Gallery

## Seventh Pasta UI collection

A component-level audit of `@assistant-ui`, `@ai-elements`, and `@tool-ui` identified the remaining
coordination and trust surfaces below. Generic social cards, weather, and commerce results were
deprioritized because they do not strengthen Pasta UI's agent-product positioning.

1. Subagent List
2. MCP Server Panel
3. Guardrail Notice
4. Confidence Marker
5. Reasoning Effort

## Eighth Pasta UI collection

This collection covers the state around a conversation rather than duplicating chat bubbles. The
patterns were confirmed in `@assistant-ui` and were authored locally around Pasta UI's existing
message primitives.

1. Follow-up Suggestions
2. Draft Restore
3. Quote Reply
4. Edit Message
5. Regenerate Menu
6. Message Timing

## Ninth Pasta UI collection

The next registry cluster moves past chat presentation into recurring agent work. The patterns were
identified in `@assistant-ui`, `@ai-elements`, and `@tool-ui`, then authored locally as explainable,
interactive Pasta UI components.

1. Schedule Card
2. Prompt Library
3. Activity Graph

## Tenth Pasta UI collection

Targeted registry searches confirmed another product-level cluster: durable background results,
usage boundaries, shared work, and code review. These are authored locally and deduplicated against
File Diff, Background Runs, and the existing feedback primitives.

1. Background Inbox
2. Tool Timeline
3. Quota Banner
4. Shared Conversation
5. Feedback Dialog
6. Reviewable Diff

## Eleventh Pasta UI collection

Metadata from `@agents-ui`, `@inferencesh`, and `@tool-ui` exposed two adjacent product surfaces:
live multimodal sessions and declarative interfaces returned by tools. Pasta UI treats generated UI
as a constrained schema instead of evaluating arbitrary component code.

1. Agent Control Bar
2. Audio Visualizer
3. Live Transcript
4. Agent Widget
5. Question Flow
6. Option List
7. Parameter Slider

## Twelfth Pasta UI collection

Targeted `@assistant-ui` searches exposed structured answer types and execution summaries that are
not covered by a chat bubble or generic card. Each component keeps the returned information
inspectable while fitting the same restrained neutral visual system.

1. Spec Sheet
2. Map Answer
3. Read Aloud
4. Math Block
5. Inline Citation
6. Agent Status
7. Task Card
8. Tool Group

## Registry coverage and deduplication ledger

The remaining AI-facing registries were re-audited by metadata after the twelfth collection. The
catalog is intentionally normalized by product behavior instead of registry item name:

- `@nexus-ui`: Questions maps to Question Flow; Chain of Thought maps to Agent Activity; Thread maps
  to Message Scroller; Tool maps to Tool Result. No new family was needed.
- `@tool-ui`: Order Summary, Preferences Panel, and Video Player were new. Geo Map, Audio, Chart,
  Data Table, and Code Diff map to existing families.
- `@gaia`: Search Results Tabs and Email Composer were new. Tool Calls, Composer,
  Link Preview, and chart variants map to existing families.
- `@dominik-ui`: Permission Selector maps to Permission Grant; Command Tabs and loaders are generic
  presentation variants rather than new product behavior.

Block-level products such as Artifact Workspace, RAG Workspace, Image Studio, Agent Console, and
Support Copilot belong in a future Blocks catalog. They are not misclassified as single components.

## Thirteenth Pasta UI collection

This collection turns agent tool results into complete interactive product surfaces rather than
plain JSON or generic cards.

1. Order Summary
2. Preferences Panel
3. Video Player
4. Search Results Tabs
5. Email Composer
