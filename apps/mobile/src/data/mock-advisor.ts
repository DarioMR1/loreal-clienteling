import type { BeautyAdvisor, SalesMetric } from '@/types';

export const currentAdvisor: BeautyAdvisor = {
  id: 'ba1',
  name: 'Carolina Reyes',
  photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
  store: 'Liverpool Polanco',
  brand: 'Lancôme',
  role: 'ba',
};

export const mockMetrics: SalesMetric[] = [
  { label: 'Venta del mes', value: 148_500, target: 200_000, unit: 'currency' },
  { label: 'Transacciones', value: 42, target: 60, unit: 'count' },
  { label: 'Clientes nuevos', value: 8, target: 15, unit: 'count' },
  { label: 'Seguimientos', value: 18, target: 25, unit: 'count' },
  { label: 'Tasa conversión', value: 68, target: 75, unit: 'percent' },
  { label: 'Citas completadas', value: 14, target: 20, unit: 'count' },
];

export const weeklyAppointmentMetrics = {
  target: 5,
  total: 4,
  new: 2,
  rescheduled: 1,
  cancelled: 0,
};

export const topBrands = [
  { brand: 'Lancôme', sales: 68_000, percentage: 46 },
  { brand: 'YSL Beauty', sales: 42_000, percentage: 28 },
  { brand: "Kiehl's", sales: 24_500, percentage: 16 },
  { brand: 'Giorgio Armani', sales: 14_000, percentage: 10 },
];

export const salesByCategory = [
  { category: 'Skincare', sales: 82_000, percentage: 55 },
  { category: 'Makeup', sales: 44_000, percentage: 30 },
  { category: 'Fragrance', sales: 22_500, percentage: 15 },
];

export const monthlyTrend = [
  { month: 'Ene', value: 120_000 },
  { month: 'Feb', value: 135_000 },
  { month: 'Mar', value: 158_000 },
  { month: 'Abr', value: 148_500 },
];
