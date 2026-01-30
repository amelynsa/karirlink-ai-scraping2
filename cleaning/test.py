import pandas as pd
import os

# ==========================================
#  KONFIGURASI FILE
# ==========================================
NAMA_FILE_INPUT = 'test-result-2026-01-28T12-33-31-998Z.csv'
# ==========================================

# --- 1. SETUP LOKASI FILE ---
script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, '..', 'storage', NAMA_FILE_INPUT)

print(f" Memproses file: {file_path}")

if not os.path.exists(file_path):
    print(" ERROR: File tidak ditemukan.")
    exit()

# --- 2. BACA CSV (DELIMITER ;) ---
df = pd.read_csv(
    file_path,
    sep=';',
    encoding='utf-8',
    on_bad_lines='skip'
)

print(f" Total data awal: {len(df)}")
print(" Kolom terbaca:", df.columns.tolist())

# --- 3. HAPUS HANYA success = false ---
if 'success' in df.columns:
    df['success'] = df['success'].astype(str).str.lower().str.strip()
    before = len(df)
    df = df[df['success'] != 'false']
    print(f" Data success=false dibuang: {before - len(df)}")

# --- 4. HAPUS DUPLIKAT (title + location + jobDescription) ---
kolom_duplikat = ['title', 'location', 'jobDescription']

if all(col in df.columns for col in kolom_duplikat):
    before = len(df)
    df = df.drop_duplicates(subset=kolom_duplikat, keep='first')
    print(f" Data duplikat dibuang: {before - len(df)}")
else:
    print(" Kolom duplikat tidak lengkap, skip step ini")

# --- 5. SIMPAN HASIL (NAMA BARU BIAR AMAN) ---
output_name = NAMA_FILE_INPUT.replace('.csv', '_CLEANED_FINAL_V2.csv')
output_file = os.path.join(script_dir, '..', 'storage', output_name)

df.to_csv(output_file, index=False)
print(f" SELESAI! File tersimpan di:\n{output_file}")