/**
 * Social Media Sharing Utilities
 * Helper functions for sharing content on social media platforms
 */

/**
 * Share on Facebook
 * @param {string} url - URL to share
 * @param {string} quote - Optional quote/text
 */
export const shareOnFacebook = (url, quote = '') => {
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}${quote ? `&quote=${encodeURIComponent(quote)}` : ''}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

/**
 * Share on Twitter/X
 * @param {string} text - Tweet text
 * @param {string} url - Optional URL to share
 * @param {Array<string>} hashtags - Optional hashtags
 */
export const shareOnTwitter = (text, url = '', hashtags = []) => {
  let shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

  if (url) {
    shareUrl += `&url=${encodeURIComponent(url)}`;
  }

  if (hashtags.length > 0) {
    shareUrl += `&hashtags=${hashtags.join(',')}`;
  }

  window.open(shareUrl, '_blank', 'width=600,height=400');
};

/**
 * Share on WhatsApp
 * @param {string} text - Message text
 * @param {string} url - Optional URL to share
 */
export const shareOnWhatsApp = (text, url = '') => {
  const message = url ? `${text} ${url}` : text;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const shareUrl = isMobile
    ? `whatsapp://send?text=${encodeURIComponent(message)}`
    : `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;

  window.open(shareUrl, '_blank');
};

/**
 * Share on Telegram
 * @param {string} text - Message text
 * @param {string} url - Optional URL to share
 */
export const shareOnTelegram = (text, url = '') => {
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

/**
 * Share via Email
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 */
export const shareViaEmail = (subject, body) => {
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
};

/**
 * Copy link to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Use Web Share API if available
 * @param {Object} data - Share data {title, text, url}
 * @returns {Promise<boolean>} Success status
 */
export const useNativeShare = async (data) => {
  if (!navigator.share) {
    return false;
  }

  try {
    await navigator.share(data);
    return true;
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error sharing:', error);
    }
    return false;
  }
};

/**
 * Share content with automatic platform detection
 * @param {Object} options - Share options
 * @returns {Promise<boolean>} Success status
 */
export const smartShare = async (options) => {
  const { title, text, url } = options;

  // Try native share first (mobile)
  const nativeShareSuccess = await useNativeShare({ title, text, url });

  if (nativeShareSuccess) {
    return true;
  }

  // Fallback: copy to clipboard
  const fullText = `${title}\n${text}\n${url}`;
  return await copyToClipboard(fullText);
};

/**
 * Generate share content for scenarios
 * @param {Object} scenario - Scenario object
 * @returns {Object} Share content
 */
export const generateScenarioShareContent = (scenario) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://defiendete-mx.pages.dev';

  return {
    title: `${scenario.title} - Defiéndete MX`,
    text: `Conoce tus derechos: ${scenario.title}. Información legal verificada para protegerte.`,
    url: `${baseUrl}/escenarios#${scenario.id}`,
    hashtags: ['DerechosHumanos', 'DefiendeteMX', 'ConocetusDere chos']
  };
};

/**
 * Generate share content for resources
 * @param {Object} resource - Resource object
 * @returns {Object} Share content
 */
export const generateResourceShareContent = (resource) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://defiendete-mx.pages.dev';

  return {
    title: `${resource.title} - Defiéndete MX`,
    text: `Descarga gratis: ${resource.title}. ${resource.description}`,
    url: `${baseUrl}/recursos`,
    hashtags: ['RecursosLegales', 'DefiendeteMX', 'EducaciónLegal']
  };
};

export default {
  shareOnFacebook,
  shareOnTwitter,
  shareOnWhatsApp,
  shareOnTelegram,
  shareViaEmail,
  copyToClipboard,
  useNativeShare,
  smartShare,
  generateScenarioShareContent,
  generateResourceShareContent
};
