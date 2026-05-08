import pandas as pd
import os

def create_test_case_file(file_path, module_name, tc_id, priority, req_no, title, pre_conds, post_conditions, cases):
    # Ensure directory exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    # Header data
    header_info = [
        ["MaternalCare - Maternal Health Risks Monitoring System", "", "", "", "", "", "", ""],
        [f"{module_name} Module · Test Case Documentation", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["Test Case ID", "", tc_id, "", "", "Test Priority", "", priority],
        ["Requirement No.", "", req_no, "", "", "Module", "", module_name],
        ["Designed by", "", "Gemini CLI", "", "", "Executed by", "", "System Tester"],
        ["Design Date", "", "May 5, 2026", "", "", "Execution Date", "", "May 5, 2026"],
        ["", "", "", "", "", "", "", ""],
        ["Test Title", "", title, "", "", "", "", ""],
        ["Pre-conditions", "", pre_conds, "", "", "", "", ""],
        ["Post-conditions", "", post_conditions, "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["#", "Test Steps", "Test Data", "Expected Result", "Actual Result", "Status", "Category Tag", "Comments"]
    ]
    
    # Combine header with test cases
    all_data = header_info + cases
    
    # Create DataFrame
    df = pd.DataFrame(all_data)
    
    # Write to Excel with formatting
    writer = pd.ExcelWriter(file_path, engine='xlsxwriter')
    df.to_excel(writer, index=False, header=False, sheet_name='Test Cases')
    
    workbook  = writer.book
    worksheet = writer.sheets['Test Cases']
    
    # Add some formatting
    header_format = workbook.add_format({'bold': True, 'bg_color': '#E11D48', 'font_color': 'white', 'border': 1})
    cell_format = workbook.add_format({'border': 1, 'text_wrap': True, 'valign': 'top'})
    title_format = workbook.add_format({'bold': True, 'font_size': 14})
    
    worksheet.set_column('A:A', 5)
    worksheet.set_column('B:B', 40)
    worksheet.set_column('C:C', 20)
    worksheet.set_column('D:D', 40)
    worksheet.set_column('E:E', 30)
    worksheet.set_column('F:F', 10)
    worksheet.set_column('G:G', 20)
    worksheet.set_column('H:H', 20)
    
    # Format the table header (Row 12)
    for col_num, value in enumerate(all_data[12]):
        worksheet.write(12, col_num, value, header_format)
        
    writer.close()

# --- Doctor Test Cases ---

# 1. Dashboard
create_test_case_file(
    'test-cases/doctor/dashboard_test_cases.xlsx',
    'Doctor Dashboard', 'TC_DOC_DASH_01', 'High', 'DOC_F01',
    'Verify Doctor Dashboard Analytics and Navigation',
    '1. User is logged in as a Doctor.\n2. User is on the Dashboard screen.',
    'Doctor has a clear overview of patient statistics.',
    [
        ["1", "Observe the summary cards (Total Patients, High Risk, etc.).", "N/A", "Cards display accurate counts from the database.", "", "PENDING", "UI/Analytics", ""],
        ["2", "Verify the Pie Chart for risk breakdown.", "N/A", "Pie chart displays visual distribution of Low, Medium, and High risk patients.", "", "PENDING", "UI/Analytics", ""],
        ["3", "Find 'Recent Assessments' and click 'View all'.", "N/A", "User is redirected to the Patient Records screen.", "", "PENDING", "Navigation", ""],
        ["4", "Click on a specific patient row in the 'Recent Assessments' list.", "Patient: [Any]", "User is taken to the Patient Record Detail screen for that specific patient.", "", "PENDING", "Navigation", ""],
        ["5", "Click 'One-Click Share Access' and select 'Scan QR Code'.", "N/A", "Camera opens and successfully scans a patient's QR code, redirecting to their records.", "", "PENDING", "Feature/Scan", ""],
        ["6", "Click 'One-Click Share Access' and enter a valid 6-digit code manually.", "Code: [Valid 6-digit]", "System verifies the code and grants access to the patient's record detail.", "", "PENDING", "Feature/Manual", ""]
    ]
)

# 2. Alert System
create_test_case_file(
    'test-cases/doctor/alert_system_test_cases.xlsx',
    'Alert System', 'TC_DOC_ALERT_01', 'Critical', 'DOC_F02',
    'Verify Real-time Alert Monitoring and Detail View',
    '1. User is logged in as a Doctor.\n2. There are active alerts in the system.',
    'Doctor can identify and respond to critical patient risks.',
    [
        ["1", "Observe the 'Alerts' tab in the bottom navigation bar.", "N/A", "A numbered badge appears if there are high/medium alerts. Red for high, Yellow for medium.", "", "PENDING", "UI/Badge", ""],
        ["2", "Navigate to the Alerts tab.", "N/A", "Alerts are displayed in descending order of urgency.", "", "PENDING", "Core Alert", ""],
        ["3", "Click 'View Details' on a High Priority alert.", "Alert ID: [Any]", "User is taken to the Alert Details screen showing graphs and risk factors.", "", "PENDING", "Navigation", "Fixed: No longer redirects to generic records."],
        ["4", "Verify the 'Systolic BP Trend' line chart.", "Historical Data", "Chart shows previous BP readings to visualize trends.", "", "PENDING", "UI/Visualization", ""],
        ["5", "Click 'Perform Re-assessment' from Alert Details.", "Patient ID", "User is taken to Assessment form with Patient Name and Age pre-filled.", "", "PENDING", "Workflow", ""]
    ]
)

# 3. Patient Assessment
create_test_case_file(
    'test-cases/doctor/patient_assessment_test_cases.xlsx',
    'Patient Assessment', 'TC_DOC_ASSESS_01', 'Critical', 'DOC_F03',
    'Verify AI-Powered Risk Assessment Flow',
    '1. User is logged in as a Doctor.\n2. User is on the New Assessment screen.',
    'Accurate risk prediction is generated and alerts are synced.',
    [
        ["1", "Select 'New Patient' and enter details.", "Name: Test Patient, Age: 38", "New patient record is prepared.", "", "PENDING", "Data Entry", ""],
        ["2", "Enter vital signs that indicate high risk.", "BP: 150/95, Sugar: 12.0", "AI predicts 'High Risk' and shows relevant maternal risks (e.g. Preeclampsia).", "", "PENDING", "AI Logic", ""],
        ["3", "Click 'Save Report'.", "N/A", "Assessment is saved; Success modal appears; User is taken to Dashboard.", "", "PENDING", "Data Integrity", ""],
        ["4", "Perform a re-assessment for the same patient with normal vitals.", "BP: 120/80, Sugar: 5.0", "AI predicts 'Low Risk'. Previous alerts for this patient are automatically RESOLVED.", "", "PENDING", "Sync Logic", "Verified fix for alert resolution."]
    ]
)

# 5. AI Model Insights (NEW)
create_test_case_file(
    'test-cases/doctor/model_insights_test_cases.xlsx',
    'Model Insights', 'TC_DOC_MODEL_01', 'Low', 'DOC_F05',
    'Verify AI Model Information and Explainability Info',
    '1. User is logged in as a Doctor.\n2. User is on the Model tab.',
    'Doctor understands the underlying AI logic.',
    [
        ["1", "View the 'Random Forest Classifier' info card.", "N/A", "Displays detailed description of the machine learning ensemble method.", "", "PENDING", "UI/Info", ""],
        ["2", "Scroll to view feature importance or dataset info.", "N/A", "Information about training data and model versioning is visible.", "", "PENDING", "UI/Info", ""]
    ]
)

# --- Patient Test Cases ---

# 1. Dashboard
create_test_case_file(
    'test-cases/patient/dashboard_test_cases.xlsx',
    'Patient Dashboard', 'TC_PAT_DASH_01', 'High', 'PAT_F01',
    'Verify Personal Health Overview',
    '1. User is logged in as a Patient.\n2. User is on the Dashboard.',
    'Patient can see their own status clearly.',
    [
        ["1", "View the 'Latest Assessment' card.", "N/A", "Displays the result of the most recent assessment performed by a doctor.", "", "PENDING", "UI", ""],
        ["2", "Verify that clinical data is restricted to own records.", "N/A", "No other patient data is visible.", "", "PENDING", "Security", ""]
    ]
)

# 2. Wellness Check
create_test_case_file(
    'test-cases/patient/wellness_check_test_cases.xlsx',
    'Wellness Check', 'TC_PAT_WELLNESS_01', 'Medium', 'PAT_F02',
    'Verify Daily Wellness Logging',
    '1. User is logged in as a Patient.\n2. User is on the Wellness tab.',
    'Daily habits are tracked and available for doctor review.',
    [
        ["1", "Enter sleep hours, water intake, and mood.", "Sleep: 8, Mood: Happy", "Data is accepted.", "", "PENDING", "Data Entry", ""],
        ["2", "Submit the wellness check.", "N/A", "Confirmation message appears; data is saved to DB.", "", "PENDING", "Data Integrity", ""]
    ]
)

# 3. Clinical History
create_test_case_file(
    'test-cases/patient/clinical_history_test_cases.xlsx',
    'Clinical History', 'TC_PAT_RECORDS_01', 'High', 'PAT_F03',
    'Verify Access to Personal Medical Records',
    '1. User is logged in as a Patient.',
    'Patient remains informed about their clinical progress.',
    [
        ["1", "Navigate to 'Clinical History' (or Records).", "N/A", "List shows all assessments performed on the patient.", "", "PENDING", "History", ""],
        ["2", "View recommendations from a specific record.", "Assessment ID", "Doctor's advice and AI recommendations are clearly visible.", "", "PENDING", "UI", ""]
    ]
)

# 4. Access Control
create_test_case_file(
    'test-cases/patient/access_control_test_cases.xlsx',
    'Access Control', 'TC_PAT_AUTH_01', 'Critical', 'PAT_F04',
    'Verify Secure Doctor Authorization via Access Codes',
    '1. User is logged in as a Patient.\n2. User is on the Doctors screen.',
    'Patient data is shared only with authorized personnel.',
    [
        ["1", "Click 'Generate Access Code'.", "N/A", "A unique 6-digit code is displayed.", "", "PENDING", "Security", ""],
        ["2", "Wait for 11 minutes and try to use the code.", "N/A", "System should indicate the code has EXPIRED.", "", "PENDING", "Security", "10-minute expiry rule."],
        ["3", "Give a valid code to a Doctor.", "6-digit code", "Doctor gains access to patient records for 24 hours.", "", "PENDING", "Security", "Permission sync check."]
    ]
)

# 5. Self Assessment Placeholder (NEW)
create_test_case_file(
    'test-cases/patient/self_assessment_test_cases.xlsx',
    'Self Assessment', 'TC_PAT_SELF_01', 'Low', 'PAT_F05',
    'Verify Self-Assessment Availability',
    '1. User is logged in as a Patient.\n2. User navigates to Self Assessment.',
    'Placeholder content is displayed correctly.',
    [
        ["1", "Click 'Self Assessment' from drawer.", "N/A", "Displays 'Under Construction' placeholder with clear explanation.", "", "PENDING", "UI", ""]
    ]
)

# --- System-Wide & Security ---

# 1. Authentication & Onboarding
create_test_case_file(
    'test-cases/security-features/auth_test_cases.xlsx',
    'Authentication', 'TC_SEC_AUTH_01', 'Critical', 'SEC_F01',
    'Verify User Authentication and Role Isolation',
    '1. User is on the Welcome/Login screen.',
    'Access is granted only to authenticated users with correct roles.',
    [
        ["1", "Log in with invalid credentials.", "Email: wrong@test.com", "Error message 'Invalid email or password' is displayed.", "", "PENDING", "Auth", ""],
        ["2", "Register a new Doctor account.", "Name: Dr. Test", "Doctor is redirected to 'Pending Approval' screen and cannot access dashboard.", "", "PENDING", "RBAC", "Verify status: PENDING"],
        ["3", "Attempt to access /dashboard as an unauthenticated user via deep-linking.", "N/A", "System redirects to Login screen.", "", "PENDING", "Security", ""],
        ["4", "Perform 'Logout' from the drawer menu.", "N/A", "Session is cleared and user is returned to Welcome page.", "", "PENDING", "Auth", ""]
    ]
)


# 4. Patient Records
create_test_case_file(
    'test-cases/doctor/patient_records_test_cases.xlsx',
    'Patient Records', 'TC_DOC_RECORDS_01', 'Medium', 'DOC_F04',
    'Verify Patient History and Record Management',
    '1. User is logged in as a Doctor.\n2. User is on the Patient Records screen.',
    'Comprehensive history is available for clinical review.',
    [
        ["1", "Search for a patient by name.", "Search: 'Jane'", "List filters to show only matching patients.", "", "PENDING", "Search", ""],
        ["2", "Click on a patient to view details.", "Patient ID", "Displays all historical assessments with dates and risk levels.", "", "PENDING", "UI/History", ""],
        ["3", "Open an assessment record from the history list.", "Assessment ID", "Modal opens showing full vital details and AI recommendations.", "", "PENDING", "UI/Detail", ""]
    ]
)

# --- Patient Test Cases ---

# 1. Dashboard
create_test_case_file(
    'test-cases/patient/dashboard_test_cases.xlsx',
    'Patient Dashboard', 'TC_PAT_DASH_01', 'High', 'PAT_F01',
    'Verify Personal Health Overview',
    '1. User is logged in as a Patient.\n2. User is on the Dashboard.',
    'Patient can see their own status clearly.',
    [
        ["1", "View the 'Latest Assessment' card.", "N/A", "Displays the result of the most recent assessment performed by a doctor.", "", "PENDING", "UI", ""],
        ["2", "Verify that clinical data is restricted to own records.", "N/A", "No other patient data is visible.", "", "PENDING", "Security", ""]
    ]
)

# 2. Wellness Check
create_test_case_file(
    'test-cases/patient/wellness_check_test_cases.xlsx',
    'Wellness Check', 'TC_PAT_WELLNESS_01', 'Medium', 'PAT_F02',
    'Verify Daily Wellness Logging',
    '1. User is logged in as a Patient.\n2. User is on the Wellness tab.',
    'Daily habits are tracked and available for doctor review.',
    [
        ["1", "Enter sleep hours, water intake, and mood.", "Sleep: 8, Mood: Happy", "Data is accepted.", "", "PENDING", "Data Entry", ""],
        ["2", "Submit the wellness check.", "N/A", "Confirmation message appears; data is saved to DB.", "", "PENDING", "Data Integrity", ""]
    ]
)

# 3. Clinical History
create_test_case_file(
    'test-cases/patient/clinical_history_test_cases.xlsx',
    'Clinical History', 'TC_PAT_RECORDS_01', 'High', 'PAT_F03',
    'Verify Access to Personal Medical Records',
    '1. User is logged in as a Patient.',
    'Patient remains informed about their clinical progress.',
    [
        ["1", "Navigate to 'Clinical History' (or Records).", "N/A", "List shows all assessments performed on the patient.", "", "PENDING", "History", ""],
        ["2", "View recommendations from a specific record.", "Assessment ID", "Doctor's advice and AI recommendations are clearly visible.", "", "PENDING", "UI", ""]
    ]
)

# 4. Access Control
create_test_case_file(
    'test-cases/patient/access_control_test_cases.xlsx',
    'Access Control', 'TC_PAT_AUTH_01', 'Critical', 'PAT_F04',
    'Verify Secure Doctor Authorization via Access Codes',
    '1. User is logged in as a Patient.\n2. User is on the Doctors screen.',
    'Patient data is shared only with authorized personnel.',
    [
        ["1", "Click 'Generate Access Code'.", "N/A", "A unique 6-digit code is displayed.", "", "PENDING", "Security", ""],
        ["2", "Wait for 11 minutes and try to use the code.", "N/A", "System should indicate the code has EXPIRED.", "", "PENDING", "Security", "10-minute expiry rule."],
        ["3", "Give a valid code to a Doctor.", "6-digit code", "Doctor gains access to patient records for 24 hours.", "", "PENDING", "Security", "Permission sync check."]
    ]
)

print("Test cases generated successfully in test-cases/ directory.")
