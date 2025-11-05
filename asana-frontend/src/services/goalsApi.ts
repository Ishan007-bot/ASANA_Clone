// Goals API Service - Using localStorage for now (no backend route exists)
export interface Goal {
  id: string;
  title: string;
  timePeriod: string;
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalData {
  title: string;
  timePeriod: string;
}

const STORAGE_KEY = 'asana_goals';

const goalsApi = {
  // Get all goals
  async getAll(): Promise<Goal[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (err) {
      console.error('Error loading goals:', err);
      return [];
    }
  },

  // Get goal by ID
  async getById(id: string): Promise<Goal | null> {
    try {
      const goals = await this.getAll();
      return goals.find(g => g.id === id) || null;
    } catch (err) {
      console.error('Error loading goal:', err);
      return null;
    }
  },

  // Create goal
  async create(data: CreateGoalData): Promise<Goal> {
    const goals = await this.getAll();
    const newGoal: Goal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: data.title.trim(),
      timePeriod: data.timePeriod,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    goals.push(newGoal);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    return newGoal;
  },

  // Update goal
  async update(id: string, data: Partial<CreateGoalData>): Promise<Goal> {
    const goals = await this.getAll();
    const index = goals.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Goal not found');
    }
    goals[index] = {
      ...goals[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    return goals[index];
  },

  // Delete goal
  async delete(id: string): Promise<void> {
    const goals = await this.getAll();
    const filtered = goals.filter(g => g.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },
};

export default goalsApi;

