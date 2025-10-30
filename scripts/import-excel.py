#!/usr/bin/env python3
"""
Import job applications from Excel spreadsheet to PostgreSQL database
Matches the exact format of "Copy of Job Search - Aug 2025.xlsx"
"""

import openpyxl
import psycopg2
from datetime import datetime
import sys

# Database connection (Docker PostgreSQL)
DB_CONFIG = {
    'host': 'localhost',
    'port': '5433',  # Docker PostgreSQL port
    'database': 'applysimple',
    'user': 'postgres',
    'password': 'postgres'
}

def parse_cover_letter(value):
    """Convert Yes/No to boolean"""
    if not value:
        return False
    return str(value).strip().lower() in ['yes', 'y', 'true', '1']

def determine_status(num_rounds, outcome_date):
    """Determine application status based on data"""
    if outcome_date:
        return "Rejected"  # Assuming most outcomes are rejections
    elif num_rounds and num_rounds > 0:
        return "Interview"
    else:
        return "Applied"

def import_excel(file_path):
    """Import applications from Excel file"""

    print(f"📂 Reading Excel file: {file_path}")
    wb = openpyxl.load_workbook(file_path)
    sheet = wb.active

    # Connect to database
    print(f"🔗 Connecting to database...")
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    # Clear existing data (optional)
    print("🗑️  Clearing existing data...")
    cur.execute('DELETE FROM applications')

    imported = 0
    skipped = 0

    print("📥 Importing applications...")

    # Column indices (0-based):
    # 0: Company, 1: Job Title, 2: Date Applied, 3: Salary, 4: Job Type
    # 5: Cover Letter?, 6: Number of Rounds, 7: Date of Offer/Rejection
    # 8: Found On?, 9: Link to Job Posting, 10: Notes

    for row in sheet.iter_rows(min_row=2, values_only=True):
        company = row[0]

        # Skip empty rows
        if not company:
            continue

        job_title = row[1]
        date_applied = row[2]
        salary = row[3]
        job_type = row[4]
        cover_letter = parse_cover_letter(row[5])
        num_rounds = int(row[6]) if row[6] and row[6] != 0 else None
        date_of_outcome = row[7]
        found_on = row[8] or "Unknown"
        job_url = row[9]
        notes = row[10]

        # Determine status
        status = determine_status(num_rounds, date_of_outcome)

        # Validate required fields
        if not job_title or not date_applied:
            print(f"⚠️  Skipping {company} - missing required fields")
            skipped += 1
            continue

        try:
            # Insert into database
            cur.execute("""
                INSERT INTO applications (
                    id, company, "jobTitle", salary, "jobType", "jobUrl",
                    "dateApplied", "foundOn", "coverLetterUsed",
                    "numberOfRounds", "dateOfOutcome", notes, status,
                    "createdAt", "updatedAt"
                ) VALUES (
                    gen_random_uuid(), %s, %s, %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s, %s,
                    NOW(), NOW()
                )
            """, (
                company, job_title, salary, job_type, job_url,
                date_applied, found_on, cover_letter,
                num_rounds, date_of_outcome, notes, status
            ))
            imported += 1

            if imported % 50 == 0:
                print(f"  ✓ Imported {imported} applications...")

        except Exception as e:
            print(f"❌ Error importing {company} - {job_title}: {e}")
            skipped += 1
            continue

    # Commit changes
    conn.commit()
    cur.close()
    conn.close()

    print(f"\n{'='*60}")
    print(f"✅ Import complete!")
    print(f"   Imported: {imported} applications")
    print(f"   Skipped: {skipped} applications")
    print(f"{'='*60}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        # Default path
        file_path = "/mnt/c/Users/hessm/Downloads/Copy of Job Search - Aug 2025.xlsx"

    try:
        import_excel(file_path)
    except FileNotFoundError:
        print(f"❌ File not found: {file_path}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
