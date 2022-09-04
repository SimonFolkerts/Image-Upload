<script>
  export default {
    data() {
      return {
        data: {
          name: "name",
          email: "email@gmail.com",
        }
      }
    },
    methods: {
      async getData() {
        const response = await fetch ('http://127.0.0.1:3000/data');
        const data = await response.json();
        console.log(data);
      },
      async postData() {
        const response = await fetch ('http://127.0.0.1:3000/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(this.data),
        });
        const data = await response.json();
        console.log(data);
      }
    }
  }
</script>

<template>
  <div>
    <h1>This is the home page</h1>
  </div>
  <form>
    <div class="form-group">
      <label for="name">Name</label>
      <input v-model="data.name" id="name" type="text">
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input v-model="data.email" id="email" type="email">
    </div>
  </form>
  <div>
    <button @click="getData" type="button">GET</button>
    <button @click="getDataById" type="button">GET ID</button>
    <button @click="postData" type="button">POST</button>
    <button @click="updateData" type="button">PUT</button>
    <button @click="deleteData" type="button">DELETE</button>
  </div>
</template>
