# AI Architecture Design for RestaurantGuard Crisis Detection

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    RESTAURANTGUARD AI SYSTEM                    │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  DATA LAYER      │
│                  │
│  • Synthetic     │──┐
│    Dataset       │  │
│  • Test Cases    │  │
│  • Ground Truth  │  │
│    Labels        │  │
└──────────────────┘  │
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│               DETECTION ENGINE (Core AI Logic)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────┐      ┌──────────────────┐                 │
│  │  PRE-FILTER    │─────▶│   AI ANALYZER    │                 │
│  │  (Rule-Based)  │      │ (Bedrock Nova)   │                 │
│  │                │      │                  │                 │
│  │ • Quick checks │      │ • Pattern recog  │                 │
│  │ • Threshold    │      │ • Root cause     │                 │
│  │   screening    │      │ • Confidence     │                 │
│  │ • 70% filtered │      │   scoring        │                 │
│  └────────────────┘      └──────────────────┘                 │
│         │                         │                             │
│         │                         │                             │
│         ▼                         ▼                             │
│  ┌──────────────────────────────────────────┐                 │
│  │      DECISION FUSION ENGINE              │                 │
│  │                                          │                 │
│  │  • Combines rule + AI outputs           │                 │
│  │  • Weighted scoring                      │                 │
│  │  • Confidence thresholds                 │                 │
│  │  • Final crisis determination            │                 │
│  └──────────────────────────────────────────┘                 │
│                      │                                          │
└──────────────────────┼──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    OUTPUT & EVALUATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌─────────────┐     │
│  │   Crisis     │    │  Severity    │    │  Metrics    │     │
│  │ Detection    │    │  Scoring     │    │  Tracking   │     │
│  │ (Yes/No)     │    │  (1-10)      │    │             │     │
│  └──────────────┘    └──────────────┘    │ • Accuracy  │     │
│                                           │ • Precision │     │
│  ┌──────────────┐    ┌──────────────┐    │ • Recall    │     │
│  │  Root Cause  │    │  Confidence  │    │ • F1 Score  │     │
│  │  Analysis    │    │  Score       │    │ • Cost/call │     │
│  │              │    │  (0-100%)    │    └─────────────┘     │
│  └──────────────┘    └──────────────┘                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### **1. Data Layer**

- **Purpose**: Store test scenarios and ground truth
- **Structure**: JSON files with labeled crisis patterns
- **Size**: 100-500 scenarios by end of month

### **2. Pre-Filter (Rule-Based)**

```python
def pre_filter(metrics):
    """Filter obvious cases without AI"""

    # Clear crisis indicators
    if metrics['ranking_drop'] > 5:
        return {'needs_ai': False, 'crisis': True, 'confidence': 95}

    # Clear non-crisis
    if metrics['ranking_drop'] < 2 and metrics['traffic_change'] > -0.1:
        return {'needs_ai': False, 'crisis': False, 'confidence': 90}

    # Borderline - needs AI
    return {'needs_ai': True, 'crisis': None, 'confidence': 0}
```

### **3. AI Analyzer (AWS Bedrock Nova)**

- **Model**: Nova Pro (or Lite for testing)
- **Input**: Complex scenarios from pre-filter
- **Output**: Structured JSON with analysis
- **Cost optimization**: Only 30% of cases reach this layer

### **4. Decision Fusion Engine**

- Combines rule-based + AI outputs
- Applies weighted scoring algorithm
- Final crisis determination with confidence

### **5. Evaluation Pipeline**

- Automated testing against ground truth
- Metrics calculation and tracking
- Error analysis and logging

---

# 30-Day AI Development Checklist

## **WEEK 1: Foundation (Days 1-7)**

### **Day 1: Environment Setup**

- [ ] Set up AWS account with student credits
- [ ] Enable AWS Bedrock access (request if needed)
- [ ] Install Python 3.11+ environment
- [ ] Install required packages: `boto3`, `pandas`, `scikit-learn`, `jupyter`
- [ ] Create project folder structure
- [ ] Set up Git repository for version control

**Deliverable**: Working development environment

---

### **Day 2: Synthetic Data Generation - Part 1**

- [ ] Define crisis scenario types:
  - [ ] Ranking drop crises
  - [ ] Traffic loss crises
  - [ ] Review score drop crises
  - [ ] Multi-factor crises
- [ ] Create data generator script
- [ ] Generate 50 scenarios (25 crisis, 25 non-crisis)
- [ ] Add ground truth labels and severity scores

**Deliverable**: `synthetic_data_v1.json` with 50 scenarios

---

### **Day 3: Synthetic Data Generation - Part 2**

- [ ] Add seasonal variations (holidays, summer, winter)
- [ ] Add restaurant type variations (fast food, fine dining, casual)
- [ ] Generate edge cases:
  - [ ] Borderline scenarios (ranking drop exactly 3)
  - [ ] Conflicting signals (ranking up, traffic down)
  - [ ] Seasonal false positives
- [ ] Expand dataset to 100 total scenarios
- [ ] Validate data quality manually

**Deliverable**: `synthetic_data_v2.json` with 100 scenarios

---

### **Day 4: AWS Bedrock Connection Test**

- [ ] Configure AWS credentials locally
- [ ] Write minimal Bedrock API test script
- [ ] Test connection with 3-5 API calls
- [ ] Verify response format
- [ ] Calculate token usage and cost per call
- [ ] Document API latency

**Deliverable**: `bedrock_test.py` with verified connection

---

### **Day 5: Rule-Based Baseline - Implementation**

- [ ] Define threshold rules:
  - [ ] Ranking drop > 3 positions
  - [ ] Traffic loss > 20%
  - [ ] Review score drop > 0.5
  - [ ] GMB suspension flag
- [ ] Implement rule-based detector function
- [ ] Add severity scoring logic
- [ ] Create evaluation script

**Deliverable**: `rule_based_detector.py`

---

### **Day 6: Rule-Based Baseline - Testing**

- [ ] Test rule-based detector on all 100 scenarios
- [ ] Calculate baseline metrics:
  - [ ] Accuracy
  - [ ] Precision
  - [ ] Recall
  - [ ] F1 Score
  - [ ] False positive rate
  - [ ] False negative rate
- [ ] Identify failure patterns
- [ ] Document baseline performance

**Deliverable**: `baseline_results.json` with metrics

**Target**: 70-75% accuracy

---

### **Day 7: Week 1 Review & Planning**

- [ ] Consolidate all Week 1 deliverables
- [ ] Analyze baseline weaknesses
- [ ] Plan prompt engineering strategy
- [ ] Calculate budget consumed vs remaining
- [ ] Adjust Week 2 plan based on learnings
- [ ] Create progress dashboard/spreadsheet

**Deliverable**: Week 1 summary report + updated plan

---

## **WEEK 2: AI Integration (Days 8-14)**

### **Day 8: Prompt Engineering - Initial Design**

- [ ] Study Bedrock Nova Pro prompt best practices
- [ ] Design initial crisis detection prompt template
- [ ] Create structured output format (JSON schema)
- [ ] Define input data format
- [ ] Test prompt with 5 manual examples
- [ ] Refine based on initial results

**Deliverable**: `prompt_template_v1.txt`

---

### **Day 9: AI Integration - Basic Implementation**

- [ ] Create `ai_analyzer.py` module
- [ ] Implement Bedrock API call function
- [ ] Add error handling and retries
- [ ] Add response parsing logic
- [ ] Implement token counting
- [ ] Add cost tracking

**Deliverable**: `ai_analyzer.py` with working API integration

---

### **Day 10: AI Testing - First Round**

- [ ] Select 20 challenging scenarios from dataset
- [ ] Run AI analyzer on all 20
- [ ] Compare AI vs rule-based vs ground truth
- [ ] Calculate AI-only metrics
- [ ] Track cost per detection
- [ ] Document failure cases

**Deliverable**: `ai_test_round1_results.json`

**Budget check**: Should use ~$5-10 in credits

---

### **Day 11: Prompt Refinement - Iteration 1**

- [ ] Analyze Day 10 failure cases
- [ ] Identify prompt weaknesses
- [ ] Refine prompt with:
  - [ ] Better context setting
  - [ ] Clearer instructions
  - [ ] Improved examples (few-shot learning)
  - [ ] Stricter output format requirements
- [ ] Test refined prompt on 10 previous failures

**Deliverable**: `prompt_template_v2.txt`

---

### **Day 12: AI Testing - Second Round**

- [ ] Test refined prompt on 30 new scenarios
- [ ] Compare v1 vs v2 performance
- [ ] Calculate improvement metrics
- [ ] Identify remaining failure patterns
- [ ] Update error taxonomy

**Deliverable**: `ai_test_round2_results.json`

**Target**: 78-82% accuracy on AI component

---

### **Day 13: Prompt Refinement - Iteration 2**

- [ ] Further refine prompt based on Round 2 results
- [ ] Add seasonality awareness
- [ ] Add restaurant type context
- [ ] Optimize token usage (reduce costs)
- [ ] Create concise prompt variant
- [ ] Test both versions

**Deliverable**: `prompt_template_v3.txt` (standard + concise)

---

### **Day 14: Week 2 Review & Integration**

- [ ] Test final AI analyzer on full 100-scenario dataset
- [ ] Compare AI vs baseline across all metrics
- [ ] Calculate total costs consumed
- [ ] Document prompt evolution
- [ ] Prepare for hybrid system development
- [ ] Update progress tracker

**Deliverable**: Week 2 comprehensive results report

---

## **WEEK 3: Hybrid System (Days 15-21)**

### **Day 15: Hybrid Architecture Design**

- [ ] Design pre-filter logic flow
- [ ] Define when to use AI vs rules
- [ ] Create confidence threshold system
- [ ] Design weighted scoring algorithm
- [ ] Plan cost optimization strategy
- [ ] Document architecture decisions

**Deliverable**: `hybrid_architecture.md` with flowcharts

---

### **Day 16: Hybrid System - Implementation**

- [ ] Create `hybrid_detector.py` module
- [ ] Implement pre-filter function
- [ ] Integrate rule-based detector
- [ ] Integrate AI analyzer
- [ ] Implement decision fusion logic
- [ ] Add cost tracking per path (rule vs AI)

**Deliverable**: `hybrid_detector.py` with full pipeline

---

### **Day 17: Hybrid System - Initial Testing**

- [ ] Run hybrid system on full dataset
- [ ] Measure:
  - [ ] Overall accuracy
  - [ ] % cases using AI vs rules
  - [ ] Cost per detection
  - [ ] Processing time
- [ ] Compare hybrid vs pure AI vs pure rules
- [ ] Identify optimization opportunities

**Deliverable**: `hybrid_test_v1_results.json`

---

### **Day 18: Multi-Factor Scoring Implementation**

- [ ] Design weighted scoring formula:
  - [ ] Ranking factor weight
  - [ ] Traffic factor weight
  - [ ] Review factor weight
  - [ ] Temporal factor weight
- [ ] Implement scoring algorithm
- [ ] Test different weight combinations
- [ ] Find optimal weights via grid search

**Deliverable**: `scoring_algorithm.py` with optimized weights

---

### **Day 19: Confidence Threshold Tuning**

- [ ] Analyze confidence distribution
- [ ] Test different confidence thresholds
- [ ] Balance precision vs recall
- [ ] Optimize for business impact (minimize missed crises)
- [ ] Create confidence calibration curve
- [ ] Document threshold rationale

**Deliverable**: Calibrated confidence system

---

### **Day 20: Hybrid System - Final Optimization**

- [ ] Integrate optimized scoring
- [ ] Apply calibrated confidence thresholds
- [ ] Test on full dataset (100+ scenarios)
- [ ] Fine-tune pre-filter rules
- [ ] Minimize cost while maximizing accuracy
- [ ] Run final performance evaluation

**Deliverable**: `hybrid_detector_final.py`

**Target**: 85%+ accuracy, <$0.05 per detection

---

### **Day 21: Week 3 Review & Expansion**

- [ ] Generate 50 additional test scenarios
- [ ] Test system on new unseen data
- [ ] Calculate final Week 3 metrics
- [ ] Document system capabilities
- [ ] Prepare for real-world validation
- [ ] Update progress tracker

**Deliverable**: Week 3 final report + expanded dataset (150 total)

---

## **WEEK 4: Validation & Documentation (Days 22-30)**

### **Day 22: Real-World Data Collection**

- [ ] Research public restaurant SEO case studies
- [ ] Find 10-15 real crisis examples:
  - [ ] From BrightLocal blog
  - [ ] From Local SEO forums
  - [ ] From restaurant industry reports
- [ ] Extract actual metrics where available
- [ ] Create labeled real-world test set
- [ ] Document sources

**Deliverable**: `real_world_data.json` with 10-15 cases

---

### **Day 23: Real-World Testing**

- [ ] Run hybrid system on real-world cases
- [ ] Compare predictions vs actual outcomes
- [ ] Calculate accuracy on real data
- [ ] Identify gaps vs synthetic data
- [ ] Document failure modes
- [ ] Analyze prediction confidence

**Deliverable**: `real_world_test_results.json`

---

### **Day 24: Error Analysis Deep Dive**

- [ ] Categorize all errors:
  - [ ] False positives by type
  - [ ] False negatives by type
  - [ ] Low confidence errors
  - [ ] Edge cases
- [ ] Find patterns in failures
- [ ] Propose fixes for each category
- [ ] Prioritize improvements
- [ ] Document learnings

**Deliverable**: `error_analysis_report.md`

---

### **Day 25: Final Refinements**

- [ ] Implement top 3 identified improvements
- [ ] Re-test on full dataset (synthetic + real)
- [ ] Verify accuracy improvements
- [ ] Finalize system parameters
- [ ] Lock down final version
- [ ] Run comprehensive final evaluation

**Deliverable**: Final system version with best metrics

---

### **Day 26: Demo Creation**

- [ ] Create interactive demo notebook
- [ ] Select 20 representative test cases
- [ ] Show system predictions step-by-step
- [ ] Visualize decision process
- [ ] Compare all approaches (rule/AI/hybrid)
- [ ] Add cost analysis

**Deliverable**: `demo.ipynb` Jupyter notebook

---

### **Day 27: Comprehensive Documentation**

- [ ] Write technical documentation:
  - [ ] System architecture
  - [ ] Algorithm description
  - [ ] Prompt engineering process
  - [ ] Testing methodology
  - [ ] Results analysis
- [ ] Create API reference
- [ ] Document configuration options
- [ ] Add usage examples

**Deliverable**: `TECHNICAL_DOCS.md`

---

### **Day 28: Results Compilation**

- [ ] Compile all metrics across 30 days
- [ ] Create performance comparison charts
- [ ] Calculate ROI metrics (accuracy vs cost)
- [ ] Document cost breakdown
- [ ] Create executive summary
- [ ] Prepare investor/stakeholder materials

**Deliverable**: `FINAL_RESULTS.md` with charts

---

### **Day 29: Presentation Preparation**

- [ ] Create slide deck showcasing:
  - [ ] Problem statement
  - [ ] Solution approach
  - [ ] Technical architecture
  - [ ] Results and metrics
  - [ ] Demo walkthrough
  - [ ] Next steps
- [ ] Practice presentation
- [ ] Prepare FAQ responses

**Deliverable**: Presentation deck (15-20 slides)

---

### **Day 30: Final Review & Future Planning**

- [ ] Review all 30-day deliverables
- [ ] Validate completeness
- [ ] Archive all code and data
- [ ] Create GitHub repository (public or private)
- [ ] Plan next phase (infrastructure build)
- [ ] Document lessons learned
- [ ] Celebrate completion!

**Deliverable**: Complete project archive + roadmap for Month 2

---

## Progress Tracking Spreadsheet Template

Create a spreadsheet with these columns:

| Day | Task       | Status | Accuracy | Cost | Notes                | Blocker? |
| --- | ---------- | ------ | -------- | ---- | -------------------- | -------- |
| 1   | Setup      | ✓      | -        | $0   | Completed on time    | No       |
| 2   | Data Gen 1 | ✓      | -        | $0   | 50 scenarios created | No       |
| ... | ...        | ...    | ...      | ...  | ...                  | ...      |

**Status codes**: ✓ Done, ⏳ In Progress, ⚠️ Delayed, ❌ Blocked

---

## Key Milestones & Gates

**Week 1 Gate**: Baseline accuracy 70-75% → Proceed to AI  
**Week 2 Gate**: AI accuracy 78-82% → Proceed to hybrid  
**Week 3 Gate**: Hybrid accuracy 85%+ → Proceed to validation  
**Week 4 Gate**: Real-world validation success → Ready for pitch

---

## Budget Tracking

| Week      | Planned Spend | Actual Spend | Remaining Budget |
| --------- | ------------- | ------------ | ---------------- |
| 1         | $10           | $            | $                |
| 2         | $25           | $            | $                |
| 3         | $30           | $            | $                |
| 4         | $20           | $            | $                |
| **Total** | **$85**       | **$**        | **$**            |
