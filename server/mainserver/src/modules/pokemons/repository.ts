import { httpClient } from '../../infra/http/httpClient'

export function PokemonsRepository() {
  return {
    async getAll() {
      return httpClient('https://pokeapi.co/api/v2/pokemon')
        .then((response) => {
          return response.results.map((pokemon, index) => {
            return {
              ...pokemon,
              id: index + 1,
            }
          })
        })
    },
    async getById(id) {
      return httpClient(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((pokemon) => {
          return pokemon;
        });
    }
  }
}
