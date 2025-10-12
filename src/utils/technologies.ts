export type Technology = { id: string; name: string }

export const TECHNOLOGIES: Technology[] = [
  // Languages
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'csharp', name: 'C#' },
  { id: 'cpp', name: 'C/C++' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'kotlin', name: 'Kotlin' },
  { id: 'swift', name: 'Swift' },
  { id: 'php', name: 'PHP' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'dart', name: 'Dart' },
  { id: 'scala', name: 'Scala' },

  // Frontend frameworks
  { id: 'react', name: 'React' },
  { id: 'nextjs', name: 'Next.js' },
  { id: 'angular', name: 'Angular' },
  { id: 'vue', name: 'Vue.js' },
  { id: 'nuxt', name: 'Nuxt' },
  { id: 'svelte', name: 'Svelte' },
  { id: 'solid', name: 'SolidJS' },

  // Mobile & Desktop
  { id: 'react-native', name: 'React Native' },
  { id: 'flutter', name: 'Flutter' },
  { id: 'ionic', name: 'Ionic' },
  { id: 'swiftui', name: 'SwiftUI' },
  { id: 'kmp', name: 'Kotlin Multiplatform' },
  { id: 'electron', name: 'Electron' },

  // Styling/UI
  { id: 'tailwind', name: 'Tailwind CSS' },
  { id: 'bootstrap', name: 'Bootstrap' },
  { id: 'mui', name: 'Material UI' },
  { id: 'chakra', name: 'Chakra UI' },
  { id: 'ant-design', name: 'Ant Design' },
  { id: 'shadcn', name: 'shadcn/ui' },

  // Build tools
  { id: 'vite', name: 'Vite' },
  { id: 'webpack', name: 'Webpack' },
  { id: 'rollup', name: 'Rollup' },
  { id: 'esbuild', name: 'esbuild' },
  { id: 'babel', name: 'Babel' },

  // Backend frameworks
  { id: 'node', name: 'Node.js' },
  { id: 'express', name: 'Express' },
  { id: 'nestjs', name: 'NestJS' },
  { id: 'fastify', name: 'Fastify' },
  { id: 'spring-boot', name: 'Spring Boot' },
  { id: '.net', name: '.NET' },
  { id: 'django', name: 'Django' },
  { id: 'flask', name: 'Flask' },
  { id: 'fastapi', name: 'FastAPI' },
  { id: 'laravel', name: 'Laravel' },
  { id: 'rails', name: 'Ruby on Rails' },
  { id: 'phoenix', name: 'Phoenix (Elixir)' },
  { id: 'gin', name: 'Gin (Go)' },

  // Databases & ORM
  { id: 'postgresql', name: 'PostgreSQL' },
  { id: 'mysql', name: 'MySQL' },
  { id: 'mariadb', name: 'MariaDB' },
  { id: 'sqlite', name: 'SQLite' },
  { id: 'sqlserver', name: 'SQL Server' },
  { id: 'oracle', name: 'Oracle' },
  { id: 'mongodb', name: 'MongoDB' },
  { id: 'redis', name: 'Redis' },
  { id: 'cassandra', name: 'Cassandra' },
  { id: 'dynamodb', name: 'DynamoDB' },
  { id: 'elasticsearch', name: 'Elasticsearch' },
  { id: 'neo4j', name: 'Neo4j' },
  { id: 'firestore', name: 'Firebase Firestore' },
  { id: 'prisma', name: 'Prisma' },
  { id: 'typeorm', name: 'TypeORM' },
  { id: 'sequelize', name: 'Sequelize' },
  { id: 'mongoose', name: 'Mongoose' },
  { id: 'hibernate', name: 'Hibernate' },
  { id: 'entity-framework', name: 'Entity Framework' },
  { id: 'sqlalchemy', name: 'SQLAlchemy' },

  // Messaging & streaming
  { id: 'kafka', name: 'Apache Kafka' },
  { id: 'rabbitmq', name: 'RabbitMQ' },
  { id: 'nats', name: 'NATS' },
  { id: 'sqs', name: 'AWS SQS' },

  // Cloud & DevOps
  { id: 'aws', name: 'AWS' },
  { id: 'azure', name: 'Azure' },
  { id: 'gcp', name: 'Google Cloud' },
  { id: 'docker', name: 'Docker' },
  { id: 'kubernetes', name: 'Kubernetes' },
  { id: 'terraform', name: 'Terraform' },
  { id: 'ansible', name: 'Ansible' },
  { id: 'pulumi', name: 'Pulumi' },
  { id: 'github-actions', name: 'GitHub Actions' },
  { id: 'gitlab-ci', name: 'GitLab CI' },
  { id: 'jenkins', name: 'Jenkins' },

  // API & Data
  { id: 'rest', name: 'REST' },
  { id: 'graphql', name: 'GraphQL' },
  { id: 'apollo', name: 'Apollo' },
  { id: 'grpc', name: 'gRPC' },

  // Testing
  { id: 'jest', name: 'Jest' },
  { id: 'vitest', name: 'Vitest' },
  { id: 'mocha', name: 'Mocha' },
  { id: 'chai', name: 'Chai' },
  { id: 'cypress', name: 'Cypress' },
  { id: 'playwright', name: 'Playwright' },
  { id: 'junit', name: 'JUnit' },
  { id: 'pytest', name: 'PyTest' },
  { id: 'rspec', name: 'RSpec' },

  // State & Networking (FE)
  { id: 'redux', name: 'Redux' },
  { id: 'zustand', name: 'Zustand' },
  { id: 'mobx', name: 'MobX' },
  { id: 'react-query', name: 'React Query' },
  { id: 'swr', name: 'SWR' },

  // Observability
  { id: 'prometheus', name: 'Prometheus' },
  { id: 'grafana', name: 'Grafana' },
  { id: 'opentelemetry', name: 'OpenTelemetry' },
  { id: 'sentry', name: 'Sentry' },

  // Serverless & Edge
  { id: 'lambda', name: 'AWS Lambda' },
  { id: 'vercel', name: 'Vercel' },
  { id: 'netlify', name: 'Netlify' },
  { id: 'cloudflare-workers', name: 'Cloudflare Workers' },
  { id: 'deno', name: 'Deno' },
  { id: 'bun', name: 'Bun' },
]
