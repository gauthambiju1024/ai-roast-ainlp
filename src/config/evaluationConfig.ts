// Evaluation API Configuration
// All evaluation settings in one place for easy modification

export const EVALUATION_CONFIG = {
  API_BASE_URL: "https://roastjudge-api-342803715506.asia-south1.run.app",
  EVAL_ENDPOINT_PATH: "/judge_battle",
  HEALTH_ENDPOINT_PATH: "/health",
  EVAL_TIMEOUT_MS: 30000,
  EVAL_TABLE: "battle_evals",
} as const;

export const getEvaluationUrl = () => 
  `${EVALUATION_CONFIG.API_BASE_URL}${EVALUATION_CONFIG.EVAL_ENDPOINT_PATH}`;

export const getHealthUrl = () => 
  `${EVALUATION_CONFIG.API_BASE_URL}${EVALUATION_CONFIG.HEALTH_ENDPOINT_PATH}`;
