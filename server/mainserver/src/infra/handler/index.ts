import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-micro'
import { PokemonsRepository } from '../../modules/pokemons/repository'

const typeDefs = gql`
  type Query {
    pokemons: [Pokemon!]!
    pokemon(id: String): Pokemon
  }
  type Pokemon {
    id: String
    name: String
  }
`

const resolvers = {
  Query: {
    pokemons() {
      return PokemonsRepository().getAll();
    },
    pokemon(_, { id }) {
      return PokemonsRepository().getById(id);
    },
  },
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })

export const handler = new ApolloServer({ schema }).createHandler({
  path: '/api/graphql',
})
