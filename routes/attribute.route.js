import { Router } from 'express';
import { models } from '../data/integrations/database/models/index.js';
import { SequelizeAttributeRepository } from '../infrastructure/repositories/attributeRepository.js';
import { CreateAttributeUseCase, DeleteAttributeUseCase, FetchAttributeUseCase, UpdateAttributeUseCase } from '../core/services/product/attribute.js';
import { AttributeController } from '../app/controllers/products/attribute.js';
import { JoiSanitizer } from '../app/middleware/joisanitizer.js';
import Joi from 'joi';


const attributeRoute = Router({ mergeParams: true, caseSensitive: true });

const { Attribute, AttributeValue } = models;

const attributeRepository = new SequelizeAttributeRepository(Attribute, AttributeValue);

// Usecases
const createAttributeUseCase = new CreateAttributeUseCase(attributeRepository);
const updateAttributeUseCase = new UpdateAttributeUseCase(attributeRepository);
const fetchAttributeUseCase = new FetchAttributeUseCase(attributeRepository);
const deleteAttributeUseCase = new DeleteAttributeUseCase(attributeRepository);

// Attribute controller
const attributeController = new AttributeController(createAttributeUseCase, updateAttributeUseCase, fetchAttributeUseCase, deleteAttributeUseCase);

// middlewares
const routeParamsValidator = new JoiSanitizer();

// schemas
const attributeParams = Joi.object({
    attributeId: Joi.string().required(),
})

attributeRoute.post('/', attributeController.create.bind(attributeController));
attributeRoute.get('/', attributeController.findAll.bind(attributeController));
attributeRoute.get('/:attributeId', routeParamsValidator.validateParams(attributeParams), attributeController.findOne.bind(attributeController));
attributeRoute.put('/:attributeId', routeParamsValidator.validateParams(attributeParams), attributeController.update.bind(attributeController));
attributeRoute.delete('/:attributeId', routeParamsValidator.validateParams(attributeParams), attributeController.delete.bind(attributeController));

export { attributeRoute };