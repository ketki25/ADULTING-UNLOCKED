-- ============================================================
-- ADULTING UNLOCKED — DATABASE SCHEMA
-- ============================================================

CREATE DATABASE IF NOT EXISTS adulting_unlocked;
USE adulting_unlocked;

-- ============================================================
-- USERS & AUTH
-- ============================================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin', 'mentor') DEFAULT 'student',
  college VARCHAR(200),
  branch VARCHAR(100),
  year INT,
  avatar VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- MODULE 1: CAMPUS LIFE MASTERY
-- ============================================================
CREATE TABLE hostels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  price_per_month DECIMAL(10, 2),
  type ENUM('boys', 'girls', 'co-ed') DEFAULT 'co-ed',
  amenities JSON,
  images JSON,
  contact_phone VARCHAR(20),
  contact_email VARCHAR(150),
  total_rooms INT,
  available_rooms INT,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mess_services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  price_per_month DECIMAL(10, 2),
  meal_types JSON,
  menu JSON,
  images JSON,
  contact_phone VARCHAR(20),
  timing VARCHAR(200),
  food_type ENUM('veg', 'non-veg', 'both') DEFAULT 'both',
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  entity_type ENUM('hostel', 'mess') NOT NULL,
  entity_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(200),
  comment TEXT,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  entity_type ENUM('hostel', 'mess', 'career', 'scholarship') NOT NULL,
  entity_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorite (user_id, entity_type, entity_id)
);

-- ============================================================
-- MODULE 2: BROKE GRAD CLUB
-- ============================================================
CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category ENUM('food', 'transport', 'education', 'entertainment', 'health', 'rent', 'shopping', 'other') DEFAULT 'other',
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE budget_goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  month INT NOT NULL,
  year INT NOT NULL,
  total_budget DECIMAL(10, 2) NOT NULL,
  food_budget DECIMAL(10, 2) DEFAULT 0,
  transport_budget DECIMAL(10, 2) DEFAULT 0,
  education_budget DECIMAL(10, 2) DEFAULT 0,
  entertainment_budget DECIMAL(10, 2) DEFAULT 0,
  other_budget DECIMAL(10, 2) DEFAULT 0,
  savings_goal DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_budget (user_id, month, year)
);

CREATE TABLE scholarships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(300) NOT NULL,
  provider VARCHAR(200) NOT NULL,
  description TEXT,
  eligibility TEXT,
  amount DECIMAL(12, 2),
  deadline DATE,
  category ENUM('merit', 'need-based', 'minority', 'sports', 'research', 'government', 'private') DEFAULT 'merit',
  level ENUM('undergraduate', 'postgraduate', 'phd', 'all') DEFAULT 'all',
  apply_link VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MODULE 3: CAREER COMPASS
-- ============================================================
CREATE TABLE careers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category ENUM('tech', 'government', 'startup', 'higher-studies', 'research', 'finance', 'management', 'other') DEFAULT 'tech',
  description TEXT,
  skills_required JSON,
  avg_salary VARCHAR(100),
  growth_rate VARCHAR(50),
  roadmap JSON,
  resources JSON,
  difficulty ENUM('easy', 'moderate', 'hard') DEFAULT 'moderate',
  time_to_achieve VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alumni (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  college VARCHAR(200),
  graduation_year INT,
  current_role VARCHAR(200),
  company VARCHAR(200),
  career_path ENUM('tech', 'government', 'startup', 'higher-studies', 'research', 'finance', 'management', 'other'),
  story TEXT,
  linkedin_url VARCHAR(300),
  avatar VARCHAR(255),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  type ENUM('resume', 'interview', 'course', 'book', 'video', 'tool', 'other') NOT NULL,
  description TEXT,
  url VARCHAR(500),
  career_id INT,
  is_free BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE SET NULL
);

-- ============================================================
-- MODULE 4: GRAD MIND
-- ============================================================
CREATE TABLE anonymous_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  category ENUM('vent', 'anxiety', 'motivation', 'advice', 'gratitude', 'other') DEFAULT 'vent',
  likes INT DEFAULT 0,
  is_flagged BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT TRUE,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES anonymous_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE moods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  mood_score INT CHECK (mood_score BETWEEN 1 AND 10),
  mood_label ENUM('terrible', 'bad', 'okay', 'good', 'great') NOT NULL,
  note TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_mood (user_id, date)
);

CREATE TABLE support_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  role ENUM('user', 'assistant') NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MODULE 5: STUDYBUDDY
-- ============================================================
CREATE TABLE mentors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  bio TEXT,
  skills JSON,
  interests JSON,
  availability ENUM('weekdays', 'weekends', 'both') DEFAULT 'both',
  max_mentees INT DEFAULT 3,
  current_mentees INT DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0,
  session_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE interests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(100),
  icon VARCHAR(50)
);

CREATE TABLE buddy_matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mentor_id INT NOT NULL,
  mentee_id INT NOT NULL,
  status ENUM('pending', 'active', 'completed', 'rejected') DEFAULT 'pending',
  matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE,
  FOREIGN KEY (mentee_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE chat_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message TEXT,
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX idx_hostels_city ON hostels(city);
CREATE INDEX idx_mess_city ON mess_services(city);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, date);
CREATE INDEX idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX idx_careers_category ON careers(category);
CREATE INDEX idx_posts_created ON anonymous_posts(created_at);
CREATE INDEX idx_moods_user_date ON moods(user_id, date);

-- ============================================================
-- SAMPLE DATA
-- ============================================================
INSERT INTO users (name, email, password, role, college, branch, year) VALUES
('Admin User', 'admin@adultingunlocked.com', '$2b$10$placeholder_hash', 'admin', 'System', 'N/A', 0),
('Arjun Sharma', 'arjun@example.com', '$2b$10$placeholder_hash', 'student', 'VIT Pune', 'Computer Engineering', 3),
('Priya Nair', 'priya@example.com', '$2b$10$placeholder_hash', 'mentor', 'COEP Pune', 'Information Technology', 4);

INSERT INTO scholarships (name, provider, description, eligibility, amount, deadline, category, level, apply_link) VALUES
('PM Scholarship Scheme', 'Government of India', 'Scholarship for wards of Ex-Servicemen', 'Children of Ex-servicemen/Ex-Coast Guard', 25000, '2024-12-31', 'government', 'undergraduate', 'https://scholarships.gov.in'),
('AICTE Pragati Scholarship', 'AICTE', 'For girl students in technical education', 'Girl students in AICTE approved colleges', 50000, '2024-11-30', 'government', 'undergraduate', 'https://aicte-pragati-saksham-gov.in'),
('Infosys Spark Scholarship', 'Infosys Foundation', 'Merit-based scholarship for engineering students', 'Top 10% in class, family income < 3 LPA', 20000, '2024-10-15', 'private', 'undergraduate', 'https://infosys.com/spark');

INSERT INTO careers (title, category, description, skills_required, avg_salary, growth_rate, difficulty) VALUES
('Software Engineer', 'tech', 'Build software products for tech companies. High demand, remote-friendly career path.', '["DSA", "System Design", "Web Dev", "Problem Solving"]', '8-40 LPA', '+25% YoY', 'moderate'),
('UPSC Civil Services', 'government', 'Join the Indian Administrative Service and shape public policy at national level.', '["General Knowledge", "Essay Writing", "Current Affairs", "Analytical Thinking"]', '50k-1.5L/month', 'Stable', 'hard'),
('Product Manager', 'tech', 'Bridge technology and business by building products users love.', '["Communication", "Analytics", "Roadmapping", "User Research"]', '15-60 LPA', '+30% YoY', 'hard');

INSERT INTO alumni (name, college, graduation_year, current_role, company, career_path, story, is_featured) VALUES
('Rohit Mehta', 'VJTI Mumbai', 2021, 'Software Engineer', 'Google', 'tech', 'Started with competitive programming, cracked FAANG in 6 months of focused prep. The journey was tough but systematic.', TRUE),
('Ananya Singh', 'IIT Pune', 2020, 'IAS Officer', 'Government of India', 'government', 'Engineering gave me the analytical foundation for UPSC. Cleared in my second attempt. Discipline over motivation.', TRUE),
('Karan Patel', 'COEP Pune', 2022, 'Co-founder', 'EduTech Startup', 'startup', 'Built my first product during college. Got into an accelerator and raised seed funding within a year of graduation.', TRUE);

INSERT INTO interests (name, category, icon) VALUES
('Web Development', 'Tech', '💻'),
('Machine Learning', 'Tech', '🤖'),
('Competitive Programming', 'Tech', '⚔️'),
('Mobile Development', 'Tech', '📱'),
('UPSC Preparation', 'Govt', '📚'),
('Entrepreneurship', 'Business', '🚀'),
('Design & UI/UX', 'Creative', '🎨'),
('Research', 'Academic', '🔬'),
('Finance & Stocks', 'Business', '📈'),
('Sports & Fitness', 'Lifestyle', '🏃');