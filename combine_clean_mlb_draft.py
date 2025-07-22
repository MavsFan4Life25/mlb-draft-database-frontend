import os
import pandas as pd
import re

def standardize_position(pos):
    pos = str(pos).upper().strip()
    if pos in ['P', 'C', '1B', '2B', '3B', 'SS', 'OF']:
        return pos
    if 'PITCH' in pos:
        return 'P'
    if 'CATCH' in pos:
        return 'C'
    if 'OUT' in pos:
        return 'OF'
    if 'INFIELD' in pos:
        return 'IF'
    if 'FIRST' in pos:
        return '1B'
    if 'SECOND' in pos:
        return '2B'
    if 'THIRD' in pos:
        return '3B'
    if 'SHORT' in pos:
        return 'SS'
    return pos

def group_school(school):
    # Group all high schools as 'HS', keep others as-is
    if isinstance(school, str) and re.match(r'^HS\b', school.strip(), re.IGNORECASE):
        return 'HS'
    return school

csv_files = [f for f in os.listdir('.') if f.startswith('mlb_draft_') and f.endswith('.csv') and 'complete' in f]

all_data = []
for file in csv_files:
    match = re.search(r'(\d{4})', file)
    year = match.group(1) if match else ''
    print(f"Reading {file} (Year: {year})")
    df = pd.read_csv(file)
    df['Year'] = year
    all_data.append(df)

combined = pd.concat(all_data, ignore_index=True)

cleaned_rows = []
for idx, row in combined.iterrows():
    round_num = str(row['Round']) if 'Round' in row and pd.notnull(row['Round']) else ''
    pick_num = str(row['Pick']) if 'Pick' in row and pd.notnull(row['Pick']) else ''
    round_pick = f"Round {round_num} Pick {pick_num}" if round_num and pick_num else ''

    # Group all HS as 'HS', keep colleges/others as-is
    pre_draft = str(row['Pre-Draft Team']) if 'Pre-Draft Team' in row else ''
    school = group_school(pre_draft)
    if not school or school == '' or pd.isna(school):
        # fallback to 'School' column if available
        school = row['School'] if 'School' in row and pd.notnull(row['School']) else ''

    # Robust Bat/Throw splitting
    bt = str(row['B/T']) if 'B/T' in row else ''
    bat, throw = '', ''
    if '/' in bt:
        parts = [x.strip().upper() for x in bt.split('/')]
        if len(parts) > 0 and parts[0] in ['L', 'R', 'S']:
            bat = parts[0]
        if len(parts) > 1 and parts[1] in ['L', 'R']:
            throw = parts[1]

    signed_bonus = str(row['Signed Bonus']) if 'Signed Bonus' in row else ''
    if '(unsigned)' in signed_bonus.lower():
        signed_bonus_display = '(unsigned)'
    else:
        signed_bonus_display = signed_bonus

    pos_val = row['Pos'] if 'Pos' in row else row.get('Position', '')
    position = standardize_position(pos_val)

    cleaned_rows.append({
        'Year': row['Year'] if 'Year' in row else year,
        'Round': round_num,
        'Pick': pick_num,
        'RoundPick': round_pick,
        'Name': row['Player'] if 'Player' in row else row.get('Name', ''),
        'TeamDrafted': row['Team'] if 'Team' in row else '',
        'School': school,
        'AgeAtDraft': row['Age'] if 'Age' in row else '',
        'Position': position,
        'Bat': bat,
        'Throw': throw,
        'SlottedBonus': row['Slotted Bonus'] if 'Slotted Bonus' in row else '',
        'SignedBonus': signed_bonus_display,
        'Diff': row['+/- Diff'] if '+/- Diff' in row else '',
    })

cleaned_df = pd.DataFrame(cleaned_rows)
cleaned_df.to_csv('mlb_draft_all_cleaned.csv', index=False)

print("Sample of cleaned data:")
print(cleaned_df.head(10))
print(f"\nSaved cleaned data to mlb_draft_all_cleaned.csv with {len(cleaned_df)} rows.")
