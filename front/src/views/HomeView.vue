<script>
export default {
  data() {
    return {
      image: null,
      items: [],
    };
  },
  methods: {
    fileChangeHandler(event) {
      this.image = event.target.files[0];
    },
    async uploadFile() {
      const formData = new FormData();
      formData.append("attachment", this.image);

      const response = await fetch("http://127.0.0.1:3000/images", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
    },
    async getFiles() {
      const response = await fetch("http://localhost:3000/images");
      const results = await response.json();
      this.items = results;
    },
  },
};
</script>

<template>
  <main>
    <h2>This is the home view</h2>
    <div>
      <input @input="fileChangeHandler" type="file" name="image" id="image" />
      <br />
      <br />
      <button @click="uploadFile" type="button">Upload</button>
    </div>
    <br />
    <br />
    <br />
    <div>
      <button @click="getFiles" type="button">Get</button>
    </div>
    <div v-for="item of items">
      {{ items }}
      <img :src="`data:image/png;base64,${item.image.data}`" />
    </div>
  </main>
</template>
