const { GraphQLEnumType } = require('graphql');

const timeIntervalType = new GraphQLEnumType({
  name: 'TimeInterval',
  description: 'The time interval for which the listings are queried',
  values: {
    hour: {
      value: 'hour',
      description: 'All posts in the last hour'
    },
    day: {
      value: 'day',
      description: 'All posts made durin the last day'
    },
    week: {
      value: 'week',
      description: 'All posts during the last week'
    },
    month: {
      value: 'month',
      description: 'All posts during the last month'
    },
    year: {
      value: 'year',
      description: 'All posts from the last year'
    },
    all: {
      value: 'All',
      description: 'All posts'
    }
  }
});

module.exports = { timeIntervalType };
