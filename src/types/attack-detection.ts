/**
 * Type definitions for Attack Detection API
 */

/**
 * Represents the status of a user in brute force detection
 */
export interface BruteForceStatus {
  /**
   * Number of failed login attempts
   */
  numFailures: number;

  /**
   * Last failed login time in milliseconds since epoch
   */
  lastFailure: number;

  /**
   * Last IP address that failed login
   */
  lastIPFailure: string;

  /**
   * Whether the user is currently disabled due to brute force protection
   */
  disabled: boolean;
}
