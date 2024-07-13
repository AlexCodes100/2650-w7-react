import { gql } from 'apollo-server-express';
import { addNote, removeNote, updateNote, getNotes, getNote } from '../persistence.js';
import "dotenv/config.js";

const typeDefs = gql`
  type Note {
    id: String!
    text: String!
    imageUrl: String
    imageAuthor: String
    imageAuthorLink: String
  }

  type Image {
    urls: Urls
    user: User
  }

  type Urls {
    regular: String
  }

  type User {
    name: String
    links: Links
  }

  type Links {
    html: String
  }   

  type Query {
    notes: [Note]
    note(id: String!): Note
    fetchImage(query: String!): Image
  }

  type Mutation {
    addNote(text: String!): Note
    removeNote(id: String!): String
    updateNote(id: String!, text: String!, imageUrl: String, imageAuthor: String, imageAuthorLink: String): Note
  }
`;

const resolvers = {
  Query: {
    notes: () => getNotes(),
    note: (_, { id }) => getNote(id),
    fetchImage: async (_, { query }) => {
        const accessKey = process.env.UNSPLASH_ACCESS_KEY;
        const response = await fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${accessKey}`);
        const data = await response.json();
        return data;
      }
  },
  Mutation: {
    addNote: (_, { text }) => addNote({ text }),
    removeNote: (_, { id }) => {
      removeNote(id);
      return id;
    },
    updateNote: (_, { id, text, imageUrl, imageAuthor, imageAuthorLink }) => 
      updateNote(id, text, imageUrl, imageAuthor, imageAuthorLink),
  },
};

export { typeDefs, resolvers };
