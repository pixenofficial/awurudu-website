/*
  Supabase Schema SQL for Sinhala & Tamil New Year 2026 Portal

  -- 1. Nakath (Auspicious Times) Table
  CREATE TABLE nakath (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    time TIMESTAMPTZ NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 2. Recipes Table
  CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    image_url TEXT,
    ingredients TEXT[] NOT NULL,
    instructions TEXT[] NOT NULL,
    prep_time TEXT,
    servings INTEGER DEFAULT 4,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 3. Analytics (Simple)
  CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 4. Quiz Questions Table
  CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    option1 TEXT NOT NULL,
    option2 TEXT NOT NULL,
    option3 TEXT NOT NULL,
    option4 TEXT NOT NULL,
    correct_answer INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 5. Leaderboard Table
  CREATE TABLE leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    game_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 6. Avurudu Prince/Princess Voting Table
  CREATE TABLE contestants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Prince' or 'Princess'
    votes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 7. Votes Tracking Table
  CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contestant_id UUID REFERENCES contestants(id),
    user_id UUID, -- Optional, for authenticated users
    ip_address TEXT, -- For rate limiting
    voted_at DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Enable RLS
  ALTER TABLE nakath ENABLE ROW LEVEL SECURITY;
  ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
  ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
  ALTER TABLE contestants ENABLE ROW LEVEL SECURITY;
  ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

  -- Public Read Access
  CREATE POLICY "Public Read Nakath" ON nakath FOR SELECT USING (true);
  CREATE POLICY "Public Read Recipes" ON recipes FOR SELECT USING (true);
  CREATE POLICY "Public Read Quiz" ON quiz_questions FOR SELECT USING (true);
  CREATE POLICY "Public Read Leaderboard" ON leaderboard FOR SELECT USING (true);
  CREATE POLICY "Public Read Contestants" ON contestants FOR SELECT USING (true);

  -- Public Create Access (for games)
  CREATE POLICY "Public Create Leaderboard" ON leaderboard FOR INSERT WITH CHECK (true);
  CREATE POLICY "Public Create Votes" ON votes FOR INSERT WITH CHECK (true);

  -- Admin Write Access (Requires Authentication)
  CREATE POLICY "Admin Write Nakath" ON nakath FOR ALL USING (auth.role() = 'authenticated');
  CREATE POLICY "Admin Write Recipes" ON recipes FOR ALL USING (auth.role() = 'authenticated');

  -- Sample Data
  INSERT INTO nakath (title, time, description) VALUES
  ('New Year Dawn', '2026-04-14T08:41:00Z', 'The auspicious time for the dawn of the New Year.'),
  ('Punya Kalaya', '2026-04-14T02:17:00Z', 'The period for religious observances.'),
  ('Cooking Meals', '2026-04-14T09:05:00Z', 'Auspicious time to light the hearth and cook the first meal.'),
  ('Eating Meals', '2026-04-14T10:15:00Z', 'Auspicious time to partake in the first meal of the year.');

  INSERT INTO recipes (title, image_url, ingredients, instructions, prep_time, servings) VALUES
  ('Konda Kevum', 'https://picsum.photos/seed/kavum/800/600', ARRAY['Rice flour', 'Treacle', 'Coconut milk', 'Oil'], ARRAY['Mix flour and treacle to a thick batter.', 'Heat oil in a deep pan.', 'Pour batter into center.', 'Form the konda while frying.', 'Fry until golden brown.'], '1 hour', 10),
  ('Kokis', 'https://picsum.photos/seed/kokis/800/600', ARRAY['Rice flour', 'Coconut milk', 'Egg', 'Turmeric'], ARRAY['Mix ingredients to a smooth batter.', 'Heat mold in oil.', 'Dip mold in batter.', 'Fry until crisp.', 'Shake to release.'], '45 mins', 15),
  ('Mung Kevum', 'https://picsum.photos/seed/mung/800/600', ARRAY['Mung bean flour', 'Rice flour', 'Treacle', 'Coconut milk'], ARRAY['Mix flours.', 'Add treacle and milk.', 'Shape into diamonds.', 'Deep fry until golden.'], '1.5 hours', 12),
  ('Asmi', 'https://picsum.photos/seed/asmi/800/600', ARRAY['Rice flour', 'Coconut milk', 'Cinnamon leaf extract', 'Treacle syrup'], ARRAY['Make a smooth batter.', 'Add cinnamon extract.', 'Pour through perforated spoon into oil.', 'Fold and set aside.', 'Fry again and drizzle treacle.'], '2 days', 8);

  -- Sample Quiz Data
  INSERT INTO quiz_questions (question, option1, option2, option3, option4, correct_answer) VALUES
  ('What is the traditional sweet made with rice flour and treacle?', 'Kokis', 'Kavum', 'Aluwa', 'Asmi', 1),
  ('Which bird is associated with the Sinhala and Tamil New Year?', 'Parrot', 'Peacock', 'Koha', 'Owl', 2);
*/
