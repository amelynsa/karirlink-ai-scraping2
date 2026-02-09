export function summarizeRunResult(
  extractedData: Object[],
  usageData: Object[],
  numberOfSources: number,
): void {
  console.log("\n=== Rangkuman Running Scraper ===");
  console.log(`Jumlah sumber utama: ${numberOfSources}`);
  console.log(`Total data yang diambil: ${extractedData.length}`);
  const successfulExtractions = extractedData.filter(
    (item: any) => item.success,
  );
  console.log(`Berhasil: ${successfulExtractions.length}`);
  console.log(`Gagal: ${extractedData.length - successfulExtractions.length}`);

  const totalTokensUsed = usageData.reduce((sum: number, usage: any) => {
    return sum + (usage.totalTokenCount || 0);
  }, 0);
  console.log(`Total token yang digunakan: ${totalTokensUsed}`);
  console.log("=== Selesai ===\n");
}
