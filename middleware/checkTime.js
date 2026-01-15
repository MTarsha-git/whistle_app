const { Op } = require('sequelize');
const { YourModel } = require('./models'); // Replace with your model path

async function findRecordsAbout2HoursBefore(targetDateTime) {
  try {
    // Calculate the datetime 2 hours before the target
    const twoHoursBefore = new Date(targetDateTime);
    twoHoursBefore.setHours(targetDateTime.getHours() - 2);

    const records = await YourModel.findAll({
      where: {
        your_datetime_column: {
          [Op.lt]: twoHoursBefore // Less than (before) the calculated time
        }
      }
    });
    console.log(Records approximately 2 hours before ${targetDateTime.toISOString()}:, records);
    return records;
  } catch (error) {
    console.error('Error finding records:', error);
    throw error;
  }
}

// Example usage:
const targetDateTime = new Date('2023-10-27T10:00:00Z'); // Replace with your specific datetime value
findRecordsAbout2HoursBefore(targetDateTime);
 