import { Router } from "express";
import { AddressController } from "../app/controllers/address/address.controller.js";
import { AddressService } from "../core/services/address/address.service.js";
import { SequelizeAddressRepository } from "../data/interfaces/sequelize.address.repository.js";
import Address from "../data/integrations/database/models/address.js";
import { validateUserToken } from "../app/middleware/validate.token.js";
import LoginController from "../app/controllers/users/login.js";
import LoginUseCase from "../core/services/auth/login.service.js";
import { SequelizeUserRespository } from "../data/interfaces/sequelize.user.repository.js";
import { models } from "../data/integrations/database/models/index.js";

const { User } = models;
const userRoutes = Router();

// Addresses
userRoutes.post("/address",
    validateUserToken,
    new AddressController(new AddressService(new SequelizeAddressRepository(Address))).createAddress
);
userRoutes.get("/profile",
    validateUserToken,
    new LoginController(new LoginUseCase(new SequelizeUserRespository(User))).getUserById
);
userRoutes.get("/address",
    validateUserToken,
    new AddressController(new AddressService(new SequelizeAddressRepository(Address))).fetchAddresses
);
userRoutes.get("/address/:addressId",
    validateUserToken,
    new AddressController(new AddressService(new SequelizeAddressRepository(Address))).fetchAddressById
);
userRoutes.patch("/address/:addressId",
    validateUserToken,
    new AddressController(new AddressService(new SequelizeAddressRepository(Address))).updateAddress
);
userRoutes.patch("/address/default/:addressId",
    validateUserToken,
    new AddressController(new AddressService(new SequelizeAddressRepository(Address))).setDefaultAddress
);
userRoutes.delete("/address/:addressId",
    validateUserToken,
    new AddressController(new AddressService(new SequelizeAddressRepository(Address))).deleteAddress
);

export { userRoutes };