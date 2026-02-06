import { Category } from './enums';

/**
 * Challenge Domain Types
 */
export interface Challenge {
    id: string; // UUID
    name: string;
    category: Category;
    thumbnailUrl?: string; // Added for UI
    description?: string; // Added for UI
    certificationRate?: number; // Added for UI (0-100)
    currentMembers: number;
    minMembers: number;
    maxMembers: number;
    // Add other fields as needed
}
