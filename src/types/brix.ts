export type BrixGrade = 'HONEY' | 'GRAPE' | 'APPLE' | 'TANGERINE' | 'TOMATO' | 'BITTER';

export interface BrixConfig {
    label: string;
    emoji: string;
    brixVariant: 'honey' | 'grape' | 'apple' | 'mandarin' | 'tomato' | 'bitter';
}
