import { Router } from 'express';
import { models, sequelize } from '../data/integrations/database/models/index.js';
import { JoiSanitizer } from '../app/middleware/joisanitizer.js';
import Joi from 'joi';
import { SequelizeDiscountRepository } from '../infrastructure/repositories/discountRepository.js';
import { CreateDiscountUseCase } from '../core/services/discount/createDiscountUseCase.js';
import { UpdateDiscountUseCase } from '../core/services/discount/updateDiscountUseCase.js';
import { FetchDiscountUseCase } from '../core/services/discount/fetchDiscountUseCase.js';
import { DeleteDiscountUseCase } from '../core/services/discount/deleteDiscountUseCase.js';
import { DiscountController } from '../app/controllers/discount/discountController.js';
const { Discount } = models;


const discountRoutes = Router({
    mergeParams: true,
    caseSensitive: true,
});
const discountRepository = new SequelizeDiscountRepository(sequelize, Discount);

// UseCases
const createDiscountUseCase = new CreateDiscountUseCase(discountRepository);
const updateDiscountUseCase = new UpdateDiscountUseCase(discountRepository);
const fetchDiscountUseCase = new FetchDiscountUseCase(discountRepository);
const deleteDiscountUseCase = new DeleteDiscountUseCase(discountRepository);

// controller
const discountController = new DiscountController(createDiscountUseCase, updateDiscountUseCase, fetchDiscountUseCase, deleteDiscountUseCase);


// middleware
const validator = new JoiSanitizer();

// schema:
const discountSchema = Joi.object({
    title: Joi.string().required(),
    code: Joi.string().optional(),
    usageLimit: Joi.number().optional(),
    type: Joi.string().optional(),
    amount: Joi.number().optional(),
    startPublishing: Joi.date().optional(),
    endPublishing: Joi.date().optional(),
    status: Joi.string().required(),
});

const discountIdParam = Joi.object({
    discountId: Joi.string().required(),
})

discountRoutes.post('/', validator.validateBody(discountSchema), discountController.create.bind(discountController));
discountRoutes.get('/', discountController.findAll.bind(discountController));
discountRoutes.get('/:discountId', validator.validateParams(discountIdParam), discountController.findById.bind(discountController));
discountRoutes.put('/:discountId', validator.validateParams(discountIdParam), discountController.update.bind(discountController));
discountRoutes.delete('/:discountId', validator.validateParams(discountIdParam), discountController.delete.bind(discountController));

export { discountRoutes };