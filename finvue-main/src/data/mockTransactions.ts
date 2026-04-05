export interface Transaction {
  id: string;
  date: string;
  description: string;
  merchant: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

export const mockTransactions: Transaction[] = [
  { id: '1', date: '2025-04-12', description: 'Monthly Salary - TechCorp', merchant: 'TechCorp', category: 'Salary', type: 'income', amount: 120000, status: 'completed' },
  { id: '2', date: '2025-04-10', description: 'Luxury Apartment Rent', merchant: 'Prestige Estates', category: 'Housing', type: 'expense', amount: 25000, status: 'completed' },
  { id: '3', date: '2025-04-08', description: 'Freelance UI/UX Project', merchant: 'DesignHub', category: 'Freelance', type: 'income', amount: 35000, status: 'completed' },
  { id: '4', date: '2025-04-06', description: 'Grocery Shopping', merchant: 'BigBasket', category: 'Food & Dining', type: 'expense', amount: 2200, status: 'completed' },
  { id: '5', date: '2025-04-05', description: 'Mutual Fund SIP', merchant: 'Groww', category: 'Investments', type: 'income', amount: 15000, status: 'completed' },
  { id: '6', date: '2025-04-03', description: 'Uber Rides Weekly', merchant: 'Uber', category: 'Transport', type: 'expense', amount: 1100, status: 'completed' },
  { id: '7', date: '2025-04-01', description: 'Netflix & Spotify Subscription', merchant: 'Netflix', category: 'Entertainment', type: 'expense', amount: 1200, status: 'completed' },
  { id: '8', date: '2025-03-28', description: 'Monthly Salary - TechCorp', merchant: 'TechCorp', category: 'Salary', type: 'income', amount: 118000, status: 'completed' },
  { id: '9', date: '2025-03-25', description: 'Online Course - Advanced React', merchant: 'Udemy', category: 'Education', type: 'expense', amount: 4500, status: 'completed' },
  { id: '10', date: '2025-03-22', description: 'Health Insurance Premium', merchant: 'Star Health', category: 'Healthcare', type: 'expense', amount: 3200, status: 'completed' },
  { id: '11', date: '2025-03-20', description: 'Freelance Mobile App', merchant: 'AppWorks', category: 'Freelance', type: 'income', amount: 42000, status: 'completed' },
  { id: '12', date: '2025-03-18', description: 'Electricity & Water Bill', merchant: 'BESCOM', category: 'Utilities', type: 'expense', amount: 2800, status: 'completed' },
  { id: '13', date: '2025-03-15', description: 'Shopping - Clothes & Shoes', merchant: 'Myntra', category: 'Shopping', type: 'expense', amount: 6500, status: 'completed' },
  { id: '14', date: '2025-03-12', description: 'Dinner at Fine Dining', merchant: 'The Leela Palace', category: 'Food & Dining', type: 'expense', amount: 2400, status: 'completed' },
  { id: '15', date: '2025-03-10', description: 'Dividend Income - HDFC', merchant: 'HDFC Bank', category: 'Investments', type: 'income', amount: 8500, status: 'completed' },
  { id: '16', date: '2025-03-05', description: 'Luxury Apartment Rent', merchant: 'Prestige Estates', category: 'Housing', type: 'expense', amount: 25000, status: 'completed' },
  { id: '17', date: '2025-02-28', description: 'Monthly Salary - TechCorp', merchant: 'TechCorp', category: 'Salary', type: 'income', amount: 115000, status: 'completed' },
  { id: '18', date: '2025-02-25', description: 'Freelance Consulting', merchant: 'Deloitte', category: 'Freelance', type: 'income', amount: 28000, status: 'pending' },
  { id: '19', date: '2025-02-22', description: 'Flight Tickets - Goa', merchant: 'IndiGo Airlines', category: 'Transport', type: 'expense', amount: 8500, status: 'completed' },
  { id: '20', date: '2025-02-18', description: 'Amazon Shopping Spree', merchant: 'Amazon', category: 'Shopping', type: 'expense', amount: 7800, status: 'completed' },
  { id: '21', date: '2025-02-15', description: 'Internet & WiFi Bill', merchant: 'Airtel', category: 'Utilities', type: 'expense', amount: 1500, status: 'completed' },
  { id: '22', date: '2025-02-10', description: 'Stock Trading Profit', merchant: 'Zerodha', category: 'Investments', type: 'income', amount: 22000, status: 'completed' },
  { id: '23', date: '2025-02-05', description: 'Luxury Apartment Rent', merchant: 'Prestige Estates', category: 'Housing', type: 'expense', amount: 25000, status: 'completed' },
  { id: '24', date: '2025-01-30', description: 'Monthly Salary - TechCorp', merchant: 'TechCorp', category: 'Salary', type: 'income', amount: 110000, status: 'completed' },
  { id: '25', date: '2025-01-25', description: 'Gym Membership Renewal', merchant: 'Cult.fit', category: 'Healthcare', type: 'expense', amount: 4000, status: 'completed' },
  { id: '26', date: '2025-01-20', description: 'Movie & Popcorn Night', merchant: 'PVR Cinemas', category: 'Entertainment', type: 'expense', amount: 1800, status: 'completed' },
  { id: '27', date: '2025-01-15', description: 'Freelance Logo Design', merchant: 'CreativeSpark', category: 'Freelance', type: 'income', amount: 18000, status: 'completed' },
  { id: '28', date: '2025-01-10', description: 'Zomato Food Orders', merchant: 'Zomato', category: 'Food & Dining', type: 'expense', amount: 1800, status: 'completed' },
  { id: '29', date: '2025-01-05', description: 'Luxury Apartment Rent', merchant: 'Prestige Estates', category: 'Housing', type: 'expense', amount: 24000, status: 'completed' },
  { id: '30', date: '2024-12-28', description: 'Monthly Salary - TechCorp', merchant: 'TechCorp', category: 'Salary', type: 'income', amount: 105000, status: 'completed' },
  { id: '31', date: '2024-12-20', description: 'Year-End Bonus', merchant: 'TechCorp', category: 'Salary', type: 'income', amount: 85000, status: 'completed' },
  { id: '32', date: '2024-12-15', description: 'Christmas Shopping', merchant: 'Flipkart', category: 'Shopping', type: 'expense', amount: 5500, status: 'completed' },
  { id: '33', date: '2024-12-10', description: 'Gas Pipeline Bill', merchant: 'IGL', category: 'Utilities', type: 'expense', amount: 950, status: 'failed' },
  { id: '34', date: '2024-11-28', description: 'Monthly Salary - TechCorp', merchant: 'TechCorp', category: 'Salary', type: 'income', amount: 100000, status: 'completed' },
  { id: '35', date: '2024-11-15', description: 'Diwali Bonus', merchant: 'TechCorp', category: 'Salary', type: 'income', amount: 50000, status: 'completed' },
];

export const categories = ['Salary', 'Freelance', 'Investments', 'Housing', 'Food & Dining', 'Transport', 'Healthcare', 'Entertainment', 'Shopping', 'Utilities', 'Education'];
