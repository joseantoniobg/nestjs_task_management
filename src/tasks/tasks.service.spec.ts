import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockUser = { id: 2, username: 'Test User' };

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
});

describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                         TasksService,
                         //{ provide: TasksService, useFactory: mockTaskService },
                         { provide: TaskRepository, useFactory: mockTaskRepository },
                       ],
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('someValue');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            
            const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Some Search Query' }
            // call taskservice getTasks
            const result = await tasksService.getTasks(filters, mockUser);
            // expect taskRepository.getTasks TO HAVE BEEN CALLED
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        });
    });

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
            const mockTask = { 'title': 'Test Task', description:'Test Desc' }
            taskRepository.findOne.mockResolvedValue(mockTask);
            const result = await tasksService.findTaskByid(1, mockUser);
            expect(result).toEqual(mockTask);
            expect(taskRepository.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: mockUser.id }});
        });

        it('throws an error as task is not found', async () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.findTaskByid(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    }); 

    describe('createTask', () => {
        it('creates a task from the information assigned', async () => {
            const mockCreateTaskDto = { 'title': 'Test Task', description:'Test Desc' }
            taskRepository.createTask.mockResolvedValue(mockCreateTaskDto);
            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const result = await tasksService.createTask(mockCreateTaskDto, mockUser);
            expect(taskRepository.createTask).toHaveBeenCalledWith(mockCreateTaskDto, mockUser);
            expect(result).toEqual(mockCreateTaskDto);
        });
    });

    describe('deleteTask', () => {
        it('deletes a task upon its id', async () => {
            expect(taskRepository.delete).not.toHaveBeenCalled();
            const mockDbResult = { affected: 1 };
            taskRepository.delete.mockResolvedValue(mockDbResult);
            const result = await tasksService.deleteTask(1, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
            expect(result).toEqual(undefined);
        });
        it('throws an error because it didnt find the task to delete', async () => {
            expect(taskRepository.delete).not.toHaveBeenCalled();
            const mockDbResult = { affected: 0 };
            taskRepository.delete.mockResolvedValue(mockDbResult);
            expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException); 
        });
    });

    describe('updateTaskStatus', () => {
        it('updates a task with a new status upon its id', async () => {
            const mockTask = { 
                               id: 1, 
                               title: 'Test Task', 
                               description: 'Task Description', 
                               save: jest.fn().mockResolvedValue(true), 
                               status: TaskStatus.OPEN 
                             }
            const mockTaskStatus = TaskStatus.DONE;
            tasksService.findTaskByid = jest.fn().mockResolvedValue(mockTask);
            expect(tasksService.findTaskByid).not.toHaveBeenCalled();
            expect(mockTask.save).not.toHaveBeenCalled();
            const result = await tasksService.updateTaskStatus(1, mockTaskStatus, mockUser);
            expect(mockTask.save).toHaveBeenCalled();
            expect(tasksService.findTaskByid).toHaveBeenCalled();
            expect(result.status).toEqual(mockTaskStatus);
        });

        it('throws an error if the task to update does not exists', () => {
            expect(tasksService.updateTaskStatus(0, TaskStatus.DONE, mockUser)).rejects.toThrow(NotFoundException);
        });
    });
}); 