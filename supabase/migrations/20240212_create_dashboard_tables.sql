-- Create enum types
CREATE TYPE lesson_type AS ENUM ('driving', 'theory');
CREATE TYPE lesson_status AS ENUM ('confirmed', 'pending', 'cancelled');
CREATE TYPE activity_type AS ENUM ('payment', 'exam', 'lesson');

-- Create lessons table
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id),
    student_name VARCHAR(255) NOT NULL,
    instructor_id UUID NOT NULL REFERENCES instructors(id),
    instructor_name VARCHAR(255) NOT NULL,
    type lesson_type NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    status lesson_status NOT NULL DEFAULT 'pending',
    location TEXT,
    vehicle_id UUID REFERENCES vehicles(id),
    vehicle_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create activities table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type activity_type NOT NULL,
    user_id UUID NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_lessons_start_time ON lessons(start_time);
CREATE INDEX idx_lessons_student_id ON lessons(student_id);
CREATE INDEX idx_lessons_instructor_id ON lessons(instructor_id);
CREATE INDEX idx_activities_created_at ON activities(created_at);
CREATE INDEX idx_activities_user_id ON activities(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for lessons
CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to get dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
    total_students INTEGER,
    active_students INTEGER,
    total_instructors INTEGER,
    total_vehicles INTEGER,
    total_exams INTEGER,
    exam_success_rate DECIMAL,
    monthly_revenue DECIMAL,
    driving_hours INTEGER,
    last_month_driving_hours INTEGER,
    last_month_revenue DECIMAL,
    last_month_exam_success_rate DECIMAL
) AS $$
DECLARE
    current_month DATE := date_trunc('month', CURRENT_DATE);
    last_month DATE := date_trunc('month', CURRENT_DATE - INTERVAL '1 month');
BEGIN
    RETURN QUERY
    WITH current_month_stats AS (
        SELECT 
            COUNT(DISTINCT s.id) as total_students,
            COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'active') as active_students,
            COUNT(DISTINCT i.id) as total_instructors,
            COUNT(DISTINCT v.id) as total_vehicles,
            COUNT(DISTINCT e.id) FILTER (WHERE e.date >= current_month) as total_exams,
            COALESCE(AVG(CASE WHEN e.status = 'passed' AND e.date >= current_month THEN 1 ELSE 0 END) * 100, 0) as exam_success_rate,
            COALESCE(SUM(p.amount) FILTER (WHERE p.created_at >= current_month), 0) as monthly_revenue,
            COALESCE(SUM(l.duration) FILTER (WHERE l.type = 'driving' AND l.start_time >= current_month), 0) / 60 as driving_hours,
            COALESCE(SUM(l.duration) FILTER (WHERE l.type = 'driving' AND l.start_time >= last_month AND l.start_time < current_month), 0) / 60 as last_month_driving_hours,
            COALESCE(SUM(p.amount) FILTER (WHERE p.created_at >= last_month AND p.created_at < current_month), 0) as last_month_revenue,
            COALESCE(AVG(CASE WHEN e.status = 'passed' AND e.date >= last_month AND e.date < current_month THEN 1 ELSE 0 END) * 100, 0) as last_month_exam_success_rate
        FROM students s
        LEFT JOIN instructors i ON true
        LEFT JOIN vehicles v ON true
        LEFT JOIN exams e ON e.student_id = s.id
        LEFT JOIN payments p ON p.student_id = s.id
        LEFT JOIN lessons l ON l.student_id = s.id
    )
    SELECT * FROM current_month_stats;
END;
$$ LANGUAGE plpgsql;

-- Create function to get weekly lessons
CREATE OR REPLACE FUNCTION get_weekly_lessons()
RETURNS TABLE (
    date DATE,
    total_lessons INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE dates AS (
        SELECT date_trunc('day', CURRENT_DATE - INTERVAL '6 days')::date AS date
        UNION ALL
        SELECT (date + INTERVAL '1 day')::date
        FROM dates
        WHERE date < CURRENT_DATE
    )
    SELECT 
        d.date,
        COUNT(l.id)::INTEGER as total_lessons
    FROM dates d
    LEFT JOIN lessons l ON date_trunc('day', l.start_time)::date = d.date
    GROUP BY d.date
    ORDER BY d.date;
END;
$$ LANGUAGE plpgsql;
