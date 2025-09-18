# Doctor Login Instructions

## Dr. Priya Sharma - Doctor Account

A predefined doctor account has been created for testing and demonstration purposes.

### Login Credentials

**Email Options:**
- `priya@doctor.com`
- `priya@psynergy.com`

**Password:** Any password (mock authentication)

### Doctor Profile Details

- **Name:** Dr. Priya Sharma
- **Specialization:** Clinical Psychology
- **Experience:** 8 years
- **Qualification:** MD Psychiatry, PhD Clinical Psychology
- **Role:** Doctor

### How to Login

1. Navigate to: http://localhost:3001/auth/login
2. Enter one of the email addresses above
3. Enter any password
4. Click "Sign In"
5. You will be automatically redirected to the Doctor Dashboard at `/doctor`

### Doctor Dashboard Features

After logging in as Dr. Priya, you will have access to:

1. **Doctor Dashboard** (`/doctor`)
   - Patient overview and statistics
   - Risk assessment monitoring
   - Quick access to patient records

2. **Patient Mood Monitoring** (`/doctor/moods`)
   - View all patient mood entries
   - Filter patients by risk level
   - Monitor mood trends and patterns

3. **Appointment Management** (`/doctor/appointments`)
   - View and manage patient appointments
   - Filter by date and status
   - Track appointment types (video, phone, in-person)

### Navigation

The navigation menu will automatically show doctor-specific options:
- Doctor Dashboard
- Patient Moods
- Appointments
- Logout

### Testing the System

1. **Login as Dr. Priya** using the credentials above
2. **Explore the Doctor Dashboard** to see patient statistics
3. **Check Patient Moods** to monitor mental health data
4. **Review Appointments** to see scheduled sessions
5. **Test Navigation** between different doctor features

### Additional Doctor Accounts

You can also create other doctor accounts using any email containing "doctor" or "dr.":
- `doctor@example.com`
- `dr.smith@hospital.com`
- `anydoctor@clinic.com`

These will create generic doctor accounts with basic information.

### Student and Admin Accounts

For comparison, you can also test:
- **Student Account:** Any email not containing "doctor" or "admin"
- **Admin Account:** Any email containing "admin" or "institute"

Each role will redirect to their respective dashboards with appropriate features and permissions.
