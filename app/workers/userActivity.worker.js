import { Worker } from "bullmq";
import IORedis from "ioredis"
import { models } from "../../data/integrations/database/models/index.js";
import LoginUseCase from "../../core/services/auth/login.service.js";
import { SequelizeUserRespository } from "../../data/interfaces/sequelize.user.repository.js";



const { User } = models;
const userUsecase = new LoginUseCase(new SequelizeUserRespository(User));
const connection = new IORedis({ maxRetriesPerRequest: null })
const worker = new Worker('user-activity', async (job) => {
    switch (job.name) {
        case 'updateLastLogin':
            {
                const { userId, date } = job.data;
                if (userId && date) {
                    await userUsecase.updateUserProfile(userId, { lastLogin: date })
                }
            }
    }
}, { connection });

