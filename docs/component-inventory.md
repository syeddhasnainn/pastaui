# Pasta UI component inventory

Research snapshot: 2026-09-18

Sources:

- https://ui.shadcn.com/docs/directory
- https://ui.shadcn.com/r/registries.json
- https://beui.dev/components/motion/switch

The shadcn registry directory was queried without installing or copying registry code. All 339
visible registry endpoints were requested; 264 returned catalog items during the crawl. The crawl
returned 50,000 items with 37,342 exact names and 26,443 names after basic variant normalization.

## Deduplication rules

- Numbered examples and visual variants belong to one component family.
- Prefixes added by registries do not create new component families.
- A pattern with materially different interaction or accessibility semantics remains distinct.
- Marketing and application sections such as Hero, Pricing, Footer, FAQ, Dashboard, and Login belong
  in the Blocks catalog.
- Pasta UI components are authored locally. Registry entries are used for taxonomy research only.

## Canonical component families

### Actions

- Button
- Button Group
- Copy Button
- Toggle
- Toggle Group
- Toolbar

### Forms

- Checkbox
- Color Picker
- Combobox
- Date Picker
- Field
- File Upload
- Input
- Input Group
- Input OTP
- Label
- Number Field
- Phone Input
- Radio Group
- Rating
- Select
- Slider
- Switch
- Textarea
- Wheel Picker

### Navigation

- Breadcrumb
- Command Menu
- Context Menu
- Dropdown Menu
- Menubar
- Navigation Menu
- Pagination
- Sidebar
- Stepper
- Tabs

### Feedback

- Alert
- Alert Dialog
- Empty State
- Progress
- Skeleton
- Spinner
- Toast
- Tooltip

### Overlays

- Bottom Sheet
- Dialog
- Drawer
- Hover Card
- Popover
- Preview Rail
- Sheet

### Data display

- Attachment
- Avatar
- Badge
- Card
- Carousel
- Chart
- Code Block
- Data Grid
- Data Table
- Kbd
- List
- Marquee
- Meter
- Stat
- Table
- Timeline
- Tree

### Layout and disclosure

- Accordion
- Aspect Ratio
- Collapsible
- Resizable
- Scroll Area
- Separator

### Motion

- Animated List
- Animated Number
- Bloom Menu
- Cursor
- Swipeable List
- Text Animation
- Theme Toggle
- Tilt Card

### AI agents

See [AI component research](./ai-component-research.md) for the dedicated directory audit and
prioritized product taxonomy. The first thirteen Pasta UI collections contain 87 agent-native families
covering conversation, streamed output, execution, approvals, long-running work, permissions, and
durable output.

## Implemented component documentation

The public route currently includes locally authored documentation and previews for:

- Agent Activity
- Agent Status
- AI Sidebar
- Accordion
- Alert
- Alert Dialog
- Approval Card
- Audio Player
- Attachments
- Aspect Ratio
- Avatar
- Background Runs
- Background Inbox
- Badge
- Breadcrumb
- Button
- Button Group
- Card
- Checkbox
- Citations
- Code Block
- Commit
- Collapsible
- Confidence Marker
- Connection State
- Context Breakdown
- Cost Meter
- Dialog
- Document Reference
- Edit Message
- Empty State
- Environment Variables
- File Diff
- File Tree
- Feedback Dialog
- Follow-up Suggestions
- Guardrail Notice
- Image Generation
- Inline Citation
- Input
- Job Progress
- Kbd
- Label
- Link Preview
- Message Bubble
- Message Scroller
- Message Queue
- Memory
- Model Picker
- MCP Server Panel
- Pagination
- Popover
- Progress
- Prompt Input
- Quota Banner
- Permission Grant
- Radio Group
- Reasoning Effort
- Reasoning Text
- Research Report
- Retrieval Chunks
- Schedule Card
- Search Results Tabs
- Shared Conversation
- Select
- Separator
- Skeleton
- Slider
- Spinner
- Switch
- Subagent List
- Table
- Task Card
- Tabs
- Textarea
- Thinking Shimmer
- Toggle
- Toggle Group
- Todo List
- Tool Approval
- Tool Error
- Tool Result
- Tool Timeline
- Tool Group
- Tooltip
- Video Player
- Voice Input
- Email Composer

The catalog structure is data-driven so new component families can be added without changing the
route or documentation layout.
