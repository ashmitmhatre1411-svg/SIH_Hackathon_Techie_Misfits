import csv
from models import IndianStandard

def seed_from_csv(db: Session, filepath: str):
    with open(filepath, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            standard = IndianStandard(
                is_code=row['is_code'],
                title=row['title'],
                department=row['department'],
                is_qco_mandatory=row['is_qco_mandatory'].lower() == 'true',
                description=row['description']
            )
            db.add(standard)
        db.commit()
