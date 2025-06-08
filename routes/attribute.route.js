import { Router } from 'express';
import { models, sequelize } from '../data/integrations/database/models/index.js';
import { SequelizeAttributeRepository } from '../infrastructure/repositories/attributeRepository.js';
import { CreateAttributeUseCase, DeleteAttributeUseCase, DeleteAttributeValueUseCase, FetchAttributeUseCase, UpdateAttributeUseCase } from '../core/services/product/attribute.js';
import { AttributeController } from '../app/controllers/products/attribute.js';
import { JoiSanitizer } from '../app/middleware/joisanitizer.js';
import Joi from 'joi';


const attributeRoute = Router({ mergeParams: true, caseSensitive: true });

const { Attribute, AttributeValue } = models;

const attributeRepository = new SequelizeAttributeRepository(sequelize, Attribute, AttributeValue);

// Usecases
const createAttributeUseCase = new CreateAttributeUseCase(attributeRepository);
const updateAttributeUseCase = new UpdateAttributeUseCase(attributeRepository);
const fetchAttributeUseCase = new FetchAttributeUseCase(attributeRepository);
const deleteAttributeUseCase = new DeleteAttributeUseCase(attributeRepository);
const deleteAttributeValueUseCase = new DeleteAttributeValueUseCase(attributeRepository);

// Attribute controller
const attributeController = new AttributeController(createAttributeUseCase, updateAttributeUseCase, fetchAttributeUseCase, deleteAttributeUseCase, deleteAttributeValueUseCase);

// middlewares
const validator = new JoiSanitizer();

// schemas
const attributeParams = Joi.object({
    attributeId: Joi.string().required(),
});

const attributeSchema = Joi.object({
    name: Joi.string().required(),
    values: Joi.array().optional(),
});
const deleteAttributeValueSchema = Joi.object({
    archivedValues: Joi.array().required(),
})

attributeRoute.post('/', validator.validateBody(attributeSchema), attributeController.create.bind(attributeController));
attributeRoute.get('/', attributeController.findAll.bind(attributeController));
attributeRoute.get('/:attributeId', validator.validateParams(attributeParams), attributeController.findOne.bind(attributeController));
attributeRoute.put('/:attributeId', validator.validateParams(attributeParams), attributeController.update.bind(attributeController));
attributeRoute.delete('/:attributeId', validator.validateParams(attributeParams), attributeController.delete.bind(attributeController));
attributeRoute.delete('/:attributeId/value', validator.validateParams(attributeParams), validator.validateBody(deleteAttributeValueSchema), attributeController.deleteAttributeValue.bind(attributeController));

export { attributeRoute };