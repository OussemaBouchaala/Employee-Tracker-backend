import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const API_URL = `${BASE_URL}/job-posts`;

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

let testsPassed = 0;
let testsFailed = 0;
let createdJobPostId: string;
let candidateId: string;

function log(message: string, color: string = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message: string) {
    testsPassed++;
    log(`✅ ${message}`, colors.green);
}

function logError(message: string, error?: any) {
    testsFailed++;
    log(`❌ ${message}`, colors.red);
    if (error) {
        console.error(error.response?.data || error.message);
    }
}

function logInfo(message: string) {
    log(`ℹ️  ${message}`, colors.cyan);
}

function logSection(message: string) {
    console.log('\n' + '='.repeat(60));
    log(message, colors.yellow);
    console.log('='.repeat(60));
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Test 1: Testing API Connection
async function testApiConnection() {
    logSection('TEST 1: Testing API Connection');
    try {
        const response = await axios.get(`${API_URL}/testing-api`);
        logSuccess(`API Connection Test - Status: ${response.status}`);
        logInfo(`Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
        return true;
    } catch (error) {
        logError('API Connection Test Failed', error);
        return false;
    }
}

// Test 2: Get All Job Posts
async function testGetAllJobPosts() {
    logSection('TEST 2: Get All Job Posts');
    try {
        const response = await axios.get(API_URL);
        logSuccess(`Get All Job Posts - Found ${response.data.length} job posts`);
        
        if (response.data.length > 0) {
            createdJobPostId = response.data[0]._id;
            logInfo(`Using Job Post ID for tests: ${createdJobPostId}`);
            
            // Check if relationships are loaded
            if (response.data[0].recruiter) {
                logSuccess('Relationships loaded: recruiter ✓');
            }
            if (response.data[0].jobPostCandidates) {
                logSuccess(`Relationships loaded: ${response.data[0].jobPostCandidates.length} candidates ✓`);
            }
        }
        return true;
    } catch (error) {
        logError('Get All Job Posts Failed', error);
        return false;
    }
}

// Test 3: Get Single Job Post
async function testGetSingleJobPost() {
    logSection('TEST 3: Get Single Job Post by ID');
    if (!createdJobPostId) {
        logError('No Job Post ID available for testing');
        return false;
    }

    try {
        const response = await axios.get(`${API_URL}/${createdJobPostId}`);
        logSuccess(`Get Single Job Post - Title: "${response.data.title}"`);
        logInfo(`Employment Type: ${response.data.employmentType}`);
        logInfo(`Seniority Level: ${response.data.seniorityLevel}`);
        
        if (response.data.recruiter?.user) {
            logSuccess(`Recruiter: ${response.data.recruiter.user.name} (${response.data.recruiter.companyName})`);
        }
        
        if (response.data.jobPostCandidates?.length > 0) {
            logSuccess(`Found ${response.data.jobPostCandidates.length} matched candidates`);
            // Extract candidate ID - try different possible structures
            const firstMatch = response.data.jobPostCandidates[0];
            
            // Debug: Log the actual structure
            logInfo(`JobPostCandidate structure: ${JSON.stringify(firstMatch, null, 2).substring(0, 300)}`);
            
            candidateId = firstMatch.candidateId || firstMatch.candidate?._id || firstMatch.candidate?.userId;
            if (candidateId) {
                logInfo(`✓ Extracted Candidate ID: ${candidateId}`);
            } else {
                logError('✗ Failed to extract Candidate ID from response');
            }
        } else {
            logInfo('No jobPostCandidates found in response');
        }
        
        return true;
    } catch (error) {
        logError('Get Single Job Post Failed', error);
        return false;
    }
}

// Test 4: Get Candidates for Job Post
async function testGetCandidatesForJobPost() {
    logSection('TEST 4: Get Candidates for Job Post');
    if (!createdJobPostId) {
        logError('No Job Post ID available for testing');
        return false;
    }

    try {
        const response = await axios.get(`${API_URL}/${createdJobPostId}/candidates`);
        logSuccess(`Get Candidates - Found ${response.data.length} candidates`);
        
        response.data.forEach((match: any, index: number) => {
            logInfo(`  ${index + 1}. ${match.candidate?.user?.name || 'Unknown'} - Score: ${match.score}`);
        });
        
        // Extract candidate ID from the first match for Test 8
        if (response.data.length > 0) {
            const firstMatch = response.data[0];
            
            // Debug: Show the actual structure
            logInfo(`DEBUG - First match structure: ${JSON.stringify(firstMatch, null, 2).substring(0, 400)}`);
            
            // Try multiple extraction methods
            candidateId = firstMatch._id
            
            logInfo(`DEBUG - candidateId field: ${firstMatch.candidateId}`);
            logInfo(`DEBUG - candidate._id field: ${firstMatch.candidate?._id}`);
            logInfo(`DEBUG - candidate.userId field: ${firstMatch.candidate?.userId}`);
            
            if (candidateId) {
                logSuccess(`✓ Extracted Candidate ID for Test 8: ${candidateId}`);
            } else {
                logError(`✗ Failed to extract Candidate ID - all fields were undefined`);
            }
        }
        
        return true;
    } catch (error) {
        logError('Get Candidates for Job Post Failed', error);
        return false;
    }
}

// Test 5: Get AI Candidates (Mock)
async function testGetAICandidates() {
    logSection('TEST 5: Get AI Candidates (Mock API Call)');
    
    const mockJobPost = {
        title: 'Senior Full Stack Developer',
        employmentType: 'Full-time',
        requirements: '5+ years experience with React, Node.js, and MongoDB. Strong problem-solving skills.',
        industries: 'Technology, Software Development',
        jobFunction: 'Software Engineering',
        seniorityLevel: 'Senior'
    };

    try {
        const response = await axios.post(`${API_URL}/getCandidates`, {
            jobpost: mockJobPost,
            amount: 5
        });
        
        logSuccess('Get AI Candidates - API call successful');
        logInfo(`Response type: ${typeof response.data}`);
        
        if (Array.isArray(response.data)) {
            logSuccess(`Received ${response.data.length} candidate recommendations`);
        } else {
            logInfo('Response: ' + JSON.stringify(response.data).substring(0, 200));
        }
        
        return true;
    } catch (error) {
        logError('Get AI Candidates Failed', error);
        return false;
    }
}

// Test 6: Create Job Post (Without Auth - Will Fail)
async function testCreateJobPostWithoutAuth() {
    logSection('TEST 6: Create Job Post (Without Auth - Expected to Fail)');
    
    const newJobPost = {
        title: 'Test Backend Developer',
        employmentType: 'Full-time',
        requirements: '3+ years experience with Node.js, Express, MongoDB',
        industries: 'Technology',
        jobFunction: 'Backend Engineering',
        seniorityLevel: 'Mid-Level'
    };

    try {
        const response = await axios.post(API_URL, newJobPost);
        logError('Create Job Post should have failed without auth but succeeded!');
        return false;
    } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            logSuccess('Create Job Post correctly rejected without authentication (401/403)');
            return true;
        } else {
            logError('Create Job Post failed with unexpected error', error);
            return false;
        }
    }
}

// Test 7: Update Job Post (Without Auth - Will Fail)
async function testUpdateJobPostWithoutAuth() {
    logSection('TEST 7: Update Job Post (Without Auth - Expected to Fail)');
    if (!createdJobPostId) {
        logError('No Job Post ID available for testing');
        return false;
    }

    const updateData = {
        title: 'Updated Title - Test'
    };

    try {
        const response = await axios.patch(`${API_URL}/${createdJobPostId}`, updateData);
        logError('Update Job Post should have failed without auth but succeeded!');
        return false;
    } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            logSuccess('Update Job Post correctly rejected without authentication (401/403)');
            return true;
        } else {
            logError('Update Job Post failed with unexpected error', error);
            return false;
        }
    }
}

// Test 8: Add Candidate to Job Post (Without Auth - Will Fail)
async function testAddCandidateWithoutAuth() {
    logSection('TEST 8: Add Candidate to Job Post (Without Auth - Expected to Fail)');
    if (!createdJobPostId || !candidateId) {
        logError('No Job Post ID or Candidate ID available for testing');
        return false;
    }

    try {
        const response = await axios.post(`${API_URL}/${createdJobPostId}/add-candidate`, {
            candidateId: candidateId,
            score: 88
        });
        logError('Add Candidate should have failed without auth but succeeded!');
        return false;
    } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            logSuccess('Add Candidate correctly rejected without authentication (401/403)');
            return true;
        } else {
            logError('Add Candidate failed with unexpected error', error);
            return false;
        }
    }
}

// Test 9: Find and Match Candidates (Without Auth - Will Fail)
async function testFindAndMatchCandidatesWithoutAuth() {
    logSection('TEST 9: Find and Match Candidates (Without Auth - Expected to Fail)');
    if (!createdJobPostId) {
        logError('No Job Post ID available for testing');
        return false;
    }

    try {
        const response = await axios.post(`${API_URL}/${createdJobPostId}/find-and-match-candidates`, {
            amount: 5
        });
        logError('Find and Match Candidates should have failed without auth but succeeded!');
        return false;
    } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            logSuccess('Find and Match Candidates correctly rejected without authentication (401/403)');
            return true;
        } else {
            logError('Find and Match Candidates failed with unexpected error', error);
            return false;
        }
    }
}

// Test 10: Delete Job Post (Without Auth - Will Fail)
async function testDeleteJobPostWithoutAuth() {
    logSection('TEST 10: Delete Job Post (Without Auth - Expected to Fail)');
    if (!createdJobPostId) {
        logError('No Job Post ID available for testing');
        return false;
    }

    try {
        const response = await axios.delete(`${API_URL}/${createdJobPostId}`);
        logError('Delete Job Post should have failed without auth but succeeded!');
        return false;
    } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            logSuccess('Delete Job Post correctly rejected without authentication (401/403)');
            return true;
        } else {
            logError('Delete Job Post failed with unexpected error', error);
            return false;
        }
    }
}

// Test 11: Invalid Job Post ID
async function testInvalidJobPostId() {
    logSection('TEST 11: Get Job Post with Invalid ID');
    
    try {
        const response = await axios.get(`${API_URL}/invalid-id-12345`);
        logError('Should have failed with invalid ID but succeeded!');
        return false;
    } catch (error: any) {
        if (error.response?.status === 404 || error.response?.status === 500) {
            logSuccess('Invalid ID correctly handled (404/500)');
            return true;
        } else {
            logError('Invalid ID test failed with unexpected error', error);
            return false;
        }
    }
}

// Main test runner
async function runAllTests() {
    console.clear();
    logSection('🧪 JOB POST ENDPOINTS - AUTOMATED TESTING');
    logInfo('Base URL: ' + BASE_URL);
    logInfo('Make sure the server is running and database is seeded!');
    logInfo('Run: npm run start:dev (in another terminal)');
    logInfo('Run: npm run seed (to populate data)');
    
    await sleep(1000);

    // Run all tests
    await testApiConnection();
    await sleep(500);
    
    await testGetAllJobPosts();
    await sleep(500);
    
    await testGetSingleJobPost();
    await sleep(500);
    
    await testGetCandidatesForJobPost();
    await sleep(500);
    
    await testGetAICandidates();
    await sleep(500);
    
    await testCreateJobPostWithoutAuth();
    await sleep(500);
    
    await testUpdateJobPostWithoutAuth();
    await sleep(500);
    
    await testAddCandidateWithoutAuth();
    await sleep(500);
    
    await testFindAndMatchCandidatesWithoutAuth();
    await sleep(500);
    
    await testDeleteJobPostWithoutAuth();
    await sleep(500);
    
    await testInvalidJobPostId();

    // Summary
    logSection('📊 TEST SUMMARY');
    log(`Total Tests: ${testsPassed + testsFailed}`, colors.blue);
    log(`✅ Passed: ${testsPassed}`, colors.green);
    log(`❌ Failed: ${testsFailed}`, colors.red);
    
    if (testsFailed === 0) {
        log('\n🎉 ALL TESTS PASSED!', colors.green);
    } else {
        log(`\n⚠️  ${testsFailed} test(s) failed`, colors.red);
    }
    
    console.log('='.repeat(60));
    
    process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
    logError('Fatal error running tests', error);
    process.exit(1);
});
