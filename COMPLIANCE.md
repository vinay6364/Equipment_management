# Compliance Checklist

This document confirms compliance with the assignment requirements.

## UI compliance

- **No inline styles were used.**  
  All styling is done via Tailwind CSS classes (e.g. `className="..."`). There are no `style={{}}` usages in the frontend.

- **No raw HTML form elements were used.**  
  All form controls use shadcn/ui components only:
  - Text and date inputs: `Input` from `@/components/ui/input`
  - Dropdowns: `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` from `@/components/ui/select`
  - Buttons: `Button` from `@/components/ui/button`
  - Labels: `Label` from `@/components/ui/label`  
  There are no raw `<input>`, `<select>`, or `<button>` elements in the codebase.

- **Add and Edit reuse the same form component.**  
  The component `EquipmentForm` in `frontend/src/components/EquipmentForm.tsx` is used for both adding and editing equipment. It accepts an optional `initial` prop; when provided, the form is in “edit” mode and pre-fills fields and submits via update API; when not provided, it is in “add” mode and submits via create API.

## Backend and data

- **Equipment types are not hardcoded in the database schema.**  
  Equipment types are stored in the `equipment_type` table. The schema supports adding, updating, or removing types via SQL or future admin tooling without code changes. Types are loaded dynamically for the “Type” dropdown via the `GET /api/equipment-types` endpoint.

- **Business rules are enforced in the backend.**  
  - **Maintenance logging:** When a maintenance record is created (`POST /api/maintenance`), the backend service sets the equipment’s status to “Active” and updates “Last Cleaned Date” to the maintenance date.  
  - **Status constraint:** When creating or updating equipment with status “Active”, the backend validates that “Last Cleaned Date” is within the last 30 days. If not, the request is rejected with HTTP 400 and a clear error message, which is displayed in the UI.
