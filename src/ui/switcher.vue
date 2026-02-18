<script setup lang="ts">
// props
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  field: {
    type: String,
    required: true,
  },
});
// emits
const emit = defineEmits(["infoInput"]);
// switching
function onSwitch(option: string) {
  if (props.field === 'nothing') {
    emit("infoInput", option);
    console.log(option)
  } else {
    emit("infoInput", props.field, option);
  }
}
</script>

<!-- prettier-ignore -->
<template>
  <div class="b">
    <h3 :style="{'--switcher-name': `var(--${data.name})`}"></h3>
    <div class="switcher">
      <button class="option" :style="{'--option-name': `var(--${data.option1})`}" :class="{ active: data.value === data.option1 }" @click="onSwitch(data.option1)"></button>
      <button class="option" :style="{'--option-name': `var(--${data.option2})`}" :class="{ active: data.value === data.option2 }" @click="onSwitch(data.option2)"></button>
    </div>
  </div>
</template>

<style scoped>
.b {
  display: flex;
  flex-direction: column;

  h3::after {
    content: var(--switcher-name);
  }

  .switcher {
    width: 100%;
    display: flex;

    .option {
      width: 50%;
    }

    ::after {
      content: var(--option-name);
    }
  }
}

.b {
  h3 {
    font-size: 1rem;
    font-weight: 500;
  }
  
  .switcher {
    padding: 0.25rem;
    background: var(--back-c);
    border: solid 0.125rem var(--back-d);
    border-radius: 0.75rem;

    .option {
      width: 50%;
      padding: 0.25rem 0;
      border-radius: 0.5rem;
      color: var(--text-c);
      outline: none;
    }
  }

  .option.active {
    background: var(--back-d);
    color: var(--text-a);
  }
}
</style>
