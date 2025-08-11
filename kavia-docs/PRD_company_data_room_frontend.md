# Product Requirements Document (PRD)
Company Data Room Frontend (React) — Secure Startup Fundraising Platform

1. Overview and Purpose
The platform is a secure, tiered-access web application enabling early-stage startup founders to share structured company information and sensitive documents with potential investors. It streamlines fundraising conversations through controlled access, a clear document management experience, and NDA signing, while preserving auditability and protecting confidential data. This PRD covers the frontend container (company_data_room_frontend) which will deliver the UI for founders, investors, and admin operators, and integrate with Supabase for authentication, storage interactions, and real-time updates as required.

2. Goals and Success Criteria
- Provide a frictionless, professional experience for founders to upload, organize, and manage access to documents and analytics in a secure data room.
- Allow investors to request access and view materials in a graduated manner: public, qualified, and NDA-signed tiers.
- Facilitate NDA signing through an integrated e-signature workflow and protect downloads where required.
- Deliver comprehensive audit logs and analytics to founders and admin operators for visibility into access and activity.
- Ensure secure-by-default authentication with passwordless magic links and clear session management.
- Achieve responsive, accessible, and performant UI across devices.

Success will be measured by:
- Reduced time for founders to prepare and share data rooms.
- Increased completion rate of investor access requests and NDA signatures.
- Low support tickets related to access confusion or login issues.
- Positive uptime and performance metrics for core user journeys.

3. Target Users and Roles
- Founder: Creates and manages the data room, uploads documents, configures tiered access, reviews activity, and responds to access requests.
- Investor: Discovers the data room, requests access, signs NDA, and views documents according to granted tier.
- Admin (Operations/Support): Responds to flagged content, helps resolve access issues, monitors platform health, and can investigate logs for support purposes.

4. Access Tiers and Authorization Model
The frontend must represent and enforce (with backend validation) three levels of access:
- Public: High-level overview and selected non-sensitive documents; accessible without login but may prompt for email capture where appropriate.
- Qualified: After authentication and minimal qualification (e.g., email domain verification or manual approval), investors can view additional documents.
- NDA-Signed: After successful e-signature of the NDA and any additional approvals, investors can view sensitive documents; downloads may be restricted depending on file policies.

Authorization will be reflected in the UI via:
- Conditional visibility of sections and actions in the sidebar.
- Gated document previews with contextual prompts to authenticate, request access, or sign the NDA.
- Clear tier badges and explanations for why content is locked and how to gain access.

5. Key Features
- Magic Link / Passwordless Authentication
  - Passwordless login via email with magic link delivery using Supabase Auth.
  - Session persistence and clear handling of expiration, logout, and re-authentication.
- Founder Dashboard
  - Upload and organize files into structured sections (pitch, financials, product, legal).
  - Manage access by tier, invite investors, and approve requests.
  - View analytics and audit logs (views, downloads, signature completion, last activity).
- Investor Interface
  - Browse public content and request higher-tier access through guided flows.
  - Execute NDA e-signature within a modal flow.
  - View documents with in-app viewers; enforce download protection where required.
- NDA E-Signature Integration and Download Protection
  - Embedded signature UX (modal), clear terms presentation, and status tracking.
  - Configurable download toggles at the file or folder level for NDA-signed content.
- Audit Logs and Analytics
  - Display view, download, and signature events with timestamps and actor.
  - Aggregate analytics (most viewed documents, recent activity) for founders.
- Admin Operations
  - Review flagged content and user reports.
  - Assist with user support (access issues, signature failures).
  - Read-only review of logs and user activity as permitted.
- Notifications
  - Email and in-app notifications for access requests, approvals, NDA completion, and document updates.
- Mobile Responsive Design
  - Consistent, accessible experience on phones and tablets with touch-friendly controls.

6. Platform, Tech Stack, and Current State
- Platform: Web
- Framework: React (Create React App baseline)
- Container: company_data_room_frontend (frontend UI)
- Current state of codebase (baseline):
  - Minimal React app with theme toggle in src/App.js.
  - Styling managed through src/App.css (light/dark theme variables).
  - Entry point in src/index.js and tests in src/App.test.js.
  - ESLint configured via eslint.config.mjs.
- Third-party services: Supabase (planned integration for Auth and real-time needs)
- Environment variables to be supported by the frontend build:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_KEY

7. Information Architecture and Navigation
- Global Layout: Dashboard-oriented UI with a left sidebar, top context bar, main content area for document preview, and context-aware modals.
  - Sidebar: Sections for Overview, Documents, Access Requests, NDA, Activity/Analytics, Settings (Founder), and Help.
  - Document Preview Area: Inline viewers for common formats (PDF/images) and metadata panel.
  - Context-aware Modals: Access request, NDA signing, upload dialog, and permissions editor.
- Navigation Behaviors:
  - Deep linking to specific documents using URL parameters.
  - Preservation of user state across refreshes (where allowed).
  - Clear empty-state messaging for first-time founders and unapproved investors.

8. UX and Visual Design Requirements
- Style: Modern, minimalistic with light theme by default. Respect existing theme variables and consider future dark mode (already toggled in the baseline).
- Accessibility: WCAG AA target. Use semantic HTML, visible focus states, high-contrast text, and ARIA attributes for modals and dynamic content.
- Responsiveness: Mobile-first layout for sidebar collapse, document preview resizing, and touch-friendly controls for uploads and signature actions.
- States and Feedback:
  - Success, error, and pending states for actions such as upload, request access, and signature.
  - Skeleton loaders/placeholders for document viewers and analytics.
  - Clear empty states with guidance for next steps.

9. Core User Flows
- Investor Public to Qualified Flow:
  1) Land on public overview with selected documents visible.
  2) Click “Request access” which prompts authentication (magic link).
  3) After login, submit minimal details if needed; await approval or auto-qualification.
  4) Qualified documents unlock; NDA prompt displays for sensitive items.
- NDA Signature Flow:
  1) Open NDA modal in context of accessing a protected document.
  2) Review terms; sign using embedded e-signature component.
  3) On success, unlock NDA-signed tier with updated permissions; optionally restrict download by policy.
- Founder Setup Flow:
  1) Create space and upload files into structured sections.
  2) Configure visibility by tier and invite target investors.
  3) Monitor access requests, approvals, and activity analytics from dashboard.
- Admin Support Flow:
  1) Access flagged content queue and review reports.
  2) View audit logs and user activity to troubleshoot access issues.
  3) Apply administrative actions allowed by policy (non-destructive by default).

10. Security and Compliance Requirements
- Authentication and Authorization:
  - Passwordless magic links via Supabase Auth. Enforce email verification where applicable.
  - Robust session handling, logout, and token refresh.
  - Frontend must treat authorization as advisory; backend will be source of truth for enforcement.
- Data Protection:
  - Encrypted transport (HTTPS). Never expose secrets in the frontend; only public keys belong in the client build.
  - Download protection flows: watermarking overlays in viewers (frontend) where appropriate; server-side download gating.
- Privacy and Compliance:
  - Follow least-privilege principles. Display only the minimum necessary personal information in the UI.
  - Provide clear consent and privacy notices for investor identity collection.
  - Respect logging minimization and secure handling of PII.
- Auditability:
  - Surface immutable audit events from the backend (viewed, downloaded, signed, enabled/disabled access).
  - Time-stamped, actor-identified entries with readable formatting and filters.

11. Third-Party Integration: Supabase
- Auth:
  - Email-based magic link sign-in and sign-out flows.
  - On-auth state handling to update UI access tier indicators and gated content.
- Data and Real-time:
  - Subscribe to relevant change feeds (e.g., access request status, NDA completion) for timely UI updates where supported.
- Environment and Configuration:
  - The frontend build will read REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY at runtime (injected during build).
  - The app must gracefully handle misconfiguration by displaying a clear admin-facing error in non-production environments.

12. Notifications
- Email notifications (via backend/Supabase services) for:
  - Access requests created and approved.
  - NDA completion and failures.
  - Document updates and investor activity summaries.
- In-app notifications:
  - Non-intrusive toasts for immediate feedback.
  - Notification center panel for historical events with filtering.

13. Analytics and Audit Logs
- Founder-facing analytics:
  - Top viewed documents, recent activity list, NDA completion funnel.
- Audit log viewer:
  - Table view with filters (user, date, action), export options (CSV), and pagination.
- Investor activity timeline (investor profile pane) to assist founder decisions.

14. Admin Operations
- Flagged content queue with details and quick actions (snooze, resolve).
- User support tools to look up accounts and recent activity (read-only).
- System status banner for issues affecting authentication or file viewing.

15. Non-Functional Requirements
- Performance:
  - Core pages should render interactive content under a reasonable threshold on average connections.
  - Lazy-load heavy viewers, defer analytics, and batch network requests.
- Reliability:
  - Defensive UI for network failures and re-try strategies.
  - Meaningful offline messages for transient errors.
- Quality:
  - ESLint rules enforced (see eslint.config.mjs). Maintain test coverage for critical flows.
- Internationalization:
  - Prepare for text externalization; ensure layouts flex for language expansion.

16. Constraints and Assumptions
- Frontend enforcement is limited; backend will provide canonical authorization and signed URLs for sensitive operations.
- The current codebase is a minimal React template and does not yet include Supabase wiring; this PRD defines requirements for upcoming implementation.
- Download protection and watermarking require coordination with backend services and viewer components.

17. Acceptance Criteria (MVP)
- Investors can view public content and request access via a guided flow.
- Passwordless magic link flow works reliably, with clear UI feedback.
- Founders can upload documents (UI flow established even if backed by stubbed endpoints initially) and assign visibility by tier.
- NDA modal flow exists and updates access tier display after “completion” in a testable environment.
- Basic audit log and activity views are visible in the founder dashboard with sample data.
- Application is responsive and accessible with keyboard navigation and ARIA labels for modals.
- Environment variables are documented and required at build time:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_KEY

18. Out of Scope (Initial MVP)
- Full e-signature vendor integration beyond proof-of-concept flow (may be stubbed).
- Comprehensive watermarking and DRM; initial solution may be basic overlay.
- Complex analytics dashboards; begin with essential counts and timelines.

19. Future Enhancements
- Full e-signature provider integration with advanced signing options.
- Extended analytics (cohort analysis, investor funnel, document heatmaps).
- Team-based founder roles and granular permissions.
- Multi-workspace support for agencies or multi-portfolio VCs.

Appendix: References to Current Codebase
- App structure and theme toggle: src/App.js, src/App.css.
- App bootstrap: src/index.js.
- Project configuration: package.json, eslint.config.mjs.
- Project description and customization guide: company_data_room_frontend/README.md.

End of Document
