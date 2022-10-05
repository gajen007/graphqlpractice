const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLSchema } = graphql;

var fakeDB = [{ name:"Book 1", pages:432 , id:1},{ name: "Book 2", pages: 32, id: 2},{ name: "Book 3", pages: 532, id: 3 }]; 

 const sampleBook = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },
        pages: { type: GraphQLInt }
    })
 });

const schema = new GraphQLSchema({query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        getThisBook: {
            type: sampleBook,
            args: { 
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return fakeDB.find((item) => { return item.id == args.id});
            }
        }
    }
 })});

const app = express();
app.use('/graphql', graphqlHTTP({schema,graphiql:true}));
// .use('something') is a MIDDLEWARE
//graphiql is the GUI facility
app.listen(3000, () => { console.log('Listening on port 3000');});