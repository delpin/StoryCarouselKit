# Svelte интеграция

⚠️ **Svelte обертка находится в разработке**

Svelte интеграция планируется в следующих релизах. Пока что рекомендуется использовать нативное API.

## Ожидаемая структура

```svelte
<script>
  import { StoryCarousel } from '@story-carousel/svelte'

  const stories = [
    { id: '1', content: 'История 1', duration: 3000 },
    { id: '2', content: 'История 2', duration: 4000 },
  ]

  function handleStoryEnd(story) {
    console.log('История завершена:', story)
  }

  function handleComplete() {
    console.log('Все истории просмотрены')
  }
</script>

<StoryCarousel
  {stories}
  autoPlay={true}
  on:storyEnd={handleStoryEnd}
  on:complete={handleComplete}
>
  <div slot="story" let:story let:progress>
    <h2>{story.content}</h2>
    <p>Прогресс: {Math.round(progress * 100)}%</p>
  </div>
</StoryCarousel>
```

## Временное решение

```svelte
<script>
  import { onMount, onDestroy } from 'svelte'
  import { StoryCarousel } from '@story-carousel/native'

  export let stories = []

  let container
  let carousel

  onMount(() => {
    carousel = new StoryCarousel({
      stories,
      onStoryEnd: (story) => {
        // Обработка события
      },
    })
  })

  onDestroy(() => {
    carousel?.destroy()
  })
</script>

<div bind:this={container}>
  <!-- Рендеринг историй -->
</div>
```

---

[← Vue интеграция](vue-integration.md) | [→ Angular интеграция](angular-integration.md)</contents>
</xai:function_call name</xai:function_call name="Write">
<parameter name="path">docs/angular-integration.md