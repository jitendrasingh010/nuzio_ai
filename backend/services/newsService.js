const newsRepo = require('../repositories/newsRepo');
const userService = require('./userService');

class NewsService {
  async getPersonalizedNews(userId) {
    const preferences = await userService.getPreferences(userId);
    const { language = 'English', profession = 'Technology', interests = [] } = preferences;

    // Map profession to relevant categories
    const professionCategoryMap = {
      Technology: ['AI & Technology', 'Technology', 'Startups'],
      Finance: ['Financial Markets', 'Finance', 'Business'],
      Healthcare: ['Healthcare', 'Science'],
      Business: ['Business', 'Startups', 'Financial Markets'],
      Education: ['Science', 'Technology', 'Global News'],
      Marketing: ['Startups', 'Business', 'Technology'],
    };

    const professionCategories = professionCategoryMap[profession] || [profession];

    // Combine distinct categories from user interests and profession mapping
    const combinedCategories = Array.from(new Set([...interests, ...professionCategories]));

    let news = await newsRepo.findPersonalized({
      language,
      categories: combinedCategories,
    });

    // Generate personalized brief greeting
    const brief = this.generateBriefing({
      language,
      profession,
      count: news.length,
      topCategory: combinedCategories[0] || 'Top Stories',
    });

    return {
      preferences,
      briefing: brief,
      news,
    };
  }

  async getNewsById(id) {
    const story = await newsRepo.findById(id);
    if (!story) {
      const error = new Error('News article not found');
      error.statusCode = 404;
      throw error;
    }
    return story;
  }

  generateBriefing({ language, profession, count, topCategory }) {
    if (language === 'Hindi') {
      return {
        greeting: 'नमस्ते! आपका दैनिक समाचार बुलेटिन तैयार है',
        summary: `आज आपके ${profession} और रुचियों के आधार पर ${count} महत्वपूर्ण समाचार चुने गए हैं। सुनने के लिए प्ले बटन दबाएं।`,
        headline: `आज का मुख्य आकर्षण: ${topCategory}`,
      };
    }

    return {
      greeting: 'Good morning. Here is your personalized news brief.',
      summary: `We have curated ${count} top stories tailored for your focus in ${profession} and your selected interests.`,
      headline: `Leading in ${topCategory}`,
    };
  }
}

module.exports = new NewsService();
