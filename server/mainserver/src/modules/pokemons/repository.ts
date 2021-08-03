import { httpClient } from '../../infra/http/httpClient'


interface IPokemon {
  id: number
  name: string
  image: string
}

function outputPokemon({ pokemon, id }): IPokemon {
  return {
    id,
    name: pokemon.name,
    image: pokemon.image || pokemon.sprites.other['official-artwork'].front_default,
  }
}

export function PokemonsRepository() {
  const result = {
    async getAll(): Promise<IPokemon[]> {
      const total = 151;
      return httpClient(`https://pokeapi.co/api/v2/pokemon?limit=${total}&offset=0`)
        .then((response) => {
          const res = response.results.map(async (_, index) => {
            const id = index + 1;
            const pokemon = await result.getById(id);
            return outputPokemon({ pokemon, id });
          })

          return Promise.all(res);
        });
    },
    async getById(id): Promise<IPokemon> {
      return httpClient(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((pokemon) => {
          return outputPokemon({ pokemon, id });
        });
    }
  }
  return result;
}
