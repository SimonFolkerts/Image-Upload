<template>
  <main>
    <h2>Upload an Image</h2>
    <div>
      <!-- 1. selecting an image to upload triggers the event handler -->
      <input @input="fileChangeHandler" type="file" name="image" id="image" />

      <!-- 3. once an image is selected, clicking this button triggers the upload method -->
      <button v-if="image" @click="uploadFile" type="button">Upload</button>
    </div>
  </main>

  <!-- This is an example of how one would upload data using just a regular HTML form
  <form action="http://127.0.0.1:3000/images" method="POST">
    <input type="text" name="username" />
    <input type="email" name="email" />
    <input type="file" name="file-attachment" />
    <button type="submit">Submit Form</button>
  </form> -->
</template>

<script>
export default {
  data() {
    return {
      image: null,
    };
  },
  methods: {
    // 2. event handler that every time an image is selected using the file input in the browser, saves the image into a data property called 'image'
    fileChangeHandler(event) {
      this.image = event.target.files[0];
    },

    // 4. When the upload button is clicked, this method executes, packaging the image up into a formData object that is used to transmit mulipart form data like text and files etc.
    async uploadFile() {
      if (!image) {
        // if no image loaded, alert the user and abort
        alert("please select a file to upload");
      } else {
        // usually files such as images are transmitted as part of a form. In this case we are not using a form submission to trigger a POST request, we are doing it manually using 'fetch', so we need to first load the image into a new formData object
        const formData = new FormData(); // create a new FormData() object called formData
        formData.append("attachment", this.image); // add the image to it as a formData field with the name of 'attachment'. We will search for a field named 'attachment' on the back end.

        // Explanation: Normally when a form is created and someone clicks the submit button, the form automatically creates a formData object that contains the values of all its inputs, where the property names are based off of the 'name=""' attribute that each input has. This formData is then sent using the method specified in the forms method attribute. There is a commented out example of this in the template above. This form would automatically post its data to localhost:300/images. However in Vue we are doing everything using listeners, so we need to manually get the image, put it into a formData object with a name, and then POSTing it to the back end. We are basically simulating a form submission.

        // now we just take the form data and send it to the back end using a POST request that we create and send using the fetch() function
        const response = await fetch("http://127.0.0.1:3000/images", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log(data);
      }
    },
  },
};
</script>
