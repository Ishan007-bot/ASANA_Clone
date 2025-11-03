/**
 * Extract @mentions from text content
 * @param {string} content - Text content to parse
 * @returns {string[]} - Array of mentioned usernames (without @)
 */
export const extractMentions = (content) => {
  if (!content) return [];
  
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1]);
  }

  // Remove duplicates
  return [...new Set(mentions)];
};


