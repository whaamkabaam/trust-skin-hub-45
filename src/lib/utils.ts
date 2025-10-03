import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fixImagePath(path: string): string {
  if (!path) return 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return path;
  return path;
}

/**
 * Generate a unique operator name by appending (Copy) or incrementing number
 */
export function generateUniqueOperatorName(originalName: string, existingNames: string[]): string {
  let newName = `${originalName} (Copy)`;
  let counter = 1;
  
  while (existingNames.includes(newName)) {
    newName = `${originalName} (${counter})`;
    counter++;
  }
  
  return newName;
}

/**
 * Generate a unique operator slug from name, ensuring it doesn't conflict with existing slugs
 */
export function generateUniqueOperatorSlug(name: string, existingSlugs: string[]): string {
  // Convert name to slug format
  let baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  let newSlug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(newSlug)) {
    newSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return newSlug;
}
