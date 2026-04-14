import { SupabaseUserRepository }       from '../supabase/SupabaseUserRepository';
import { SupabaseProductoRepository }   from '../supabase/SupabaseProductoRepository';
import { SupabaseServicioRepository }   from '../supabase/SupabaseServicioRepository';
import {
  SupabaseProveedorRepository,
  SupabaseCategoriaRepository,
  SupabaseStockRepository,
  SupabaseCompraRepository,
} from '../supabase/SupabaseRepositories';

import type { UserRepository }       from './UserRepository';
import type { ProductoRepository }   from './ProductoRepository';
import type { ProveedorRepository }  from './ProveedorRepository';
import type { CategoriaRepository }  from './CategoriaRepository';
import type { StockRepository }      from './StockRepository';
import type { CompraRepository }     from './CompraRepository';
import type { ServicioRepository }   from './ServicioRepository';

/**
 * Fábrica de repositorios — Repository Factory
 *
 * Abstrae la implementación concreta (Supabase).
 * Si se cambia la fuente de datos, solo se toca este archivo.
 */
export const createUserRepository      = (): UserRepository      => new SupabaseUserRepository();
export const createProductoRepository  = (): ProductoRepository  => new SupabaseProductoRepository();
export const createProveedorRepository = (): ProveedorRepository => new SupabaseProveedorRepository();
export const createCategoriaRepository = (): CategoriaRepository => new SupabaseCategoriaRepository();
export const createStockRepository     = (): StockRepository     => new SupabaseStockRepository();
export const createCompraRepository    = (): CompraRepository    => new SupabaseCompraRepository();
export const createServicioRepository  = (): ServicioRepository  => new SupabaseServicioRepository();
