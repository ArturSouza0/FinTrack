export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  userId: string;
}

// DTOs para corresponder ao backend
export interface CreateCategoryDto {
  name: string;
  type: 'income' | 'expense';
  userId: string | null;
}

export interface FindCategoriesByUserIdDto {
  userId: string;
}

export interface FindCategoryByIdDto {
  id: string;
}

export interface UpdateCategoryDto {
  id: string;
  name?: string;
  type?: 'income' | 'expense';
}

export interface DeleteCategoryDto {
  id: string;
}