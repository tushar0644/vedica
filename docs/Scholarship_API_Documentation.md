# Scholarship API Documentation

## Base URL

`https://vedica.origensystems.com`

---

## 1. Get All Fields (DocType Metadata)

**Request**

```http
GET https://vedica.origensystems.com/api/resource/DocType/Scholarship
```

This endpoint returns all fields and metadata for the Scholarship DocType.

---

## 2. Create Scholarship Record

**Request**

```http
POST https://vedica.origensystems.com/api/resource/Scholarship
```

**Sample Payload**

```json
{
  "application_id__vs_id": "ADM-2026-00008", <-important
  "title": "Mr."
  .....
  ....
  ....
  ...
  etc
}
```

---

## 3. Get Scholarship Record

### Option 1: Get by Filter

**Request**

```http
GET https://vedica.origensystems.com/api/resource/Scholarship?fields=["*"]&filters=[["application_id__vs_id","=","ADM-2026-00008"]]
```

Returns Scholarship records matching the Application ID.

### Option 2: Get by Document Name

**Request**

```http
GET https://vedica.origensystems.com/api/resource/Scholarship/SCH-2026-00001
```

Returns a specific Scholarship document.

---

## 4. Delete Scholarship Record

### Step 1: Find Scholarship Record

```http
GET https://vedica.origensystems.com/api/resource/Scholarship?fields=["*"]&filters=[["application_id__vs_id","=","ADM-2026-00008"]]
```

### Step 2: Delete Using Document Name

```http
DELETE https://vedica.origensystems.com/api/resource/Scholarship/SCH-2026-00001
```

---

## Authentication

Include API credentials in request headers:

```http
Authorization: token API_KEY:API_SECRET
```

Example:

```http
Authorization: token xxxxxxxxx:xxxxxxxxx
```
