-- Initialize the database
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false
);

-- Insert initial data
INSERT INTO todos (title, completed) VALUES 
('Learn Docker', false),
('Write Seed Script', false),
('Run the App', true);