# 📘 Vedica Frappe CRM & Admission API Documentation

## Document Status Flow

| docstatus | State     | Description                 |
| --------- | --------- | --------------------------- |
| 0         | Draft     | Document is editable        |
| 1         | Submitted | Document cannot be modified |
| 2         | Cancelled | Document is cancelled       |

---

# 1. Authentication APIs

## Forgot Password

**POST**
`https://vedica.origensystems.com/api/method/forgot_password`

### Request

```json
{
  "email": "rk0346101@gmail.com",
  "redirectUrl": "https://portal.example.com/reset-password"
}
```

### Email Link Example

```text
https://portal.example.com/reset-password?token=abc123xyz
```

## Reset Password

**POST**
`https://vedica.origensystems.com/api/method/reset_password`

### Request

```json
{
  "token": "abc123xyz",
  "newPassword": "MyNewPassword@123"
}
```

### Response

```json
{
  "message": "Password reset successfully"
}
```

---

# 2. Get Profile Details

**GET**

```text
https://vedica.origensystems.com/api/resource/CRM%20Lead?fields=["*"]&filters=[["custom_emailss","=","rk0346101@gmail.com"]]
```

Returns complete CRM Lead profile details.

---

# 3. Update Profile

## Get CRM Lead ID

**GET**

```text
/api/resource/CRM Lead?filters=[["custom_emailss","=","rk0346101@gmail.com"]]
```

### Response

```json
{
  "data": [
    {
      "name": "CRM-LEAD-2026-00064"
    }
  ]
}
```

## Update CRM Lead

**PUT**

```text
https://vedica.origensystems.com/api/resource/CRM%20Lead/CRM-LEAD-2026-00064
```

### Request

```json
{
  "custom_select_city": "Delhi",
  "custom_select_state": "Delhi",
  "custom_mobile_nos": "+91-9999999999"
}
```

---

# 4. Get All Fields

**GET**

```text
https://vedica.origensystems.com/api/resource/DocType/CRM%20Lead
```

Returns DocType metadata and field definitions.

---

# 5. Get User Application Forms

**GET**

```text
https://vedica.origensystems.com/api/resource/Admission?fields=["*"]&filters=[["email_id","=","ee@gmail.com"]]
```

### Response

```json
{
  "data": [
    {
      "name": "ADM-2026-00001"
    }
  ]
}
```

## Get Specific Admission

**GET**

```text
https://vedica.origensystems.com/api/resource/Admission/ADM-2026-00001
```

---

# 6. Expected Status Values

The `docstatus` field indicates the current state of a document.

| Value | Status    |
| ----- | --------- |
| 0     | Draft     |
| 1     | Submitted |
| 2     | Cancelled |

Example:

```json
{
  "docstatus": 0
}
```

Meaning: Draft

---

# 7. Get Submitted Application Form Data

**GET**

```text
https://vedica.origensystems.com/api/resource/Admission/ADM-2026-00001
```

Returns the complete Admission form data.

---

# 8. Create Application Form

**POST**

```text
https://vedica.origensystems.com/api/resource/Admission
```

### Request

```json
{
  "crm_lead": "CRM-LEAD-2026-00064",
  "middle_name": "dd",
  "email_id": "rk@gmail.com",
  "date_of_birth": "2003-12-02",
  "streams_under_gradaute": "BFA"
}
```

### Notes

- `crm_lead` must be provided.
- Date format must be `YYYY-MM-DD`.

---

# 9. Update Application Form

**PUT**

```text
https://vedica.origensystems.com/api/resource/Admission/ADM-2026-00001
```

### Request

```json
{
  "middle_name": "dd"
}
```

#10 Submit Admisson form

When you hit the api https://vedica.origensystems.com/api/resource/Admission <-Post
so its submit the admission form in draft state by default
so when user fill all the details and at last user click on submit so for completely submit the from we use the submit_admisson.If form is submitted so user cannot able to update the form in future.
https://vedica.origensystems.com/api/method/submit_admission

{
"name": "ADM-2026-00001"
}

#11 Admission from percentage

https://vedica.origensystems.com/api/method/get_admission_completion

body
{
"name": "ADM-2026-00001"
}

response
{
"message": {
"name": "ADM-2026-00001",
"completion_percentage": 5,
"filled_fields": 6,
"total_fields": 123
}
}

## Submitted Document Restriction

If the document is already submitted (`docstatus = 1`), updates are not allowed.

Example Error:

```json
{
  "exception": "frappe.exceptions.UpdateAfterSubmitError",
  "exc_type": "UpdateAfterSubmitError"
}
```

Example Message:

```text
Not allowed to change Middle Name after submission.
```

---

# Summary

- Draft (0): Editable
- Submitted (1): Read-only
- Cancelled (2): Cancelled
- CRM Lead must be linked while creating Admission.
- Date format must be `YYYY-MM-DD`.
