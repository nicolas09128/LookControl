import type { Categoria } from '../../interfaces/Categoria';

export interface CategoriaRepository {
  getAll(): Promise<{ data?: Categoria[]; error?: any }>;
}
