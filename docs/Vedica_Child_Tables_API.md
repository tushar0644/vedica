# Vedica API Documentation - Child Tables

## 1. Post Graduation Table

### Get Fields
GET https://vedica.origensystems.com/api/resource/DocType/Under Graduate Details

### Create/Update Application with Post Graduation Details

POST https://vedica.origensystems.com/api/resource/Application

```json
{
  "first_name": "Raj",
  "last_name": "Kumar",
  "...": "...",
  "postgraduate": [
    {
      "course_name": "MCA",
      "university": "ABC University",
      "year_of_passing": "2025",
      "percentage": "85"
    }
  ]
}
```

---

## 2. Competitive Exams Table

### Get Fields
GET https://vedica.origensystems.com/api/resource/DocType/Competive

### Create/Update Application with Competitive Exam Details

POST https://vedica.origensystems.com/api/resource/Application

```json
{
  "first_name": "Raj",
  "have_you_taken_any_competitive_exams_before": "Yes",
  "...": "...",
  "competive": [
    {
      "examination": "CAT",
      "score": 95,
      "year": "2025",
      "percentile": 99
    },
    {
      "examination": "GMAT",
      "score": 700,
      "year": "2024-01-01",
      "percentile": 95
    }
  ]
}
```

---

## 3. Work Experience Table

### Get Fields
GET https://vedica.origensystems.com/api/resource/DocType/Work Experience Details

### Create/Update Application with Work Experience Details

POST https://vedica.origensystems.com/api/resource/Application

```json
{
  "first_name": "Raj",
  "do_you_have_any_work_experience": "Yes",
  "...": "...",
  "work_experience": [
    {
      "name_of_organization": "Software Engineer",
      "organization": "Autonomous"
    }
  ]
}
```

---

## 4. Internship Details Table

### Get Fields
GET https://vedica.origensystems.com/api/resource/DocType/Internship Details

### Create/Update Application with Internship Details

POST https://vedica.origensystems.com/api/resource/Application

```json
{
  "first_name": "Raj",
  "do_you_have_internship_experience": "Yes",
  "...": "...",
  "internship_details": [
    {
      "employment_type": "Paid",
      "name_of_organization": "Autonomous"
    }
  ]
}
```

---

## 5. Extra-Curricular Activities Table

### Get Fields
GET https://vedica.origensystems.com/api/resource/DocType/Extra-Curricular Activities Details

### Create/Update Application with Extra-Curricular Activities

POST https://vedica.origensystems.com/api/resource/Application

```json
{
  "first_name": "Raj",
  "do_you_have_internship_experience": "Yes",
  "...": "...",
  "extra_curricular_activities": [
    {
      "name_of_activity": "ww",
      "duration": "3"
    }
  ]
}
```

---

# Scholarship Child Tables

## 6. Sibling(s) Details Table

### Get Fields
GET https://vedica.origensystems.com/api/resource/DocType/Sibling Name

### Create/Update Scholarship with Sibling Details

POST https://vedica.origensystems.com/api/resource/Scholarship

```json
{
  "sibling_details": [
    {
      "name1": "Rahul Kumar",
      "highest_education": "B.Tech",
      "organisation": "Infosys",
      "designation": "Software Engineer"
    }
  ]
}
```

---

## 7. Academic / Professional References Table

### Get Fields
GET https://vedica.origensystems.com/api/resource/DocType/Refrences

### Create/Update Scholarship with References

POST https://vedica.origensystems.com/api/resource/Scholarship

```json
{
  "academic_professional": [
    {
      "contact_number": ""
    }
  ]
}
```
