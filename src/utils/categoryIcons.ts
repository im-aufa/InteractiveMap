import { GraduationCap, Heart, Cpu, Leaf, Palette, Palmtree, Users, Building, Sprout, Waves } from 'lucide-react';

export const categoryIcons = {
    'Pendidikan': { icon: GraduationCap, color: '#3B82F6' },           // Blue
    'Kesehatan': { icon: Heart, color: '#EF4444' },                    // Red
    'Teknologi': { icon: Cpu, color: '#8B5CF6' },                      // Purple
    'Lingkungan': { icon: Leaf, color: '#10B981' },                    // Green
    'Ekonomi Kreatif': { icon: Palette, color: '#F59E0B' },            // Orange
    'Pariwisata': { icon: Palmtree, color: '#14B8A6' },                // Teal
    'Pemberdayaan Masyarakat': { icon: Users, color: '#EC4899' },      // Pink
    'Infrastruktur': { icon: Building, color: '#6366F1' },             // Indigo
    'Pertanian': { icon: Sprout, color: '#84CC16' },                   // Lime
    'Kelautan': { icon: Waves, color: '#06B6D4' },                     // Cyan
};

export type CategoryKey = keyof typeof categoryIcons;
