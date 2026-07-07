# Form APIs — Application Form & Lead Capture Form

Covers: fetching a form's fields/data, creating a new submission, updating an existing one, submitting (finalizing) an Application, and the state→city cascading dropdown. All endpoints are on `vedica.origensystems.com`.

---

## 1. Authentication

| Form | `login_required` | Notes |
|---|---|---|
| `application-form` (Application) | **1 — Yes** | Caller must have a logged-in session (cookie) before calling any of these. |
| `lead-capture` (CRM Lead) | **0 — No** | Works for Guest. No login needed to submit a lead. |

To log in (only needed for the Application form):

```
POST /api/method/login
Content-Type: application/x-www-form-urlencoded

usr=<email>&pwd=<password>
```

Frappe returns a `Set-Cookie: sid=...` header. In Postman, just keep "Cookie jar" / "Automatically follow redirects + send cookies" on — once you log in once in the same Postman environment, the `sid` cookie is reused on every subsequent request automatically. No CSRF token handling is needed for these endpoints (they're plain whitelisted methods, not the Desk app).

---

## 2. Application Form (`Application` doctype)

### 2.1 Fetch form (blank, or your existing submission)

```
GET /api/method/get_application_form_data
GET /api/method/get_application_form_data?application=<APPLICATION-NAME>
```

- `application` is **optional**. Since the web form has `allow_multiple = 0`, if you omit it (and you're logged in), Frappe automatically finds and returns *your own* existing Application if you already have one — this is the built-in mechanism for "view the form I already submitted." You don't need a separate "search my submission" call.
- Pass `application` explicitly only if you already know the exact docname and want that one (subject to the same ownership check).

**Response shape:**
```json
{
  "message": {
    "fields": [
      { "fieldname": "first_name", "fieldtype": "Data", "label": "First Name", "options": null, "reqd": 1, "depends_on": null },
      { "fieldname": "state_current_address", "fieldtype": "Autocomplete", "label": "State", "options": "Andhra Pradesh\nAssam\n...", "reqd": 0, "depends_on": null },
      { "fieldname": "city_current_address", "fieldtype": "Autocomplete", "label": "City", "options": "Achalpur\nAchhnera\n...(ALL cities, unfiltered)...", "reqd": 0, "depends_on": null }
      // ... all other application-form fields
    ],
    "doc": { /* full existing Application doc, or null if you don't have one yet */ }
  }
}
```

**Important caveat on Link fields (`state_current_address`, `city_current_address`, `state_permanent_address`, `city_permanent_address`):** Frappe's underlying mechanism converts these to `"Autocomplete"` and dumps the **entire** linked doctype's records into `options` as a newline-joined string — it does **not** apply Desk's per-state filter. So `options` on a city field here is literally every city in the master table, not cities for any particular state. Use the dedicated cascading API below instead of trusting this `options` value for city/district.

### 2.2 Create a new Application (or save as draft)

```
POST /api/method/frappe.website.doctype.web_form.web_form.accept
Content-Type: application/x-www-form-urlencoded

web_form=application-form
data={"first_name":"Riya","email_id":"riya@example.com","state_current_address":"Maharashtra","city_current_address":"Pune", ... all other fieldname:value pairs ...}
```

- `data` is a **JSON string** (stringify the object before sending), not nested form fields.
- Do **not** include `name` in `data` for a create. This inserts a new `Application` with `docstatus = 0` (Draft) and `owner = <your session user>`.
- Because the web form has `allow_incomplete = 1`, you can submit partial data — mandatory-field validation is relaxed, so you can save progress across multiple calls.
- Response: the full saved doc (`{"message": {...doc...}}`).

### 2.3 Update your draft

Same endpoint, but include `name` (the Application's docname) inside `data`:

```
data={"name":"APP-2026-00123","mobile_number":"9876543210", ...}
```

- This works while `docstatus = 0` (Draft). The server checks `web_form.has_web_form_permission(doctype, doc.name, "write")` — you must be the owner.
- **Note:** the web form has `allow_edit = 0`. In Frappe, `allow_edit` only blocks editing *after the document has been submitted* (`docstatus = 1`) via the default web-form template's edit route — it does **not** block the raw `accept` API call itself while still a draft. Once you've called `submit_admission` (below) and `docstatus = 1`, further `accept` calls with that `name` should be treated as not allowed for editing — don't rely on calling `accept` again post-submission.

### 2.4 Submit (finalize) the Application

```
POST /api/method/submit_admission
Content-Type: application/x-www-form-urlencoded

name=APP-2026-00123
```

- Moves `docstatus` from `0` (Draft) → `1` (Submitted). This is a **separate, explicit step** — `accept` alone never submits, it only inserts/updates a draft.
- Throws if already submitted (`docstatus = 1`) or cancelled (`docstatus = 2`).
- Response: `{"message": "Application submitted successfully", "docstatus": 1}`.

### 2.5 Typical end-to-end flow for Application

```
1. GET  get_application_form_data                       → check if you already have a draft/submission
2. POST accept (web_form=application-form, no name)      → create draft, get back the name
3. POST accept (web_form=application-form, with name)    → update draft as many times as needed
4. POST submit_admission (name=...)                       → finalize, docstatus=1
5. GET  get_application_form_data?application=<name>     → view your final submitted record any time
```

---

## 3. Lead Capture Form (`CRM Lead` doctype)

### 3.1 Fetch form

```
GET /api/method/get_lead_capture_form_data
```

No login needed (`login_required = 0`). Since `lead-capture` is Guest-facing, the "auto-find my existing record" behavior from §2.1 does **not** apply here (it only kicks in for non-Guest sessions) — every call returns a blank form's field list unless you pass `lead=<CRM-LEAD-NAME>` explicitly and you happen to be logged in as its owner.

**Current real field list** (confirmed live):

| fieldname | fieldtype | notes |
|---|---|---|
| `custom_salutationss` | Select | `Mr./Dr./Prof./Mrs./Ms.` |
| `first_name` | Data | |
| `last_name` | Data | |
| `custom_emailss` | Data | |
| `custom_mobile_nos` | Phone | |
| `custom_select_state` | Select | hardcoded static list of 29 Indian state names, on the web form field row itself |
| `custom_select_city` | Data | ⚠️ **known broken — see §3.3** |
| `custom_select_course` | Select | currently one option only |
| `custom_select_current_total_work_experience` | Select | `Freshers / Less than 2 years / More then 2 years` |

### 3.2 Create a lead

```
POST /api/method/frappe.website.doctype.web_form.web_form.accept
Content-Type: application/x-www-form-urlencoded

web_form=lead-capture
data={"first_name":"Riya","last_name":"Sharma","custom_emailss":"riya@example.com","custom_mobile_nos":"9876543210","custom_select_state":"Maharashtra", ...}
```

- No `name` for create. Inserts a new `CRM Lead` owned by the current session (or anonymous, since Guest is allowed).
- `lead-capture` has `allow_edit = 0` and `allow_multiple = 0` — this form is effectively **one-shot**: once submitted there is no supported "update my lead" call. Treat it as create-only.

### 3.3 ⚠️ Known issue — City field is currently broken, left as-is at your instruction

The web form's `custom_select_city` row references a fieldname that **does not exist** on `CRM Lead`. The real field is `custom_city` (a Link to the `city` doctype). As currently configured:

- Whatever value you send for `custom_select_city` in `data` is **silently discarded** on submit — `doc.set("custom_select_city", value)` sets a non-persisted attribute, no error, no data saved.
- The fetch API can never return city options for it either, since it's typed as plain `Data` with no `options`.

You confirmed you want to leave this as-is for now. When you're ready to fix it, the change is a one-line edit on the `lead-capture` Web Form's field row (`fieldname: custom_select_city → custom_city`, `fieldtype: Data → Link`, `options: → city`) — I can do this whenever you give the go-ahead.

Until then: **do not send `custom_select_city` expecting it to persist** — it won't.

---

## 4. Cascading State → City dropdown

This is the new API, built specifically because Link-field dumps (§2.1) return *every* city unfiltered, and Desk's own filtering (`frm.set_query`) only exists inside the Desk UI, not on the public website.

```
GET /api/method/get_cities_for_state?state=<STATE NAME>
```

- `allow_guest = 1` — works with or without login.
- `state` must exactly match a `state` doctype record name (e.g. `Maharashtra`, not `maharashtra` or `MH`).
- If `state` is omitted or doesn't match anything, returns `[]` (never errors).

**Response:**
```json
{ "message": ["Achalpur", "Ahmednagar", "Akola", "Akot", "Amalner", "..."] }
```

**Frontend wiring (vanilla JS example):**
```js
stateSelect.addEventListener('change', async () => {
  const res = await fetch(`/api/method/get_cities_for_state?state=${encodeURIComponent(stateSelect.value)}`);
  const { message: cities } = await res.json();
  citySelect.innerHTML = cities.map(c => `<option value="${c}">${c}</option>`).join('');
});
```

**Applies to:**
- Application form: `state_current_address → city_current_address`, `state_permanent_address → city_permanent_address`
- Lead capture form: `custom_select_state → custom_city` (once §3.3 is fixed)

**Not yet built — same pattern, not requested yet:** `District` is structured identically to `city` (also has a `state` Link field), and the Application form has `district_current_address`/`district_permanent_address` Link fields too. If you want district cascading filtering as well, it's the same ~10-line API (`get_districts_for_state`) — say the word and I'll add it the same way.

---

## 5. Quick reference — all endpoints in this doc

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/method/get_application_form_data` | Login required | Fetch blank form, or your existing Application |
| GET | `/api/method/get_lead_capture_form_data` | Guest OK | Fetch blank lead-capture form |
| POST | `/api/method/frappe.website.doctype.web_form.web_form.accept` | Per-form | Create or update a draft submission (`web_form`, `data`) |
| POST | `/api/method/submit_admission` | Login required | Finalize an Application (`docstatus` 0→1) |
| GET | `/api/method/get_cities_for_state` | Guest OK | Cities filtered by state, for cascading dropdowns |
