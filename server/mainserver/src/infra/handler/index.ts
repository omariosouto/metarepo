import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-micro'
import { PokemonsRepository } from '../../modules/pokemons/repository'


const pokemonsRepository = PokemonsRepository();

const typeDefs = gql`
  type Query {
    pokemons: [Pokemon!]!
    pokemon(id: String): Pokemon
  }
  type Pokemon {
    id: String
    name: String
    image: String
  }
`

const resolvers = {
  Query: {
    async pokemons() {
      return pokemonsRepository.getAll();
    },
    async pokemon(_, { id }) {
      return pokemonsRepository.getById(id);
    },
  },
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })

export const handler = new ApolloServer({
  schema,
  introspection: true,
  playground: true,
}).createHandler({
  path: '/api/graphql',
})
