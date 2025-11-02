// Tecnologías y plataformas disponibles para selección

export const TECHNOLOGIES = [
  // Frontend
  { id: 'react', name: 'React', category: 'frontend' },
  { id: 'vue', name: 'Vue.js', category: 'frontend' },
  { id: 'angular', name: 'Angular', category: 'frontend' },
  { id: 'next', name: 'Next.js', category: 'frontend' },
  { id: 'nuxt', name: 'Nuxt.js', category: 'frontend' },
  { id: 'svelte', name: 'Svelte', category: 'frontend' },
  { id: 'typescript', name: 'TypeScript', category: 'frontend' },
  { id: 'javascript', name: 'JavaScript', category: 'frontend' },
  { id: 'html', name: 'HTML5', category: 'frontend' },
  { id: 'css', name: 'CSS3', category: 'frontend' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend' },
  { id: 'bootstrap', name: 'Bootstrap', category: 'frontend' },
  { id: 'sass', name: 'Sass/SCSS', category: 'frontend' },

  // Backend
  { id: 'nodejs', name: 'Node.js', category: 'backend' },
  { id: 'express', name: 'Express.js', category: 'backend' },
  { id: 'nestjs', name: 'NestJS', category: 'backend' },
  { id: 'python', name: 'Python', category: 'backend' },
  { id: 'django', name: 'Django', category: 'backend' },
  { id: 'flask', name: 'Flask', category: 'backend' },
  { id: 'fastapi', name: 'FastAPI', category: 'backend' },
  { id: 'java', name: 'Java', category: 'backend' },
  { id: 'spring', name: 'Spring Boot', category: 'backend' },
  { id: 'csharp', name: 'C#', category: 'backend' },
  { id: 'dotnet', name: '.NET Core', category: 'backend' },
  { id: 'php', name: 'PHP', category: 'backend' },
  { id: 'laravel', name: 'Laravel', category: 'backend' },
  { id: 'ruby', name: 'Ruby', category: 'backend' },
  { id: 'rails', name: 'Ruby on Rails', category: 'backend' },
  { id: 'go', name: 'Go', category: 'backend' },
  { id: 'rust', name: 'Rust', category: 'backend' },

  // Bases de Datos
  { id: 'mongodb', name: 'MongoDB', category: 'database' },
  { id: 'mysql', name: 'MySQL', category: 'database' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'database' },
  { id: 'sqlite', name: 'SQLite', category: 'database' },
  { id: 'redis', name: 'Redis', category: 'database' },
  { id: 'elasticsearch', name: 'Elasticsearch', category: 'database' },
  { id: 'firebase', name: 'Firebase', category: 'database' },
  { id: 'supabase', name: 'Supabase', category: 'database' },

  // Mobile
  { id: 'react-native', name: 'React Native', category: 'mobile' },
  { id: 'flutter', name: 'Flutter', category: 'mobile' },
  { id: 'swift', name: 'Swift', category: 'mobile' },
  { id: 'kotlin', name: 'Kotlin', category: 'mobile' },
  { id: 'ionic', name: 'Ionic', category: 'mobile' },
  { id: 'xamarin', name: 'Xamarin', category: 'mobile' },

  // DevOps & Cloud
  { id: 'docker', name: 'Docker', category: 'devops' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'devops' },
  { id: 'aws', name: 'AWS', category: 'cloud' },
  { id: 'azure', name: 'Azure', category: 'cloud' },
  { id: 'gcp', name: 'Google Cloud', category: 'cloud' },
  { id: 'vercel', name: 'Vercel', category: 'cloud' },
  { id: 'netlify', name: 'Netlify', category: 'cloud' },
  { id: 'heroku', name: 'Heroku', category: 'cloud' },

  // Testing
  { id: 'jest', name: 'Jest', category: 'testing' },
  { id: 'cypress', name: 'Cypress', category: 'testing' },
  { id: 'playwright', name: 'Playwright', category: 'testing' },
  { id: 'vitest', name: 'Vitest', category: 'testing' },
  { id: 'testing-library', name: 'Testing Library', category: 'testing' },

  // Otros
  { id: 'graphql', name: 'GraphQL', category: 'api' },
  { id: 'rest', name: 'REST API', category: 'api' },
  { id: 'websockets', name: 'WebSockets', category: 'api' },
  { id: 'prisma', name: 'Prisma', category: 'orm' },
  { id: 'mongoose', name: 'Mongoose', category: 'orm' },
  { id: 'sequelize', name: 'Sequelize', category: 'orm' },
] as const

export const PLATFORMS = [
  { id: 'web', name: 'Web Application', icon: '🌐' },
  { id: 'mobile-ios', name: 'iOS Mobile App', icon: '📱' },
  { id: 'mobile-android', name: 'Android Mobile App', icon: '📱' },
  { id: 'desktop-windows', name: 'Windows Desktop', icon: '🖥️' },
  { id: 'desktop-mac', name: 'macOS Desktop', icon: '🖥️' },
  { id: 'desktop-linux', name: 'Linux Desktop', icon: '🖥️' },
  { id: 'pwa', name: 'Progressive Web App (PWA)', icon: '📲' },
  { id: 'api', name: 'API/Backend Service', icon: '⚙️' },
  { id: 'microservices', name: 'Microservices', icon: '🔧' },
  { id: 'cli', name: 'Command Line Interface', icon: '💻' },
  { id: 'browser-extension', name: 'Browser Extension', icon: '🧩' },
  { id: 'embedded', name: 'Embedded System', icon: '🔌' },
  { id: 'iot', name: 'IoT Device', icon: '📡' },
  { id: 'smart-tv', name: 'Smart TV App', icon: '📺' },
  { id: 'watch', name: 'Smartwatch App', icon: '⌚' },
] as const

export const TECHNOLOGY_CATEGORIES = [
  { id: 'frontend', name: 'Frontend', color: 'bg-blue-100 text-blue-800' },
  { id: 'backend', name: 'Backend', color: 'bg-green-100 text-green-800' },
  { id: 'database', name: 'Base de Datos', color: 'bg-purple-100 text-purple-800' },
  { id: 'mobile', name: 'Mobile', color: 'bg-pink-100 text-pink-800' },
  { id: 'devops', name: 'DevOps', color: 'bg-orange-100 text-orange-800' },
  { id: 'cloud', name: 'Cloud', color: 'bg-cyan-100 text-cyan-800' },
  { id: 'testing', name: 'Testing', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'api', name: 'API', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'orm', name: 'ORM', color: 'bg-gray-100 text-gray-800' },
] as const

// Funciones helper
export const getTechnologiesByCategory = (category: string) => {
  return TECHNOLOGIES.filter(tech => tech.category === category)
}

export const getAllTechnologies = () => TECHNOLOGIES

export const getAllPlatforms = () => PLATFORMS

export const getTechnologyCategories = () => TECHNOLOGY_CATEGORIES
