export const databaseInitialQuery = `
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_type') THEN
    CREATE TYPE activity_type AS ENUM ('quiz', 'drag_drop', 'crossword', 'matching', 'multiple_choice', 'fill_in_the_blank', 'sentence_order', 'word_search');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_status') THEN
    CREATE TYPE activity_status AS ENUM ('created', 'approved', 'rejected');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "users"(
 id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'user',
  isVerified BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMPTZ DEFAULT now(),
  updatedAt TIMESTAMPTZ DEFAULT now()
);

INSERT INTO "users"(email,password,name,"isVerified") VALUES('professor_luiza@fiap.com','$2b$10$xLctj4YlH2ikp.2Y3UuT1.FDSQtZD8fKO.XZ1XQk4sWq49j3LHPhq','Luiza Maria', true) ON CONFLICT (email) DO NOTHING;

CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  type activity_type NOT NULL,
  config JSON,
  content JSON,
  cover_image VARCHAR(255),
  userId INTEGER REFERENCES users(id),
  status activity_status DEFAULT 'created',
  reviewFeedback TEXT,
  createdAt TIMESTAMPTZ DEFAULT now(),
  updatedAt TIMESTAMPTZ DEFAULT now()
);
`;