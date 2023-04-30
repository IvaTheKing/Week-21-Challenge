const jwt = require('jsonwebtoken');
const { buildSchema } = require("graphql");
const { secret, expiration } = require("../config/authConfig");
const User = require("../models/User");

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

const schema = buildSchema(`
  type Query {
    currentUser: User!
  }
  
  type User {
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
    bookCount: Int!
  }
  
  type Book {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }
`);

const root = {
  currentUser: async (args, context) => {
    // Check if user is authenticated
    if (!context.user) {
      throw new Error('You are not authenticated');
    }

    try {
      // Find user in database
      const user = await User.findById(context.user._id).populate('savedBooks');

      return user;
    } catch (err) {
      console.error(err);
      throw new Error('Something went wrong');
    }
  },
};


const graphqlMiddleware = graphqlHTTP(async (req, res) => {
  // Get token from authorization header
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    throw new Error('You have no token!');
  }

  try {
    // Verify token and get user data
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    const user = await User.findById(data._id);

    // Add user to context
    return {
      schema: schema,
      rootValue: root,
      context: {
        user: user,
      },
    };
  } catch {
    console.error('Invalid token');
    throw new Error('Invalid token');
  }
});

module.exports = graphqlMiddleware;

// my personal tutor saved my ass with this most of this assignment but I couldn't complete it before he lost his patience, I was so lost but he walked me through it and let me screw up, helped me fix it, let me screw up, helped me fix it again. Super patient man.