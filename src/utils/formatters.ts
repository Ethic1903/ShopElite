/**
 * Форматировать число как валюту в рублях
 * @param amount - Сумма для форматирования
 * @param currency - Код валюты (по умолчанию: RUB)
 * @returns Строка с форматированной валютой
 */
export const formatCurrency = (amount: number, currency: string = 'RUB'): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Форматировать строку даты в более читаемый вид (русский)
 * @param dateString - ISO строка даты
 * @returns Строка с форматированной датой (например, "21 окт. 2023")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Truncate a long text and add ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if necessary
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Generate a rating display (e.g., "4.5 ★★★★☆ (123 reviews)")
 * @param rating - Rating value (0-5)
 * @param reviewCount - Number of reviews
 * @returns Formatted rating string
 */
export const formatRating = (rating: number, reviewCount: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  const stars = '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars);
  
  return `${rating.toFixed(1)} ${stars} (${reviewCount} отзывов)`;
};