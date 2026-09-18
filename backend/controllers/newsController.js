const newsService = require('../services/newsService');

class NewsController {
  async getPersonalizedNews(req, res) {
    try {
      const userId = req.user.id;
      const data = await newsService.getPersonalizedNews(userId);
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to fetch personalized news',
      });
    }
  }

  async getNewsById(req, res) {
    try {
      const { id } = req.params;
      const newsId = parseInt(id, 10);
      if (isNaN(newsId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid news ID',
        });
      }

      const story = await newsService.getNewsById(newsId);
      return res.status(200).json({
        success: true,
        data: story,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to fetch news article',
      });
    }
  }
}

module.exports = new NewsController();
