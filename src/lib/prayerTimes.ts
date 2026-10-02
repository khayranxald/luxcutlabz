type PrayerTimes = {
  maghrib: string;
  isya: string;
};

let cachedCityId: string | null = null;

async function getParepareCityId(): Promise<string | null> {
  if (cachedCityId) return cachedCityId;

  try {
    const res = await fetch("https://api.myquran.com/v3/sholat/kabkota/cari/parepare");
    if (!res.ok) return null;

    const json = await res.json();
    const results: { id: string; lokasi: string }[] = json?.data ?? [];

    const match = results.find((r) => r.lokasi?.toUpperCase().includes("PAREPARE"));
    if (!match) return null;

    cachedCityId = match.id;
    return match.id;
  } catch {
    return null;
  }
}

function isValidTimeString(value: unknown): value is string {
  return typeof value === "string" && /^\d{1,2}:\d{2}/.test(value);
}

export async function getPrayerTimes(date: string): Promise<PrayerTimes | null> {
  try {
    const cityId = await getParepareCityId();
    if (!cityId) return null;

    const res = await fetch(`https://api.myquran.com/v3/sholat/jadwal/${cityId}/${date}?tz=Asia/Jakarta`);
    if (!res.ok) return null;

    const json = await res.json();
    const jadwal = json?.data?.jadwal;

    // Validasi ketat: hanya kembalikan data kalau BENAR-BENAR ada maghrib & isya
    // dalam format jam yang valid. Kalau struktur API beda dari dugaan, berhenti
    // di sini dengan null — jangan diteruskan ke komponen dalam kondisi rusak.
    if (!isValidTimeString(jadwal?.maghrib) || !isValidTimeString(jadwal?.isya)) {
      console.warn("Format jadwal sholat tidak sesuai dugaan:", jadwal);
      return null;
    }

    return {
      maghrib: jadwal.maghrib,
      isya: jadwal.isya,
    };
  } catch (err) {
    console.warn("Gagal mengambil jadwal sholat:", err);
    return null;
  }
}
