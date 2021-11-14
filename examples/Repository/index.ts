//https://www.npmjs.com/package/ts-node
/*
npm install -D typescript
npm install -D ts-node
*/
//https://medium.com/@erickwendel/generic-repository-with-typescript-and-node-js-731c10a1b98e

// importing mongoClient to connect at mongodb
import { MongoClient } from 'mongodb';

import { SpartanRepository } from './repositories/SpartanRepository'
import { Spartan } from './entities/Spartan';

//importing Hero classes
import { HeroRepository } from './repositories/HeroRepository'
import { Hero } from './entities/Hero';

import minimist from 'minimist'

async function ejecutarCmds() {
    try {
        console.log('Contectando a la Base de datos...')
        /* ---------------------------------------------------------------- */
        /*              Conexión a la base de datos warriors                */
        /* ---------------------------------------------------------------- */
        // connecting at mongoClient
        const connection = await MongoClient.connect('mongodb://localhost',{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const db = connection.db('warriors');
        /* ---------------------------------------------------------------- */
        console.log('Base de datos conectada')

        const argv = minimist(process.argv.slice(2))
        let {tipo,cmd,id,nombre,valor} = argv
        //console.log(tipo,cmd,id,nombre,valor)

        tipo = tipo? tipo.toLowerCase() : ''
        cmd = cmd? cmd.toLowerCase() : ''
        /* ------------------------------------- */
        /*            ENTIDAD SPARTAN            */
        /* ------------------------------------- */
        if(tipo == 'spartan') {
            /* -------------------------------------------------------- */
            /*          Creación de un repositorio spartan              */
            /* -------------------------------------------------------- */
            console.log('Instanciando el Repository spartans')
            const repositorySpartan = new SpartanRepository(db, 'spartans');
            let resultSpartan

            switch(cmd) {
                case 'buscar':
                    if(id) console.log(await repositorySpartan.findOne(id))
                    else console.log(await repositorySpartan.find())
                    break

                case 'agregar':
                    const spartan = new Spartan(nombre, valor);
                    resultSpartan = await repositorySpartan.create(spartan);
                    console.log(`spartan inserted with ${resultSpartan ? 'success' : 'fail'}`)
                    break
                        
                case 'reemplazar':
                    resultSpartan = await repositorySpartan.update(id,new Spartan(nombre, valor));
                    console.log(`spartan updated with ${resultSpartan ? 'success' : 'fail'}`)
                    break
                                
                case 'borrar':
                    resultSpartan = await repositorySpartan.delete(id);
                    console.log(`spartan deleted with ${resultSpartan ? 'success' : 'fail'}`)
                    break

                case 'count':
                    const count = await repositorySpartan.countOfSpartans();
                    console.log(`the count of spartans is ${count}`)
                    break                
        
                default:
                    console.log('comando no válido:',cmd)
            }
        }
        /* ------------------------------------- */
        /*              ENTIDAD HERO             */
        /* ------------------------------------- */
        else if(tipo == 'hero') {
            /* -------------------------------------------------------- */
            /*            Creación de un repositorio hero               */
            /* -------------------------------------------------------- */
            console.log('Instanciando el Repository heros')
            const repositoryHero = new HeroRepository(db, 'heroes');
            let resultHero

            switch(cmd) {
                case 'buscar':
                    console.log(`${cmd} no implementado para ${tipo}`)
                    break

                case 'agregar':
                    const hero = new Hero(nombre, valor);
                    resultHero = await repositoryHero.create(hero);
                    console.log(`hero inserted with ${resultHero ? 'success' : 'fail'}`)
                    break
                        
                case 'reemplazar':
                    console.log(`${cmd} no implementado para ${tipo}`)
                    break
                                
                case 'borrar':
                    console.log(`${cmd} no implementado para ${tipo}`)
                    break

                case 'count':
                    const count = await repositoryHero.countOfHeros();
                    console.log(`the count of heros is ${count}`)
                    break                
        
                default:
                    console.log('comando no válido:',cmd)
            }
        }
        else console.log('tipo no válido:',tipo)

        await connection.close()
        console.log('Base de datos desconectada')
    }
    catch(error) {
        console.log(error)
    }
}

ejecutarCmds()


if(false) {
// creating a function that execute self runs
(async () => {
    /* ---------------------------------------------------------------- */
    /*              Conexión a la base de datos warriors                */
    /* ---------------------------------------------------------------- */
    // connecting at mongoClient
    const connection = await MongoClient.connect('mongodb://localhost',{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = connection.db('warriors');
    /* ---------------------------------------------------------------- */

    /* ---------------------------------------------------------------- */
    /*        Creación de un repositorio para guardar spartan           */
    /* ---------------------------------------------------------------- */
    // initializing the repository
    const repository = new SpartanRepository(db, 'spartans');

    /* ---------------------------------------------------------------- */
    /*                 Agrego spartan al repositorio                    */
    /*            Listo cantidad de spartan en repositorio              */
    /* ---------------------------------------------------------------- */
    // call create method from generic repository
    // --- create --- creating a spartan
    const spartan = new Spartan('Leonidas', 1020);
    let result = await repository.create(spartan);
    console.log(`spartan inserted with ${result ? 'success' : 'fail'}`)

    // --- find --- call specific method from spartan class
    const spartans = await repository.find();
    console.log(`Los spartans son:`, spartans)

    //call specific method from spartan class
    const count = await repository.countOfSpartans();
    console.log(`the count of spartans is ${count}`)

    // --- update --- modificado a spartan
    result = await repository.update('60c3bf97a56fce3d1c130ee3',new Spartan('Leonidas', 777));
    console.log(`spartan updated with ${result ? 'success' : 'fail'}`)

    // --- delete --- modificado a spartan
    result = await repository.delete('60c3bf97a56fce3d1c130ee3');
    console.log(`spartan deleted with ${result ? 'success' : 'fail'}`)

    /* ---------------------------------------------------------------- */
    /* ---------------------------------------------------------------- */
    /* ---------------------------------------------------------------- */

    /* ---------------------------------------------------------------- */
    /*          Creación de un repositorio para guardar hero            */
    /* ---------------------------------------------------------------- */
    const repositoryHero = new HeroRepository(db, 'heroes');
    /* ---------------------------------------------------------------- */
    /*                   Agrego hero al repositorio                     */
    /*            verifico inserción de hero en repositorio             */
    /* ---------------------------------------------------------------- */
    const hero = new Hero('Spider Man', 200);
    const resultHero = await repositoryHero.create(hero);
    console.log(`hero inserted with ${resultHero ? 'success' : 'fail'}`)
   
    await connection.close()
})();
}