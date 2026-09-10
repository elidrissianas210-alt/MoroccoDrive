export interface Agency { id: string; ownerId: string; name: string; slug: string; description: string | null; city: string; phone: string; email: string; logoUrl: string | null; isVerified: boolean; }
export interface Vehicle { id: string; agencyId: string; make: string; model: string; year: number; category: string; transmission: string; fuelType: string; seats: number; dailyPriceMad: number; registrationNumber: string; imageUrl: string | null; isAvailable: boolean; }

export interface CarImage { id: string; carId: string; storagePath: string; publicUrl: string; sortOrder: number; }
