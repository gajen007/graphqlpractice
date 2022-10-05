const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLList, GraphQLSchema } = graphql;

const books = [{ id:1, name:"Poniyin Selvan", authorID:1},{ id:2, name: "Sivagamiyin Sabatham", authorID:1},{ id:3, name: "Paarthipan Kanavu", authorID:1},{ id:4, name: "Udaiyaar", authorID:2},{ id:5, name: "Vengaiyin Mainthan", authorID:3},{ id:6, name: "Kadal Pura", authorID:4},{ id:7, name: "Jala Theepam", authorID:4},{ id:8, name: "Yavana Rani", authorID:4}];
const authors = [{id:1,name:"Kalki"},{id:2,name:"Balakumaran"},{id:3,name:"Akilan"},{id:4,name:"Saandilyan"}]

const sampleAuthor = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },
        writtenBooks: {
            type: new GraphQLList(sampleBook),
            resolve(parent, args) {
                return books.filter(item => item.authorID == parent.id);
            }
        }
    })
});

const sampleBook = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },
        author: { 
            type: sampleAuthor,
            resolve(parent, args) {
                return authors.find((item) => { return item.id == parent.authorID});
            }
        }
    })
});

const schema = new GraphQLSchema({query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        getThisBook: {
            type: sampleBook,
            args: { 
                bookID: { type: GraphQLID }
            },
            resolve(parent, args) {
                return books.find((item) => { return item.id == args.bookID});
            }
        },
        getAllBooks:{
            type: new GraphQLList(sampleBook),
            resolve(parent, args) {
                return books;
            }
        },
        getAllAuthors:{
            type: new GraphQLList(sampleAuthor),
            resolve(parent, args) {
                return authors;
            }
        }
    }
})});

const app = express();
app.use('/graphql', graphqlHTTP({schema,graphiql:true}));
// .use('something') is a MIDDLEWARE
//graphiql is the GUI facility
app.listen(3000, () => { console.log('Listening on port 3000');});