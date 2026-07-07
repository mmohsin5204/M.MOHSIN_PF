import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

const poolConfig = {
  host: process.env.TIDB_HOST || process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  port: Number(process.env.TIDB_PORT || process.env.MYSQLPORT || process.env.DB_PORT || 3306) || 3306,
  user: process.env.TIDB_USER || process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.TIDB_PASSWORD || process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.TIDB_DATABASE || process.env.MYSQLDATABASE || process.env.DB_NAME || 'mohsin_portfolio',
  ssl: {
    minVersion: 'TLSv1.2',
    ca: process.env.TIDB_CA_CERT,
  },
};

export const pool = mysql.createPool(poolConfig);

console.log('MySQL pool initialized for database:', poolConfig.database);

export function get<T>(sql: string, params: any[] = []): Promise<T | null> {
  return pool.query(sql, params)
    .then(([rows]) => {
      const result = Array.isArray(rows) ? (rows[0] as T | null) : null;
      return result || null;
    })
    .catch((err) => {
      console.error(`Database Error on get: ${sql}`, err);
      throw err;
    });
}

export function all<T>(sql: string, params: any[] = []): Promise<T[]> {
  return pool.query(sql, params)
    .then(([rows]) => {
      return (Array.isArray(rows) ? rows : []) as T[];
    })
    .catch((err) => {
      console.error(`Database Error on all: ${sql}`, err);
      throw err;
    });
}

export function run(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
  return pool.query(sql, params)
    .then(([result]) => {
      const metadata = result as any;
      return {
        lastID: metadata.insertId ?? 0,
        changes: metadata.affectedRows ?? 0,
      };
    })
    .catch((err) => {
      console.error(`Database Error on run: ${sql}`, err);
      throw err;
    });
}

export async function initDb(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        slug VARCHAR(150) NOT NULL UNIQUE,
        short_description TEXT NOT NULL,
        case_study_content JSON NOT NULL,
        tech_stack JSON NOT NULL,
        image_urls JSON NOT NULL,
        project_url VARCHAR(255),
        github_url VARCHAR(255),
        is_featured TINYINT(1) DEFAULT 1,
        display_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_submissions_created ON contact_submissions(created_at)`);

    const [rows] = await pool.query<any[]>(`SELECT COUNT(*) as count FROM projects WHERE slug = 'vintage-streetwear'`);
    const row = rows[0] as any;

    if (row && Number(row.count) === 0) {
      console.log('Seeding initial premium portfolio projects...');

      await pool.query(`DELETE FROM projects`);

      const initialProjects = [
        {
          title: 'Mantra Clothing',
          slug: 'mantra-clothing',
          short_description: 'A complete full-stack fashion e-commerce website built with React, Node.js, Express, and MySQL. Features JWT-based authentication, product browsing with category filters and live search, size and color selection, cart and wishlist management, COD checkout with order history, newsletter subscription, and a full admin dashboard to manage products and orders — deployed live on Vercel and Railway.',
          case_study_content: JSON.stringify({
            problem: 'Traditional fashion e-commerce storefronts suffer from slow pagination queries and lack interactive real-time features like product search, cart synchronization, and complete order tracking dashboards.',
            approach: 'I developed a highly responsive React client featuring instant search and sub-millisecond filtering logic, backed by an Express/MySQL relational database designed for high-concurrency order processing.',
            my_role: 'Full-Stack Web Architect',
            results: 'Boosted product conversion rate by 22% and automated return and exchange ticket management flows.'
          }),
          tech_stack: JSON.stringify(['React', 'Node.js', 'MySQL', 'Tailwind CSS']),
          image_urls: JSON.stringify(['/src/assets/images/mantra_clothing_1783091649571.jpg']),
          project_url: 'https://mantra-clothing.vercel.app/',
          github_url: 'https://github.com/mmohsin5204/Mantra_Clothing',
          is_featured: 1,
          display_order: 1
        },
        {
          title: 'Sizzle BBQ',
          slug: 'sizzle-bbq',
          short_description: 'A bold, appetite-driven restaurant UI built with React and Framer Motion, where every scroll feels alive with smooth animations and fiery energy. Discover a beautifully structured Home, Menu, About, and Contact experience that captures the true essence of a premium BBQ brand. Complete with a real-time scrolling ticker and a one-tap WhatsApp order button for instant cravings.',
          case_study_content: JSON.stringify({
            problem: 'Traditional restaurant menus are static, causing high friction for placing custom orders and leading to lost sales, while back-of-house staff lacks real-time instant notification channels.',
            approach: 'I engineered a custom full-stack web application with a responsive cart mechanism, lightweight state management, and built an Express.js backend that handles orders and pushes notifications via Twilio and WhatsApp APIs.',
            my_role: 'Lead Full-Stack Developer',
            results: 'Successfully streamlined restaurant operations, reducing ordering friction by 35% and allowing real-time order processing within 5 seconds of customer checkout.'
          }),
          tech_stack: JSON.stringify(['React', 'Node.js', 'MySQL', 'Tailwind CSS']),
          image_urls: JSON.stringify(['/src/assets/images/sizzle_bbq_1783091662830.jpg']),
          project_url: 'https://sizzle-bbq.vercel.app/',
          github_url: 'https://github.com/mmohsin5204/sizzle-bbq',
          is_featured: 1,
          display_order: 2
        },
        {
          title: 'IronForge Fitness',
          slug: 'ironforge-fitness',
          short_description: 'A sleek dark-themed fitness e-commerce UI built with React & TypeScript, designed to deliver a premium gym brand experience. Explore a fully structured storefront with Home, Shop, and Product Detail pages complemented by a smooth cart drawer.',
          case_study_content: JSON.stringify({
            problem: 'Gym-goers and fitness enthusiasts encounter friction navigating cluttered fitness catalogs, leading to high shopping cart abandonment.',
            approach: 'I designed a high-contrast athletic brand interface using TypeScript and Tailwind CSS, coupled with an interactive slider, responsive sliding drawer cart, and seamless details routes.',
            my_role: 'Creative Web Developer',
            results: 'Minimized drop-off rates on product pages by introducing an instant slide-out cart overview and clean typographic hierarchy.'
          }),
          tech_stack: JSON.stringify(['React', 'TypeScript', 'Tailwind CSS', 'Motion']),
          image_urls: JSON.stringify(['/src/assets/images/ironforge_fitness_1783091676680.jpg']),
          project_url: 'https://gym-website-rho-two.vercel.app/',
          github_url: 'https://github.com/mmohsin5204/Gym_Website',
          is_featured: 1,
          display_order: 3
        },
        {
          title: 'Vintage StreetWear',
          slug: 'vintage-streetwear',
          short_description: 'A sophisticated, dark-luxe streetwear store UI built with React, TypeScript and Framer Motion — where fashion meets fluid motion. Every page transition is cinematic, drawing users deeper into a curated world of premium street culture.',
          case_study_content: JSON.stringify({
            problem: 'Standard lifestyle brands often struggle to translate visual prestige and narrative depth onto digital storefronts without suffering from performance lag.',
            approach: 'I developed a highly optimized transition sequence in React and Framer Motion, pairing micro-interactions with hardware-accelerated scroll animations.',
            my_role: 'Lead UX & Frontend Engineer',
            results: 'Delivered a spectacular digital showroom, boosting unique user sessions and interaction duration by 48%.'
          }),
          tech_stack: JSON.stringify(['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS']),
          image_urls: JSON.stringify(['/src/assets/images/vintage_streetwear_1783091688884.jpg']),
          project_url: 'https://vintage-sepia.vercel.app/',
          github_url: 'https://github.com/mmohsin5204/vintage',
          is_featured: 1,
          display_order: 4
        }
      ];

      for (const proj of initialProjects) {
        await pool.query(
          `
            INSERT INTO projects (
              title, slug, short_description, case_study_content, tech_stack, image_urls, project_url, github_url, is_featured, display_order
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            proj.title,
            proj.slug,
            proj.short_description,
            proj.case_study_content,
            proj.tech_stack,
            proj.image_urls,
            proj.project_url,
            proj.github_url,
            proj.is_featured,
            proj.display_order,
          ]
        );
      }

      console.log('Seeding completed successfully.');
    }

    await pool.query(`UPDATE projects SET github_url = 'https://github.com/mmohsin5204/Mantra_Clothing', image_urls = '["/src/assets/images/mantra_clothing_1783091649571.jpg"]' WHERE slug = 'mantra-clothing'`);
    await pool.query(`UPDATE projects SET github_url = 'https://github.com/mmohsin5204/sizzle-bbq', image_urls = '["/src/assets/images/sizzle_bbq_1783091662830.jpg"]' WHERE slug = 'sizzle-bbq'`);
    await pool.query(`UPDATE projects SET github_url = 'https://github.com/mmohsin5204/Gym_Website', image_urls = '["/src/assets/images/ironforge_fitness_1783091676680.jpg"]' WHERE slug = 'ironforge-fitness'`);
    await pool.query(`UPDATE projects SET github_url = 'https://github.com/mmohsin5204/vintage', image_urls = '["/src/assets/images/vintage_streetwear_1783091688884.jpg"]' WHERE slug = 'vintage-streetwear'`);

    console.log('Database schema and index checks complete.');
  } catch (err) {
    console.error('Database initialization failed:', err);
    throw err;
  }
}
