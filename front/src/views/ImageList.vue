<template>
  <div>
    <div>
      <!-- on click, get the images -->
      <button @click="getFiles" type="button">Get</button>
    </div>
    <!-- loop through the array of images, and for each one, make an img tag. We set as the src value a special code that allows the img tag to render an image encoded as base64. For each img tag we simply append onto the end of this code the base64 representation of the string from each of the objects in the array respectively -->
    <div v-for="item of items">
      <img :src="`data:image/png;base64,${item.image.data}`" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: null,
    };
  },
  methods: {
    // to get the images, we just send a GET request, and put the array into the data property. It will be an array of objects that contain an image property. The image property has data, which is the base64 image, and the conten type string. To display an image or images, see above in the template.
    async getFiles() {
      const response = await fetch("http://localhost:3000/images");
      const results = await response.json();
      this.items = results;
    },
  },
};
</script>

<style scoped></style>
