import {Request, Response} from 'express';
import {getRepository} from 'typeorm';
import Orphanage from '../models/Orphanage';
import orphanageView from '../views/orphanages_view';
import * as Yup from 'yup';

export default{
  async index(request: Request, response: Response){
    const orphanagesRepository = getRepository(Orphanage);

    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    });
    
    return response.json(orphanageView.renderMany(orphanages));
  },

  async show(request: Request, response: Response){
    const {id} = request.params; 
       
    const orphanagesRepository = getRepository(Orphanage);

    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images']
    });
    
    return response.json(orphanageView.render(orphanage));
  },

  async create(request: Request, response: Response){
    const{
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
    } = request.body;
     
    const orphanagesRepository = getRepository(Orphanage);
        
    const requestImages = request.files as Express.Multer.File[];
    const images = requestImages.map(image =>{
      return {path: image.filename}
    })

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true',
      images
        
    };

    const schema = Yup.object().shape({
      name: Yup.string().required('Nome obrigatório'),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required(),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required()
        })
      )
    });

    await schema.validate(data, {
      abortEarly: false,
    });

    const orphanage = orphanagesRepository.create(data);
     
    await orphanagesRepository.save(orphanage);
     
    return response.status(201).json(orphanage);
    //201 significa que algo foi criado
  }
}

//Rota = conjunto
//Recurso = usuario
//Metodos HTTP = GET, POST, PUT, DELETE

//GET = buscar uma informacao (lista, item)
//POST = criar uma informacao nova
//PUT = editar uma informacao
//DELETE = deletar uma informacao

//Parametros = 

//Query Params: http://localhost:3333/users?search=karla
//Route Params: http://localhost:3333/users/1 (Identificar um recurso)
//Body: http://localhost:3333/users/ (Informacoes compostas)


/*app.post('/users/:id', (request, response) => {
    console.log(request.query);
    console.log(request.params);
    console.log(request.body);
    return response.json({message:'Hello world'});
});*/


//Driver nativo 
//Query builder - KNEX.JS (Querys com javascript)
//ORM - Object Relational Mapping (Uma classe do javascript simboliza uma tabela no banco)
