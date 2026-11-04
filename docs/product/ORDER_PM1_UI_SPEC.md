# ORDER — PM-1: SPEC WORDING UI (dari Strategy/BOS)
Status: ORDER | Date: 2026-11-03 | Dari: Strategy (bos PM-1 + DEV)
Target: PM-1 session local-fc05e232e3553d563ef8810f130d05c7515a4c063fc3977bbb4af93914622550
Approval: TIDAK BUTUH. Eksekusi langsung.

## Perintah
Buatkan SPEC implementasi dari `docs/product/UI_WORDING_PACK.md` v0.2 agar DEV mengerti tanpa tafsir.

## Input wajib baca
- `docs/product/UI_WORDING_PACK.md`
- `apps/web/app/page.tsx`
- `apps/web/app/radar/page.tsx`
- `apps/web/app/arena/page.tsx`
- `apps/web/app/gated/page.tsx`
- `apps/web/app/denied/page.tsx`
- `apps/web/app/roadmap/page.tsx`
- `apps/web/app/layout.tsx`
- `docs/specs/ARENA_GMGN_SPEC.md` v0.2 (leaderboard arena hapus)

## Output wajib
Tulis `docs/product/UI_COPY_SPEC.md` berisi:
1. Tabel mapping: file → baris/komponen → string lama → string baru persis.
2. Daftar hapus: blok leaderboard arena + blok PM follow-ups roadmap.
3. Daftar larangan: tanpa ubah error code backend, kontrak API, logika trade, Safety Gate.
4. Checklist verifikasi DEV per file (buka, paste, simpan, cek render).
5. Kriteria done + risiko bila string meleset.

## Batas
- Docs only, tanpa kode.
- Bahasa spec Indonesia, string UI Inggris persis.
- Selesai lalu lapor: file dibuat, keputusan pending, langkah DEV.

## Konteks lock (jangan ubah)
Arena-only. RISKY blokir + HIGH RISK. X simpan nonaktif. Reward batch1 badge + spotlight. $WenFUN beku sampai Januari.
