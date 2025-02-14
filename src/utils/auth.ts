/**
 * Génère un mot de passe aléatoire sécurisé
 * @returns {string} Mot de passe généré
 */
export function generatePassword(): string {
  const length = 12;
  const charset = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  // S'assurer qu'au moins un caractère de chaque type est inclus
  let password = '';
  password += charset.uppercase.charAt(Math.floor(Math.random() * charset.uppercase.length));
  password += charset.lowercase.charAt(Math.floor(Math.random() * charset.lowercase.length));
  password += charset.numbers.charAt(Math.floor(Math.random() * charset.numbers.length));
  password += charset.symbols.charAt(Math.floor(Math.random() * charset.symbols.length));

  // Remplir le reste du mot de passe avec des caractères aléatoires
  const allChars = Object.values(charset).join('');
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Mélanger le mot de passe
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
