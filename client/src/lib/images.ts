// Vape shop interior images
export const interiorImages = [
  "https://images.unsplash.com/photo-1606584117563-5a5f4f0cb197?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1558138818-d44c4dbe7888?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1561646761-e3a9d0a58d73?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600429991827-5c6bdd4b62ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
];

// Vape products images
export const productImages = [
  "https://images.unsplash.com/photo-1644162066429-c919e1853483?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1557506150-0eda38c07203?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1563488225051-a3ec1238337e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1616711906333-23cf81d0fb4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1595163925099-e73fbcfd4516?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1616511132520-393748862126?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
];

// Vape accessories images
export const accessoryImages = [
  "https://images.unsplash.com/photo-1616049872849-7f3ff7acf2df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1617751594683-8ba22b045118?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1606271591734-5f0e201fb11e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1587914839172-657bb0a73325?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
];

// Get random image from the arrays
export function getRandomInteriorImage() {
  return interiorImages[Math.floor(Math.random() * interiorImages.length)];
}

export function getRandomProductImage() {
  return productImages[Math.floor(Math.random() * productImages.length)];
}

export function getRandomAccessoryImage() {
  return accessoryImages[Math.floor(Math.random() * accessoryImages.length)];
}
