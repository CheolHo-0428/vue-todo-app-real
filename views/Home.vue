<template>
  <section class="home">
    <div>
      <h1>
        JASON's Home page!
      </h1>
      <h2 @click="$router.push('/about')">
        About
      </h2>
      <!-- 위와 아래는 같은 방법이다!!! -->
      <router-link
        to="/todos"
        tag="h2"
      >
        Todo App
      </router-link>
    </div>
  </section>
</template>