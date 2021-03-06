import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
        ) {}

    getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto);
    }

    async findTaskByid(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);
        
        if (!found) {
            throw new NotFoundException(`Task with id "${id}" not found!`);
        }
        
        return found;
        
    }
    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
       return this.taskRepository.createTask(createTaskDto);
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.findTaskByid(id);

        if (!task) {
            throw new NotFoundException(`Task with id "${id}" not found!`);
        }

        task.status = status;
        await task.save();
        return task;
    }

    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with id "${id}" not found!`);
        } 
    }
}
