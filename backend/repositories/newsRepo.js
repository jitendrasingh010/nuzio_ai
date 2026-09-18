const { Op } = require('sequelize');
const { News } = require('../models');

class NewsRepo {
  async findById(id) {
    return await News.findByPk(id);
  }

  async findPersonalized({ language, categories = [] }) {
    const whereClause = {};

    if (language) {
      whereClause.language = language;
    }

    if (categories && categories.length > 0) {
      whereClause.category = {
        [Op.in]: categories,
      };
    }

    let news = await News.findAll({
      where: whereClause,
      order: [['publishedAt', 'DESC']],
    });

    // If no news matches specific category filter, fall back to matching language
    if ((!news || news.length === 0) && language) {
      news = await News.findAll({
        where: { language },
        order: [['publishedAt', 'DESC']],
      });
    }

    // If still empty (e.g. initial setup), return all news
    if (!news || news.length === 0) {
      news = await News.findAll({
        order: [['publishedAt', 'DESC']],
      });
    }

    return news;
  }

  async findAll(where = {}) {
    return await News.findAll({
      where,
      order: [['publishedAt', 'DESC']],
    });
  }
}

module.exports = new NewsRepo();
