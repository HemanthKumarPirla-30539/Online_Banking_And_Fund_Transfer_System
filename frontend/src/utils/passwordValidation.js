const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const numberRegex = /\d/;
const specialRegex = /[!@#$%^&*()_+\-=[\]{}|;:'",.<>?/]/;

export function evaluatePasswordStrength(password) {
  const hasUppercase = uppercaseRegex.test(password);
  const hasLowercase = lowercaseRegex.test(password);
  const hasNumber = numberRegex.test(password);
  const hasSpecial = specialRegex.test(password);
  const hasMinimumLength = password.length >= 8;
  const hasMaximumLength = password.length <= 20;
  const characterTypeCount = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  let strength = 'weak';

  if (hasMinimumLength && hasMaximumLength && hasUppercase && hasLowercase && hasNumber && hasSpecial) {
    strength = 'strong';
  } else if (hasMinimumLength && characterTypeCount >= 3) {
    strength = 'medium';
  }

  return {
    strength,
    checks: {
      minimumLength: hasMinimumLength,
      uppercase: hasUppercase,
      lowercase: hasLowercase,
      number: hasNumber,
      special: hasSpecial,
      maximumLength: hasMaximumLength,
    },
  };
}
