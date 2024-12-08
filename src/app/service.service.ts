import { Injectable, signal } from '@angular/core';
import { TodoInterface } from './interface';
import { FilterEnum } from './enum';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  todosSig = signal<TodoInterface[]>(this.loadTodosFromLocalStorage());
  filterSig = signal<FilterEnum>(FilterEnum.all);

  private saveTodosToLocalStorage(): void {
    const todos = this.todosSig();
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  private loadTodosFromLocalStorage(): TodoInterface[] {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
  }

  private updateTodosAndSave(updateFn: (todos: TodoInterface[]) => TodoInterface[]): void {
    this.todosSig.update(todos => {
      const updatedTodos = updateFn(todos);
      this.saveTodosToLocalStorage();
      return updatedTodos;
    });
  }

  addTodo(text: string): void {
    const newTodo: TodoInterface = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      text: text,
      isCompleted: false
    };
    this.updateTodosAndSave(todos => [...todos, newTodo]);
    this.saveTodosToLocalStorage();
  }

  saveTodo(id: string, text: string): void {
    this.updateTodosAndSave(todos => {
      const todo = todos.find(todo => todo.id === id);
      if (todo) {
        todo.text = text;
      }
      return todos;
    });
    this.saveTodosToLocalStorage();
  }

  deleteTodo(id: string): void {
    this.updateTodosAndSave(todos => todos.filter(todo => todo.id !== id));
    this.saveTodosToLocalStorage();
  }

  toggleTodoCompletion(id: string): void {
    this.updateTodosAndSave(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  }

  changeFilter(filterName: FilterEnum): void {
    this.filterSig.set(filterName);
  }

  updateTodos(newTodos: TodoInterface[]): void {
    this.todosSig.set(newTodos);
    this.saveTodosToLocalStorage();
  }
}
