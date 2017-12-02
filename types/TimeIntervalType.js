const { GraphQLEnumType } = require('graphql');

const timeIntervalType = new GraphQLEnumType({
  name: 'TimeInterval',
  description: 'The time interval for which the listings are queried',
  values: {
    hour: {
      value: 'hour'
    },
    day: {
      value: 'day'
    },
    week: {
      value: 'week'
    },
    month: {
      value: 'month'
    },
    year: {
      value: 'year'
    },
    all: {
      value: 'All'
    }
  }
});

module.exports = { timeIntervalType };
