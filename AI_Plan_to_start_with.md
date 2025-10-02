# 1-Month AI Crisis Detection Accuracy Plan (Budget-Constrained)

**Goal:** Achieve 85%+ Crisis Detection Accuracy in 30 Days

---

## Phase 1: Foundation (Days 1-7)

### Week 1: Data Collection & Baseline Setup

#### Day 1-2: Synthetic Data Generation

Create realistic restaurant metrics datasets (no API costs)  
Generate 100+ crisis scenarios:

- Ranking drops (3-10 positions)
- Traffic losses (20-50%)
- Review score drops (0.3-1.0 stars)
- Seasonal patterns vs actual crises  
  Label each scenario: `crisis/no_crisis` + severity

```python
# Example synthetic data structure
crisis_scenarios = {
    'scenario_1': {
        'previous_ranking': 3,
        'current_ranking': 8,
        'traffic_change': -0.35,
        'review_score_change': -0.6,
        'time_period': 'non_holiday',
        'label': 'critical_crisis',
        'cause': 'negative_review_spike'
    }
}
```

#### Day 3-4: AWS Bedrock Setup (Free Tier)

- Set up AWS account with student credits
- Enable Bedrock Nova Pro access
- Create basic Python testing environment
- Test API connectivity with minimal calls

#### Day 5-7: Rule-Based Baseline

- Implement simple threshold detection (control group)
- Test on synthetic data
- Measure baseline accuracy, false positives, false negatives  
  **Target:** 70-75% baseline accuracy

---

## Phase 2: AI Model Development (Days 8-21)

### Week 2: Prompt Engineering & Testing

#### Day 8-10: Prompt Design

Focus on zero-shot and few-shot prompting (minimal token usage):

```python
CRISIS_DETECTION_PROMPT = """
You are a restaurant SEO crisis detection system.

Given these metrics:
- Previous ranking: {prev_rank}
- Current ranking: {curr_rank}
- Traffic change: {traffic_change}%
- Review score change: {review_change}
- Time period: {time_period}

Analyze:
1. Is this a crisis? (yes/no)
2. Severity (1-10)
3. Likely cause
4. Confidence (0-100%)

Rules:
- Ranking drop >3 positions = likely crisis
- Traffic loss >20% = likely crisis
- Consider seasonality (holidays, summer outdoor dining)
- Multiple factors = higher confidence

Respond in JSON format only.
"""
```

#### Day 11-14: Iterative Testing

- Test 20 scenarios daily (budget ~$5-10/day in API costs)
- Compare AI vs rule-based accuracy
- Refine prompts based on failures  
  Track metrics:
- True positive rate
- False positive rate
- Precision/recall

### Week 3: Algorithm Optimization

#### Day 15-17: Hybrid Approach

Combine rule-based + AI for cost efficiency:

```python
def detect_crisis(metrics):
    # Quick rule-based filter (free)
    if simple_threshold_check(metrics):
        # Only use AI for borderline cases
        return ai_analyze(metrics)
    else:
        return rule_based_decision(metrics)
```

This reduces AI calls by 60-70%, saving credits.

#### Day 18-21: Multi-Factor Scoring

- Implement weighted scoring system
- Test different weight combinations
- Validate against ground truth labels  
  **Target:** 85%+ accuracy

---

## Phase 3: Validation & Refinement (Days 22-30)

### Week 4: Real-World Testing

#### Day 22-25: Limited Real Data

Find 10-20 public restaurant case studies online  
Extract real crisis scenarios from:

- SEO case studies
- Restaurant review platforms
- Industry reports  
  Test your algorithm on actual data

#### Day 26-28: Error Analysis

- Categorize all false positives/negatives
- Identify pattern gaps
- Refine detection thresholds
- Add edge case handling

#### Day 29-30: Documentation & Results

- Document accuracy metrics
- Create demo with 50 test cases
- Prepare presentation showing:
  - Baseline: 70-75% (rule-based)
  - Final: 85%+ (hybrid AI)
  - Cost per detection: <$0.05

---

## Budget Optimization Strategies

### Minimize AWS Costs:

- **Caching:** Cache similar queries to avoid repeat API calls
- **Batch Processing:** Analyze multiple scenarios in one prompt
- **Tiered Detection:**
  - Free rule-based filtering (70% of cases)
  - AI only for complex cases (30% of cases)
- **Use Nova Lite first:** Test with cheaper model, upgrade to Pro only when needed

### Token Management:

```python
# Efficient prompt structure
CONCISE_PROMPT = """
Metrics: rank {prev_rank}→{curr_rank}, traffic {traffic_change}%, reviews {review_change}
Crisis? Severity? Cause?
JSON only."""
```

Reduces tokens by 60%, cuts costs by 60%.

---

## Success Metrics (End of Month 1)

| Metric              | Target | How to Measure                         |
| ------------------- | ------ | -------------------------------------- |
| Detection Accuracy  | 85%+   | % correct crisis/no-crisis predictions |
| False Positive Rate | <15%   | % non-crises flagged as crises         |
| Processing Time     | <2 sec | Average AI response time               |
| Cost per Detection  | <$0.05 | AWS spend / total detections           |
| Severity Accuracy   | 75%+   | Correct severity classification        |

---

## Realistic Constraints & Trade-offs

### What You CAN Achieve:

- ✓ Validate core AI accuracy using synthetic + public data
- ✓ Build confidence in detection algorithm
- ✓ Create proof-of-concept demo
- ✓ Spend <$100 in AWS credits

### What You CANNOT Do in 1 Month:

- ✗ Full production infrastructure
- ✗ Real-time 15-minute monitoring
- ✗ Integration with live GMB APIs
- ✗ Multi-restaurant scalability testing

---

## Week-by-Week Deliverables

- **Week 1:** Synthetic dataset (100+ scenarios) + baseline accuracy (70-75%)
- **Week 2:** AI prompt iteration + improved accuracy (78-82%)
- **Week 3:** Hybrid system + optimization (82-85%)
- **Week 4:** Real data validation + final demo (85%+ proven)

---

## Tools & Resources (Free/Cheap)

- **AWS Bedrock:** Use student credits, start with Nova Lite
- **Python Libraries:** boto3, pandas, scikit-learn (free)
- **Data Sources:**
  - BrightLocal case studies (public)
  - Restaurant review datasets (Kaggle)
  - Google Trends data (free API)

> **No real APIs yet** (to save costs/credits). Simulate restaurant metrics: Create JSON datasets for 50 fictional restaurants (e.g., rankings, traffic, reviews over time). Use public datasets from Kaggle (e.g., Yelp reviews, Google Trends for SEO simulation) or generate with Python (random walks for metrics).  
> For realism: Download sample GMB data from public sources (e.g., Google Places API free tier limited calls) or mock it. Aim for 1,000-5,000 data points (e.g., hourly metrics over weeks).  
> **Testing:** Jupyter notebooks (free)

---

## Critical Success Factors

- Focus ruthlessly on accuracy - skip infrastructure for now
- Test on diverse scenarios - holidays, health violations, competitor actions
- Document everything - your findings are valuable for future fundraising
- Prove the concept - 85% accuracy validates the business case

> If you achieve 85%+ accuracy with documented test cases, you'll have strong evidence to attract investment or partnerships for the full build-out.  
> **Start with Day 1 tomorrow:** Generate your first 20 crisis scenarios and baseline dataset.
