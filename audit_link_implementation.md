# Audit Logic & External Integrations Implementation

## Overview
Implemented comprehensive audit logging and external link integrations (Trello/FileMaker) across the Web Updates system.

## Changes

### Data Layer (`src/lib/data.ts`)
- **Types**: Added `trello_url`, `filemaker_url` to `RequestItem`. added `AuditEntry` and `audit_logs` to `Request`.
- **Functions**:
  - `addAuditEntry`: Helper to push logs to request history.
  - `updateItemExternalLinks`: New function to update links.
  - Updated `updateRequestStatus`, `updateItemStatus`, `assignRequest`, `assignItem`, `sendMessage`, `updateItemEffortAndDate`, `bulkAssignRequests`, `addPeerReviewer`, `submitPeerReviewDecision` to support user attribution and logging.

### Admin Dashboard (`src/app/admin`)
- **Request Detail**:
  - Added "Operational Audit Trail" section.
  - Added inputs for Trello and FileMaker URLs.
  - Connected all actions to the new audit-aware data functions.
- **Main Dashboard**:
  - Updated bulk actions to log changes with "Admin" attribution.

### Reviewer Dashboard (`src/app/reviewer`)
- **Request Detail**:
  - Added display of Trello/FileMaker links.
  - Updated actions (approve/reject/request changes) to log audits.

### Client Dashboard (`src/app`)
- **Request Detail**:
  - Added display of Trello/FileMaker links.
  - Updated message sending to log "Client" as actor.
- **Main Dashboard**:
  - Fixed sorting logic for "Urgency", "DateDesc", "DateAsc".

## Verification
- **Audit Logs**: Verified that status changes, assignments, and messages generate audit entries.
- **External Links**: Verified inputs validation and display in all views.
- **Safety**: Fallbacks added for user email (`user.email || 'Role'`) to ensure no logging failures.
