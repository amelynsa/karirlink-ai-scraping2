import pandas as pd
import re
import os

# ==========================================
# 🔧 KONFIGURASI FILE
# ==========================================
# Ganti nama file di sini sesuai file yang mau kamu cleaning
NAMA_FILE_INPUT = 'test-result-2026-01-28T12-33-31-998Z.csv'
# ==========================================

# --- 1. SETUP LOKASI FILE ---
script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, '..', 'storage', NAMA_FILE_INPUT)

print(f" Memproses file: {file_path}")

if not os.path.exists(file_path):
    print(" ERROR: File tidak ditemukan di folder storage.")
    exit()

# --- 2. BACA FILE CSV ---
try:
    # Membaca CSV
    df = pd.read_csv(file_path, on_bad_lines='skip')
    print(f" Total data awal: {len(df)}")
except Exception as e:
    print(f" Gagal membaca CSV. Error: {e}")
    exit()

# --- 3. FILTER DATA HALU (Success=False) ---
if 'success' in df.columns:
    # Pastikan hanya mengambil yang success=true
    df = df[df['success'].astype(str).str.lower() == 'true']

# --- 4. KAMUS PEMBENARAN NAMA ---
mapping_resmi = {
    "BRI": "PT Bank Rakyat Indonesia (Persero) Tbk",
    "BANK BRI": "PT Bank Rakyat Indonesia (Persero) Tbk",
    "PT. BANK RAKYAT INDONESIA (PERSERO), TBK": "PT Bank Rakyat Indonesia (Persero) Tbk",

    "MANDIRI": "PT Bank Mandiri (Persero) Tbk",
    "BANK MANDIRI (PERSERO)": "PT Bank Mandiri (Persero) Tbk",

    "BCA": "PT Bank Central Asia Tbk",

    "ICBP": "PT Indofood CBP Sukses Makmur Tbk",
    "ICBP - BEVERAGES - WATER": "PT Indofood CBP Sukses Makmur Tbk",

    "BOGASARI": "PT Indofood Sukses Makmur Tbk (Bogasari)",

    "SHOPEE (SPX EXPRESS)": "PT Shopee International Indonesia (SPX Express)",
    "SHOPEE EXPRESS": "PT Shopee International Indonesia (SPX Express)",

    "GOTO": "PT GoTo Gojek Tokopedia Tbk",

    "SMARTFREN": "PT Smartfren Telecom Tbk",

    "TELKOMSEL": "PT Telekomunikasi Indonesia (Persero) Tbk"
}

# --- 5. CLEANING NAMA PERUSAHAAN ---
def clean_company_name(text):
    if not isinstance(text, str): return "UNKNOWN"
    clean = text.upper()
    # Hapus karakter sampah
    clean = re.sub(r'\bPT\b|\bCV\b|\bTBK\b|\(PERSERO\)|[.,\-()]', ' ', clean)
    clean = " ".join(clean.split())
    
    # Cek Kamus
    if clean in mapping_resmi: return mapping_resmi[clean]
    for key, val in mapping_resmi.items():
        if key in clean: return val
    return clean

print(" Merapikan nama perusahaan...")
if 'company' in df.columns:
    df['company'] = df['company'].apply(clean_company_name)

# --- 6. HAPUS DUPLIKAT (SANGAT SPESIFIK) ---
# Aturan: Hapus HANYA JIKA Company, Title, Location, DAN Description sama persis.
# Kalau lokasi beda dikit (misal Jakarta vs Jakarta Pusat), TIDAK dihapus.

kolom_kunci = ['company', 'title', 'location', 'description']

# Cek dulu apakah kolom-kolom itu ada di file CSV kamu
kolom_ada = [c for c in kolom_kunci if c in df.columns]

# print(f" Cek duplikat berdasarkan kolom: {kolom_ada}")
# print(f"   (Jika lokasi beda sedikit, data TETAP DISIMPAN)")

# awal = len(df)
# df = df.drop_duplicates(subset=kolom_ada)
# akhir = len(df)

# print(f" Data duplikat dibuang: {awal - akhir}")
# print(f" Total data bersih tersisa: {akhir}")

# --- 7. SIMPAN HASIL ---
output_name = NAMA_FILE_INPUT.replace('.csv', '_CLEANED_V2.xlsx')
output_file = os.path.join(script_dir, '..', 'storage', output_name)

df.to_excel(output_file, index=False)
print(f" SELESAI! Hasil: {output_file}")