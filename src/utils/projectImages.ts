import mantraImg from '../assets/images/mantra_clothing_1783091649571.jpg';
import sizzleImg from '../assets/images/sizzle_bbq_1783091662830.jpg';
import ironforgeImg from '../assets/images/ironforge_fitness_1783091676680.jpg';
import vintageImg from '../assets/images/vintage_streetwear_1783091688884.jpg';

export function getProjectImage(slug: string): string {
  switch (slug) {
    case 'mantra-clothing':
      return mantraImg;
    case 'sizzle-bbq':
      return sizzleImg;
    case 'ironforge-fitness':
      return ironforgeImg;
    case 'vintage-streetwear':
      return vintageImg;
    default:
      return '';
  }
}
