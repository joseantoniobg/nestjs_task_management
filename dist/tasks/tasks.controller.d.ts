import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
    getTasks(user: User, filterDto: GetTasksFilterDto): Promise<Task[]>;
    getTaskById(user: User, id: number): Promise<Task>;
    createTask(user: User, createTaskDto: CreateTaskDto): Promise<Task>;
    updateTaskStatus(user: User, id: number, status: TaskStatus): Promise<Task>;
    deleteTask(user: User, id: number): Promise<void>;
}
