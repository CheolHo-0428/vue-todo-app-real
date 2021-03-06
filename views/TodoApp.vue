<template>
  <div class="todo-app">
    <div class="todo-app__actions">
      <div class="filters">
        <router-link 
          to="all"
          tag="button"
        >
          모든 항목 ({{ total }})
        </router-link>
        <router-link 
          to="active"
          tag="button"
        >
          해야 할 항목 ({{ activeCount }})
        </router-link>
        <router-link 
          to="completed"
          tag="button"
        >
          완료된 항목 ({{ completedCount }})
        </router-link>
      </div>
      <div class="actions clearfix">
        <div class="float--left">
          <label>
            <input
              v-model="allDone"
              type="checkbox"
            />
            <span class="icon">
              <span class="material-icons">
                done_all
              </span>
            </span>
          </label>
        </div>
        <div class="float--right clearfix">
          <button 
            class="btn float--left"
            @click="scrollToTop"
          >
            <span class="material-icons">
                expand_less
            </span>
          </button>
          <button 
            class="btn float--left"
            @click="scrollToBottom"
          >
            <span class="material-icons">
                expand_more
            </span>
          </button>
          <button 
            class="btn btn--danger float--left"
            @click="clearCompleted"
          >
              <span class="material-icons">
                delete_sweep
              </span>
          </button>
        </div>
      </div>
    </div>

    <div class="todo-app__list">
      <todo-item
        v-for = "todo in filteredTodos"
        :key = "todo.id"
        :todo = "todo"
        @update-todo = "updateTodo"
        @delete-todo = "deleteTodo"
      />
    </div>

    <todo-creator
      class="todo-app__creator"
      @create-todo="createTodo"/>
  </div>
</template>

<script>
import lowdb from "lowdb";
import LocalStorage from "lowdb/adapters/LocalStorage";
import cryptoRandomString from "crypto-random-string";
import _cloneDeep from "lodash/cloneDeep"
import _find from "lodash/find"
import _assign from "lodash/assign"
import _findIndex from "lodash/findIndex"
import _forEachRight from "lodash/forEachRight"
import scrollTo from "scroll-to"
import TodoCreator from "~/components/TodoCreator";
import TodoItem from "~/components/TodoItem";

export default {
  components: {
    TodoItem,
    TodoCreator,
  },

  data() {
    return {
      db: null,
      todos: [],
      // filter: 'all',
    };
  },

  computed: {
    filteredTodos() {
      switch (this.$route.params.id) {
        case 'all':
        default:  
          return this.todos;
        case 'active': 
          return this.todos.filter(todo => !todo.done);
        case 'completed':
          return this.todos.filter(todo => todo.done); 
      }
    },

    total() {
      return this.todos.length;
    },

    activeCount() {
      return this.todos.filter(todo => !todo.done).length;
    },

    completedCount() {
      return this.todos.filter(todo => todo.done).length;
      // return this.total - this.activeCount;
    },

    allDone: {
      get() {
        return this.total === this.completedCount && this.total > 0;
      },

      set(check) {
        this.completeAll(check);
      }
    }
  },

  created() {
    this.initDB();
  },

  methods: {
    initDB() {
      const adapter = new LocalStorage("todo-app");
      this.db = lowdb(adapter);

      //DB에 데이터가 있는지 없는지 검사
      const hasTodos = this.db.has('todos');

      if(hasTodos) {
        this.todos = _cloneDeep(this.db.getState().todos); 
      } else {
        // Local DB 초기화
      this.db
        .defaults({
          todos: [], // Collection
        })
        .write();
      }
    },
    createTodo(title) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title: title,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      };

      // Create DB
      this.db
        .get("todos")
        .push(newTodo)
        .write();
      
      // Create Client
      this.todos.push(newTodo)
    },

    updateTodo(todo, value) {
      this.db
        .get('todos')
        .find({ id: todo.id})
        .assign(value)
        .write()

      const foundTodo = _find(this.todos, { id: todo.id }) 
      _assign(foundTodo, value)
    },

    deleteTodo(todo) {
      this.db
        .get('todos')
        .remove({ id: todo.id })
        .write()
      
      const foundIndex = _findIndex(this.todos, { id: todo.id })
      this.$delete(this.todos, foundIndex)
    },

    // changeFilter(filter) {
    //   this.filter = filter;
    // },

    completeAll(checked) {
      // DB
     const newTodos = this.db
          .get('todos')
          .forEach(todo => {
            todo.done = checked
          })
          .write()
      
      // Local DB
      this.todos = _cloneDeep(newTodos);
    },

    clearCompleted() {
      // 선택적으로 지울때는 뒤에서부터 지워야한다.
      // 순수 자바스크립트 코드 
      /* 
      this.todos
        .reduce((list, todo, index) => {
          if(todo.done) {
            list.push(index)
          }
          return list;
        }, [])
        .reverse()
        .forEach(index => {
          this.deleteTodo(this.todos[index])
        })
      */

     //라이브러리 사용
     _forEachRight(this.todos, todo => {
       if(todo.done) {
         this.deleteTodo(todo)
       }
     })
    },

    //스크롤 애니메이션 적용해서 올라가기
    scrollToTop() {
      scrollTo(0, 0, {
        ease: 'linear',
        // duration: 1000
      })
    },

    //스크롤 애니메이션 적용해서 내려가기
    scrollToBottom() {
      scrollTo(0, document.body.scrollHeight, {
        ease: 'linear',
        // duration: 1000
      })
    },
  },
};
</script>

<style lang="scss">
  @import "scss/style";

  .filters button.router-link-active {
    background: royalblue;
    color: white;
  }
</style>