# AGENTS.md

## Project Overview
This project is a **Garments Machine Maintenance and Rent Machine Management Web App**.

The goal is to build a simple, practical, low-cost web application for garments factory users to manage:
- machine master
- rent machines
- vendors
- agreements
- machine allocation
- return/replace flow
- breakdown complaints
- preventive maintenance
- technician work updates
- spare parts basic tracking
- reports and dashboard

---

## Current Phase
The current phase is:

**Frontend-only prototype**

Use only:
- HTML
- CSS
- Bootstrap 5
- Vanilla JavaScript

Do not use:
- backend
- database
- API
- React
- Vue
- Tailwind
- TypeScript
- unnecessary third-party libraries

Use:
- static/mock/sample data
- simple file-based structure
- clean page linking
- future-backend-friendly naming and layout

---

## Product Context
This app is for a garments factory.

Primary users:
- Admin
- Maintenance Head
- Supervisor
- Technician
- Production User
- Store User

The UI must be suitable for:
- non-technical users
- quick data entry
- simple workflows
- practical factory use
- desktop and mobile access

---

## Product Principles
Always keep the product:

- simple
- clean
- practical
- low-cost
- responsive
- easy to understand
- easy to expand later

Prioritize:
- usability over decoration
- speed over complexity
- clarity over fancy design

Avoid:
- overengineering
- too many colors
- crowded screens
- complex layouts
- unnecessary animations
- confusing navigation
- overly modern SaaS-style design that reduces usability

---

## UI/UX Rules
Use a clean ERP-style admin layout.

### Layout
- left sidebar navigation
- top header
- main content area
- responsive layout for desktop and mobile
- consistent spacing and alignment

### Components
Use:
- cards
- tables
- forms
- badges
- modals
- dropdowns
- alerts

### Design Rules
- use readable font sizes
- use large enough buttons
- keep forms short and practical
- use clear section headings
- use status badges with clear meaning
- keep tables readable
- use search/filter areas above tables
- keep action buttons visible and easy to understand

### Avoid
- flashy UI
- excessive shadows or gradients
- decorative-only elements
- tiny action buttons
- hidden important actions
- unnecessary charts
- complicated multi-step interactions unless required

---

## Business Scope
The product must support the following business areas in the UI:

1. Authentication UI
2. Dashboard
3. Factory / Floor / Line Setup
4. Machine Master
5. Vendor Management
6. Agreement Management
7. Rent Machine Management
8. Machine Allocation / Transfer
9. Return / Replace
10. Breakdown Ticket
11. Preventive Maintenance
12. Technician Task Pages
13. Spare Parts Basic
14. Reports

---

## Business Logic to Reflect in the Prototype
Reflect these rules in labels, status badges, forms, sample data, and page structure.

### Machine Rules
- machines can be own or rent
- rent machines must be linked to vendor and agreement
- machines have status such as active, breakdown, under maintenance, idle, returned, replaced

### Breakdown Workflow
- production user creates complaint
- supervisor assigns technician
- technician updates work
- ticket is completed and closed

### PM Workflow
- preventive maintenance uses frequency such as daily, weekly, monthly
- due, overdue, completed concepts should appear in the UI

### Rent Machine Workflow
- rent machine is received
- linked to vendor and agreement
- allocated to line/floor
- may be returned or replaced
- return and replacement flow should be visible in the UI

### Spare Parts
- basic stock list
- usage against maintenance activity
- low stock concept should appear in reports/dashboard

---

## Page List
Expected main pages in the prototype include:

- login.html
- dashboard.html
- machines.html
- machine-form.html
- machine-details.html
- rent-machines.html
- rent-machine-form.html
- vendors.html
- vendor-form.html
- agreements.html
- agreement-form.html
- allocation.html
- return-replace.html
- breakdown-list.html
- breakdown-form.html
- ticket-details.html
- pm-schedule.html
- pm-due.html
- technician-tasks.html
- spare-parts.html
- reports.html

More pages may be added if they stay within project scope and remain consistent.

---

## File and Naming Rules
Use clear and business-friendly file names.

Examples:
- machines.html
- machine-form.html
- rent-machines.html
- vendors.html
- agreements.html
- breakdown-list.html
- breakdown-form.html

Use consistent naming for:
- CSS classes
- IDs
- JS functions
- labels
- section names
- page titles

Avoid vague names like:
- page1
- test2
- final-new
- temp-layout

---

## Code Style Rules
### HTML
- write clean and structured HTML
- use semantic sections where practical
- keep indentation clean
- keep page sections clearly separated

### CSS
- keep custom CSS organized
- use Bootstrap first, custom CSS second
- avoid excessive custom styling
- keep styling maintainable

### JavaScript
- use vanilla JavaScript
- keep JS simple and readable
- use JS for UI interactions only
- use mock/static data where needed
- simulate workflow behavior lightly
- do not build fake complex architecture

---

## Reusability Rules
Where practical, keep layout reusable:
- sidebar structure should remain consistent
- header structure should remain consistent
- cards/tables/forms should follow the same style rules
- status badges should use consistent naming and appearance

Try to keep the prototype easy to convert later into:
- PHP
- Laravel
- MySQL-backed application

---

## Sample Data Rules
Always use realistic garments-factory sample data.

Examples:
- machine codes like `MC-1001`
- rent machine codes like `RM-2003`
- vendors with realistic names
- agreement numbers like `AGR-2026-001`
- lines like `Line 01`, `Line 02`
- ticket numbers like `BD-2026-0001`

Use realistic statuses such as:
- Active
- Idle
- Breakdown
- Under Maintenance
- Returned
- Replaced
- Open
- Assigned
- In Progress
- Completed
- Closed
- Due
- Overdue

---

## How to Handle Tasks
When asked to create a page or component:

1. understand the page purpose
2. keep the page within business scope
3. use the shared layout style
4. keep the UI simple and practical
5. use realistic sample data
6. make the page responsive
7. keep future backend integration in mind

If a page is complex:
- first propose a simple layout structure
- then implement

If asked to improve a page:
- improve usability first
- improve clarity second
- improve visual polish third

---

## Definition of Done
A page is considered done when:
- it is responsive
- it follows the project layout
- it uses practical garments-factory terminology
- it includes relevant sample data
- forms/tables/cards are clearly usable
- actions and badges are understandable
- the code is clean and organized
- the page feels like part of one consistent system

---

## Default Output Expectations
For each page:
- provide full HTML structure
- use Bootstrap 5 layout/components
- include only necessary custom CSS
- include only necessary JavaScript
- keep page logic simple
- do not add unrelated libraries
- do not add features outside current scope

---

## Priority Order
When in doubt, prioritize:
1. usability
2. clarity
3. consistency
4. responsiveness
5. simplicity
6. future backend readiness

---

## Final Instruction
Always treat this project as a **real garments factory business app prototype**, not as a generic admin template demo.
Every page must feel practical, readable, and ready for future backend integration.