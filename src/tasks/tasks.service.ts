import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
        ) {}

    getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    async findTaskByid(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { userId: user.id, id }});
        
        if (!found) {
            throw new NotFoundException(`Task with id "${id}" not found!`);
        }
        
        return found;
        
    }
    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
       return this.taskRepository.createTask(createTaskDto, user);
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.findTaskByid(id, user);

        if (!task) {
            throw new NotFoundException(`Task with id "${id}" not found!`);
        }

        task.status = status;
        await task.save();
        return task;
    }

    async deleteTask(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({ id, userId: user.id });
        if (result.affected === 0) {
            throw new NotFoundException(`Task with id "${id}" not found!`);
        } 
    }
}
