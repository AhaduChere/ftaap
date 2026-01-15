<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#2e777e] to-[#81b6bb] p-4">
    <div class="w-full max-w-md h-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 flex flex-col gap-5">
      <h2 class="text-3xl font-extrabold text-center text-[#2e777e]">Teacher Login</h2>
      <div class="flex flex-col gap-3">
        <input
          v-model="firstName"
          placeholder="First Name"
          class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
          <input
          v-model="lastName"
          placeholder="Last Name"
          class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
          <input
          v-model="username"
          placeholder="Username"
          class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
          <input
          v-model="email"
          placeholder="Email"
          class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-[#2e777e] transition" />
      </div>

      <button
        class="mt-2 px-4 py-3 bg-[#2e777e] text-white font-semibold rounded-lg hover:bg-[#256166] active:scale-95 transition"
        @click="login">
        Sign In
      </button>

      <p v-if="error" class="text-red-600 text-sm text-center font-medium">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const firstName = ref('');
const lastName = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
let roleId = 0;

const emit = defineEmits(['login-success']);

const props = defineProps({
  userRole: {
    type: String,
    required: true
  }
});

if(props.userRole == 'admin'){
    roleId = 1;
  }else {
    roleId = 2;
  }

async function login() {
  if (!username.value || !password.value || !email.value || !firstName.value || !lastName.value) {
    error.value = 'Please fill in all fields';
    return;
  }

  if(!email.value.includes('forehandconsulting')){
    error.value = 'Invalid Email or Password';
    return;
  }

  try {
    const user = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
        roleId: roleId
      }),
    });
    if (user.ok) {
      const data = await user.json();
      const userId = data.user?.user_id;

      try{
        const teacher = await fetch('/api/teacher', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            firstName: firstName.value,
            lastName: lastName.value
          }),
        });

        if(teacher.ok){
          emit('login-success');
        }else {
          error.value = 'We\'re Sorry Something Went Wrong Please try Again later';
        }
      }catch (err){
        console.error(err);
      }
    } else {
      error.value = 'Invalid credentials';
    }
  } catch (err) {
    error.value = 'Login failed';
    console.error(err);
  }
}
</script>
