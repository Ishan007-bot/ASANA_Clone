// Portfolios API Service - Using localStorage for now (no backend route exists)
export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioData {
  name: string;
  description?: string;
}

const STORAGE_KEY = 'asana_portfolios';

const portfoliosApi = {
  // Get all portfolios
  async getAll(): Promise<Portfolio[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (err) {
      console.error('Error loading portfolios:', err);
      return [];
    }
  },

  // Get portfolio by ID
  async getById(id: string): Promise<Portfolio | null> {
    try {
      const portfolios = await this.getAll();
      return portfolios.find(p => p.id === id) || null;
    } catch (err) {
      console.error('Error loading portfolio:', err);
      return null;
    }
  },

  // Create portfolio
  async create(data: CreatePortfolioData): Promise<Portfolio> {
    const portfolios = await this.getAll();
    const newPortfolio: Portfolio = {
      id: `portfolio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name.trim(),
      description: data.description?.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    portfolios.push(newPortfolio);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolios));
    return newPortfolio;
  },

  // Update portfolio
  async update(id: string, data: Partial<CreatePortfolioData>): Promise<Portfolio> {
    const portfolios = await this.getAll();
    const index = portfolios.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Portfolio not found');
    }
    portfolios[index] = {
      ...portfolios[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolios));
    return portfolios[index];
  },

  // Delete portfolio
  async delete(id: string): Promise<void> {
    const portfolios = await this.getAll();
    const filtered = portfolios.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },
};

export default portfoliosApi;

