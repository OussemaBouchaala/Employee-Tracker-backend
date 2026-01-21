# Job Post Controller & Service Documentation

## Table of Contents
1. [Controller Endpoints](#controller-endpoints)
2. [Service Methods](#service-methods)
3. [Data Flow Examples](#data-flow-examples)

---

## Controller Endpoints

### 1. **GET /job-posts/testing-api**
**Purpose:** Test API connection  
**Authentication:** Not required  
**Controller Method:** `testing_api()`  
**Service Method:** `testing_api()`

**Description:**  
Simple endpoint to verify the API is running and can connect to external services.

**Response:**
```json
{
  "message": "Hello World"
}
```

**Use Case:**  
Health check for the API and external service connectivity.

---

### 2. **POST /job-posts/getCandidates**
**Purpose:** Get AI-matched candidates for a job post (without saving to database)  
**Authentication:** Not required  
**Controller Method:** `getcandidates(jobpost, amount)`  
**Service Method:** `find_candidates(jobPost, amount)`

**Request Body:**
```json
{
  "jobpost": {
    "title": "Senior Full Stack Developer",
    "employmentType": "Full-time",
    "requirements": "5+ years experience with React, Node.js",
    "industries": "Technology",
    "jobFunction": "Software Engineering",
    "seniorityLevel": "Senior"
  },
  "amount": 5
}
```

**Response:**
```json
{
  "candidates": [
    {
      "candidateId": "...",
      "score": 92,
      "name": "John Doe",
      ...
    }
  ]
}
```

**Use Case:**  
Test the AI matching algorithm without creating database records. Useful for previewing candidates before committing.

---

### 3. **POST /job-posts/:id/find-and-match-candidates**
**Purpose:** Find AI candidates AND create JobPostCandidate entries in database  
**Authentication:** Required (Recruiter or Admin)  
**Controller Method:** `findAndMatchCandidates(jobPostId, amount)`  
**Service Method:** `findAndCreateCandidateMatches(jobPostId, amount)`

**Request Body:**
```json
{
  "amount": 10
}
```

**Response:**
```json
[
  {
    "_id": "...",
    "jobPostId": "...",
    "candidateId": "...",
    "score": 88,
    "candidate": {
      "user": {
        "name": "Alice Developer"
      }
    }
  }
]
```

**Use Case:**  
Recruiter uses AI to find candidates and automatically creates matches in the database. This is the main workflow for matching candidates to jobs.

**Process:**
1. Fetches the job post by ID
2. Calls AI API with job post details
3. For each returned candidate:
   - Checks if candidate exists in database
   - Checks for duplicate matches
   - Creates JobPostCandidate entry with score
4. Returns all created matches

---

### 4. **POST /job-posts/:id/add-candidate**
**Purpose:** Manually add a specific candidate to a job post  
**Authentication:** Required (Recruiter or Admin)  
**Controller Method:** `addCandidateToJobPost(jobPostId, candidateId, score)`  
**Service Method:** `addCandidateToJobPost(jobPostId, candidateId, score)`

**Request Body:**
```json
{
  "candidateId": "507f1f77bcf86cd799439011",
  "score": 85
}
```

**Response:**
```json
{
  "_id": "...",
  "jobPostId": "...",
  "candidateId": "507f1f77bcf86cd799439011",
  "score": 85,
  "createdAt": "2026-01-20T21:00:00.000Z"
}
```

**Use Case:**  
Recruiter manually adds a candidate they found outside the AI system, or adjusts the score for a specific candidate.

**Validation:**
- Checks if job post exists
- Checks if candidate exists
- Prevents duplicate matches

---

### 5. **GET /job-posts/:id/candidates**
**Purpose:** Get all candidates matched to a specific job post  
**Authentication:** Not required  
**Controller Method:** `getCandidatesForJobPost(jobPostId)`  
**Service Method:** `getCandidatesForJobPost(jobPostId)`

**Response:**
```json
[
  {
    "_id": "...",
    "score": 92,
    "candidateId": "...",
    "candidate": {
      "_id": "...",
      "cv": "http://example.com/cv.pdf",
      "description": "Experienced developer...",
      "user": {
        "name": "Alice Developer",
        "email": "alice@example.com"
      }
    }
  }
]
```

**Use Case:**  
View all candidates who have been matched to a job post, with their scores and details.

**Features:**
- Loads candidate relationship
- Loads user relationship (nested)
- Returns with scores for ranking

---

### 6. **POST /job-posts**
**Purpose:** Create a new job post  
**Authentication:** Required (Recruiter or Admin)  
**Controller Method:** `create(createJobPostDto, req)`  
**Service Method:** `create(createJobPostDto, userId)`

**Request Body:**
```json
{
  "title": "Backend Developer",
  "employmentType": "Full-time",
  "requirements": "3+ years experience with Node.js, Express, MongoDB",
  "industries": "Technology, Software Development",
  "jobFunction": "Backend Engineering",
  "seniorityLevel": "Mid-Level"
}
```

**Response:**
```json
{
  "_id": "...",
  "title": "Backend Developer",
  "employmentType": "Full-time",
  "requirements": "3+ years experience...",
  "industries": "Technology, Software Development",
  "jobFunction": "Backend Engineering",
  "seniorityLevel": "Mid-Level",
  "recruiterId": "...",
  "createdAt": "2026-01-20T21:00:00.000Z"
}
```

**Use Case:**  
Recruiter creates a new job posting.

**Process:**
1. Extracts user ID from JWT token
2. Finds recruiter record by user ID
3. Creates job post with recruiter ID
4. Returns created job post

---

### 7. **GET /job-posts**
**Purpose:** Get all job posts  
**Authentication:** Not required  
**Controller Method:** `findAll()`  
**Service Method:** `findAll()`

**Response:**
```json
[
  {
    "_id": "...",
    "title": "Senior Full Stack Developer",
    "employmentType": "Full-time",
    "requirements": "...",
    "recruiter": {
      "companyName": "TechCorp Solutions",
      "user": {
        "name": "Sarah Johnson",
        "email": "sarah@techcorp.com"
      }
    },
    "jobPostCandidates": [
      {
        "score": 92,
        "candidateId": "..."
      }
    ]
  }
]
```

**Use Case:**  
Browse all available job posts, typically for candidate job search.

**Features:**
- Loads recruiter relationship
- Loads recruiter.user relationship (nested)
- Loads jobPostCandidates array
- Returns all job posts with full details

---

### 8. **GET /job-posts/:id**
**Purpose:** Get a single job post by ID  
**Authentication:** Not required  
**Controller Method:** `findOne(id)`  
**Service Method:** `findOne(id)`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Senior Full Stack Developer",
  "employmentType": "Full-time",
  "requirements": "5+ years experience...",
  "industries": "Technology",
  "jobFunction": "Software Engineering",
  "seniorityLevel": "Senior",
  "recruiter": {
    "companyName": "TechCorp Solutions",
    "user": {
      "name": "Sarah Johnson"
    }
  },
  "jobPostCandidates": [
    {
      "score": 92,
      "candidate": {
        "user": {
          "name": "Alice Developer"
        }
      }
    }
  ]
}
```

**Use Case:**  
View detailed information about a specific job post.

**Features:**
- Loads full recruiter details
- Loads all matched candidates with their details
- Deep relationship loading (recruiter.user, candidates.user)

---

### 9. **PATCH /job-posts/:id**
**Purpose:** Update a job post  
**Authentication:** Required (Owner or Admin)  
**Controller Method:** `update(id, updateJobPostDto)`  
**Service Method:** `update(id, updateJobPostDto)`

**Request Body:**
```json
{
  "title": "Senior Backend Developer - UPDATED",
  "requirements": "5+ years experience with Node.js, Express, MongoDB, Redis"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Senior Backend Developer - UPDATED",
  "requirements": "5+ years experience with Node.js, Express, MongoDB, Redis",
  "updatedAt": "2026-01-20T22:00:00.000Z"
}
```

**Use Case:**  
Recruiter updates their job post details.

**Authorization:**
- Must be the owner (recruiter who created it) OR admin
- Verified by `IsOwnerOrAdminGuard`

---

### 10. **DELETE /job-posts/:id**
**Purpose:** Delete a job post  
**Authentication:** Required (Owner or Admin)  
**Controller Method:** `remove(id)`  
**Service Method:** `remove(id)`

**Response:**
```
HTTP 200 OK (no body)
```

**Use Case:**  
Recruiter removes a job post that's no longer active.

**Authorization:**
- Must be the owner (recruiter who created it) OR admin
- Verified by `IsOwnerOrAdminGuard`

---

## Service Methods

### Core CRUD Methods

#### `create(createJobPostDto: CreateJobPostDto, userId: string): Promise<JobPost>`
**Purpose:** Create a new job post  
**Parameters:**
- `createJobPostDto`: Job post details (title, requirements, etc.)
- `userId`: ID of the user creating the post

**Process:**
1. Finds recruiter by userId
2. Throws `NotFoundException` if recruiter not found
3. Creates job post with recruiterId
4. Saves and returns job post

---

#### `findAll(): Promise<JobPost[]>`
**Purpose:** Get all job posts with relationships  
**Returns:** Array of job posts with recruiter and candidate data

**Relationships Loaded:**
- `recruiter`
- `recruiter.user`
- `jobPostCandidates`

---

#### `findOne(id: string): Promise<JobPost>`
**Purpose:** Get single job post with full details  
**Parameters:**
- `id`: Job post ID

**Returns:** Job post with deep relationships

**Relationships Loaded:**
- `recruiter`
- `recruiter.user`
- `jobPostCandidates`
- `jobPostCandidates.candidate`
- `jobPostCandidates.candidate.user`

**Throws:** `NotFoundException` if job post not found

---

#### `update(id: string, updateJobPostDto: UpdateJobPostDto): Promise<JobPost>`
**Purpose:** Update job post fields  
**Parameters:**
- `id`: Job post ID
- `updateJobPostDto`: Fields to update

**Process:**
1. Calls `findOne(id)` to get existing job post
2. Merges update data with existing data
3. Saves and returns updated job post

---

#### `remove(id: string): Promise<void>`
**Purpose:** Delete a job post  
**Parameters:**
- `id`: Job post ID

**Process:**
1. Calls `findOne(id)` to verify existence
2. Removes job post from database

---

### AI & Candidate Matching Methods

#### `find_candidates(jobPost: CreateJobPostDto, amount: number): Observable<JSON>`
**Purpose:** Call AI API to get candidate matches (no database save)  
**Parameters:**
- `jobPost`: Job post details
- `amount`: Number of candidates to return

**Returns:** Observable with AI API response

**Use Case:** Preview candidates before committing to database

---

#### `findAndCreateCandidateMatches(jobPostId: string, amount: number): Promise<JobPostCandidate[]>`
**Purpose:** Find AI candidates AND create database entries  
**Parameters:**
- `jobPostId`: Job post to match candidates for
- `amount`: Number of candidates to find

**Process:**
1. Fetches job post by ID
2. Converts to DTO format for AI API
3. Calls AI API with job post details
4. For each returned candidate:
   - Finds candidate in database
   - Checks for existing match (prevents duplicates)
   - Creates JobPostCandidate entry with score
5. Returns array of created matches

**Returns:** Array of JobPostCandidate entries

**Throws:** `NotFoundException` if job post not found

---

#### `addCandidateToJobPost(jobPostId: string, candidateId: string, score: number): Promise<JobPostCandidate>`
**Purpose:** Manually add a candidate to a job post  
**Parameters:**
- `jobPostId`: Job post ID
- `candidateId`: Candidate ID
- `score`: Match score (0-100)

**Process:**
1. Validates job post exists
2. Validates candidate exists
3. Checks for duplicate match
4. Creates and saves JobPostCandidate entry

**Returns:** Created JobPostCandidate

**Throws:**
- `NotFoundException` if job post or candidate not found
- `Error` if candidate already matched to this job post

---

#### `getCandidatesForJobPost(jobPostId: string): Promise<JobPostCandidate[]>`
**Purpose:** Get all candidates matched to a job post  
**Parameters:**
- `jobPostId`: Job post ID

**Process:**
1. Queries JobPostCandidate by jobPostId using MongoDB native query
2. Manually loads candidate relationship for each match
3. Manually loads user relationship for each candidate

**Returns:** Array of JobPostCandidate with candidate and user data

**Note:** Uses MongoDB native queries because TypeORM relations don't work properly with MongoDB

---

#### `getJobPostsForCandidate(candidateId: string): Promise<JobPostCandidate[]>`
**Purpose:** Get all job posts a candidate has been matched to  
**Parameters:**
- `candidateId`: Candidate ID

**Returns:** Array of JobPostCandidate with job post details

**Relationships Loaded:**
- `jobPost`
- `jobPost.recruiter`
- `jobPost.recruiter.user`

---

### Testing & Utility Methods

#### `testing_api(): Observable<JSON>`
**Purpose:** Test external API connection  
**Returns:** Observable with test API response

---

## Data Flow Examples

### Example 1: Recruiter Creates Job Post and Finds Candidates

```
1. POST /job-posts
   Body: { title: "Backend Dev", requirements: "...", ... }
   → Service: create(dto, userId)
   → Returns: JobPost with ID

2. POST /job-posts/{jobPostId}/find-and-match-candidates
   Body: { amount: 10 }
   → Service: findAndCreateCandidateMatches(jobPostId, 10)
   → Calls AI API
   → Creates JobPostCandidate entries
   → Returns: Array of matches with scores

3. GET /job-posts/{jobPostId}/candidates
   → Service: getCandidatesForJobPost(jobPostId)
   → Returns: All matched candidates with details
```

### Example 2: Candidate Browses Jobs

```
1. GET /job-posts
   → Service: findAll()
   → Returns: All job posts with recruiter info

2. GET /job-posts/{jobPostId}
   → Service: findOne(jobPostId)
   → Returns: Detailed job post with all relationships
```

### Example 3: Recruiter Manually Adds Candidate

```
1. POST /job-posts/{jobPostId}/add-candidate
   Body: { candidateId: "...", score: 88 }
   → Service: addCandidateToJobPost(jobPostId, candidateId, 88)
   → Validates both exist
   → Creates match
   → Returns: JobPostCandidate entry
```

---

## Authentication & Authorization

### Guards Used

1. **IsRecruiterOrAdminGuard**
   - Used on: create, find-and-match-candidates, add-candidate
   - Requires: User role must be RECRUITER or ADMIN

2. **IsOwnerOrAdminGuard**
   - Used on: update, delete
   - Requires: User must be the job post owner (recruiter) OR admin

### Public Endpoints (No Auth Required)
- GET /job-posts/testing-api
- POST /job-posts/getCandidates
- GET /job-posts
- GET /job-posts/:id
- GET /job-posts/:id/candidates

---

## Error Handling

### Common Errors

- **404 Not Found**: Job post, candidate, or recruiter not found
- **401 Unauthorized**: No authentication token provided
- **403 Forbidden**: User doesn't have permission (wrong role or not owner)
- **400 Bad Request**: Invalid data in request body
- **500 Internal Server Error**: Database or AI API errors

### Error Response Format
```json
{
  "statusCode": 404,
  "message": "Job Post not found",
  "error": "Not Found"
}
```
