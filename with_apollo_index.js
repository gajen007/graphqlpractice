const { ApolloServer, gql } = require('apollo-server');
//Schema is simply the "type definitions"
const typeDefs = gql`
  type Version {
    press: String
    number: Int
  }
  type Book {
    title: String
    author: String
    versions: [Version!]
  }
  type Query {
    getbooks: [Book]
  }
`;

//ends with exclamation mark if non-nullable

const books = [
    {
      title: 'The Awakening',
      author: 'Kate Chopin',
      versions:[{'press':'Manimegalai','number':1},{'press':'Vaanathi','number':2}]
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
      versions:[{'press':'Allianze','number':2},{'press':'ValarTholil','number':3}]
    },
  ];

//Resolver: fetching the types defined in the schema.
const resolvers = {
    Query: {
      getbooks: () => books
    },
  };

//Instance
const {ApolloServerPluginLandingPageLocalDefault} = require('apollo-server-core');
  // The ApolloServer constructor requires two args: schema-definition & set of resolvers.
  const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });