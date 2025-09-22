-- RestaurantGuard AI Agent Database Schema
-- PostgreSQL 15.4 compatible

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create restaurants table
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address JSONB NOT NULL,
    contact_info JSONB NOT NULL,
    digital_presence JSONB NOT NULL DEFAULT '{}',
    target_keywords JSONB NOT NULL DEFAULT '[]',
    monitoring_config JSONB NOT NULL DEFAULT '{}',
    api_credentials JSONB NOT NULL DEFAULT '{}',
    competitor_data JSONB DEFAULT '{}',
    subscription_tier VARCHAR(50) DEFAULT 'basic',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create SEO metrics tracking table
CREATE TABLE seo_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL,
    metric_data JSONB NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed BOOLEAN DEFAULT FALSE
);

-- Create crisis events table
CREATE TABLE crisis_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    crisis_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    detection_data JSONB NOT NULL,
    response_plan JSONB,
    actions_taken JSONB,
    resolution_status VARCHAR(50) DEFAULT 'detected' CHECK (
        resolution_status IN ('detected', 'in_progress', 'resolved', 'failed')
    ),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_time_minutes INTEGER,
    impact_score DECIMAL(3,2),
    lessons_learned TEXT
);

-- Create action outcomes table for learning
CREATE TABLE action_outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crisis_event_id UUID REFERENCES crisis_events(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    action_details JSONB NOT NULL,
    success_metrics JSONB,
    effectiveness_score DECIMAL(3,2) CHECK (effectiveness_score >= 0 AND effectiveness_score <= 1),
    execution_time_seconds INTEGER,
    cost_usd DECIMAL(10,2),
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    measured_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Create competitor tracking table
CREATE TABLE competitor_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    competitor_name VARCHAR(255) NOT NULL,
    competitor_website VARCHAR(500),
    competitor_data JSONB NOT NULL,
    ranking_data JSONB,
    last_analyzed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    analysis_frequency VARCHAR(50) DEFAULT 'daily',
    threat_level VARCHAR(20) DEFAULT 'medium' CHECK (
        threat_level IN ('low', 'medium', 'high', 'critical')
    )
);

-- Create keyword tracking table
CREATE TABLE keyword_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    keyword_type VARCHAR(50) NOT NULL CHECK (
        keyword_type IN ('primary', 'secondary', 'local', 'seasonal', 'competitor')
    ),
    current_position INTEGER,
    previous_position INTEGER,
    best_position INTEGER,
    worst_position INTEGER,
    search_volume INTEGER,
    difficulty_score INTEGER,
    tracked_since DATE DEFAULT CURRENT_DATE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create review tracking table
CREATE TABLE review_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    review_id VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    reviewer_name VARCHAR(255),
    review_date TIMESTAMP WITH TIME ZONE,
    sentiment_score DECIMAL(3,2),
    topics JSONB,
    response_generated BOOLEAN DEFAULT FALSE,
    response_posted BOOLEAN DEFAULT FALSE,
    response_text TEXT,
    response_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(platform, review_id)
);

-- Create scheduled actions table
CREATE TABLE scheduled_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    action_data JSONB NOT NULL,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (
        priority IN ('low', 'medium', 'high', 'critical')
    ),
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (
        status IN ('scheduled', 'executing', 'completed', 'failed', 'cancelled')
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    executed_at TIMESTAMP WITH TIME ZONE,
    completion_time_seconds INTEGER,
    error_message TEXT
);

-- Create performance baselines table
CREATE TABLE performance_baselines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    baseline_type VARCHAR(50) NOT NULL,
    baseline_data JSONB NOT NULL,
    calculation_period_days INTEGER DEFAULT 30,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_current BOOLEAN DEFAULT TRUE
);

-- Create audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    action_description TEXT,
    user_id VARCHAR(255),
    source_system VARCHAR(100),
    before_state JSONB,
    after_state JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_restaurants_status ON restaurants(status);
CREATE INDEX idx_restaurants_created_at ON restaurants(created_at);

CREATE INDEX idx_seo_metrics_restaurant_time ON seo_metrics(restaurant_id, recorded_at DESC);
CREATE INDEX idx_seo_metrics_type ON seo_metrics(metric_type);
CREATE INDEX idx_seo_metrics_processed ON seo_metrics(processed) WHERE processed = FALSE;

CREATE INDEX idx_crisis_events_restaurant ON crisis_events(restaurant_id);
CREATE INDEX idx_crisis_events_status ON crisis_events(resolution_status);
CREATE INDEX idx_crisis_events_detected_at ON crisis_events(detected_at DESC);
CREATE INDEX idx_crisis_events_type_severity ON crisis_events(crisis_type, severity);

CREATE INDEX idx_action_outcomes_crisis ON action_outcomes(crisis_event_id);
CREATE INDEX idx_action_outcomes_type ON action_outcomes(action_type);
CREATE INDEX idx_action_outcomes_effectiveness ON action_outcomes(effectiveness_score DESC);

CREATE INDEX idx_competitor_tracking_restaurant ON competitor_tracking(restaurant_id);
CREATE INDEX idx_competitor_tracking_analyzed ON competitor_tracking(last_analyzed);

CREATE INDEX idx_keyword_tracking_restaurant ON keyword_tracking(restaurant_id);
CREATE INDEX idx_keyword_tracking_keyword ON keyword_tracking(keyword);
CREATE INDEX idx_keyword_tracking_active ON keyword_tracking(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_keyword_tracking_position ON keyword_tracking(current_position);

CREATE INDEX idx_review_tracking_restaurant ON review_tracking(restaurant_id);
CREATE INDEX idx_review_tracking_platform ON review_tracking(platform);
CREATE INDEX idx_review_tracking_date ON review_tracking(review_date DESC);
CREATE INDEX idx_review_tracking_rating ON review_tracking(rating);
CREATE INDEX idx_review_tracking_response_needed ON review_tracking(response_generated) WHERE response_generated = FALSE;

CREATE INDEX idx_scheduled_actions_restaurant ON scheduled_actions(restaurant_id);
CREATE INDEX idx_scheduled_actions_scheduled_for ON scheduled_actions(scheduled_for);
CREATE INDEX idx_scheduled_actions_status ON scheduled_actions(status);

CREATE INDEX idx_performance_baselines_restaurant ON performance_baselines(restaurant_id);
CREATE INDEX idx_performance_baselines_current ON performance_baselines(is_current) WHERE is_current = TRUE;

CREATE INDEX idx_audit_logs_restaurant ON audit_logs(restaurant_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Create functions for automated updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_restaurants_updated_at
    BEFORE UPDATE ON restaurants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate crisis resolution time
CREATE OR REPLACE FUNCTION update_crisis_resolution_time()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.resolution_status = 'resolved' AND OLD.resolution_status != 'resolved' THEN
        NEW.resolved_at = CURRENT_TIMESTAMP;
        NEW.resolution_time_minutes = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - NEW.detected_at)) / 60;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_crisis_resolution_time_trigger
    BEFORE UPDATE ON crisis_events
    FOR EACH ROW
    EXECUTE FUNCTION update_crisis_resolution_time();

-- Function to update baseline currency
CREATE OR REPLACE FUNCTION update_baseline_currency()
RETURNS TRIGGER AS $$
BEGIN
    -- Mark old baselines as not current
    UPDATE performance_baselines
    SET is_current = FALSE
    WHERE restaurant_id = NEW.restaurant_id
      AND baseline_type = NEW.baseline_type
      AND is_current = TRUE
      AND id != NEW.id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_baseline_currency_trigger
    AFTER INSERT ON performance_baselines
    FOR EACH ROW
    EXECUTE FUNCTION update_baseline_currency();

-- Views for common queries
CREATE VIEW restaurant_health_summary AS
SELECT
    r.id,
    r.name,
    r.status,
    COUNT(DISTINCT ce.id) as total_crises,
    COUNT(DISTINCT CASE WHEN ce.resolution_status = 'resolved' THEN ce.id END) as resolved_crises,
    COUNT(DISTINCT CASE WHEN ce.detected_at >= CURRENT_DATE - INTERVAL '30 days' THEN ce.id END) as recent_crises,
    AVG(ce.resolution_time_minutes) as avg_resolution_time_minutes,
    MAX(sm.recorded_at) as last_monitored,
    COUNT(DISTINCT kt.id) as tracked_keywords,
    AVG(rt.rating) as average_review_rating,
    COUNT(DISTINCT rt.id) as total_reviews
FROM restaurants r
LEFT JOIN crisis_events ce ON r.id = ce.restaurant_id
LEFT JOIN seo_metrics sm ON r.id = sm.restaurant_id
LEFT JOIN keyword_tracking kt ON r.id = kt.restaurant_id AND kt.is_active = TRUE
LEFT JOIN review_tracking rt ON r.id = rt.restaurant_id
WHERE r.status = 'active'
GROUP BY r.id, r.name, r.status;

CREATE VIEW crisis_performance_metrics AS
SELECT
    crisis_type,
    severity,
    COUNT(*) as total_events,
    COUNT(CASE WHEN resolution_status = 'resolved' THEN 1 END) as resolved_events,
    AVG(resolution_time_minutes) as avg_resolution_time,
    AVG(impact_score) as avg_impact_score,
    MIN(detected_at) as first_occurrence,
    MAX(detected_at) as last_occurrence
FROM crisis_events
GROUP BY crisis_type, severity
ORDER BY severity DESC, total_events DESC;

CREATE VIEW keyword_performance_summary AS
SELECT
    r.name as restaurant_name,
    kt.keyword,
    kt.keyword_type,
    kt.current_position,
    kt.previous_position,
    kt.best_position,
    kt.search_volume,
    CASE
        WHEN kt.current_position IS NULL THEN 'Not Ranking'
        WHEN kt.current_position <= 3 THEN 'Top 3'
        WHEN kt.current_position <= 10 THEN 'Page 1'
        WHEN kt.current_position <= 20 THEN 'Page 2'
        ELSE 'Below Page 2'
    END as position_category,
    kt.last_updated
FROM keyword_tracking kt
JOIN restaurants r ON kt.restaurant_id = r.id
WHERE kt.is_active = TRUE
ORDER BY r.name, kt.keyword_type, kt.current_position NULLS LAST;

-- Insert sample configuration data
INSERT INTO restaurants (name, address, contact_info, digital_presence, target_keywords, monitoring_config) VALUES
(
    'Sample Restaurant',
    '{"street": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "USA"}',
    '{"phone": "+1-555-0123", "email": "info@samplerestaurant.com", "website": "https://samplerestaurant.com"}',
    '{"googleMyBusinessId": "sample-gmb-id", "yelpBusinessId": "sample-yelp-id", "facebookPageId": "sample-fb-id"}',
    '["best restaurant nyc", "italian restaurant manhattan", "fine dining new york"]',
    '{"monitoringFrequency": "15_minutes", "alertThresholds": {"rankingDrop": 30, "trafficDrop": 20}}'
);

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO restaurantguard_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO restaurantguard_admin;
GRANT USAGE ON SCHEMA public TO restaurantguard_admin;