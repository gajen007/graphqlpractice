const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLList, GraphQLSchema } = graphql;
const mongoose = require('mongoose');
const Book = require("./modals/mdl_book");
const Author = require("./modals/mdl_author");

const sampleAuthor = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },
        writtenBooks: {
            type: new GraphQLList(sampleBook),
            resolve(parent, args) { 
                //return books.filter(item => item.authorID == parent.id);
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
                //return authors.find((item) => { return item.id == parent.authorID});
            }
        }
    })
});

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({// to retrieve the data
        name: 'RootQueryType',
        fields: {
            getThisBookByID: {
                type: sampleBook,
                args: {  bookID: { type: GraphQLID } },
                resolve(parent, args) { 
                    //return books.find((item) => { return item.id == args.bookID});
                }
            },
            getAllBooks:{//see no args here
                type: new GraphQLList(sampleBook),
                resolve(parent, args) { 
                    //return books;
                }
            },
            getAllAuthors:{//see no args here
                type: new GraphQLList(sampleAuthor),
                resolve(parent, args) { 
                    //return authors;
                }
            }
        }
    })
    ,
    mutation: new GraphQLObjectType({// to modify the data
        name: 'RootMutationType',
        fields:{
            addNewAuthor:{
                type: sampleAuthor,
                args: {
                    newAuthorName: { type: GraphQLString },
                },
                resolve(parent,args){
                    let newAuthor = new Author({
                        name: args.newAuthorName
                        //See "ID" isn't mentioned bcoz of Mongo!
                    });
                    newAuthor.save();
                }
            },
            addNewBook:{
                type: sampleBook,
                args: {
                    newName: { type: GraphQLString },
                    authorIDofNewBook: { type: GraphQLID }
                },
                resolve(parent,args){}
            },
            editBookNameByID:{
                type:sampleBook,
                args:{
                    targetBookId: { type: GraphQLID },
                    updatedName: { type: GraphQLString }
                },
                resolve(parent,args){}
            },
            deleteBookByID:{
                type:sampleBook,
                args:{
                    targetBookId: { type: GraphQLID },
                },
                resolve(parent,args){}
            }
        }
    })
});

const app = express();
app.use('/graphql', graphqlHTTP({schema,graphiql:true}));
mongoose.connect('mongodb://127.0.0.1:27017/forGraphQL',{useNewUrlParser:true});
mongoose.connection.once('open',()=>{
    console.log("MongoDB is connected now");
})
app.listen(3000, () => { console.log('Listening on port 3000');});