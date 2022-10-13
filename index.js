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
                return Book.find({"authorID":parent.id});
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
                return Author.findById(parent.authorID);
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
                    return Book.findById(args.bookID);
                }
            },
            getThisAuthorByID: {
                type: sampleAuthor,
                args: {  authorID: { type: GraphQLID } },
                resolve(parent, args) {
                    return Author.findById(args.authorID);
                }
            },
            getAllBooks:{
                type: new GraphQLList(sampleBook),
                resolve(parent, args) { 
                    return Book.find();
                }
            },
            getAllAuthors:{
                type: new GraphQLList(sampleAuthor),
                resolve(parent, args) { 
                    return Author.find();
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
                    newAuthorId: { type: GraphQLID },
                    newAuthorName: { type: GraphQLString },
                },
                resolve(parent,args){
                    let newAuthor = new Author({
                        id: args.newAuthorId,
                        name: args.newAuthorName
                    });
                    newAuthor.save();
                    return newAuthor; //Not Necessary; But for confirm on Screen
                }
            },
            addNewBook:{
                type: sampleBook,
                args: {
                    newBookName: { type: GraphQLString },
                    authorIDofNewBook: { type: GraphQLID }
                },
                resolve(parent,args){
                    let newBook = new Book({
                        name: args.newBookName,
                        authorID: args.authorIDofNewBook
                    });
                    newBook.save();
                    return newBook; //Not Necessary; But for confirm on Screen
                }
            },
            editBookNameByID:{
                type:sampleBook,
                args:{
                    targetBookId: { type: GraphQLID },
                    updatedBookName: { type: GraphQLString }
                },
                resolve(parent,args){
                    return Book.findOneAndUpdate(
                        { id:args.targetBookId },
                        { $set:{name:args.updatedBookName}},
                        { returnOriginal: false },
                      );
                }
            },
            editAuthorNameByID:{
                type:sampleAuthor,
                args:{
                    targetAuthorId: { type: GraphQLID },
                    updatedAuthorName: { type: GraphQLString }
                },
                resolve(parent,args){
                    return Author.findOneAndUpdate(
                        { id:args.targetAuthorId },
                        { $set:{name:args.updatedAuthorName}},
                        { returnOriginal: false },
                      );
                }
            },
            deleteBookByID:{
                type:sampleBook,
                args:{ targetBookId: { type: GraphQLID }, },
                resolve(parent,args){
                    return Book.findOneAndDelete({ id:args.targetBookId });
                }
            },
            deleteAuthorByID:{
                type:sampleAuthor,
                args:{ targetAuthorId: { type: GraphQLID }, },
                resolve(parent,args){
                    return Author.findOneAndDelete({ id:args.targetAuthorId });
                }
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