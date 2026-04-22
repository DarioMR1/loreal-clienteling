export const AuditAction = {
  CUSTOMER_VIEWED: "customer_viewed",
  CUSTOMER_EXPORTED: "customer_exported",
  CUSTOMER_DELETED_ARCO_REQUEST: "customer_deleted_arco_request",
  CONSENT_GRANTED: "consent_granted",
  CONSENT_REVOKED: "consent_revoked",
  USER_LOGIN: "user_login",
  USER_LOGOUT: "user_logout",
  USER_LOGIN_FAILED: "user_login_failed",
  USER_ACTIVATED: "user_activated",
  ROLE_CHANGED: "role_changed",
  USER_CREATED: "user_created",
  USER_UPDATED: "user_updated",
  USER_DEACTIVATED: "user_deactivated",
  AI_RECOMMENDATION_REQUESTED: "ai_recommendation_requested",
  SYNC_CONFLICT_RESOLVED: "sync_conflict_resolved",
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

export const AUDIT_ACTIONS = Object.values(AuditAction);
