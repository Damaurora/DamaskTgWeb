import { Category, Product, Location, News } from "@shared/schema";

export const categoryIcons: Record<string, string> = {
  pods: "crown",
  "pod-mods": "flashlight",
  tobacco: "leaf",
  disposables: "battery-2-charge",
  "e-liquids": "drop",
  hookahs: "box-3",
  "chewing-tobacco": "paint",
  vaporizers: "cloud",
  accessories: "tools"
};

// Mapped icon names to Lucide React components
export const iconMap: Record<string, string> = {
  crown: "CrownIcon",
  flashlight: "ZapIcon",
  leaf: "LeafIcon",
  "battery-2-charge": "BatteryChargingIcon",
  drop: "DropletIcon",
  "box-3": "PackageIcon",
  paint: "PaintbrushIcon",
  cloud: "CloudIcon",
  tools: "WrenchIcon",
  fire: "FlameIcon"
};

// Default images for categories if none provided
export const defaultCategoryImages: Record<string, string> = {
  pods: "https://images.unsplash.com/photo-1644162066429-c919e1853483?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "pod-mods": "https://images.unsplash.com/photo-1557506150-0eda38c07203?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  tobacco: "https://images.unsplash.com/photo-1563488225051-a3ec1238337e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  disposables: "https://images.unsplash.com/photo-1616711906333-23cf81d0fb4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "e-liquids": "https://images.unsplash.com/photo-1595163925099-e73fbcfd4516?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  hookahs: "https://images.unsplash.com/photo-1616511132520-393748862126?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "chewing-tobacco": "https://images.unsplash.com/photo-1616049872849-7f3ff7acf2df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  vaporizers: "https://images.unsplash.com/photo-1617751594683-8ba22b045118?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  accessories: "https://images.unsplash.com/photo-1606271591734-5f0e201fb11e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
};
