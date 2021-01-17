import React, { Component } from "react";
import AppHeader from "../app-header";
import SearchPanel from "../search-panel";
import TodoList from "../todo-list";
import ItemStatusFilter from "../item-status-filter";
import ItemAddForm from "../item-add-form";
import "./app.css";

export default class App extends Component {
  maxID = 100;

  state = {
    todoData: [
      this.createToDoItem("Drink Coffee"),
      this.createToDoItem("Make Awesome App"),
      this.createToDoItem("Have a lunch"),
    ],
    term: "",
    filter: "all",
  };

  createToDoItem(label) {
    return {
      label,
      important: false,
      done: false,
      id: this.maxID++,
    };
  }

  deleteItem = (id) => {
    this.setState(({ todoData }) => {
      const idx = todoData.findIndex((el) => el.id === id);
      const newArray = [...todoData.slice(0, idx), ...todoData.slice(idx + 1)];
      return {
        todoData: newArray,
      };
    });
  };

  addItem = (text) => {
    const newItem = this.createToDoItem(text);
    this.setState(({ todoData }) => {
      const newArr = [...todoData, newItem];
      return {
        todoData: newArr,
      };
    });
  };

  searchItem = (arr, term) => {
    if (term.length === 0) {
      return arr;
    }
    return arr.filter((item) => {
      return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
    });
  };

  onSearchChange = (term) => {
    this.setState({
      term,
    });
  };


  onFilterChange = (filter) => {
    this.setState({
      filter,
    });
  };

  toggleProperty = (arr, id, propName) => {
    const idx = arr.findIndex((el) => el.id === id);
    const oldItem = arr[idx];
    const newItem = { ...oldItem, [propName]: !oldItem[propName] };
    return [...arr.slice(0, idx), newItem, ...arr.slice(idx + 1)];
  };

  onToggleImportant = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, "important"),
      };
    });
  };

  onToggleDone = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, "done"),
      };
    });
  };

  filter(arr, filter) {
    switch (filter) {
      case "all":
        return arr;
      case "active":
        return arr.filter((item) => !item.done);
      case "done":
        return arr.filter((item) => item.done);
      default:
        return arr;
    }
  }

  render() {
    const { todoData, term, filter } = this.state;
    const visibleItems = this.filter(this.searchItem(todoData, term), filter);
    const doneCount = todoData.filter((el) => el.done).length;
    const todoCount = todoData.length - doneCount;

    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel onSearchChange={this.onSearchChange} />
          <ItemStatusFilter filter={filter} onFilterChange={this.onFilterChange} />
        </div>

        <TodoList
          todos={visibleItems}
          onDeleted={this.deleteItem}
          onToggleImportant={this.onToggleImportant}
          onToggleDone={this.onToggleDone}
        />
        <ItemAddForm onAdded={this.addItem} />
      </div>
    );
  }
}
