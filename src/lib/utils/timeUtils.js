import moment from 'moment';

class TimeUtils {
  static MINUTES_PER_TOPIC = 10;
  static MINUTES_IN_HOUR = 60;

  /**
   * Calculates the total estimated duration of a course
   * @param {Object} course - Course object containing classes and topics
   * @returns {moment.Duration} Duration object
   */
  static calculateCourseDuration = (courseId, progress) => {
    if (!progress || !progress[courseId] || !progress[courseId].completedContent) {
      return moment.duration(0, 'minutes');
    }

    const totalTopics = Object.values(progress[courseId].completedContent)
      .reduce((total, cls) => total + cls.length, 0);
    const totalMinutes = totalTopics * TimeUtils.MINUTES_PER_TOPIC;
    
    return moment.duration(totalMinutes, 'minutes');
  };

  /**
   * Calculates the time already studied in a specific course based on its ID
   * @param {string} courseId - ID of the course
   * @param {Object} progress - Progress object containing completed topics
   * @returns {moment.Duration}
   */
  static calculateTimeStudied = (courseId, progress) => {
    if (!progress || !progress[courseId] || !progress[courseId].completedContent) {
      return moment.duration(0, 'minutes');
    }

    let completedTopics = 0;
    const courseProgress = progress[courseId].completedContent;

    Object.values(courseProgress).forEach(classContent => {
      completedTopics += classContent.filter(topic => topic.completed).length;
    });

    const totalMinutes = completedTopics * TimeUtils.MINUTES_PER_TOPIC;
    return moment.duration(totalMinutes, 'minutes');
  };

  /**
   * Calculates the remaining time to complete a course
   * @param {string} courseId - ID of the course
   * @param {Object} progress - Progress object containing completed topics
   * @returns {moment.Duration}
   */
  static calculateRemainingTime = (courseId, progress) => {
    if (!progress || !progress[courseId] || !progress[courseId].completedContent) {
      return moment.duration(0, 'minutes');
    }

    const totalDuration = TimeUtils.calculateCourseDuration(courseId, progress);
    const studiedDuration = TimeUtils.calculateTimeStudied(courseId, progress);
    
    return moment.duration(totalDuration.asMilliseconds() - studiedDuration.asMilliseconds());
  };

  static formatDuration = (duration) => {
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    if (!hours) return `${minutes.toString()}m`;
    if (!minutes) return `${hours.toString()}h`;
    return `${hours.toString()}h ${minutes.toString()}m`;
  };

  /**
   * Calculates the total time studied across all courses
   * @param {Object} progress - Progress object containing completed topics for all courses
   * @returns {moment.Duration} Total duration object
   */
  static calculateTotalTimeStudied = (progress) => {
    if (!progress) {
      return moment.duration(0, 'minutes');
    }

    let totalMinutes = 0;
    Object.keys(progress).forEach(courseId => {
      const courseTime = TimeUtils.calculateTimeStudied(courseId, progress);
      totalMinutes += courseTime.asMinutes();
    });

    return moment.duration(totalMinutes, 'minutes');
  };
}

export { TimeUtils };