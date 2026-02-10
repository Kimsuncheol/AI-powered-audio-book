export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  requirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

export function validatePassword(password: string): PasswordValidation {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const errors: string[] = [];

  if (!requirements.minLength) {
    errors.push('At least 8 characters');
  }
  if (!requirements.hasUpperCase) {
    errors.push('One uppercase letter');
  }
  if (!requirements.hasLowerCase) {
    errors.push('One lowercase letter');
  }
  if (!requirements.hasNumber) {
    errors.push('One number');
  }
  if (!requirements.hasSpecialChar) {
    errors.push('One special character');
  }

  return {
    isValid: Object.values(requirements).every((req) => req),
    errors,
    requirements,
  };
}

export function getPasswordStrength(password: string): {
  strength: 'weak' | 'medium' | 'strong';
  color: string;
} {
  const validation = validatePassword(password);
  const metRequirements = Object.values(validation.requirements).filter(Boolean).length;

  if (metRequirements <= 2) {
    return { strength: 'weak', color: '#FF3B30' };
  } else if (metRequirements <= 4) {
    return { strength: 'medium', color: '#FF9500' };
  } else {
    return { strength: 'strong', color: '#34C759' };
  }
}
