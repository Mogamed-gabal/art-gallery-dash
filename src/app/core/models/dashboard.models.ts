export type ViewKey = 'overview' | 'content' | 'artworks' | 'categories' | 'orders' | 'courses' | 'requests';
export interface DashboardStat { label: string; value: string; delta: string; icon: string; tone: string; }
export const dashboardNav: { key: ViewKey; label: string; icon: string }[] = [
  { key: 'overview', label: 'نظرة عامة', icon: '⌂' }, { key: 'requests', label: 'طلبات خاصة', icon: '✦' }, { key: 'orders', label: 'الطلبات', icon: '▣' }, { key: 'artworks', label: 'الأعمال الفنية', icon: '◉' }, { key: 'categories', label: 'التصنيفات', icon: '◇' }, { key: 'courses', label: 'الكورسات', icon: '▥' }, { key: 'content', label: 'محتوى المعرض', icon: '▤' },
];

