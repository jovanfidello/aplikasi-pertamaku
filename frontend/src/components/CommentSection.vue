// npm install dompurify
<script setup>
import { ref } from 'vue';
import DOMPurify from 'dompurify';

const comment = ref('');
const comments = ref([]); // Use array to store multiple comments

const submitComment = () => {
  const sanitizedComment = DOMPurify.sanitize(comment.value); // Sanitize input
  comments.value.push(sanitizedComment); // Add sanitized comment to the array
  comment.value = ''; // Clear the input field
};
</script>

<template>
  <div>
    <h3>Comments</h3>
    <input v-model="comment" placeholder="Leave a comment" />
    <button @click="submitComment">Submit</button>

    <!-- Display comments -->
    <div v-for="(com, index) in comments" :key="index">
      <div v-html="com"></div>
    </div>
  </div>
</template>


