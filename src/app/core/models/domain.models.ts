export interface User { id: string; email: string; fullName: string; }
export interface ArtworkImage { id: string; url: string; publicId: string; isPrimary: boolean; }
export interface Category { id: string; nameAr: string; nameEn: string; slug: string; artworks?: Artwork[]; artworksCount?: number; }
export interface Artwork { id: string; titleAr: string; titleEn: string; storyAr: string; storyEn: string; price: string; discountPrice: string | null; onSale: boolean; quantity: number; isBestSeller: boolean; status: 'AVAILABLE' | 'SOLD_OUT'; category: Category; images: ArtworkImage[]; createdAt: string; updatedAt: string; }
export interface OrderItem { id: string; itemType: 'ARTWORK'; artwork?: Artwork | null; quantity: number; unitPrice: string; lineTotal: string; }
export interface Order { id: string; orderNumber: string; customerName: string; phone: string; whatsappPhone: string | null; email: string | null; shippingAddress: string; totalAmount: string; paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED'; orderStatus: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'; items: OrderItem[]; createdAt: string; }
export interface Course { id: string; title: string; description: string; externalUrl: string; welcomeVideoUrl?: string | null; isActive: boolean; createdAt: string; updatedAt: string; }
export interface SiteContent { hero: { titleAr: string; titleEn: string; subtitleAr: string; subtitleEn: string; imageUrl: string } | null; about: { titleAr: string; titleEn: string; bioAr: string; bioEn: string; image1Url: string; image2Url: string } | null; contact: { titleAr: string; titleEn: string; descriptionAr: string; descriptionEn: string; phone: string; whatsapp: string; email: string; socialLinks?: Record<string, string> } | null; }
export interface PaginatedResponse<T> { items: T[]; meta: { page: number; limit: number; total: number; totalPages: number }; }
export interface ClientRequestImage { url: string; publicId?: string; }
export interface ClientRequest { id: string; name?: string; phone: string; whatsapp?: string; email?: string; description: string; images: (string | ClientRequestImage)[]; status?: 'NEW' | 'CONTACTED' | 'CLOSED'; createdAt: string; }
export type ApiPayload<T> = { success: true; statusCode: number; data: T; message: string };
