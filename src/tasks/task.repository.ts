import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Query, Logger, InternalServerErrorException } from '@nestjs/common';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    private logger = new Logger('TasksRepository');
    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>{
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', { userId: user.id });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }
        
        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }
        
        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`Failed getting tasks for user ${user.username}. Filters: ${filterDto}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;
        const newTask = new Task();
        newTask.title = title;
        newTask.description = description;
        newTask.status = TaskStatus.OPEN;
        newTask.user = user;

        try {
            await newTask.save();
        } catch (error) {
            this.logger.error(`Failed to create task for user ${user.username}. Data: ${createTaskDto}`, error.stack);
            throw new InternalServerErrorException();
        }

        delete newTask.user;
        return newTask;
    }
}