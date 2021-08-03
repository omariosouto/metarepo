import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

String capitalize(String s) => s[0].toUpperCase() + s.substring(1);

class Pokemon {
  final String id;
  final String name;
  final String image;

  Pokemon({
    required this.id,
    required this.name,
    required this.image,
  });

  factory Pokemon.fromJson(Map<String, dynamic> json) {
    return Pokemon(
      id: json['id'],
      name: json['name'],
      image: json['image'],
    );
  }
}

Future<List<Pokemon>> fetchPokemon() async {
  final response = await http
      .get(Uri.parse('https://jsonplaceholder.typicode.com/albums/1'));

  final apiResponse = await http.post(
    Uri.parse('https://metarepo.vercel.app/api/graphql'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({
      'query': '''
        query {
          pokemons {
            id
            name
            image
          }
        }
      ''',
    }),
  );

  if (response.statusCode == 200) {
    final pokemonsFromServer =
        jsonDecode(apiResponse.body)['data']['pokemons'] as List<dynamic>;
    return pokemonsFromServer
        .map((pokemon) => Pokemon.fromJson(pokemon))
        .toList();
  } else {
    throw Exception('Failed to load album');
  }
}

// ===========================================

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pokedex App',
      theme: ThemeData(
        primarySwatch: Colors.red,
      ),
      home: MyHomePage(title: 'Pokedex By: DevSoutinho'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  late Future<List<Pokemon>> futureAlbum;

  @override
  void initState() {
    super.initState();
    futureAlbum = fetchPokemon();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: <Widget>[
            FutureBuilder<List<Pokemon>>(
              future: futureAlbum,
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  return Column(
                    children: snapshot.data!
                        .map((pokemon) => Row(
                              children: <Widget>[
                                Text(pokemon.id),
                                Image.network(
                                  pokemon.image,
                                  width: 200,
                                  height: 200,
                                  fit: BoxFit.contain,
                                ),
                                Text(capitalize(pokemon.name)),
                              ],
                            ))
                        .toList(),
                  );
                }

                if (snapshot.hasError) {
                  return Text('${snapshot.error}');
                }

                return const CircularProgressIndicator();
              },
            ),
          ],
        ),
      ),
    );
  }
}
