import { Home, Plane, UtensilsCrossed, DollarSign, ShoppingBag, Zap, Wallet, GraduationCap, Gamepad2, TrendingUp, Briefcase } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Housing: Home,
  Transport: Plane,
  'Food & Dining': UtensilsCrossed,
  Salary: DollarSign,
  Freelance: Briefcase,
  Investments: TrendingUp,
  Shopping: ShoppingBag,
  Utilities: Zap,
  Healthcare: Wallet,
  Education: GraduationCap,
  Entertainment: Gamepad2,
};

const colorMap: Record<string, string> = {
  Housing: '#006b5f',
  Transport: '#004d40',
  'Food & Dining': '#ba1a1a',
  Salary: '#003617',
  Freelance: '#003617',
  Investments: '#003617',
  Shopping: '#006b5f',
  Utilities: '#004d40',
  Healthcare: '#ba1a1a',
  Education: '#006b5f',
  Entertainment: '#004d40',
};

export function getCategoryIcon(category: string) {
  return iconMap[category] || DollarSign;
}

export function getCategoryColor(category: string) {
  return colorMap[category] || '#006b5f';
}
