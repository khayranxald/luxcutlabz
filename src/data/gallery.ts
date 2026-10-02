export type GalleryItem = {
  id: string;
  label: string;
};

// Sementara pakai label saja — foto asli akan diupload lewat admin dashboard (Week 5)
export const galleryItems: GalleryItem[] = [
  { id: "g1", label: "Fade Cut" },
  { id: "g2", label: "Beard Shape" },
  { id: "g3", label: "Studio Interior" },
  { id: "g4", label: "Classic Cut" },
  { id: "g5", label: "Styling Session" },
  { id: "g6", label: "Textured Crop" },
];
