const { UserInterest } = require('../models');

class InterestRepo {
  async getInterestsByUserId(userId) {
    const interests = await UserInterest.findAll({
      where: { userId },
      attributes: ['interest'],
    });
    return interests.map((i) => i.interest);
  }

  async setInterests(userId, interestsArray) {
    // Delete existing interests for user
    await UserInterest.destroy({ where: { userId } });

    if (interestsArray && interestsArray.length > 0) {
      const records = interestsArray.map((interest) => ({
        userId,
        interest,
      }));
      return await UserInterest.bulkCreate(records);
    }
    return [];
  }
}

module.exports = new InterestRepo();
