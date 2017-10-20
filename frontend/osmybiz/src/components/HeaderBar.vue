<template>
    <div class="header">
      <div class="title">
        OpenStreetMap My Business
      </div>
      <div class="login-button">
        <button>Login</button>
      </div>
    </div>
</template>

<script>
    export default {
      name: 'header-bar'
    }
</script>

<style scoped>

  .header {
    height: 50px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-size: 24px;
    font-weight:bold;
    margin: 0 24px;
  }

  .login-button {
    margin: 0 24px;
  }

</style>
