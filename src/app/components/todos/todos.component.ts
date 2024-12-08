import { Component, OnInit, computed, inject } from '@angular/core';
import { ServiceService } from '../../service.service';
import { FilterEnum } from '../../enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todos',
  imports: [CommonModule, FormsModule],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  todosService = inject(ServiceService);
  filterSig = this.todosService.filterSig;
  filterEnum = FilterEnum;
  text: string = "";
  editingId: string | null = null;

  ngOnInit(): void {
    this.todosService.updateTodos(this.todosService.todosSig());
  }

  noTodosClass = computed(() => this.todosService.todosSig().length === 0);
  todosAll = computed(() => this.todosService.todosSig().length);

  activeCount = computed(() => {
    return this.todosService.todosSig().filter(todo => !todo.isCompleted).length;
  })

  changeText(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.text = target.value;
  }

  addTodo(): void {
    this.todosService.addTodo(this.text);
    this.text = "";
  }
  visibleTodos = computed(() => {
    const todos = this.todosService.todosSig();
    const filter = this.todosService.filterSig();
    if (filter === FilterEnum.active) {
      return todos.filter(todo => !todo.isCompleted)
    }
    else if (filter === FilterEnum.completed) {
      return todos.filter(todo => todo.isCompleted);
    }
    return todos;
  })
  changeFilter(event: Event, filterName: FilterEnum): void {
    event.preventDefault();
    this.todosService.changeFilter(filterName);
  }
  isEditing: boolean = false;
  setEditingId(editingId: string | null): void {
    this.editingId = editingId;
  };
  editTodo(id: string, currentText: string): void {
    this.isEditing = true;
    this.editingId = id;
    this.text = currentText;
  }
  saveTodo(id: string, text: string): void {
    this.todosService.saveTodo(id, text);
    this.isEditing = false;
  }
  deleteTodo(id: string): void {
    this.todosService.deleteTodo(id);
  }
  toggleTodo(id: string): void {
    const todos = this.todosService.todosSig();
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex !== -1) {
      todos[todoIndex] = {
        ...todos[todoIndex],
        isCompleted: !todos[todoIndex].isCompleted,
      };
      this.todosService.updateTodos([...todos]);
    }
  }
}
