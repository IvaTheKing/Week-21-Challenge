const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type User {
        _id: ID
        username: String!
        email: String!
        bookCount: Int!
        savedBooks: [Book]
    }
    type Book {
        _id: ID!
        authors: String!
        description: String!
        title: String!
        bookId: String!
        image: String!
        link: String!
        
    }
    type Query {
        me: [User]
    }
    type Auth {
        token: ID!
        user: [User]
    }`;