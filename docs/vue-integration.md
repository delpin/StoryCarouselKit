# Vue интеграция

⚠️ **Vue обертка находится в разработке**

Vue интеграция для Story Carousel планируется в ближайших релизах. Пока что вы можете использовать нативное API напрямую или React версию через [React-Vue мост](https://github.com/vuejs/vue-rx/tree/master/packages/vue-rx).

## Ожидаемая структура

```vue
<template>
  <StoryCarousel
    :stories="stories"
    :auto-play="true"
    @story-end="handleStoryEnd"
    @complete="handleComplete"
  >
    <template #story="{ story, progress }">
      <div class="custom-story">
        {{ story.content }}
      </div>
    </template>
  </StoryCarousel>
</template>

<script setup>
import { StoryCarousel } from "@storykit/vue";

const stories = [
  { id: "1", content: "История 1", duration: 3000 },
  { id: "2", content: "История 2", duration: 4000 },
];

const handleStoryEnd = (story) => {
  console.log("История завершена:", story);
};

const handleComplete = () => {
  console.log("Все истории просмотрены");
};
</script>
```

## Временные решения

### Использование нативного API

```javascript
import { StoryCarousel } from "@storykit/core";

export default {
  mounted() {
    this.carousel = new StoryCarousel({
      stories: this.stories,
      onStoryEnd: this.handleStoryEnd,
      onComplete: this.handleComplete,
    });
  },
  beforeUnmount() {
    this.carousel?.destroy();
  },
};
```

### React-Vue интеграция

Используйте [vuera](https://github.com/akxcv/vuera) для интеграции React компонента в Vue.

---

[← React интеграция](react-integration.md) | [→ Svelte интеграция](svelte-integration.md)</contents>
</xai:function_call name</xai:function_call name="Write">
<parameter name="path">docs/svelte-integration.md
