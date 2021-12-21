const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
} = require("graphql");

const RocketType = new GraphQLObjectType({
  name: "Rocket",
  fields: () => ({
    rocket_id: { type: GraphQLString },
    rocket_name: { type: GraphQLString },
    rocket_type: { type: GraphQLString },
  }),
});

const LaunchType = new GraphQLObjectType({
  name: "Launch",
  fields: () => ({
    flight_number: { type: GraphQLInt },
    name: { type: GraphQLString },
    date_local: { type: GraphQLString },
    success: { type: GraphQLBoolean },
    rocket: { type: RocketType },
    details: { type: GraphQLString },
  }),
});

const HistoryArticleType = new GraphQLObjectType({
  name: "HistoryArticle",
  fields: () => ({
    article: { type: GraphQLString },
  }),
});

const HistoryType = new GraphQLObjectType({
  name: "History",
  fields: () => ({
    title: { type: GraphQLString },
    event_date_utc: { type: GraphQLString },
    details: { type: GraphQLString },
    links: { type: HistoryArticleType },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    launches: {
      type: new GraphQLList(LaunchType),
      resolve(parent, args) {
        console.log("@@@ launches", parent, args);
        return axios
          .get("https://api.spacexdata.com/v4/launches")
          .then((response) => response.data);
      },
    },
    launch: {
      type: LaunchType,
      args: { id: { type: GraphQLString } },
      resolve(_, args) {
        return axios
          .get(`https://api.spacexdata.com/v4/launches/${args.id}`)
          .then((res) => res.data);
      },
    },
    history: {
      type: new GraphQLList(HistoryType),
      resolve(source, args, context, info) {
        console.log("@@@ history response", source, args, context, info);
        return axios
          .get("https://api.spacexdata.com/v4/history")
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
