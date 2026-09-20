import { supabase, isSupabaseConfigured } from './supabaseClient';
import { 
  Goal, 
  Task, 
  Habit, 
  FinanceRecord, 
  HealthLog, 
  JournalEntry,
  MindNote 
} from '../types';

export const dbService = {
  // ============================================================================
  // GOALS CRUD
  // ============================================================================
  async fetchGoals(userId: string): Promise<Goal[]> {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching goals from Supabase:', error);
      throw error;
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      category: row.category,
      targetDate: row.target_date,
      currentProgress: row.current_progress || 0,
      status: row.status || 'in-progress',
      targetMetric: row.target_metric || undefined,
      milestones: Array.isArray(row.milestones) ? row.milestones : [],
      createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
    }));
  },

  async createGoal(goal: Omit<Goal, 'id' | 'createdAt'>, userId: string): Promise<Goal> {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('goals')
      .insert([{
        user_id: userId,
        title: goal.title,
        description: goal.description || null,
        category: goal.category,
        target_date: goal.targetDate,
        current_progress: goal.currentProgress || 0,
        status: goal.status || 'in-progress',
        target_metric: goal.targetMetric || null,
        milestones: goal.milestones || []
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating goal in Supabase:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      category: data.category,
      targetDate: data.target_date,
      currentProgress: data.current_progress,
      status: data.status,
      targetMetric: data.target_metric || undefined,
      milestones: data.milestones || [],
      createdAt: data.created_at.split('T')[0]
    };
  },

  async updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
    if (!isSupabaseConfigured) return;
    const dbPayload: any = {};
    if (updates.title !== undefined) dbPayload.title = updates.title;
    if (updates.description !== undefined) dbPayload.description = updates.description;
    if (updates.category !== undefined) dbPayload.category = updates.category;
    if (updates.targetDate !== undefined) dbPayload.target_date = updates.targetDate;
    if (updates.currentProgress !== undefined) dbPayload.current_progress = updates.currentProgress;
    if (updates.status !== undefined) dbPayload.status = updates.status;
    if (updates.targetMetric !== undefined) dbPayload.target_metric = updates.targetMetric;
    if (updates.milestones !== undefined) dbPayload.milestones = updates.milestones;

    const { error } = await supabase
      .from('goals')
      .update(dbPayload)
      .eq('id', id);

    if (error) {
      console.error('Error updating goal in Supabase:', error);
      throw error;
    }
  },

  async deleteGoal(id: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting goal from Supabase:', error);
      throw error;
    }
  },

  // ============================================================================
  // TASKS CRUD
  // ============================================================================
  async fetchTasks(userId: string): Promise<Task[]> {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching tasks from Supabase:', error);
      throw error;
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      priority: row.priority,
      status: row.status,
      dueDate: row.due_date,
      category: row.category,
      linkedGoalId: row.linked_goal_id || undefined,
      createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
    }));
  },

  async createTask(task: Omit<Task, 'id' | 'createdAt'>, userId: string): Promise<Task> {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        user_id: userId,
        title: task.title,
        description: task.description || null,
        priority: task.priority,
        status: task.status,
        due_date: task.dueDate,
        category: task.category,
        linked_goal_id: task.linkedGoalId || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating task in Supabase:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      priority: data.priority,
      status: data.status,
      dueDate: data.due_date,
      category: data.category,
      linkedGoalId: data.linked_goal_id || undefined,
      createdAt: data.created_at.split('T')[0]
    };
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    if (!isSupabaseConfigured) return;
    const dbPayload: any = {};
    if (updates.title !== undefined) dbPayload.title = updates.title;
    if (updates.description !== undefined) dbPayload.description = updates.description;
    if (updates.priority !== undefined) dbPayload.priority = updates.priority;
    if (updates.status !== undefined) dbPayload.status = updates.status;
    if (updates.dueDate !== undefined) dbPayload.due_date = updates.dueDate;
    if (updates.category !== undefined) dbPayload.category = updates.category;
    if (updates.linkedGoalId !== undefined) dbPayload.linked_goal_id = updates.linkedGoalId || null;

    const { error } = await supabase
      .from('tasks')
      .update(dbPayload)
      .eq('id', id);

    if (error) {
      console.error('Error updating task in Supabase:', error);
      throw error;
    }
  },

  async deleteTask(id: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task in Supabase:', error);
      throw error;
    }
  },

  // ============================================================================
  // HABITS & HABIT LOGS CRUD
  // ============================================================================
  async fetchHabits(userId: string): Promise<Habit[]> {
    if (!isSupabaseConfigured) return [];
    
    // Fetch habits and their completion logs
    const [habitsRes, logsRes] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('habit_logs').select('*').eq('user_id', userId)
    ]);

    if (habitsRes.error) {
      console.error('Error fetching habits from Supabase:', habitsRes.error);
      throw habitsRes.error;
    }

    const logsMap: Record<string, Record<string, boolean>> = {};
    (logsRes.data || []).forEach((log: any) => {
      if (!logsMap[log.habit_id]) logsMap[log.habit_id] = {};
      logsMap[log.habit_id][log.completed_date] = true;
    });

    return (habitsRes.data || []).map((row: any) => {
      const history = logsMap[row.id] || {};
      
      // Calculate current streak
      let currentStreak = 0;
      let checkDate = new Date();
      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (history[dateStr]) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (currentStreak === 0) {
          // Check yesterday in case today isn't done yet
          checkDate.setDate(checkDate.getDate() - 1);
          const yesterdayStr = checkDate.toISOString().split('T')[0];
          if (history[yesterdayStr]) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        } else {
          break;
        }
      }

      const totalCompleted = Object.keys(history).length;
      const bestStreak = Math.max(currentStreak, totalCompleted > 0 ? currentStreak : 0);

      return {
        id: row.id,
        title: row.title,
        category: row.category,
        frequency: row.frequency || 'daily',
        timeOfDay: row.time_of_day || 'morning',
        targetCount: row.target_count || 1,
        color: row.color || '#6366f1',
        createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        currentStreak,
        bestStreak,
        history
      };
    });
  },

  async createHabit(
    habit: Omit<Habit, 'id' | 'createdAt' | 'currentStreak' | 'bestStreak' | 'history'>, 
    userId: string
  ): Promise<Habit> {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('habits')
      .insert([{
        user_id: userId,
        title: habit.title,
        category: habit.category,
        frequency: habit.frequency || 'daily',
        time_of_day: habit.timeOfDay || 'morning',
        target_count: habit.targetCount || 1,
        color: habit.color || '#6366f1'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating habit in Supabase:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      category: data.category,
      frequency: data.frequency,
      timeOfDay: data.time_of_day,
      targetCount: data.target_count,
      color: data.color,
      createdAt: data.created_at.split('T')[0],
      currentStreak: 0,
      bestStreak: 0,
      history: {}
    };
  },

  async toggleHabitDay(habitId: string, dateStr: string, isCompleted: boolean, userId: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    if (isCompleted) {
      // Insert log
      const { error } = await supabase
        .from('habit_logs')
        .insert([{
          user_id: userId,
          habit_id: habitId,
          completed_date: dateStr
        }]);
      if (error && error.code !== '23505') { // ignore duplicate
        console.error('Error logging habit completion in Supabase:', error);
        throw error;
      }
    } else {
      // Remove log
      const { error } = await supabase
        .from('habit_logs')
        .delete()
        .eq('habit_id', habitId)
        .eq('completed_date', dateStr);
      if (error) {
        console.error('Error removing habit completion from Supabase:', error);
        throw error;
      }
    }
  },

  async deleteHabit(id: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting habit from Supabase:', error);
      throw error;
    }
  },

  // ============================================================================
  // FINANCE TRANSACTIONS CRUD
  // ============================================================================
  async fetchFinances(userId: string): Promise<FinanceRecord[]> {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('finance_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching finance transactions from Supabase:', error);
      throw error;
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      type: row.type,
      amount: parseFloat(row.amount),
      category: row.category,
      description: row.description,
      date: row.date,
      paymentMethod: row.payment_method || undefined,
      createdAt: row.created_at ? row.created_at.split('T')[0] : row.date
    }));
  },

  async createFinance(rec: Omit<FinanceRecord, 'id' | 'createdAt'>, userId: string): Promise<FinanceRecord> {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('finance_transactions')
      .insert([{
        user_id: userId,
        type: rec.type,
        amount: rec.amount,
        category: rec.category,
        description: rec.description,
        date: rec.date,
        payment_method: rec.paymentMethod || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating finance transaction in Supabase:', error);
      throw error;
    }

    return {
      id: data.id,
      type: data.type,
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description,
      date: data.date,
      paymentMethod: data.payment_method || undefined,
      createdAt: data.created_at.split('T')[0]
    };
  },

  async deleteFinance(id: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('finance_transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting finance transaction from Supabase:', error);
      throw error;
    }
  },

  // ============================================================================
  // HEALTH & VITALS CRUD
  // ============================================================================
  async fetchHealth(userId: string): Promise<HealthLog[]> {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('health_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching health logs from Supabase:', error);
      throw error;
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      date: row.date,
      waterIntakeMl: row.water_intake_ml || 0,
      sleepHours: parseFloat(row.sleep_hours) || 0,
      sleepQuality: row.sleep_quality || 'good',
      workoutMinutes: row.workout_minutes || 0,
      workoutType: row.workout_type || undefined,
      caloriesBurned: row.calories_burned || 0,
      energyLevel: row.energy_level || 4,
      weightKg: row.weight_kg !== null && row.weight_kg !== undefined ? parseFloat(row.weight_kg) : undefined,
      notes: row.notes || undefined
    }));
  },

  async upsertHealthLog(log: Omit<HealthLog, 'id'> & { id?: string }, userId: string): Promise<HealthLog> {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');

    const basePayload: any = {
      user_id: userId,
      date: log.date,
      water_intake_ml: log.waterIntakeMl || 0,
      sleep_hours: log.sleepHours || 0,
      sleep_quality: log.sleepQuality || 'good',
      workout_minutes: log.workoutMinutes || 0,
      workout_type: log.workoutType || null,
      calories_burned: log.caloriesBurned || 0,
      energy_level: log.energyLevel || 4,
      notes: log.notes || (log.weightKg ? `Weight: ${log.weightKg}kg` : null)
    };

    if (log.weightKg !== undefined) {
      basePayload.weight_kg = log.weightKg;
    }

    let res = await supabase
      .from('health_logs')
      .upsert([basePayload], { onConflict: 'user_id,date' })
      .select()
      .single();

    // If column weight_kg doesn't exist yet in Supabase schema, retry without it
    if (res.error && res.error.message && res.error.message.includes('weight_kg')) {
      delete basePayload.weight_kg;
      res = await supabase
        .from('health_logs')
        .upsert([basePayload], { onConflict: 'user_id,date' })
        .select()
        .single();
    }

    if (res.error) {
      console.error('Error upserting health log in Supabase:', res.error);
      throw res.error;
    }

    const data = res.data;
    return {
      id: data.id,
      date: data.date,
      waterIntakeMl: data.water_intake_ml || 0,
      sleepHours: parseFloat(data.sleep_hours) || 0,
      sleepQuality: data.sleep_quality || 'good',
      workoutMinutes: data.workout_minutes || 0,
      workoutType: data.workout_type || undefined,
      caloriesBurned: data.calories_burned || 0,
      energyLevel: data.energy_level || 4,
      weightKg: data.weight_kg !== null && data.weight_kg !== undefined ? parseFloat(data.weight_kg) : log.weightKg,
      notes: data.notes || undefined
    };
  },

  // ============================================================================
  // JOURNAL CRUD
  // ============================================================================
  async fetchJournal(userId: string): Promise<JournalEntry[]> {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching journal entries from Supabase:', error);
      throw error;
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      date: row.date,
      mood: row.mood,
      title: row.title || undefined,
      content: row.content,
      gratitude: row.gratitude || undefined,
      tags: Array.isArray(row.tags) ? row.tags : [],
      aiSentiment: row.ai_sentiment || undefined,
      aiReflection: row.ai_reflection || undefined,
      createdAt: row.created_at ? row.created_at.split('T')[0] : row.date
    }));
  },

  async createJournal(entry: Omit<JournalEntry, 'id' | 'createdAt'>, userId: string): Promise<JournalEntry> {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([{
        user_id: userId,
        date: entry.date,
        mood: entry.mood,
        title: entry.title || null,
        content: entry.content,
        gratitude: entry.gratitude || null,
        tags: entry.tags || [],
        ai_sentiment: entry.aiSentiment || null,
        ai_reflection: entry.aiReflection || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating journal entry in Supabase:', error);
      throw error;
    }

    return {
      id: data.id,
      date: data.date,
      mood: data.mood,
      title: data.title || undefined,
      content: data.content,
      gratitude: data.gratitude || undefined,
      tags: data.tags || [],
      aiSentiment: data.ai_sentiment || undefined,
      aiReflection: data.ai_reflection || undefined,
      createdAt: data.created_at.split('T')[0]
    };
  },

  async deleteJournal(id: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting journal entry in Supabase:', error);
      throw error;
    }
  },

  // ============================================================================
  // MIND NOTES CRUD (Destination Table: mind_notes)
  // ============================================================================
  async fetchMindNotes(userId: string): Promise<MindNote[]> {
    if (!isSupabaseConfigured) {
      try {
        const local = localStorage.getItem('lotai_mind_notes');
        return local ? JSON.parse(local) : [];
      } catch {
        return [];
      }
    }

    try {
      const { data, error } = await supabase
        .from('mind_notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('mind_notes table might not exist on Supabase, falling back to local storage:', error.message);
        const local = localStorage.getItem('lotai_mind_notes');
        return local ? JSON.parse(local) : [];
      }

      return (data || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        category: row.category || 'Thought',
        tags: Array.isArray(row.tags) ? row.tags : [],
        date: row.date || (row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
        createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
      }));
    } catch (err) {
      console.warn('Error querying mind_notes from Supabase, using local fallback:', err);
      const local = localStorage.getItem('lotai_mind_notes');
      return local ? JSON.parse(local) : [];
    }
  },

  async createMindNote(note: Omit<MindNote, 'id' | 'createdAt'>, userId: string): Promise<MindNote> {
    const newNote: MindNote = {
      id: 'note-' + Date.now(),
      title: note.title,
      content: note.content,
      category: note.category || 'Thought',
      tags: note.tags || [],
      date: note.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (!isSupabaseConfigured) {
      try {
        const local = localStorage.getItem('lotai_mind_notes');
        const list: MindNote[] = local ? JSON.parse(local) : [];
        list.unshift(newNote);
        localStorage.setItem('lotai_mind_notes', JSON.stringify(list));
      } catch {}
      return newNote;
    }

    try {
      const { data, error } = await supabase
        .from('mind_notes')
        .insert([{
          user_id: userId,
          title: note.title,
          content: note.content,
          category: note.category || 'Thought',
          tags: note.tags || [],
          date: note.date
        }])
        .select()
        .single();

      if (error) {
        console.warn('Could not insert into mind_notes table on Supabase, caching locally:', error.message);
        const local = localStorage.getItem('lotai_mind_notes');
        const list: MindNote[] = local ? JSON.parse(local) : [];
        list.unshift(newNote);
        localStorage.setItem('lotai_mind_notes', JSON.stringify(list));
        return newNote;
      }

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: Array.isArray(data.tags) ? data.tags : [],
        date: data.date,
        createdAt: data.created_at ? data.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
      };
    } catch (err) {
      console.warn('Error creating mind note on Supabase, saving to local:', err);
      const local = localStorage.getItem('lotai_mind_notes');
      const list: MindNote[] = local ? JSON.parse(local) : [];
      list.unshift(newNote);
      localStorage.setItem('lotai_mind_notes', JSON.stringify(list));
      return newNote;
    }
  },

  async deleteMindNote(id: string): Promise<void> {
    try {
      const local = localStorage.getItem('lotai_mind_notes');
      if (local) {
        const list: MindNote[] = JSON.parse(local);
        localStorage.setItem('lotai_mind_notes', JSON.stringify(list.filter(n => n.id !== id)));
      }
    } catch {}

    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('mind_notes').delete().eq('id', id);
    } catch (err) {
      console.warn('Failed to delete mind_note in Supabase:', err);
    }
  }
};

