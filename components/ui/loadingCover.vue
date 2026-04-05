<template>
  <div class="loading">
    <div class="block">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loading {
  width: 100%;
  height: 100%;
  background: #00000040;
  backdrop-filter: blur(1px);
  position: absolute;
  z-index: 5;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .block {
    width: 6rem;
    aspect-ratio: 1 / 1;
    background: #00000060;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .spinner {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 0.25rem solid rgba(255, 255, 255, 0.2);
    border-top-color: #ffffff90;
    border-left-color: #ffffff90;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
